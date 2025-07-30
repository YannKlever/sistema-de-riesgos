import { useState } from 'react';
import InTexto from '../../components/CamposFormulario/InTexto/InTexto';
import InSelect from '../../components/CamposFormulario/InSelect/InSelect';
import HeaderInfoRegistro from '../../components/CamposFormulario/HeaderInfoRegistro/HeaderInfoRegistro';
import styles from './FormularioProductoServicio.module.css';

const FormularioProductoServicio = ({ onBack }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Lista hipotética de productos/servicios
    const productosServicios = [
        { value: 'seguro_vida', label: 'Seguro de Vida' },
        { value: 'seguro_auto', label: 'Seguro de Automóvil' },
        { value: 'seguro_hogar', label: 'Seguro de Hogar' },
        { value: 'cuenta_ahorros', label: 'Cuenta de Ahorros' },
        { value: 'cuenta_corriente', label: 'Cuenta Corriente' },
        { value: 'prestamo_personal', label: 'Préstamo Personal' },
        { value: 'tarjeta_credito', label: 'Tarjeta de Crédito' },
        { value: 'inversion_fondos', label: 'Fondos de Inversión' }
    ];

    // Lista hipotética de tipos de cliente
    const tiposCliente = [
        { value: 'persona_natural', label: 'Persona Natural' },
        { value: 'empresa_pequena', label: 'Empresa Pequeña' },
        { value: 'empresa_mediana', label: 'Empresa Mediana' },
        { value: 'empresa_grande', label: 'Empresa Grande' },
        { value: 'sector_publico', label: 'Sector Público' },
        { value: 'organizacion_sin_fines_lucro', label: 'Organización sin fines de lucro' },
        { value: 'cliente_extranjero', label: 'Cliente Extranjero' }
    ];

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
                        titulo="Factor de Riesgo Producto/Servicio" 
                        onBack={onBack}
                    />
                </div>
                
                <div className={styles.content}>
                    <form onSubmit={handleSubmit}>
                        {/* Sección Información Básica */}
                        <div className={styles.section}>
                            <h3 className={styles.sectionTitle}>
                                <span className={styles.sectionIcon}>📋</span>
                                Información Básica
                            </h3>
                            <div className={styles.row}>
                                <div className={styles.field}>
                                    <InTexto
                                        label="Oficina que ofrece el producto"
                                        name="oficina"
                                        placeholder="Ej: Sucursal Central"
                                        maxLength={100}
                                        required
                                    />
                                </div>
                                <div className={styles.field}>
                                    <InSelect
                                        label="Producto y/o Servicio ofrecido"
                                        name="productoServicio"
                                        options={productosServicios}
                                        required
                                    />
                                </div>
                            </div>
                            
                            <div className={styles.row}>
                                <div className={styles.field}>
                                    <InSelect
                                        label="Tipo de cliente del producto o servicio"
                                        name="tipoCliente"
                                        options={tiposCliente}
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

export default FormularioProductoServicio;