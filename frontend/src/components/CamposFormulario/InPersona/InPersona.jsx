import { useState, useEffect, useMemo, useRef } from 'react';
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
    const initialPersonaState = useMemo(() => ({
        nombres: '',
        apellidos: '',
        tipo_documento: '',
        nro_documento: '',
        extension: '',
        otra_extension: ''
    }), []);

    const [personaData, setPersonaData] = useState(initialPersonaState);
    const containerRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const form = container.closest('form');
        if (!form) return;

        const handleReset = () => {
            setPersonaData(initialPersonaState);
        };

        form.addEventListener('reset', handleReset);
        return () => form.removeEventListener('reset', handleReset);
    }, [initialPersonaState]);

    useEffect(() => {
        if (defaultValue) {
            setPersonaData(prev => ({
                ...initialPersonaState,
                ...defaultValue
            }));
        }
    }, [defaultValue, initialPersonaState]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPersonaData(prev => ({
            ...prev,
            [name.replace(prefix, '')]: value
        }));
    };

    return (
        <div ref={containerRef} className={styles.personaContainer}>
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
                        value={personaData.nombres || ''}
                        onChange={handleChange}
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
                        value={personaData.apellidos || ''}
                        onChange={handleChange}
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
                        value={personaData.tipo_documento || ''}
                        onChange={handleChange}
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
                        value={personaData.nro_documento || ''}
                        onChange={handleChange}
                    />
                </div>
            </div>

            <div className={styles.personaRow}>
                <div className={styles.personaField}>
                    <label className={styles.personaLabel}>Extensión</label>
                    <select
                        name={`extension${prefix}`}
                        className={styles.personaSelect}
                        value={personaData.extension || ''}
                        onChange={handleChange}
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
                        disabled={!prefix}
                        className={styles.personaInput}
                        value={personaData.otra_extension || ''}
                        onChange={handleChange}
                    />
                </div>
            </div>
        </div>
    );
};

export default InPersona;