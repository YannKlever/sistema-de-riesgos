import React, { useState } from 'react';
import styles from './inAutorizacion.module.css';

const InAutorizacion = ({ onAutorizacionChange, name }) => {
    const [autorizado, setAutorizado] = useState(null);

    const handleCheckboxChange = (e) => {
        const isChecked = e.target.checked;
        const value = isChecked ? "Autorizado por alta gerencia" : null;
        setAutorizado(value);

        if (onAutorizacionChange) {
            onAutorizacionChange(value);
        }
    };

    return (
        <div className={styles.autorizacionContainer}>
            <div className={styles.checkboxGroup}>
                <label className={styles.checkboxLabel}>
                    <input
                        type="checkbox"
                        name={name}
                        checked={autorizado !== null}
                        onChange={handleCheckboxChange}
                        className={styles.checkboxInput}
                        // Valor que se enviará cuando esté marcado
                        value={autorizado || ""}
                    />
                    <span className={styles.checkboxCustom}></span>
                    Autorizado por alta gerencia
                </label>
            </div>

            {autorizado && (
                <p className={styles.mensajeAutorizado}>✓ {autorizado}</p>
            )}
        </div>
    );
};

export default InAutorizacion;