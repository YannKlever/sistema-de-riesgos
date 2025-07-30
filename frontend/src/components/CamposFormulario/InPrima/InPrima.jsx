import React, { useState, useEffect, useRef } from 'react';
import styles from './styles.module.css';

const calcularRiesgoPrima = (prima) => {
    if (!prima || isNaN(prima)) return null;

    const valor = parseFloat(prima);

    if (valor >= 100000) return 5;
    if (valor >= 50000) return 4;
    if (valor >= 20000) return 3;
    if (valor >= 5000) return 2;
    return 1;
};

const InPrima = ({
    label,
    name,
    nameNumerico = `${name}_numerico`,
    required = false,
    defaultValue = '',
    defaultNumerico = null
}) => {
    const [prima, setPrima] = useState(defaultValue || '');
    const containerRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const form = container.closest('form');
        if (!form) return;

        const handleReset = () => {
            setPrima(defaultValue || '');
        };

        form.addEventListener('reset', handleReset);
        return () => form.removeEventListener('reset', handleReset);
    }, [defaultValue]);

    useEffect(() => {
        if (defaultValue) {
            setPrima(defaultValue);
        }
    }, [defaultValue]);

    const handleChange = (e) => {
        const value = e.target.value;
        if (/^\d*\.?\d*$/.test(value) || value === '') {
            setPrima(value);
        }
    };

    const riesgoNumerico = calcularRiesgoPrima(prima);

    return (
        <div ref={containerRef} className={styles.primaContainer}>
            <label className={styles.primaLabel}>
                {label}
                {required && <span className={styles.requiredAsterisk}>*</span>}
            </label>
            <div className={styles.primaInputGroup}>
                <span className={styles.primaPrefix}>$</span>
                <input
                    type="text"
                    name={name}
                    value={prima}
                    onChange={handleChange}
                    required={required}
                    placeholder="Ej: 1250.50"
                    inputMode="decimal"
                    className={styles.primaInput}
                />
                <span className={styles.primaSuffix}>.00</span>
            </div>
            <small className={styles.primaHelpText}>
                Ingrese el valor numérico sin separadores de miles
            </small>

            <input
                type="hidden"
                name={nameNumerico}
                value={riesgoNumerico || ''}
            />
        </div>
    );
};

export default InPrima;