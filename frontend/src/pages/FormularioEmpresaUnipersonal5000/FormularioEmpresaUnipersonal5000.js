import { useState } from 'react';
import SeccionDatosEmpresa from '../../components/CamposFormulario/SeccionDatosEmpresa/SeccionDatosEmpresa';
import SeccionInformacionSeguro from '../../components/CamposFormulario/SeccionInformacionSeguro/SeccionInformacionSeguro';
import InTexto from '../../components/CamposFormulario/InTexto/InTexto';
import InTelefono from '../../components/CamposFormulario/InTelefono/InTelefono';
import InRiesgo from '../../components/CamposFormulario/InRiesgo/InRiesgo';
import InPersona from '../../components/CamposFormulario/InPersona/InPersona';
import InPais from '../../components/CamposFormulario/InPais/InPais';
import InPep from '../../components/CamposFormulario/InPep/InPep';
import InIngresosAnuales from '../../components/CamposFormulario/InIngresosAnuales/InIngresosAnuales';
import InVolumenActividad from '../../components/CamposFormulario/InVolumenActividad/InVolumenActividad';
import InFrecuenciaActividad from '../../components/CamposFormulario/InFrecuenciaActividad/InFrecuenciaActividad';
import HeaderInfoRegistro from '../../components/CamposFormulario/HeaderInfoRegistro/HeaderInfoRegistro';
import styles from './formularioEmpresaUnipersonal5000.module.css';
import SeccionFrecuenciaContacto from '../../components/CamposFormulario/SeccionFrecuenciaContacto/SeccionFrecuenciaContacto';
import SeccionEvaluacionRiesgo from '../../components/CamposFormulario/SeccionEvaluacionRiesgo/SeccionEvaluacionRiesgo';

const FormularioEmpresaUnipersonal5000 = () => {
    const [isSubmitting] = useState(false);

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
                // Limpiar formulario si es exitoso
                e.target.reset();
            } else {
                alert(`Error: ${result?.error || 'Error desconocido'}`);
            }
        } catch (error) {
            console.error('Error en handleSubmit:', error);
            alert(`Error de conexión: ${error.message}`);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.cardBody}>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="hidden"
                            name="tipo_sociedad"
                            value="Empresa Unipersonal"
                        />
                        <div className={styles.cardHeader}>
                            <HeaderInfoRegistro titulo="Formulario de Empresa Unipersonal (Prima $5000+)" />
                        </div>
                        <SeccionDatosEmpresa />
                        <div className={styles.formSection}>
                            <h5 className={styles.sectionTitle}>
                                <span className={styles.sectionIcon}>🏠</span>
                                Información Comercial
                            </h5>
                            <div className={styles.formRow}>
                                <div className={styles.formFullCol}>
                                    <InTexto
                                        label="Domicilio comercial"
                                        name="domicilio_comercial_legal"
                                        maxLength={200}
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
                                <div className={styles.formCol}>
                                    <InIngresosAnuales
                                        label="Nivel de Ingresos o Promedio de ingresos mensuales"
                                        name="ingresos_mensuales"
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
                                <div className={styles.formCol}>
                                    <InPep
                                        label="Cliente PEP"
                                        name="categoria_pep"
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
                            </div>
                        </div>

                        <SeccionInformacionSeguro />
                        <SeccionFrecuenciaContacto />
                        <SeccionEvaluacionRiesgo />

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

export default FormularioEmpresaUnipersonal5000;