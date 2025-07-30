import { useState } from 'react';
import styles from './styles.module.css';

// Mapeo de tipos de documento con su nivel de riesgo (1-5)
const riesgoPorTipoDocumento = {
    // Documentos Contractuales
    'poliza': 5,
    'anexo ampliacion vigencia': 4,
    'anexo ampliacion cobertura': 4,
    'anexo reduccion cobertura': 3, 
    'anexo modificacion condiciones': 4 
};

const InTipoDocumento = ({ 
    label, 
    name, 
    nameNumerico = `${name}_numerico`,
    required = false,
    defaultValue = '',
    defaultNumerico = null
}) => {
    const [tipoDocumento, setTipoDocumento] = useState(defaultValue || '');

    const handleChange = (e) => {
        setTipoDocumento(e.target.value);
    };

    const riesgoNumerico = tipoDocumento in riesgoPorTipoDocumento 
        ? riesgoPorTipoDocumento[tipoDocumento] 
        : null;

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
                </optgroup>
            </select>
            
            <input 
                type="hidden" 
                name={nameNumerico} 
                value={riesgoNumerico || ''} 
            />
        </div>
    );
};

export default InTipoDocumento;