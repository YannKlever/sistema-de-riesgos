import { useState, useEffect } from 'react';
import styles from './styles.module.css';

const extensiones = [
    { value: 'lp', label: 'LP' },
    { value: 'or', label: 'OR' },
    { value: 'po', label: 'PO' },
    { value: 'co', label: 'CO' },
    { value: 'ch', label: 'CH' },
    { value: 'ta', label: 'TA' },
    { value: 'sc', label: 'SC' },
    { value: 'be', label: 'BE' },
    { value: 'pa', label: 'PA' },
    { value: 'otra', label: 'OTRA' }
];

const tiposDocumento = [
    { value: 'cédula de identidad', label: 'Cédula de Identidad' },
    { value: 'pasaporte', label: 'Pasaporte' },
    { value: 'cédula de identidad del extranjero', label: 'Cédula de Extranjero' },
    { value: 'documento especial de identificación', label: 'Documento Especial de Identificación' }
];

const InPersona = ({ title, prefix = '', defaultValue = null }) => {
    const [selectedTipoDocumento, setSelectedTipoDocumento] = useState('');
    const [selectedExtension, setSelectedExtension] = useState('');

    useEffect(() => {
        if (defaultValue) {
            setSelectedTipoDocumento(defaultValue.tipo_documento || '');
            setSelectedExtension(defaultValue.extension || '');
        }
    }, [defaultValue]);

    const handleTipoDocumentoChange = (e) => {
        setSelectedTipoDocumento(e.target.value);
    };

    const handleExtensionChange = (e) => {
        setSelectedExtension(e.target.value);
    };

    return (
        <div className={styles.personaContainer}>
            {title && <h5 className={styles.personaTitle}>{title}</h5>}

            <div className={styles.personaRow}>
                <div className={styles.personaField}>
                    <label className={styles.personaLabel}>
                        Nombres <span className={styles.requiredAsterisk}>*</span>
                    </label>
                    <input
                        type="text"
                        name={`nombres${prefix}`}
                        maxLength={50}
                        required
                        className={styles.personaInput}
                        defaultValue={defaultValue?.nombres || ''}
                    />
                </div>

                <div className={styles.personaField}>
                    <label className={styles.personaLabel}>
                        Apellidos <span className={styles.requiredAsterisk}>*</span>
                    </label>
                    <input
                        type="text"
                        name={`apellidos${prefix}`}
                        maxLength={50}
                        required
                        className={styles.personaInput}
                        defaultValue={defaultValue?.apellidos || ''}
                    />
                </div>
            </div>

            <div className={styles.personaRow}>
                <div className={styles.personaField}>
                    <label className={styles.personaLabel}>
                        Tipo de Documento <span className={styles.requiredAsterisk}>*</span>
                    </label>
                    <select
                        name={`tipo_documento${prefix}`}
                        required
                        className={styles.personaSelect}
                        value={selectedTipoDocumento}
                        onChange={handleTipoDocumentoChange}
                    >
                        <option value="">Seleccione...</option>
                        {tiposDocumento.map(opcion => (
                            <option key={opcion.value} value={opcion.value}>
                                {opcion.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className={styles.personaField}>
                    <label className={styles.personaLabel}>
                        Número de Documento <span className={styles.requiredAsterisk}>*</span>
                    </label>
                    <input
                        type="text"
                        name={`nro_documento${prefix}`}
                        maxLength={20}
                        required
                        className={styles.personaInput}
                        defaultValue={defaultValue?.nro_documento || ''}
                    />
                </div>
            </div>

            <div className={styles.personaRow}>
                <div className={styles.personaField}>
                    <label className={styles.personaLabel}>Extensión</label>
                    <select
                        name={`extension${prefix}`}
                        className={styles.personaSelect}
                        value={selectedExtension}
                        onChange={handleExtensionChange}
                    >
                        <option value="">Seleccione...</option>
                        {extensiones.map(opcion => (
                            <option key={opcion.value} value={opcion.value}>
                                {opcion.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className={styles.personaField}>
                    <label className={styles.personaLabel}>Otra Extensión (si aplica)</label>
                    <input
                        type="text"
                        name={`otra_extension${prefix}`}
                        maxLength={10}
                        className={styles.personaInput}
                        defaultValue={defaultValue?.otra_extension || ''}
                    />
                </div>
            </div>
        </div>
    );
};

export default InPersona;