import { useState } from 'react';
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

const FormularioPersonaJuridica = () => {
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