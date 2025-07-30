import styles from './styles.module.css';

const InFecha = ({ label, name, required = false }) => {
    return (
        <div className={styles.formGroup}>
            <label className={styles.formLabel}>
                {label}
                {required && <span className={styles.requiredAsterisk}>*</span>}
            </label>
            <input
                type="date"
                name={name}
                required={required}
                className={styles.formControl}
            />
        </div>
    );
};

export default InFecha;