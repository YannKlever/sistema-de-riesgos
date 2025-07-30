import styles from './styles.module.css';


const InRadio = ({ label, name, options, required }) => {
  return (
    <div className={styles.radioContainer}>
      <label className={styles.radioLabel}>
        {label}
        {required && <span className={styles.requiredAsterisk}>*</span>}
      </label>
      <div className={styles.radioOptions}>
        {options.map((option) => (
          <div key={option.value} className={styles.radioOption}>
            <input
              type="radio"
              id={`${name}-${option.value}`}
              name={name}
              value={option.value}
              className={styles.radioInput}
            />
            <label htmlFor={`${name}-${option.value}`} className={styles.radioText}>
              {option.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InRadio;