import React, { useState, useEffect } from 'react';
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
import styles from './formularioAccionistasSocios.module.css';
import InParticipacionAccionaria from '../../components/CamposFormulario/InParticipacionAccionaria/InParticipacionAccionaria';
import SeccionEvaluacionRiesgo from '../../components/CamposFormulario/SeccionEvaluacionRiesgo/SeccionEvaluacionRiesgo';
import { databaseService } from '../../services/database';

const FormularioAccionistasSocios = () => {
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
                    const resultado = await databaseService.obtenerAccionistaSocio(id);
                    console.log('Datos recibidos:', resultado);

                    if (resultado.success) {
                        setInitialData(resultado.data);
                        setIsEditing(true);
                    } else {
                        alert('No se pudo cargar el accionista/socio para edición');
                        navigate('/parametros/lista-accionistas-socios');
                    }
                } catch (error) {
                    console.error('Error al cargar datos:', error);
                    alert('Error al cargar datos del accionista/socio');
                    navigate('/parametros/lista-accionistas-socios');
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

        try {
            let result;
            if (isEditing) {
                result = await databaseService.actualizarAccionistaSocio(id, formValues);
            } else {
                result = await databaseService.crearAccionistaSocio(formValues);
            }

            if (result?.success) {
                alert(`Accionista/Socio ${isEditing ? 'actualizado' : 'creado'} correctamente`);
                navigate('/parametros/lista-accionistas-socios');
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
                                titulo={`Formulario del Accionista o Socio ${isEditing ? '(Edición)' : '(Nuevo)'}`}
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
                                        prefix="_accionistas_socios"
                                        defaultValue={{
                                            nombres: initialData?.nombres_accionistas_socios,
                                            apellidos: initialData?.apellidos_accionistas_socios,
                                            tipo_documento: initialData?.tipo_documento_accionistas_socios,
                                            nro_documento: initialData?.nro_documento_accionistas_socios,
                                            extension: initialData?.extension_accionistas_socios,
                                            otra_extension: initialData?.otra_extension_accionistas_socios
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
                                        label="Profesión u Actividad Principal"
                                        name="actividad"
                                        maxLength={100}
                                        required
                                        defaultValue={initialData?.actividad}
                                    />
                                </div>
                                <div className={styles.formCol}>
                                    <InRiesgo
                                        label="Riesgo de profesión"
                                        name="riesgo_actividad"
                                        required
                                        defaultValue={initialData?.riesgo_actividad}
                                        defaultNumerico={initialData?.riesgo_actividad_numerico}
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
                                <div className={styles.formCol}>
                                    <InParticipacionAccionaria
                                        label="Participación Accionaria"
                                        name="participacion_accionaria"
                                        required
                                        defaultValue={initialData?.participacion_accionaria}
                                        defaultNumerico={initialData?.participacion_accionaria_numerico}
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
                                        name="domicilio_persona"
                                        maxLength={200}
                                        required
                                        defaultValue={initialData?.domicilio_persona}
                                    />
                                </div>
                            </div>
                        </div>

                        <SeccionEvaluacionRiesgo
                            defaultValue={initialData}
                        />

                        <div className={styles.formActions}>
                            <button
                                type="button"
                                onClick={() => navigate('/parametros/lista-accionistas-socios')}
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

export default FormularioAccionistasSocios;