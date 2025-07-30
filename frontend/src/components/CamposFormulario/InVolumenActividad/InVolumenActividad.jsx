import { useState, useEffect } from 'react';
import styles from './styles.module.css';

const nivelesVolumen = {
    'alto': { texto: 'Volumen alto de actividades', valor: 5 },
    'medio alto': { texto: 'Volumen medio alto de actividades', valor: 4 },
    'medio': { texto: 'Volumen medio de actividades', valor: 3 },
    'medio bajo': { texto: 'Volumen medio bajo de actividades', valor: 2 },
    'bajo': { texto: 'Volumen bajo de actividades', valor: 1 }
};

const InVolumenActividad = ({ 
    label, 
    name, 
    nameNumerico = `${name}_numerico`,
    required = false, 
    defaultValue = '',
    defaultNumerico = null
}) => {
    const [volumenSeleccionado, setVolumenSeleccionado] = useState('');

    useEffect(() => {
        if (defaultValue) {
            setVolumenSeleccionado(defaultValue);
        }
    }, [defaultValue]);

    const handleChange = (e) => {
        setVolumenSeleccionado(e.target.value);
    };

    const valorNumerico = volumenSeleccionado in nivelesVolumen 
        ? nivelesVolumen[volumenSeleccionado].valor 
        : null;

    return (
        <div className={styles.volumenContainer}>
            <label className={styles.volumenLabel}>
                {label}
                {required && <span className={styles.requiredAsterisk}>*</span>}
            </label>
            <select
                name={name}
                required={required}
                className={styles.volumenSelect}
                value={volumenSeleccionado}
                onChange={handleChange}
            >
                <option value="">Seleccione el volumen de la actividad principal</option>
                {Object.entries(nivelesVolumen).map(([key, { texto }]) => (
                    <option key={key} value={key}>{texto}</option>
                ))}
            </select>
            
            <input 
                type="hidden" 
                name={nameNumerico} 
                value={valorNumerico || ''} 
            />
        </div>
    );
};

export default InVolumenActividad;