import styles from './styles.module.css';

const InLabel = ({ label, value, name }) => {
    return (
        <div className={styles.labelContainer}>
            <span className={styles.label}>{label}</span>
            <span className={styles.value}>{value}</span>
            <input type="hidden" name={name} value={value} />
        </div>
    );
};

export default InLabel;