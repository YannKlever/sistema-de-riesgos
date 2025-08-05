import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import InTexto from '../../components/CamposFormulario/InTexto/InTexto';
import InPersona from '../../components/CamposFormulario/InPersona/InPersona';
import InFechaNacimiento from '../../components/CamposFormulario/InFechaNacimiento/InFechaNacimiento';
import InPais from '../../components/CamposFormulario/InPais/InPais';
import InEstadoCivil from '../../components/CamposFormulario/InEstadoCivil/InEstadoCivil';
import HeaderInfoRegistro from '../../components/CamposFormulario/HeaderInfoRegistro/HeaderInfoRegistro';
import InRiesgo from '../../components/CamposFormulario/InRiesgo/InRiesgo';
import InPep from '../../components/CamposFormulario/InPep/InPep';
import InIngresosAnuales from '../../components/CamposFormulario/InIngresosAnuales/InIngresosAnuales';
import InVolumenActividad from '../../components/CamposFormulario/InVolumenActividad/InVolumenActividad';
import InFrecuenciaActividad from '../../components/CamposFormulario/InFrecuenciaActividad/InFrecuenciaActividad';
import SeccionEvaluacionRiesgo from '../../components/CamposFormulario/SeccionEvaluacionRiesgo/SeccionEvaluacionRiesgo';
import styles from './formularioClienteInterno.module.css';
import { databaseService } from '../../services/database';

const FormularioClienteInterno = () => {
    const { id } = useParams();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [initialData, setInitialData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            const cargarDatos = async () => {
                try {
                    setIsSubmitting(true);
                    const resultado = await databaseService.obtenerClienteInterno(id);
                    console.log('Datos recibidos:', resultado);

                    if (resultado.success) {
                        setInitialData(resultado.data);
                        setIsEditing(true);
                    } else {
                        alert('No se pudo cargar el cliente interno para edición');
                        navigate('/parametros/clientes-internos');
                    }
                } catch (error) {
                    console.error('Error al cargar datos:', error);
                    alert('Error al cargar datos del cliente interno');
                    navigate('/parametros/clientes-internos');
                } finally {
                    setIsSubmitting(false);
                }
            };
            cargarDatos();
        }
    }, [id, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData(e.target);
        const formValues = Object.fromEntries(formData.entries());

        const mappedData = {
            oficina: formValues.oficina,
            ejecutivo: formValues.ejecutivo,
            nombres_cliente_interno: formValues.nombres_cliente_interno,
            apellidos_cliente_interno: formValues.apellidos_cliente_interno,
            tipo_documento_cliente_interno: formValues.tipo_documento_cliente_interno,
            nro_documento_cliente_interno: formValues.nro_documento_cliente_interno,
            extension_cliente_interno: formValues.extension_cliente_interno,
            otra_extension_cliente_interno: formValues.otra_extension_cliente_interno,
            fecha_nacimiento: formValues.fecha_nacimiento,
            lugar_nacimiento: formValues.lugar_nacimiento,
            nacionalidad: formValues.nacionalidad,
            nacionalidad_numerico: formValues.nacionalidad_numerico,
            estado_civil: formValues.estado_civil,
            profesion: formValues.profesion,
            riesgo_profesion_actividad: formValues.riesgo_profesion_actividad,
            riesgo_profesion_actividad_numerico: formValues.riesgo_profesion_actividad_numerico,
            riesgo_zona: formValues.riesgo_zona,
            riesgo_zona_numerico: formValues.riesgo_zona_numerico,
            categoria_pep: formValues.categoria_pep,
            categoria_pep_numerico: formValues.categoria_pep_numerico,
            ingresos_mensuales: formValues.ingresos_mensuales,
            ingresos_mensuales_numerico: formValues.ingresos_mensuales_numerico,
            volumen_actividad: formValues.volumen_actividad,
            volumen_actividad_numerico: formValues.volumen_actividad_numerico,
            frecuencia_actividad: formValues.frecuencia_actividad,
            frecuencia_actividad_numerico: formValues.frecuencia_actividad_numerico,
            domicilio_persona_sucursal: formValues.domicilio_persona_sucursal,
            integridad_documental: formValues.integridad_documental,
            integridad_documental_numerico: formValues.integridad_documental_numerico,
            exactitud_documental: formValues.exactitud_documental,
            exactitud_documental_numerico: formValues.exactitud_documental_numerico,
            vigencia_documental: formValues.vigencia_documental,
            vigencia_documental_numerico: formValues.vigencia_documental_numerico,
            relevancia_informacion: formValues.relevancia_informacion,
            relevancia_informacion_numerico: formValues.relevancia_informacion_numerico,
            consistencia_informacion: formValues.consistencia_informacion,
            consistencia_informacion_numerico: formValues.consistencia_informacion_numerico,
            comportamiento_cliente: formValues.comportamiento_cliente,
            comportamiento_cliente_numerico: formValues.comportamiento_cliente_numerico,
            observaciones: formValues.observaciones
        };

        try {
            let result;
            if (isEditing) {
                result = await databaseService.actualizarClienteInterno(id, mappedData);
            } else {
                result = await databaseService.crearClienteInterno(mappedData);
            }

            if (result?.success) {
                alert(`Cliente interno ${isEditing ? 'actualizado' : 'creado'} correctamente`);
                navigate('/parametros/clientes-internos');
            } else {
                alert(`Error: ${result?.error || 'Error desconocido'}`);
            }
        } catch (error) {
            console.error('Error en handleSubmit:', error);
            alert(`Error de conexión: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.cardBody}>
                    <form onSubmit={handleSubmit}>
                        <div className={styles.cardHeader}>
                            <HeaderInfoRegistro
                                titulo={`Formulario Cliente Interno ${isEditing ? '(Edición)' : '(Nuevo)'}`}
                            />
                        </div>

                        <div className={styles.formSection}>
                            <h5 className={styles.sectionTitle}>
                                <span className={styles.sectionIcon}>👤</span>
                                Datos Personales
                            </h5>
                            <div className={styles.formRow}>
                                <div className={styles.fullWidthField}>
                                    <InPersona
                                        title="Datos Personales"
                                        prefix="_cliente_interno"
                                        defaultValue={{
                                            nombres: initialData?.nombres_cliente_interno,
                                            apellidos: initialData?.apellidos_cliente_interno,
                                            tipo_documento: initialData?.tipo_documento_cliente_interno,
                                            nro_documento: initialData?.nro_documento_cliente_interno,
                                            extension: initialData?.extension_cliente_interno,
                                            otra_extension: initialData?.otra_extension_cliente_interno
                                        }}
                                    />
                                </div>

                                <div className={styles.fullWidthField}>
                                    <InFechaNacimiento
                                        label="Fecha y Lugar de Nacimiento"
                                        name="_nacimiento"
                                        required
                                        defaultValue={{
                                            fecha: initialData?.fecha_nacimiento,
                                            lugar: initialData?.lugar_nacimiento
                                        }}
                                    />
                                </div>

                                <div className={styles.formCol}>
                                    <InPais
                                        label="Nacionalidad"
                                        name="nacionalidad"
                                        required
                                        defaultValue={initialData?.nacionalidad}
                                        defaultNumerico={initialData?.nacionalidad_numerico}
                                    />
                                </div>

                                <div className={styles.formCol}>
                                    <InEstadoCivil
                                        label="Estado Civil"
                                        name="estado_civil"
                                        defaultValue={initialData?.estado_civil}
                                    />
                                </div>
                                <div className={styles.formCol}>
                                    <InTexto
                                        label="Profesión u Oficio"
                                        name="profesion"
                                        maxLength={100}
                                        required
                                        defaultValue={initialData?.profesion}
                                    />
                                </div>
                                <div className={styles.formCol}>
                                    <InRiesgo
                                        label="Riesgo de profesión"
                                        name="riesgo_profesion_actividad"
                                        required
                                        defaultValue={initialData?.riesgo_profesion_actividad}
                                        defaultNumerico={initialData?.riesgo_profesion_actividad_numerico}
                                    />
                                </div>
                                <div className={styles.formCol}>
                                    <InRiesgo
                                        label="Riesgo de la zona de actividades"
                                        name="riesgo_zona"
                                        required
                                        defaultValue={initialData?.riesgo_zona}
                                        defaultNumerico={initialData?.riesgo_zona_numerico}
                                    />
                                </div>
                                <div className={styles.formCol}>
                                    <InPep
                                        label="Cliente PEP"
                                        name="categoria_pep"
                                        required
                                        defaultValue={initialData?.categoria_pep}
                                        defaultNumerico={initialData?.categoria_pep_numerico}
                                    />
                                </div>
                                <div className={styles.formCol}>
                                    <InIngresosAnuales
                                        label="Nivel de Ingresos mensuales"
                                        name="ingresos_mensuales"
                                        required
                                        defaultValue={initialData?.ingresos_mensuales}
                                        defaultNumerico={initialData?.ingresos_mensuales_numerico}
                                    />
                                </div>
                                <div className={styles.formCol}>
                                    <InVolumenActividad
                                        label="Volumen de la actividad"
                                        name="volumen_actividad"
                                        required
                                        defaultValue={initialData?.volumen_actividad}
                                        defaultNumerico={initialData?.volumen_actividad_numerico}
                                    />
                                </div>
                                <div className={styles.formCol}>
                                    <InFrecuenciaActividad
                                        label="Frecuencia de la actividad"
                                        name="frecuencia_actividad"
                                        required
                                        defaultValue={initialData?.frecuencia_actividad}
                                        defaultNumerico={initialData?.frecuencia_actividad_numerico}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className={styles.formSection}>
                            <h5 className={styles.sectionTitle}>
                                <span className={styles.sectionIcon}>🏠</span>
                                Domicilios
                            </h5>
                            <div className={styles.formRow}>
                                <div className={styles.fullWidthField}>
                                    <InTexto
                                        label="Domicilio Particular"
                                        name="domicilio_persona_sucursal"
                                        maxLength={200}
                                        required
                                        defaultValue={initialData?.domicilio_persona_sucursal}
                                    />
                                </div>
                            </div>
                        </div>

                        <SeccionEvaluacionRiesgo
                            defaultValue={{
                                integridad_documental: initialData?.integridad_documental,
                                integridad_documental_numerico: initialData?.integridad_documental_numerico,
                                exactitud_documental: initialData?.exactitud_documental,
                                exactitud_documental_numerico: initialData?.exactitud_documental_numerico,
                                vigencia_documental: initialData?.vigencia_documental,
                                vigencia_documental_numerico: initialData?.vigencia_documental_numerico,
                                relevancia_informacion: initialData?.relevancia_informacion,
                                relevancia_informacion_numerico: initialData?.relevancia_informacion_numerico,
                                consistencia_informacion: initialData?.consistencia_informacion,
                                consistencia_informacion_numerico: initialData?.consistencia_informacion_numerico,
                                comportamiento_cliente: initialData?.comportamiento_cliente,
                                comportamiento_cliente_numerico: initialData?.comportamiento_cliente_numerico,
                                observaciones: initialData?.observaciones
                            }}
                        />

                        <div className={styles.formActions}>
                            <button
                                type="button"
                                onClick={() => navigate('/parametros')}
                                className={styles.secondaryButton}
                                disabled={isSubmitting}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className={styles.primaryButton}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Guardando...' : 'Guardar'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default FormularioClienteInterno;