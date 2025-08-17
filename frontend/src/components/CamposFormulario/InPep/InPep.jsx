import { useState, useEffect } from 'react';
import styles from './styles.module.css';

const categoriasPep = {
    'no pep': { texto: 'No es PEP', valor: 1 },
    'asociado pep': { texto: 'Asociado cercano de PEP', valor: 2 },
    'familia pep': { texto: 'Familiar de PEP', valor: 3 },
    'pep extranjero': { texto: 'PEP Extranjero', valor: 4 },
    'pep nacional': { texto: 'PEP Nacional', valor: 5 }
};

const InPep = ({ 
    label, 
    name, 
    nameNumerico = `${name}_numerico`,
    required = false, 
    defaultValue = '',
    defaultNumerico = null
}) => {
    const [pepValue, setPepValue] = useState('');

    useEffect(() => {
        if (defaultValue) {
            setPepValue(defaultValue);
        }
    }, [defaultValue]);

    const handleChange = (e) => {
        setPepValue(e.target.value);
    };

    // Obtener el valor numérico correspondiente
    const valorNumerico = pepValue in categoriasPep 
        ? categoriasPep[pepValue].valor 
        : null;

    return (
        <div className={styles.pepContainer}>
            <label className={styles.pepLabel}>
                {label}
                {required && <span className={styles.requiredAsterisk}>*</span>}
            </label>
            <select
                name={name}
                required={required}
                className={styles.pepSelect}
                value={pepValue}
                onChange={handleChange}
            >
                <option value="">Seleccione un nivel</option>
                {Object.entries(categoriasPep).map(([key, { texto }]) => (
                    <option key={key} value={key}>
                        {texto}
                    </option>
                ))}
            </select>
            
            {/* Campo oculto para el valor numérico */}
            <input 
                type="hidden" 
                name={nameNumerico} 
                value={valorNumerico || ''} 
            />
        </div>
    );
};

export default InPep;