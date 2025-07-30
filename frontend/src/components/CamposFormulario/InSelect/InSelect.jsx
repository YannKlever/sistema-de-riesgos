import styles from './styles.module.css';

const InSelect = ({ label, name, options, value, onChange, required }) => {
    const handleChange = (e) => {
        if (onChange) {
            onChange(e.target.value, e);
        }
    };

    return (
        <div className={styles.selectContainer}>
            {label && (
                <label className={styles.selectLabel}>
                    {label}
                    {required && <span className={styles.required}> *</span>}
                </label>
            )}
            <select
                className={styles.select}
                name={name}
                value={value || ''}
                onChange={handleChange}
                required={required}
            >
                <option value="">Seleccione una opción</option>
                {options.map((option, index) => (
                    <option 
                        key={`${name}-opt-${index}`} 
                        value={option.value}
                        data-valor-numerico={option.valor}
                    >
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default InSelect;