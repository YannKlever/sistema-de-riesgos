import React, { useState } from 'react';
import InSelect from '../InSelect/InSelect';
import styles from './styles.module.css';

const initialFrecuenciaState = {
    frecuencia_contacto_fisico: '',
    frecuencia_contacto_digital: '',
    medio_comunicacion: '',
    medio_pago: ''
};

const SeccionFrecuenciaContacto = () => {
    const [frecuenciaState, setFrecuenciaState] = useState(initialFrecuenciaState);

    // Opciones con valores numéricos
    const opcionesFrecuencia = [
        { value: 'bajo', label: 'Bajo', valor: 1 },
        { value: 'medio bajo', label: 'Medio bajo', valor: 2 },
        { value: 'medio', label: 'Medio', valor: 3 },
        { value: 'medio alto', label: 'Medio alto', valor: 4 },
        { value: 'alto', label: 'Alto', valor: 5 }
    ];

    const opcionesMedioComunicacion = [
        { value: 'totalmente fisico', label: 'Totalmente físico', valor: 1 },
        { value: 'parcialmente fisico', label: 'Parcialmente físico', valor: 2 },
        { value: 'moderado', label: 'Moderado', valor: 3 },
        { value: 'parcialmente digital', label: 'Parcialmente digital', valor: 4 },
        { value: 'totalmente digital', label: 'Totalmente digital', valor: 5 }
    ];

    const opcionesMedioPago = [
        { value: 'transferencia', label: 'Transferencia bancaria directa', valor: 1 },
        { value: 'tarjeta', label: 'Tarjeta de crédito/débito', valor: 2 },
        { value: 'electronico', label: 'Pago electrónico', valor: 3 },
        { value: 'criptomonedas', label: 'Criptomonedas', valor: 5 },
        { value: 'efectivo', label: 'Efectivo', valor: 4 }
    ];

    const handleSelectChange = (fieldName, value) => {
        setFrecuenciaState(prev => ({
            ...prev,
            [fieldName]: value
        }));
    };

    // Función para obtener el valor numérico
    const getValorNumerico = (fieldName) => {
        const value = frecuenciaState[fieldName];
        if (!value) return '';
        
        let opciones;
        if (fieldName.includes('frecuencia_')) {
            opciones = opcionesFrecuencia;
        } else if (fieldName === 'medio_comunicacion') {
            opciones = opcionesMedioComunicacion;
        } else if (fieldName === 'medio_pago') {
            opciones = opcionesMedioPago;
        }

        const opcion = opciones.find(o => o.value === value);
        return opcion ? opcion.valor : '';
    };

    return (
        <div className={styles.seccionContainer}>
            <h5 className={styles.seccionTitulo}>
                <span className={styles.seccionIcono}>📊</span>
                Seguimiento de distribución
            </h5>
            
            <div className={styles.filaSuperior}>
                <div className={styles.campoWrapper}>
                    <div className={styles.labelContainer}>
                        <span className={styles.labelText}>Frecuencia de contacto físico</span>
                        <span className={styles.requiredAsterisk}>*</span>
                    </div>
                    <InSelect
                        name="frecuencia_contacto_fisico"
                        options={opcionesFrecuencia}
                        value={frecuenciaState.frecuencia_contacto_fisico}
                        onChange={(value) => handleSelectChange('frecuencia_contacto_fisico', value)}
                        required
                    />
                    <input 
                        type="hidden" 
                        name="frecuencia_contacto_fisico_numerico" 
                        value={getValorNumerico('frecuencia_contacto_fisico')} 
                    />
                </div>
                
                <div className={styles.campoWrapper}>
                    <div className={styles.labelContainer}>
                        <span className={styles.labelText}>Frecuencia de contacto digital</span>
                        <span className={styles.requiredAsterisk}>*</span>
                    </div>
                    <InSelect
                        name="frecuencia_contacto_digital"
                        options={opcionesFrecuencia}
                        value={frecuenciaState.frecuencia_contacto_digital}
                        onChange={(value) => handleSelectChange('frecuencia_contacto_digital', value)}
                        required
                    />
                    <input 
                        type="hidden" 
                        name="frecuencia_contacto_digital_numerico" 
                        value={getValorNumerico('frecuencia_contacto_digital')} 
                    />
                </div>
            </div>
            
            <div className={styles.filaInferior}>
                <div className={styles.campoWrapper}>
                    <div className={styles.labelContainer}>
                        <span className={styles.labelText}>Medio de comunicación</span>
                        <span className={styles.requiredAsterisk}>*</span>
                    </div>
                    <InSelect
                        name="medio_comunicacion"
                        options={opcionesMedioComunicacion}
                        value={frecuenciaState.medio_comunicacion}
                        onChange={(value) => handleSelectChange('medio_comunicacion', value)}
                        required
                    />
                    <input 
                        type="hidden" 
                        name="medio_comunicacion_numerico" 
                        value={getValorNumerico('medio_comunicacion')} 
                    />
                </div>
                
                <div className={styles.campoWrapper}>
                    <div className={styles.labelContainer}>
                        <span className={styles.labelText}>Medio de pago</span>
                        <span className={styles.requiredAsterisk}>*</span>
                    </div>
                    <InSelect
                        name="medio_pago"
                        options={opcionesMedioPago}
                        value={frecuenciaState.medio_pago}
                        onChange={(value) => handleSelectChange('medio_pago', value)}
                        required
                    />
                    <input 
                        type="hidden" 
                        name="medio_pago_numerico" 
                        value={getValorNumerico('medio_pago')} 
                    />
                </div>
            </div>
        </div>
    );
};

export default SeccionFrecuenciaContacto;