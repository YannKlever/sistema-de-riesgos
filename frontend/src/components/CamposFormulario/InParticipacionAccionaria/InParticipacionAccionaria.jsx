import { useState, useEffect } from 'react';
import styles from './styles.module.css';

// Función para calcular el nivel de riesgo basado en el porcentaje
const calcularNivelParticipacion = (porcentaje) => {
    if (!porcentaje || isNaN(porcentaje)) return null;
    
    const valor = parseFloat(porcentaje);
    
    if (valor >= 75) return 5;    
    if (valor >= 50) return 4;     
    if (valor >= 25) return 3;     
    if (valor >= 10) return 2;    
    return 1;                      
};

const InParticipacionAccionaria = ({ 
    label, 
    name, 
    nameNumerico = `${name}_numerico`,
    required = false, 
    defaultValue = '',
    defaultNumerico = null
}) => {
    const [porcentaje, setPorcentaje] = useState('');

    useEffect(() => {
        if (defaultValue) {
            setPorcentaje(defaultValue);
        }
    }, [defaultValue]);

    const handleChange = (e) => {
        setPorcentaje(e.target.value);
    };

    const valorNumerico = calcularNivelParticipacion(porcentaje);

    return (
        <div className={styles.participacionContainer}>
            <label className={styles.participacionLabel}>
                {label}
                {required && <span className={styles.requiredAsterisk}>*</span>}
            </label>
            <div className={styles.participacionInputGroup}>
                <input
                    type="number"
                    name={name}
                    placeholder="Ej: 50.75"
                    min="0"
                    max="100"
                    step="0.01"
                    required={required}
                    className={styles.participacionInput}
                    value={porcentaje}
                    onChange={handleChange}
                />
                <span className={styles.porcentajeIcon}>%</span>
            </div>
            <small className={styles.participacionHelpText}>
                Ingrese un valor entre 0 y 100 para la participación accionaria. Use punto para decimales.
            </small>
            
            {/* Campo oculto para el valor numérico */}
            <input 
                type="hidden" 
                name={nameNumerico} 
                value={valorNumerico || ''} 
            />
        </div>
    );
};

export default InParticipacionAccionaria;