import { useState, useEffect } from 'react';
import styles from './styles.module.css';

const estados = [
    "Soltero/a",
    "Casado/a",
    "Divorciado/a",
    "Viudo/a",
    "Unión Libre"
];

const InEstadoCivil = ({ label, name, required = false, defaultValue = '' }) => {
    const [estadoSeleccionado, setEstadoSeleccionado] = useState('');

    useEffect(() => {
        if (defaultValue) {
            setEstadoSeleccionado(defaultValue);
        }
    }, [defaultValue]);

    const handleChange = (e) => {
        setEstadoSeleccionado(e.target.value);
    };

    return (
        <div className={styles.formGroup}>
            <label className={styles.formLabel}>
                {label} {required && <span className={styles.requiredAsterisk}>*</span>}
            </label>
            <select 
                name={name} 
                required={required}
                className={styles.formSelect}
                value={estadoSeleccionado}
                onChange={handleChange}
            >
                <option value="">Seleccione...</option>
                {estados.map((estado, index) => (
                    <option key={index} value={estado}>{estado}</option>
                ))}
            </select>
        </div>
    );
};

export default InEstadoCivil;