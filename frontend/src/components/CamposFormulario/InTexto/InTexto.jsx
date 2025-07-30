import styles from './styles.module.css';

const InTexto = ({
    label,
    name,
    placeholder = "",
    required = false,
    maxLength = 50,
    type = "text",
    defaultValue = ''
}) => {
    return (
        <div className={styles.textoContainer}>
            <label className={styles.textoLabel}>
                {label}
                {required && <span className={styles.requiredAsterisk}>*</span>}
            </label>
            <input
                type={type}
                name={name}
                placeholder={placeholder}
                required={required}
                maxLength={maxLength}
                className={styles.textoInput}
                defaultValue={defaultValue}
            />
            {maxLength && (
                <small className={styles.textoHelpText}>
                    Máximo {maxLength} caracteres
                </small>
            )}
        </div>
    );
};

export default InTexto;