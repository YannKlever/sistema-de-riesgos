import { useState } from 'react';
import styles from './styles.module.css';

const InOtraActividad = ({ 
    label = "Otra actividad", 
    textName = "otra_actividad", 
    selectName = "riesgo_otra_actividad",
    nameNumerico = "otra_actividad_numerico",
    required = false,
    defaultTextValue = '',
    defaultSelectValue = '',
    defaultNumerico = null
}) => {
    const [textoActividad, setTextoActividad] = useState(defaultTextValue || '');
    const [nivelRiesgo, setNivelRiesgo] = useState(defaultSelectValue || '');
    
    const opcionesRiesgo = [
        { value: 'bajo', label: 'Bajo', valorNumerico: 1 },
        { value: 'medio bajo', label: 'Medio Bajo', valorNumerico: 2 },
        { value: 'medio', label: 'Medio', valorNumerico: 3 },
        { value: 'medio alto', label: 'Medio Alto', valorNumerico: 4 },
        { value: 'alto', label: 'Alto', valorNumerico: 5 }
    ];

    const handleTextChange = (e) => {
        setTextoActividad(e.target.value);
    };

    const handleSelectChange = (e) => {
        setNivelRiesgo(e.target.value);
    };

    const valorNumerico = opcionesRiesgo.find(r => r.value === nivelRiesgo)?.valorNumerico || null;

    return (
        <div className={styles.riesgoContainer}>
            <label className={styles.riesgoLabel}>
                {label}
                {required && <span className={styles.requiredAsterisk}>*</span>}
            </label>
            
            <div className={styles.riesgoInputGroup}>
                {/* Campo de texto a la izquierda */}
                <input
                    type="text"
                    name={textName}
                    className={styles.riesgoTextInput}
                    placeholder="Descripción de la actividad"
                    value={textoActividad}
                    onChange={handleTextChange}
                />
                
                {/* Select a la derecha */}
                <select 
                    name={selectName}
                    required={required}
                    className={styles.riesgoSelect}
                    value={nivelRiesgo}
                    onChange={handleSelectChange}
                >
                    <option value="">Nivel de riesgo</option>
                    {opcionesRiesgo.map(opcion => (
                        <option key={opcion.value} value={opcion.value}>
                            {opcion.label}
                        </option>
                    ))}
                </select>
            </div>
            
            <input 
                type="hidden" 
                name={nameNumerico} 
                value={valorNumerico || ''} 
            />
        </div>
    );
};

export default InOtraActividad;