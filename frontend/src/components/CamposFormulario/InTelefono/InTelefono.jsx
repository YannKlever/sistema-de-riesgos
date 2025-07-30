import styles from './styles.module.css';

const InTelefono = ({ label, name, required = false }) => {
    return (
        <div className={styles.telefonoContainer}>
            <label className={styles.telefonoLabel}>
                {label}
                {required && <span className={styles.requiredAsterisk}>*</span>}
            </label>
            <div className={styles.telefonoInputGroup}>
                <span className={styles.telefonoIcon}>📞</span>
                <input
                    type="tel"
                    name={name}
                    placeholder="Ej: 71234567"
                    pattern="[0-9]+"
                    required={required}
                    className={styles.telefonoInput}
                />
            </div>
            <small className={styles.telefonoHelpText}>
                Solo números, sin guiones ni espacios
            </small>
        </div>
    );
};

export default InTelefono;