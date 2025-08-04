import { useState, useEffect } from 'react';
import { databaseService } from '../../services/database'; // Importar el servicio de base de datos
import HeaderInfoRegistro from '../../components/CamposFormulario/HeaderInfoRegistro/HeaderInfoRegistro';
import { secciones } from './data';
import SeccionFormulario from './SeccionFormulario';
import BotonesFormulario from './BotonesFormulario';
import styles from './FormularioLD_FT.module.css';
import { generateCuestionarioPDF, downloadPDF } from '../../utils/print/pdfGeneratorCuestionario';

const FormularioLD_FT = ({ onBack, evaluacionId }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [detalles, setDetalles] = useState('');
    const [respuestas, setRespuestas] = useState({});
    const [usuarioActual, setUsuarioActual] = useState('');
    const [puntajeTotal, setPuntajeTotal] = useState(0);
    const [printError, setPrintError] = useState(null);

    const handlePrint = () => {
        try {
            const datosParaPDF = {
                ...respuestas,
                detalles,
                fecha_registro: new Date().toLocaleDateString(),
                oficina: 'Oficina Principal',
                ejecutivo: usuarioActual
            };

            const pdf = generateCuestionarioPDF(
                datosParaPDF,
                secciones,
                `Evaluación de Riesgo LD/FT ${evaluacionId ? '(Edición)' : '(Nueva)'}`,
                detalles
            );

            downloadPDF(pdf, `evaluacion_LD_FT_${evaluacionId || 'nueva'}`);
            return true;
        } catch (error) {
            handlePrintError(error);
            return false;
        }
    };
    const handlePrintError = (error) => {
        console.error('Error en generación de PDF:', error);
        setPrintError(error.message || 'Error al generar el PDF');
    };

    useEffect(() => {
        // Simular obtención del usuario actual (en producción sería desde tu sistema de autenticación)
        setUsuarioActual('admin@empresa.com');

        // Inicializar todas las respuestas con valores vacíos
        const respuestasIniciales = {};
        secciones.forEach(seccion => {
            seccion.preguntas.forEach(pregunta => {
                respuestasIniciales[pregunta.id] = { texto: '', numerico: null };
            });
        });
        setRespuestas(respuestasIniciales);

        // Si hay un ID, cargar la evaluación existente
        if (evaluacionId) {
            cargarEvaluacionExistente(evaluacionId);
        }
    }, [evaluacionId]);

    const cargarEvaluacionExistente = async (id) => {
        try {
            const resultado = await databaseService.obtenerEvaluacionLDFT(id);

            if (resultado.success) {
                const evaluacion = resultado.data;
                setDetalles(evaluacion.detalles || '');

                // Mapear las respuestas de la evaluación al estado
                const respuestasCargadas = {};
                secciones.forEach(seccion => {
                    seccion.preguntas.forEach(pregunta => {
                        respuestasCargadas[pregunta.id] = {
                            texto: evaluacion[pregunta.id] || '',
                            numerico: evaluacion[`${pregunta.id}_numerico`] || null
                        };
                    });
                });

                setRespuestas(respuestasCargadas);
                setPuntajeTotal(evaluacion.puntaje_total || 0);
            }
        } catch (error) {
            console.error('Error al cargar evaluación:', error);
            alert('Error al cargar evaluación para edición');
        }
    };

    useEffect(() => {
        // Calcular el puntaje total cada vez que cambian las respuestas
        let total = 0;
        Object.values(respuestas).forEach(respuesta => {
            if (respuesta.numerico !== null && !isNaN(respuesta.numerico)) {
                total += respuesta.numerico;
            }
        });
        setPuntajeTotal(total);
    }, [respuestas]);

    const handleChange = (preguntaId, valor) => {
        setRespuestas(prev => ({
            ...prev,
            [preguntaId]: valor
        }));
    };

    const validarFormulario = () => {
        const errores = [];

        secciones.forEach(seccion => {
            seccion.preguntas.forEach(pregunta => {
                if (!respuestas[pregunta.id]?.texto) {
                    errores.push(`Pregunta no respondida: ${pregunta.texto}`);
                }
            });
        });

        return errores;
    };

    const prepararDatosEnvio = () => {
        const datos = {
            usuario: usuarioActual,
            detalles,
            fecha_evaluacion: new Date().toISOString(),
            puntaje_total: parseFloat(puntajeTotal) || 0 // Asegurar que es número
        };

        // Añadir todas las respuestas (texto y numérico)
        Object.entries(respuestas).forEach(([key, value]) => {
            datos[key] = value.texto;
            datos[`${key}_numerico`] = parseFloat(value.numerico) || 0; // Asegurar que es número
        });

        return datos;
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        const errores = validarFormulario();
        if (errores.length > 0) {
            alert(`Por favor complete las siguientes preguntas:\n\n${errores.join('\n')}`);
            return;
        }

        setIsSubmitting(true);

        try {
            const datosEnvio = prepararDatosEnvio();
            console.log('Enviando evaluación:', datosEnvio);

            let resultado;
            if (evaluacionId) {
                resultado = await databaseService.actualizarEvaluacionLDFT(evaluacionId, datosEnvio);
            } else {
                resultado = await databaseService.crearEvaluacionLDFT(datosEnvio);
            }

            if (resultado.success) {
                alert(`✅ Evaluación ${evaluacionId ? 'actualizada' : 'guardada'} exitosamente`);

                // Preguntar si desea imprimir
                const shouldPrint = window.confirm('¿Desea imprimir el comprobante de evaluación?');
                if (shouldPrint) {
                    handlePrint();
                }

                handleReset();

                if (typeof onBack === 'function') {
                    onBack();
                }

                if (this.props.onGuardadoExitoso) {
                    this.props.onGuardadoExitoso();
                }
            } else {
                throw new Error(resultado.error || 'Error desconocido al guardar la evaluación');
            }
        } catch (error) {
            console.error('Error al enviar evaluación:', error);
            alert(`❌ Error al guardar la evaluación:\n${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };
    const handleReset = () => {
        // Resetear todas las respuestas a valores vacíos
        const respuestasReset = {};
        Object.keys(respuestas).forEach(key => {
            respuestasReset[key] = { texto: '', numerico: null };
        });
        setRespuestas(respuestasReset);
        setDetalles('');
        setPuntajeTotal(0);
    };

    return (
        <div className={styles.container}>
            {printError && (
                <div className={styles.errorAlert}>
                    Error al generar PDF: {printError}
                </div>
            )}
            <div className={styles.card}>
                <div className={styles.header}>
                    <HeaderInfoRegistro
                        titulo={`Evaluación de Riesgo LD/FT ${evaluacionId ? '(Edición)' : '(Nueva)'}`}
                        onBack={onBack}
                        infoAdicional={`Puntaje total: ${puntajeTotal}`}
                    />
                </div>

                <div className={styles.content}>
                    <form onSubmit={handleSubmit}>
                        {secciones.map((seccion, index) => (
                            <SeccionFormulario
                                key={`seccion-${index}`}
                                seccion={seccion}
                                respuestas={respuestas}
                                handleChange={handleChange}
                            />
                        ))}

                        <div className={styles.detallesContainer}>
                            <label className={styles.detallesLabel}>
                                Detalles adicionales:
                                <textarea
                                    className={styles.detallesTextarea}
                                    value={detalles}
                                    onChange={(e) => setDetalles(e.target.value)}
                                    placeholder="Observaciones, comentarios o información adicional relevante..."
                                />
                            </label>
                        </div>

                        <BotonesFormulario
                            isSubmitting={isSubmitting}
                            onBack={onBack}
                            onReset={handleReset}
                            onSubmit={handleSubmit}
                        />
                    </form>
                </div>
            </div>
        </div>
    );
};

export default FormularioLD_FT;