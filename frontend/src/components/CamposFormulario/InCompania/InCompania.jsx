import styles from './styles.module.css';

const InCompania = ({ label, name, required = false }) => {
    const companias = [
        "La Boliviana Ciacruz De Seguros Y Reaseguros S.A.",
        "La Boliviana Ciacruz Seguros Personales S.A.",
        "Fortaleza Seguros y Reaseguros S.A.",
        "Mercantil Santa Cruz Seguros y Reaseguros Generales S.A.",
        "Alianza Compañia de Seguros y Reaseguros S.A.",
        "Seguros y Reaseguros Personales Univida S.A.",
        "Bisa Seguros y Reaseguros S.A.",
        "Nacional Seguros Vida y Salud S.A.",
        "Alianza Vida de Seguros y Reaseguros S.A.",
        "Crediseguro S.A. Seguros Personales",
        "Credinform International S.A.",
        "La Vitalicia Seguros y Reaseguros de Vida S.A.",
        "Nacional Seguros Patrimoniales y Fianzas S.A.",
        "Unibienes Seguros y Reaseguros Patrimoniales S.A.",
        "Compañía de Seguros de Vida Fortaleza S.A"
    ];

    return (
        <div className={styles.companiaContainer}>
            <label className={styles.companiaLabel}>
                {label} {required && <span className={styles.requiredAsterisk}>*</span>}
            </label>
            <select
                name={name}
                required={required}
                className={styles.companiaSelect}
            >
                <option value="">Seleccione una compañía</option>
                {companias.map((compania, index) => (
                    <option key={index} value={compania}>{compania}</option>
                ))}
            </select>
        </div>
    );
};

export default InCompania;