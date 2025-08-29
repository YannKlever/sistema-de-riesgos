import { useState, useCallback } from 'react';
import SeccionDatosEmpresa from '../../components/CamposFormulario/SeccionDatosEmpresa/SeccionDatosEmpresa';
import SeccionInformacionSeguro from '../../components/CamposFormulario/SeccionInformacionSeguro/SeccionInformacionSeguro';
import InTexto from '../../components/CamposFormulario/InTexto/InTexto';
import InTelefono from '../../components/CamposFormulario/InTelefono/InTelefono';
import InRiesgo from '../../components/CamposFormulario/InRiesgo/InRiesgo';
import InPersona from '../../components/CamposFormulario/InPersona/InPersona';
import InPais from '../../components/CamposFormulario/InPais/InPais';
import InPep from '../../components/CamposFormulario/InPep/InPep';
import HeaderInfoRegistro from '../../components/CamposFormulario/HeaderInfoRegistro/HeaderInfoRegistro';
import InVolumenActividad from '../../components/CamposFormulario/InVolumenActividad/InVolumenActividad';
import InFrecuenciaActividad from '../../components/CamposFormulario/InFrecuenciaActividad/InFrecuenciaActividad';
import styles from './formularioEmpresaUnipersonal1000.module.css';
import SeccionFrecuenciaContacto from '../../components/CamposFormulario/SeccionFrecuenciaContacto/SeccionFrecuenciaContacto';
import SeccionEvaluacionRiesgo from '../../components/CamposFormulario/SeccionEvaluacionRiesgo/SeccionEvaluacionRiesgo';
import { generateFormPDF, downloadPDF } from '../../utils/print/pdfGenerator';
import InAutorizacion from '../../components/CamposFormulario/InAutorizacion/InAutorizacion';
import SeccionAlertas from '../../components/CamposFormulario/SeccionAlertas/SeccionAlertas';
import InIngresosEU from '../../components/CamposFormulario/InIngresosEU/InIngresosEU';

// Definición de las secciones para el PDF
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
        title: 'Datos de la Empresa',
        fields: [
            { label: 'Razon Social', name: 'razon_social' },
            { label: 'NIT', name: 'nit' },
            { label: 'Número de Matrícula', name: 'matricula_comercio' },
            { label: 'Domicilio Comercial', name: 'domicilio_comercial_legal' },
            { label: 'Teléfono', name: 'telefono' },
            { label: 'Correo Electrónico', name: 'correo' }
        ]
    },
    {
        title: 'Información Comercial',
        fields: [
            { label: 'Actividad Económica', name: 'actividad' },
            { label: 'Riesgo de la Actividad', name: 'riesgo_profesion_actividad' },
            { label: 'Riesgo de la Zona', name: 'riesgo_zona' },
            { label: 'Nivel de Ingresos', name: 'ingresos_mensuales' },
            { label: 'Volumen de la actividad', name: 'volumen_actividad' },
            { label: 'Frecuencia de la actividad', name: 'frecuencia_actividad' }
        ]
    },
    {
        title: 'Datos del Propietario',
        fields: [
            { label: 'Nombre Completo', name: 'nombres_propietario' },
            { label: 'Apellidos', name: 'apellidos_propietario' },
            { label: 'Tipo de Documento', name: 'tipo_documento_propietario' },
            { label: 'Número de Documento', name: 'nro_documento_propietario' },
            { label: 'Extensión', name: 'extension_propietario' },
            { label: 'Otra Extensión', name: 'otra_extension_propietario' },
            { label: 'Nacionalidad', name: 'nacionalidad' }
        ]
    },
    {
        title: 'Datos del Representante Legal',
        fields: [
            { label: 'Nombre Completo', name: 'nombres_representante' },
            { label: 'Apellidos', name: 'apellidos_representante' },
            { label: 'Tipo de Documento', name: 'tipo_documento_representante' },
            { label: 'Número de Documento', name: 'nro_documento_representante' },
            { label: 'Extensión', name: 'extension_representante' },
            { label: 'Otra Extensión', name: 'otra_extension_representante' },
            { label: 'Cliente PEP', name: 'categoria_pep' }
        ]
    },
    {
        title: 'Información del Seguro',
        fields: [
            { label: 'Compañía', name: 'compania' },
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

const FormularioEmpresaUnipersonal1000 = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [printError, setPrintError] = useState(null);

    const getFormData = useCallback(() => {
        try {
            const form = document.forms[0];
            if (!form) {
                console.error('No se encontró el formulario en el DOM');
                return {};
            }

            const data = {};
            const formElements = form.elements;

            for (let element of formElements) {
                if (element.name && element.value !== undefined) {
                    const cleanName = element.name.startsWith('_') ? element.name.substring(1) : element.name;

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

    const handlePrint = async (formData) => {
        try {
            const pdf = await generateFormPDF(
                formData,
                "Formulario de Empresa Unipersonal (Prima $1000-$5000)",
                printSections
            );
            downloadPDF(pdf, "formulario_Empresa_Unipersonal_1000_5000");
            return true;
        } catch (error) {
            handlePrintError(error);
            return false;
        }
    };

    const handlePrintError = (error) => {
        console.error('Error en generación de PDF:', error);
        let errorMessage = 'Error desconocido al generar el PDF';

        if (error.message) {
            errorMessage = error.message;
        } else if (typeof error === 'string') {
            errorMessage = error;
        }

        setPrintError(errorMessage);
        alert(`Error al generar PDF: ${errorMessage}`);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setPrintError(null);
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
                    await handlePrint(formDataForPrint);
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
                            value="Empresa Unipersonal"
                        />
                        <div className={styles.cardHeader}>
                            <HeaderInfoRegistro titulo="Formulario de Empresa Unipersonal (Prima $1000-$5000)" />
                        </div>
                        <div className={styles.formRow}>
                            <div className={styles.fullWidthField}>
                                <InAutorizacion
                                    name="autorizado_por_alta_gerencia"
                                />
                            </div>
                        </div>
                        <SeccionDatosEmpresa />

                        <div className={styles.formSection}>
                            <h5 className={styles.sectionTitle}>
                                <span className={styles.sectionIcon}>🏠</span>
                                Información Comercial
                            </h5>
                            <div className={styles.formRow}>
                                <div className={styles.formCol}>
                                    <InTexto
                                        label="Domicilio comercial"
                                        name="domicilio_comercial_legal"
                                        maxLength={200}
                                        required
                                    />
                                </div>
                                <div className={styles.formCol}>
                                    <InRiesgo
                                        label="Riesgo de la zona"
                                        name="riesgo_zona"
                                        required
                                    />
                                </div>
                                <div className={styles.formCol}>
                                    <InTelefono
                                        label="Teléfono fijo y/o móvil"
                                        name="telefono"
                                        required
                                    />
                                </div>
                                <div className={styles.formCol}>
                                    <InTexto
                                        label="Correo electrónico (cuando corresponda)"
                                        name="correo"
                                        type="email"
                                        maxLength={100}
                                    />
                                </div>
                                <div className={styles.formCol}>
                                    <InTexto
                                        label="Actividad económica"
                                        name="actividad"
                                        maxLength={100}
                                        required
                                    />
                                </div>
                                <div className={styles.formCol}>
                                    <InRiesgo
                                        label="Riesgo de la Actividad"
                                        name="riesgo_profesion_actividad"
                                        required
                                    />
                                </div>
                                <div className={styles.formCol}>
                                    <InIngresosEU
                                        label="Nivel Promedio de ingresos mensuales"
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
                                <span className={styles.sectionIcon}>👤</span>
                                Datos del Propietario
                            </h5>
                            <div className={styles.formRow}>
                                <div className={styles.formFullCol}>
                                    <InPersona
                                        title="Nombres y apellidos del Propietario"
                                        prefix="_propietario"
                                        required
                                    />
                                </div>
                                <div className={styles.formCol}>
                                    <InPais
                                        label="Nacionalidad del Propietario"
                                        name="nacionalidad"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className={styles.formSection}>
                            <h5 className={styles.sectionTitle}>
                                <span className={styles.sectionIcon}>👔</span>
                                Datos del Representante Legal
                            </h5>
                            <div className={styles.formRow}>
                                <div className={styles.formFullCol}>
                                    <InPersona
                                        title="Nombres y apellidos del Representante Legal"
                                        prefix="_representante"
                                    />
                                </div>
                                <div className={styles.formCol}>
                                    <InPep
                                        label="Cliente PEP"
                                        name="categoria_pep"
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
                                className={styles.resetButton}
                                disabled={isSubmitting}
                            >
                                Limpiar
                            </button>
                            <button
                                type="submit"
                                className={styles.submitButton}
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

export default FormularioEmpresaUnipersonal1000;