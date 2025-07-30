import { useState } from 'react';
import InTexto from '../../components/CamposFormulario/InTexto/InTexto';
import InSelect from '../../components/CamposFormulario/InSelect/InSelect';
import InRadio from '../../components/CamposFormulario/InRadio/InRadio';
import InRiesgo from '../../components/CamposFormulario/InRiesgo/InRiesgo';
import HeaderInfoRegistro from '../../components/CamposFormulario/HeaderInfoRegistro/HeaderInfoRegistro';
import styles from './FormularioCanalDistribucion.module.css';

const FormularioCanalDistribucion = ({ onBack }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            alert('Formulario enviado con éxito');
        }, 1500);
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <HeaderInfoRegistro 
                        titulo="Factor de Riesgo Canal de Distribución" 
                        
                        onBack={onBack}
                    />
                </div>
                
                <div className={styles.content}>
                    <form onSubmit={handleSubmit}>
                        {/* Sección Información del Canal */}
                        <div className={styles.section}>
                            <h3 className={styles.sectionTitle}>
                                <span className={styles.sectionIcon}>📡</span>
                                Información del Canal
                            </h3>
                            <div className={styles.row}>
                                <div className={styles.field}>
                                    <InTexto
                                        label="Nombre del canal"
                                        name="nombreCanal"
                                        placeholder="Ej: Digital, Presencial, Agente, Call Center"
                                        maxLength={100}
                                        required
                                    />
                                </div>
                            </div>
                            
                            <div className={styles.row}>
                                <div className={styles.field}>
                                    <InRadio
                                        label="¿Es un canal directo (requiere presencia física)?"
                                        name="canalDirecto"
                                        options={[
                                            {value: 'si', label: 'Sí'},
                                            {value: 'no', label: 'No'}
                                        ]}
                                        required
                                    />
                                </div>
                                <div className={styles.field}>
                                    <InRadio
                                        label="¿Es un canal indirecto o digital?"
                                        name="canalIndirecto"
                                        options={[
                                            {value: 'si', label: 'Sí'},
                                            {value: 'no', label: 'No'}
                                        ]}
                                        required
                                    />
                                </div>
                            </div>
                            
                            <div className={styles.row}>
                                <div className={styles.field}>
                                    <InSelect
                                        label="Tipo de persona usuaria"
                                        name="tipoUsuario"
                                        options={[
                                            {value: 'natural', label: 'Natural'},
                                            {value: 'juridica', label: 'Jurídica'}
                                        ]}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Sección Evaluación de Riesgos */}
                        <div className={styles.section}>
                            <h3 className={styles.sectionTitle}>
                                <span className={styles.sectionIcon}>⚠️</span>
                                Evaluación de Riesgos
                            </h3>
                            <div className={styles.row}>
                                <div className={styles.field}>
                                    <InRiesgo
                                        label="Riesgo de contacto físico"
                                        name="riesgoContactoFisico"
                                        required
                                    />
                                </div>
                                <div className={styles.field}>
                                    <InRiesgo
                                        label="Riesgo de contacto digital"
                                        name="riesgoContactoDigital"
                                        required
                                    />
                                </div>
                            </div>
                            
                            <div className={styles.row}>
                                <div className={styles.field}>
                                    <InRiesgo
                                        label="Riesgo del cliente interno"
                                        name="riesgoClienteInterno"
                                        required
                                    />
                                </div>
                                <div className={styles.field}>
                                    <InRiesgo
                                        label="Riesgo por medios de comunicación utilizados"
                                        name="riesgoMediosComunicacion"
                                        required
                                    />
                                </div>
                            </div>
                            
                            <div className={styles.row}>
                                <div className={styles.field}>
                                    <InRiesgo
                                        label="Riesgo por tipo de medio de pago"
                                        name="riesgoMedioPago"
                                        required
                                    />
                                </div>
                                <div className={styles.field}>
                                    <InRiesgo
                                        label="Riesgo Factor Canal de Distribución"
                                        name="riesgoFactorCanal"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                        
                        {/* Botones de acción */}
                        <div className={styles.buttons}>
                            <button 
                                type="button" 
                                className={styles.secondaryButton}
                                onClick={onBack}
                                disabled={isSubmitting}
                            >
                                Volver
                            </button>
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

export default FormularioCanalDistribucion;