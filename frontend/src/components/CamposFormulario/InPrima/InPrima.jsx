import React, { useState, useEffect, useRef } from 'react';
import styles from './styles.module.css';

const InPrima = ({
    label,
    name,
    required = false,
    defaultValue = ''
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
        </div>
    );
};

export default InPrima;