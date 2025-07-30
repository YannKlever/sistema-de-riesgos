import { useState } from 'react';
import InTexto from '../../components/CamposFormulario/InTexto/InTexto';
import InNit from '../../components/CamposFormulario/InNit/InNit';
import InTelefono from '../../components/CamposFormulario/InTelefono/InTelefono';
import InPersona from '../../components/CamposFormulario/InPersona/InPersona';
import InRiesgo from '../../components/CamposFormulario/InRiesgo/InRiesgo';
import InDomicilioSucursales from '../../components/CamposFormulario/InDomicilioSucursales/InDomicilioSucursales';
import InIngresosAnuales from '../../components/CamposFormulario/InIngresosAnuales/InIngresosAnuales';
import InFechaNacimiento from '../../components/CamposFormulario/InFechaNacimiento/InFechaNacimiento';
import InEstadoCivil from '../../components/CamposFormulario/InEstadoCivil/InEstadoCivil';
import InPais from '../../components/CamposFormulario/InPais/InPais';
import HeaderInfoRegistro from '../../components/CamposFormulario/HeaderInfoRegistro/HeaderInfoRegistro';
import InPep from '../../components/CamposFormulario/InPep/InPep';
import InVolumenActividad from '../../components/CamposFormulario/InVolumenActividad/InVolumenActividad';
import InFrecuenciaActividad from '../../components/CamposFormulario/InFrecuenciaActividad/InFrecuenciaActividad';
import SeccionInformacionSeguro from '../../components/CamposFormulario/SeccionInformacionSeguro/SeccionInformacionSeguro';
import SeccionFrecuenciaContacto from '../../components/CamposFormulario/SeccionFrecuenciaContacto/SeccionFrecuenciaContacto';
import SeccionEvaluacionRiesgo from '../../components/CamposFormulario/SeccionEvaluacionRiesgo/SeccionEvaluacionRiesgo';
import styles from './formularioPersonaNatural5000.module.css';

const FormularioPersonaNatural5000 = () => {
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
                            value="Persona Natural"
                        />
                        <div className={styles.cardHeader}>
                            <HeaderInfoRegistro
                                titulo="Formulario de Persona Natural (Prima $5000+)"
                            />
                        </div>
                        {/* Sección Datos Personales */}
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
                                    <InNit optional />
                                </div>

                                <div className={styles.formCol}>
                                    <InPais
                                        label="Nacionalidad"
                                        name="nacionalidad"
                                        required
                                    />
                                </div>

                                <div className={styles.formCol}>
                                    <InPais
                                        label="País de Residencia"
                                        name="pais_residencia"
                                        required
                                    />
                                </div>

                                <div className={styles.formCol}>
                                    <InEstadoCivil
                                        label="Estado Civil"
                                        name="estado_civil"
                                        required
                                    />
                                </div>

                                <div className={styles.fullWidthField}>
                                    <h6 className={styles.subsectionTitle}>Información del Cónyuge</h6>
                                </div>
                                <div className={styles.formCol}>
                                    <InTexto
                                        label="Nombres del cónyuge"
                                        name="nombres_conyugue"
                                        maxLength={50}
                                    />
                                </div>
                                <div className={styles.formCol}>
                                    <InTexto
                                        label="Apellidos del cónyuge"
                                        name="apellidos_conyugue"
                                        maxLength={50}
                                    />
                                </div>
                                <div className={styles.formCol}>
                                    <InTexto
                                        label="Actividad económica del cónyuge"
                                        name="actividad_conyugue"
                                        maxLength={100}
                                    />
                                </div>
                                <div className={styles.formCol}>
                                    <InTexto
                                        label="Ocupación principal del cónyuge"
                                        name="ocupacion_conyugue"
                                        maxLength={100}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Sección Domicilios */}
                        <div className={styles.formSection}>
                            <h5 className={styles.sectionTitle}>
                                <span className={styles.sectionIcon}>🏠</span>
                                Domicilios
                            </h5>
                            <div className={styles.formRow}>
                                <div className={styles.fullWidthField}>
                                    <InDomicilioSucursales
                                        labelPrincipal="Domicilio Particular"
                                        labelSucursales="Domicilio Comercial (si aplica)"
                                        namePrincipal="domicilio_persona_sucursal"
                                        nameSucursales="domicilio_comercial_legal"
                                        requiredPrincipal
                                    />
                                </div>

                                <div className={styles.formCol}>
                                    <InTelefono
                                        label="Teléfono Fijo/Móvil"
                                        name="telefono"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Sección Información Laboral */}
                        <div className={styles.formSection}>
                            <h5 className={styles.sectionTitle}>
                                <span className={styles.sectionIcon}>💼</span>
                                Información Laboral
                            </h5>
                            <div className={styles.formRow}>
                                <div className={styles.formCol}>
                                    <InTexto
                                        label="Actividad económica u ocupación principal"
                                        name="actividad"
                                        maxLength={100}
                                        required
                                    />
                                </div>
                                <div className={styles.formCol}>
                                    <InRiesgo
                                        label="Nivel de Riesgo de Actividad"
                                        name="riesgo_profesion_actividad"
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
                                    <InTexto
                                        label="Profesión u Oficio"
                                        name="profesion"
                                        maxLength={100}
                                        required
                                    />
                                </div>
                                <div className={styles.formCol}>
                                    <InTexto
                                        label="Lugar de Trabajo (si aplica)"
                                        name="lugar_trabajo"
                                        maxLength={100}
                                    />
                                </div>

                                <div className={styles.formCol}>
                                    <InTexto
                                        label="Cargo"
                                        name="cargo"
                                        maxLength={100}
                                    />
                                </div>
                                <div className={styles.formCol}>
                                    <InTexto
                                        label="Año de ingreso en el lugar de trabajo"
                                        name="gestion_ingreso"
                                        maxLength={4}
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
                                    <InTexto
                                        label="Correo Electrónico (si aplica)"
                                        name="correo"
                                        type="email"
                                        maxLength={100}
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

export default FormularioPersonaNatural5000;