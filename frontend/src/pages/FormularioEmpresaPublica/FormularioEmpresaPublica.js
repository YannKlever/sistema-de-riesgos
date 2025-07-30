import { useState } from 'react';
import InTexto from '../../components/CamposFormulario/InTexto/InTexto';
import InNit from '../../components/CamposFormulario/InNit/InNit';
import InTelefono from '../../components/CamposFormulario/InTelefono/InTelefono';
import InPersona from '../../components/CamposFormulario/InPersona/InPersona';
import InRiesgo from '../../components/CamposFormulario/InRiesgo/InRiesgo';
import InPais from '../../components/CamposFormulario/InPais/InPais';
import InPep from '../../components/CamposFormulario/InPep/InPep';
import InIngresosAnuales from '../../components/CamposFormulario/InIngresosAnuales/InIngresosAnuales';
import InVolumenActividad from '../../components/CamposFormulario/InVolumenActividad/InVolumenActividad';
import InFrecuenciaActividad from '../../components/CamposFormulario/InFrecuenciaActividad/InFrecuenciaActividad';
import HeaderInfoRegistro from '../../components/CamposFormulario/HeaderInfoRegistro/HeaderInfoRegistro';
import styles from './formularioEmpresaPublica.module.css';
import SeccionInformacionSeguro from '../../components/CamposFormulario/SeccionInformacionSeguro/SeccionInformacionSeguro';
import SeccionFrecuenciaContacto from '../../components/CamposFormulario/SeccionFrecuenciaContacto/SeccionFrecuenciaContacto';
import SeccionEvaluacionRiesgo from '../../components/CamposFormulario/SeccionEvaluacionRiesgo/SeccionEvaluacionRiesgo';

const FormularioEmpresaPublica = () => {
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
                            value="Empresa Pública"
                        />
                        <div className={styles.cardHeader}>
                            <HeaderInfoRegistro titulo="Formulario de Empresa Pública" />
                        </div>
                        {/* Sección Información Básica */}
                        <div className={styles.formSection}>
                            <h5 className={styles.sectionTitle}>
                                <span className={styles.sectionIcon}>📋</span>
                                Información Básica
                            </h5>
                            <div className={styles.formRow}>
                                <div className={styles.formCol}>
                                    <InTexto
                                        label="Nombre de la Institución"
                                        name="razon_social"
                                        placeholder="Gobierno Municipal de Pando"
                                        maxLength={80}
                                        required
                                    />
                                </div>
                                <div className={styles.formCol}>
                                    <InNit />
                                </div>

                                <div className={styles.formCol}>
                                    <InTexto
                                        label="Domicilio legal"
                                        name="domicilio_comercial_legal"
                                        placeholder="Zona 15 de Agosto Calle 6 #123"
                                        maxLength={100}
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
                                    <InTelefono
                                        label="Teléfono"
                                        name="telefono"
                                        required
                                    />
                                </div>
                                <div className={styles.formCol}>
                                    <InTelefono
                                        label="Celular"
                                        name="celular"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Sección Actividad Económica */}
                        <div className={styles.formSection}>
                            <h5 className={styles.sectionTitle}>
                                <span className={styles.sectionIcon}>💼</span>
                                Actividad Económica
                            </h5>
                            <div className={styles.formRow}>
                                <div className={styles.formCol}>
                                    <InTexto
                                        label="Actividad Principal"
                                        name="actividad"
                                        placeholder="Gestion del Gobierno Municipal"
                                        maxLength={60}
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
                                        label="Nivel de Ingresos Mensuales"
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
                        {/* Sección Representante Legal */}
                        <div className={styles.formSection}>
                            <h5 className={styles.sectionTitle}>
                                <span className={styles.sectionIcon}>👤</span>
                                Representante Legal
                            </h5>
                            <InPersona
                                title="Datos del Representante Legal"
                                prefix="_representante"
                            />

                            <div className={styles.formRow}>
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

export default FormularioEmpresaPublica;