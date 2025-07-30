import { useState, useEffect } from 'react';
import styles from './styles.module.css';

const nivelesRiesgo = {
    'bajo': { texto: 'Bajo', valor: 1 },
    'medio bajo': { texto: 'Medio Bajo', valor: 2 },
    'medio': { texto: 'Medio', valor: 3 },
    'medio alto': { texto: 'Medio Alto', valor: 4 },
    'alto': { texto: 'Alto', valor: 5 }
};

const InRiesgo = ({
    label,
    name,
    nameNumerico = `${name}_numerico`, // Nombre del campo numérico
    required = false,
    defaultValue = '',
    defaultNumerico = null
}) => {
    const [nivelRiesgo, setNivelRiesgo] = useState('');

    useEffect(() => {
        if (defaultValue) {
            setNivelRiesgo(defaultValue);
        }
    }, [defaultValue]);

    const handleChange = (e) => {
        setNivelRiesgo(e.target.value);
    };

    // Obtener el valor numérico correspondiente
    const valorNumerico = nivelRiesgo in nivelesRiesgo
        ? nivelesRiesgo[nivelRiesgo].valor
        : null;

    return (
        <div className={styles.riesgoContainer}>
            <label className={styles.riesgoLabel}>
                {label}
                {required && <span className={styles.requiredAsterisk}>*</span>}
            </label>
            <select
                name={name}
                required={required}
                className={styles.riesgoSelect}
                value={nivelRiesgo}
                onChange={handleChange}
            >
                <option value="">Seleccione un nivel</option>
                {Object.entries(nivelesRiesgo).map(([key, { texto }]) => (
                    <option key={key} value={key}>
                        {texto}
                    </option>
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

export default InRiesgo;