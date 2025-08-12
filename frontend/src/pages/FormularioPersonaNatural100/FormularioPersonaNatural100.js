import { useState, useCallback } from 'react';
import InTexto from '../../components/CamposFormulario/InTexto/InTexto';
import InPersona from '../../components/CamposFormulario/InPersona/InPersona';
import InFechaNacimiento from '../../components/CamposFormulario/InFechaNacimiento/InFechaNacimiento';
import InPais from '../../components/CamposFormulario/InPais/InPais';
import InEstadoCivil from '../../components/CamposFormulario/InEstadoCivil/InEstadoCivil';
import HeaderInfoRegistro from '../../components/CamposFormulario/HeaderInfoRegistro/HeaderInfoRegistro';
import InRiesgo from '../../components/CamposFormulario/InRiesgo/InRiesgo';
import InPep from '../../components/CamposFormulario/InPep/InPep';
import SeccionInformacionSeguro from '../../components/CamposFormulario/SeccionInformacionSeguro/SeccionInformacionSeguro';
import InIngresosAnuales from '../../components/CamposFormulario/InIngresosAnuales/InIngresosAnuales';
import InVolumenActividad from '../../components/CamposFormulario/InVolumenActividad/InVolumenActividad';
import InFrecuenciaActividad from '../../components/CamposFormulario/InFrecuenciaActividad/InFrecuenciaActividad';
import InAutorizacion from '../../components/CamposFormulario/InAutorizacion/InAutorizacion';
import styles from './formularioPersonaNatural100.module.css';
import SeccionFrecuenciaContacto from '../../components/CamposFormulario/SeccionFrecuenciaContacto/SeccionFrecuenciaContacto';
import SeccionEvaluacionRiesgo from '../../components/CamposFormulario/SeccionEvaluacionRiesgo/SeccionEvaluacionRiesgo';
import { generateFormPDF, downloadPDF } from '../../utils/print/pdfGenerator';
import SeccionAlertas from '../../components/CamposFormulario/SeccionAlertas/SeccionAlertas';

const printSections = [
    {
        title: 'Datos Generales',
        fields: [
            { label: 'Fecha de Registro', name: 'fecha_registro' },
            { label: 'Oficina', name: 'oficina' },
            { label: 'Ejecutivo', name: 'ejecutivo' },
        ]
    },
    {
        title: 'Datos Personales',
        fields: [
            { label: 'Nombre Completo', name: 'nombres_propietario' },
            { label: 'Apellidos', name: 'apellidos_propietario' },
            { label: 'Tipo de Documento', name: 'tipo_documento_propietario' },
            { label: 'Número de Documento', name: 'nro_documento_propietario' },
            { label: 'Extensión', name: 'extension_propietario' },
            { label: 'Otra Extensión', name: 'otra_extension_propietario' },
            { label: 'Fecha de Nacimiento', name: 'fecha_nacimiento' },
            { label: 'Lugar de Nacimiento', name: 'lugar_nacimiento' },
            { label: 'Nacionalidad', name: 'nacionalidad' },
            { label: 'Estado Civil', name: 'estado_civil' },
            { label: 'Profesión u Oficio', name: 'profesion' }
        ]
    },
    {
        title: 'Información de Riesgo',
        fields: [
            { label: 'Riesgo de profesión', name: 'riesgo_profesion_actividad' },
            { label: 'Riesgo de la zona', name: 'riesgo_zona' },
            { label: 'Cliente PEP', name: 'categoria_pep' },
            { label: 'Ingresos mensuales', name: 'ingresos_mensuales' },
            { label: 'Volumen de actividad', name: 'volumen_actividad' },
            { label: 'Frecuencia de actividad', name: 'frecuencia_actividad' }
        ]
    },
    {
        title: 'Domicilio',
        fields: [
            { label: 'Domicilio Particular', name: 'domicilio_persona_sucursal' }
        ]
    },
    {
        title: 'Información del Seguro',
        fields: [
            { label: 'Ramo de seguro', name: 'ramo_seguro' },
            { label: 'Tipo de documento', name: 'tipo_documento' },
            { label: 'Fecha de Inicio de Vigencia', name: 'fecha_inicio' },
            { label: 'Fecha de finalización de vigencia', name: 'fecha_fin' },
            { label: 'Nº de Póliza', name: 'nro_poliza' },
            { label: 'Valor de la prima', name: 'valor_prima_dolares' }
        ]
    },
    {
        title: 'Seguimiento de distribución',
        fields: [
            { label: 'Frecuencia contacto físico', name: 'frecuencia_contacto_fisico' },
            { label: 'Frecuencia contacto digital', name: 'frecuencia_contacto_digital' },
            { label: 'Medio de comunicación', name: 'medio_comunicacion' },
            { label: 'Medio de pago', name: 'medio_pago' }
        ]
    },
    {
        title: 'Evaluación de Riesgo',
        fields: [
            { label: 'Integridad documental', name: 'integridad_documental' },
            { label: 'Exactitud documental', name: 'exactitud_documental' },
            { label: 'Vigencia documental', name: 'vigencia_documental' },
            { label: 'Relevancia información', name: 'relevancia_informacion' },
            { label: 'Comportamiento cliente', name: 'comportamiento_cliente' },
            { label: 'Consistencia información', name: 'consistencia_informacion' },
            { label: 'Observaciones', name: 'observaciones' }
        ]
    }
];

const FormularioPersonaNatural100 = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [printError, setPrintError] = useState(null);

    const getFormData = useCallback(() => {
        try {
            const form = document.forms[0]; // Más confiable que querySelector
            if (!form) {
                console.error('No se encontró el formulario en el DOM');
                return {};
            }

            const data = {};
            const formElements = form.elements;

            // Recorrer todos los elementos del formulario
            for (let element of formElements) {
                if (element.name && element.value !== undefined) {
                    const cleanName = element.name.startsWith('_') ? element.name.substring(1) : element.name;

                    // Manejar diferentes tipos de inputs
                    if (element.type === 'checkbox') {
                        data[cleanName] = element.checked;
                    } else if (element.type === 'radio') {
                        if (element.checked) data[cleanName] = element.value;
                    } else {
                        data[cleanName] = element.value;
                    }
                }
            }

            console.log('Datos recolectados del formulario:', data);
            return data;
        } catch (error) {
            console.error('Error en getFormData:', error);
            setPrintError('Error al leer el formulario');
            return {};
        }
    }, []);
    const handlePrint = (formData) => {
        try {
            const pdf = generateFormPDF(formData, "Formulario de Persona Natural (Prima $100-$1000)", printSections);
            downloadPDF(pdf, "formulario_Persona_Natural_100_1000");
            return true;
        } catch (error) {
            handlePrintError(error);
            return false;
        }
    };
    const handlePrintError = (error) => {
        console.error('Error en generación de PDF:', error);
        setPrintError(error);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Iniciando envío...');

        const formData = new FormData(e.target);
        const formValues = Object.fromEntries(formData.entries());
        console.log('Datos del formulario:', formValues);

        try {
            if (!window.electronAPI) {
                throw new Error('No se encontró la API de Electron');
            }

            console.log('Llamando a electronAPI.crearCliente...');
            const result = await window.electronAPI.crearCliente(formValues);
            console.log('DEBUG Frontend - Tipo de respuesta:', typeof result);
            console.log('DEBUG Frontend - Estructura completa:', JSON.stringify(result, null, 2));

            if (result?.success) {
                alert(`Cliente guardado con ID: ${result.id ?? 'N/A'}`);
                // Preguntar si desea imprimir
                const shouldPrint = window.confirm('¿Desea imprimir el comprobante de registro?');
                if (shouldPrint) {
                    const formDataForPrint = getFormData();
                    handlePrint(formDataForPrint);
                }

                // Limpiar formulario si es exitoso
                e.target.reset();
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
            {printError && (
                <div className={styles.errorAlert}>
                    Error al generar PDF: {printError}
                </div>
            )}
            <div className={styles.card}>
                <div className={styles.cardBody}>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="hidden"
                            name="tipo_sociedad"
                            value="Persona Natural"
                        />
                        <div className={styles.cardHeader}>
                            <HeaderInfoRegistro
                                titulo="Formulario de Persona Natural (Prima $100-$1000)"
                            />
                        </div>
                        <div className={styles.formRow}>
                            <div className={styles.fullWidthField}>
                                <InAutorizacion
                                    name="autorizado_por_alta_gerencia"
                                />
                            </div>
                        </div>
                        <div className={styles.formSection}>
                            <h5 className={styles.sectionTitle}>
                                <span className={styles.sectionIcon}>👤</span>
                                Datos Personales
                            </h5>
                            <div className={styles.formRow}>
                                <div className={styles.fullWidthField}>
                                    <InPersona title="Datos Personales" prefix="_propietario" />
                                </div>

                                <div className={styles.fullWidthField}>
                                    <InFechaNacimiento
                                        label="Fecha y Lugar de Nacimiento"
                                        name="_nacimiento"
                                        required
                                    />
                                </div>

                                <div className={styles.formCol}>
                                    <InPais
                                        label="Nacionalidad"
                                        name="nacionalidad"
                                        required
                                    />
                                </div>

                                <div className={styles.formCol}>
                                    <InEstadoCivil
                                        label="Estado Civil"
                                        name="estado_civil"
                                    />
                                </div>
                                <div className={styles.formCol}>
                                    <InTexto
                                        label="Profesión u Oficio"
                                        name="profesion"
                                        maxLength={100}
                                        required
                                    />
                                </div>
                                <div className={styles.formCol}>
                                    <InRiesgo
                                        label="Riesgo de profesión"
                                        name="riesgo_profesion_actividad"
                                        required
                                    />
                                </div>
                                <div className={styles.formCol}>
                                    <InRiesgo
                                        label="Riesgo de la zona de actividades"
                                        name="riesgo_zona"
                                        required
                                    />
                                </div>
                                <div className={styles.formCol}>
                                    <InPep
                                        label="Cliente PEP"
                                        name="categoria_pep"
                                        required
                                    />
                                </div>
                                <div className={styles.formCol}>
                                    <InIngresosAnuales
                                        label="Nivel de Ingresos mensuales"
                                        name="ingresos_mensuales"
                                        required
                                    />
                                </div>
                                <div className={styles.formCol}>
                                    <InVolumenActividad
                                        label="Volumen de la actividad"
                                        name="volumen_actividad"
                                        required
                                    />
                                </div>
                                <div className={styles.formCol}>
                                    <InFrecuenciaActividad
                                        label="Frecuencia de la actividad"
                                        name="frecuencia_actividad"
                                        required
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
                                    />
                                </div>
                            </div>
                        </div>

                        <SeccionInformacionSeguro />
                        <SeccionFrecuenciaContacto />
                        <SeccionEvaluacionRiesgo />
                        <SeccionAlertas />
                        <div className={styles.formActions}>
                            <button
                                type="reset"
                                className={styles.secondaryButton}
                                disabled={isSubmitting}
                            >
                                Limpiar
                            </button>
                            <button
                                type="submit"
                                className={styles.primaryButton}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Enviando...' : 'Enviar Formulario'}
                            </button>

                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default FormularioPersonaNatural100;