import styles from './styles.module.css';

const InFechaNacimiento = ({ label, name, required = false, defaultValue = null }) => {
    const safeDefault = defaultValue || {};
    
    return (
        <div className={styles.fechaNacimientoGroup}>
            <label className={styles.fechaNacimientoLabel}>
                {label} {required && <span className={styles.requiredAsterisk}>*</span>}
            </label>
            <div className={styles.rowFields}>
                <input
                    type="date"
                    name={`fecha${name}`}
                    required={required}
                    className={styles.fechaNacimientoControl}
                    defaultValue={safeDefault.fecha || ''}
                />
                <input
                    type="text"
                    name={`lugar${name}`}
                    placeholder="Lugar de nacimiento"
                    required={required}
                    maxLength={50}
                    className={styles.fechaNacimientoControl}
                    defaultValue={safeDefault.lugar || ''}
                />
            </div>
        </div>
    );
};

export default InFechaNacimiento;