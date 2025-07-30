import styles from './styles.module.css';

const InDomicilioSucursales = ({
    labelPrincipal,
    labelSucursales,
    namePrincipal,
    nameSucursales,
    requiredPrincipal = false
}) => {
    return (
        <div className={styles.container}>
            <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                    {labelPrincipal} 
                    {requiredPrincipal && <span className={styles.requiredAsterisk}>*</span>}
                </label>
                <textarea
                    rows={2}
                    name={namePrincipal}
                    required={requiredPrincipal}
                    maxLength={200}
                    className={`${styles.formTextarea} ${styles.principalTextarea}`}
                />
            </div>

            <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                    {labelSucursales}
                </label>
                <textarea
                    rows={3}
                    name={nameSucursales}
                    maxLength={300}
                    placeholder="Si tiene sucursales, indique sus domicilios"
                    className={`${styles.formTextarea} ${styles.sucursalesTextarea}`}
                />
            </div>
        </div>
    );
};

export default InDomicilioSucursales;