import { useState, useCallback } from 'react';
import InTexto from '../../components/CamposFormulario/InTexto/InTexto';
import InNit from '../../components/CamposFormulario/InNit/InNit';
import InTelefono from '../../components/CamposFormulario/InTelefono/InTelefono';
import InPersonaCargo from '../../components/CamposFormulario/InPersonaCargo/InPersonaCargo';
import InTipoSociedad from '../../components/CamposFormulario/InTipoSociedad/InTipoSociedad';
import InDomicilioSucursales from '../../components/CamposFormulario/InDomicilioSucursales/InDomicilioSucursales';
import InIngresosAnuales from '../../components/CamposFormulario/InIngresosAnuales/InIngresosAnuales';
import InRiesgo from '../../components/CamposFormulario/InRiesgo/InRiesgo';
import InPais from '../../components/CamposFormulario/InPais/InPais';
import InPep from '../../components/CamposFormulario/InPep/InPep';
import InVolumenActividad from '../../components/CamposFormulario/InVolumenActividad/InVolumenActividad';
import InFrecuenciaActividad from '../../components/CamposFormulario/InFrecuenciaActividad/InFrecuenciaActividad';
import HeaderInfoRegistro from '../../components/CamposFormulario/HeaderInfoRegistro/HeaderInfoRegistro';
import styles from './formularioPersonaJuridica.module.css';
import SeccionInformacionSeguro from '../../components/CamposFormulario/SeccionInformacionSeguro/SeccionInformacionSeguro';
import SeccionFrecuenciaContacto from '../../components/CamposFormulario/SeccionFrecuenciaContacto/SeccionFrecuenciaContacto';
import SeccionEvaluacionRiesgo from '../../components/CamposFormulario/SeccionEvaluacionRiesgo/SeccionEvaluacionRiesgo';
import { generateFormPDF, downloadPDF } from '../../utils/print/pdfGenerator';

// Definición de las secciones para el PDF
const printSections = [
    {
        title: 'Datos Generales',
        fields: [
            { label: 'Fecha de Registro', name: 'fecha_registro' },
            { label: 'Oficina', name: 'oficina' },
            { label: 'Ejecutivo', name: 'ejecutivo' }
        ]
    },
    {
        title: 'Datos de la Empresa',
        fields: [
            { label: 'Denominación/Razón Social', name: 'razon_social' },
            { label: 'NIT', name: 'nit' },
            { label: 'Tipo de Sociedad Comercial', name: 'tipo_sociedad' },
            { label: 'Nacionalidad', name: 'nacionalidad' },
            { label: 'Domicilio Principal', name: 'domicilio_comercial_legal' },
            { label: 'Domicilio de Sucursales', name: 'domicilio_persona_sucursal' },
            { label: 'Teléfono Principal', name: 'telefono' },
            { label: 'Celular', name: 'celular' }
        ]
    },
    {
        title: 'Actividad Económica',
        fields: [
            { label: 'Actividad Principal', name: 'actividad' },
            { label: 'Riesgo de la Actividad', name: 'riesgo_profesion_actividad' },
            { label: 'Volumen de la actividad', name: 'volumen_actividad' },
            { label: 'Frecuencia de la actividad', name: 'frecuencia_actividad' },
            { label: 'Nivel de Ingresos Mensuales', name: 'ingresos_mensuales' },
            { label: 'Riesgo de la zona', name: 'riesgo_zona' }
        ]
    },
    {
        title: 'Persona en Alta Gerencia',
        fields: [
            { label: 'Nombre Completo', name: 'nombres_representante' },
            { label: 'Apellidos', name: 'apellidos_representante' },
            { label: 'Tipo de Documento', name: 'tipo_documento_representante' },
            { label: 'Número de Documento', name: 'nro_documento_representante' },
            { label: 'Extensión', name: 'extension_representante' },
            { label: 'Otra Extensión', name: 'otra_extension_representante' },
            { label: 'Cargo', name: 'cargo_representante' },
            { label: 'Cliente PEP', name: 'categoria_pep' }
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

const FormularioPersonaJuridica = () => {
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

    const handlePrint = (formData) => {
        try {
            const pdf = generateFormPDF(formData, "Formulario de Empresa Jurídica", printSections);
            downloadPDF(pdf, "formulario_Empresa_Juridica");
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
                <div className={styles.content}>
                    <form onSubmit={handleSubmit}>
                        <div className={styles.header}>
                            <HeaderInfoRegistro titulo="Formulario de Empresa Jurídica" />
                        </div>
                        {/* Sección Datos de la Empresa */}
                        <div className={styles.section}>
                            <h3 className={styles.sectionTitle}>
                                <span className={styles.sectionIcon}>🏢</span>
                                Datos de la Empresa
                            </h3>
                            <div className={styles.row}>
                                <div className={styles.field}>
                                    <InTexto
                                        label="Denominación/Razón Social"
                                        name="razon_social"
                                        placeholder="Ej: Industria Boliviana de Costura"
                                        maxLength={100}
                                        required
                                    />
                                </div>
                                <div className={styles.field}>
                                    <InNit />
                                </div>
                            </div>

                            <div className={styles.row}>
                                <div className={styles.field}>
                                    <InTipoSociedad
                                        label="Tipo y forma de Sociedad Comercial"
                                        name="tipo_sociedad"
                                        required
                                    />
                                </div>
                                <div className={styles.field}>
                                    <InPais
                                        label="Nacionalidad"
                                        name="nacionalidad"
                                        required
                                    />
                                </div>
                            </div>

                            <div className={styles.row}>
                                <div className={styles.fullWidthField}>
                                    <InDomicilioSucursales
                                        labelPrincipal="Domicilio de Oficina Principal"
                                        labelSucursales="Domicilio de Sucursales (si aplica)"
                                        namePrincipal="domicilio_comercial_legal"
                                        nameSucursales="domicilio_persona_sucursal"
                                        requiredPrincipal
                                    />
                                </div>
                            </div>

                            <div className={styles.row}>
                                <div className={styles.field}>
                                    <InTelefono
                                        label="Teléfono de Domicilio Principal"
                                        name="telefono"
                                        required
                                    />
                                </div>
                                <div className={styles.field}>
                                    <InTelefono
                                        label="Celular"
                                        name="celular"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Sección Actividad Económica */}
                        <div className={styles.section}>
                            <h3 className={styles.sectionTitle}>
                                <span className={styles.sectionIcon}>💼</span>
                                Actividad Económica
                            </h3>
                            <div className={styles.row}>
                                <div className={styles.field}>
                                    <InTexto
                                        label="Actividad Principal"
                                        name="actividad"
                                        placeholder="Ej: Textiles y manofactura"
                                        maxLength={60}
                                        required
                                    />
                                </div>
                                <div className={styles.field}>
                                    <InRiesgo
                                        label="Riesgo de la Actividad"
                                        name="riesgo_profesion_actividad"
                                        required
                                    />
                                </div>
                            </div>

                            <div className={styles.row}>
                                <div className={styles.field}>
                                    <InVolumenActividad
                                        label="Volumen de la actividad"
                                        name="volumen_actividad"
                                        required
                                    />
                                </div>
                                <div className={styles.field}>
                                    <InFrecuenciaActividad
                                        label="Frecuencia de la actividad"
                                        name="frecuencia_actividad"
                                        required
                                    />
                                </div>
                            </div>

                            <div className={styles.row}>
                                <div className={styles.field}>
                                    <InIngresosAnuales
                                        label="Nivel de Ingresos Mensuales"
                                        name="ingresos_mensuales"
                                        required
                                    />
                                </div>
                                <div className={styles.field}>
                                    <InRiesgo
                                        label="Riesgo de la zona"
                                        name="riesgo_zona"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className={styles.section}>
                            <h3 className={styles.sectionTitle}>
                                <span className={styles.sectionIcon}>👔</span>
                                Persona en Alta Gerencia
                            </h3>
                            <InPersonaCargo
                                title="Gerente General o equivalente"
                                prefix="_representante"
                            />

                            <div className={styles.row}>
                                <div className={styles.field}>
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

                        <div className={styles.buttons}>
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

export default FormularioPersonaJuridica;