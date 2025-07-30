import styles from './styles.module.css';

const InNit = () => {
    return (
        <div className={styles.nitGroup}>
            <label className={styles.nitLabel}>
                Número de Identificación Tributaria (NIT) <span className={styles.requiredAsterisk}>*</span>
            </label>
            <input
                type="text"
                name="nit"
                placeholder="Ej: 123456789"
                pattern="[0-9]+"
                required
                className={styles.nitInput}
            />
            <small className={styles.nitHelpText}>
                Ingrese solo números, sin guiones ni otros caracteres
            </small>
        </div>
    );
};

export default InNit;