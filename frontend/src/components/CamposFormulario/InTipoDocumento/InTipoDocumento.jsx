import { useState } from 'react';
import styles from './styles.module.css';

const InTipoDocumento = ({ 
    label, 
    name, 
    required = false,
    defaultValue = ''
}) => {
    const [tipoDocumento, setTipoDocumento] = useState(defaultValue || '');

    const handleChange = (e) => {
        setTipoDocumento(e.target.value);
    };

    return (
        <div className={styles.tipoDocumentoContainer}>
            <label className={styles.tipoDocumentoLabel}>
                {label}
                {required && <span className={styles.requiredAsterisk}>*</span>}
            </label>
            <select 
                name={name} 
                required={required}
                className={styles.tipoDocumentoSelect}
                value={tipoDocumento}
                onChange={handleChange}
            >
                <option value="">Seleccione un tipo de documento</option>
                
                <optgroup label="Documentos Contractuales">
                    <option value="poliza">Póliza</option>
                    <option value="anexo ampliacion vigencia">Anexo - Ampliación de Vigencia</option>
                    <option value="anexo ampliacion cobertura">Anexo - Ampliación de Cobertura</option>
                    <option value="anexo reduccion cobertura">Anexo - Reducción de Cobertura</option>
                    <option value="anexo modificacion condiciones">Anexo - Modificación de Condiciones</option>
                    <option value="rescision de cobertura">Rescision de Póliza</option>
                    <option value="documento de beneficiario">Anexo - Beneficiario</option>
                </optgroup>
            </select>
        </div>
    );
};

export default InTipoDocumento;