import styles from './styles.module.css';

const InTipoSociedad = ({ label, name, required = false }) => {
    const tiposSociedad = [
        "Sociedad Anónima",
        "Sociedad de Responsabilidad Limitada",
        "Sociedad Colectiva",
        "Sociedad en Comandita Simple",
        "Sociedad en Comandita por Acciones",
        "Sociedad Accidental"
    ];

    return (
        <div className={styles.tipoSociedadContainer}>
            <label className={styles.tipoSociedadLabel}>
                {label} {required && <span className={styles.requiredAsterisk}>*</span>}
            </label>
            <select 
                name={name} 
                required={required}
                className={styles.tipoSociedadSelect}
            >
                <option value="">Seleccione un tipo</option>
                {tiposSociedad.map((tipo, index) => (
                    <option key={index} value={tipo}>{tipo}</option>
                ))}
            </select>
        </div>
    );
};

export default InTipoSociedad;