import { useState, useEffect } from 'react';
import styles from './styles.module.css';

const frecuencias = {
    'muy alta': { texto: 'Muy alta (diaria)', valor: 5 },
    'media alta': { texto: 'Media alta (semanal)', valor: 4 },
    'media': { texto: 'Media (mensual)', valor: 3 },
    'baja': { texto: 'Baja (trimestral)', valor: 2 },
    'muy baja': { texto: 'Muy baja (anual o eventual)', valor: 1 }
};

const InFrecuenciaActividad = ({ 
    label, 
    name, 
    nameNumerico = `${name}_numerico`,
    required = false, 
    defaultValue = '',
    defaultNumerico = null
}) => {
    const [frecuenciaSeleccionada, setFrecuenciaSeleccionada] = useState('');

    useEffect(() => {
        if (defaultValue) {
            setFrecuenciaSeleccionada(defaultValue);
        }
    }, [defaultValue]);

    const handleChange = (e) => {
        setFrecuenciaSeleccionada(e.target.value);
    };

    // Obtener el valor numérico correspondiente
    const valorNumerico = frecuenciaSeleccionada in frecuencias 
        ? frecuencias[frecuenciaSeleccionada].valor 
        : null;

    return (
        <div className={styles.frecuenciaGroup}>
            <label className={styles.frecuenciaLabel}>
                {label}
                {required && <span className={styles.requiredAsterisk}>*</span>}
            </label>
            <select
                name={name}
                required={required}
                className={styles.frecuenciaSelect}
                value={frecuenciaSeleccionada}
                onChange={handleChange}
            >
                <option value="">Seleccione la frecuencia de la actividad</option>
                {Object.entries(frecuencias).map(([key, { texto }]) => (
                    <option key={key} value={key}>{texto}</option>
                ))}
            </select>
            
            {/* Campo oculto para el valor numérico */}
            <input 
                type="hidden" 
                name={nameNumerico} 
                value={valorNumerico || ''} 
            />
        </div>
    );
};

export default InFrecuenciaActividad;