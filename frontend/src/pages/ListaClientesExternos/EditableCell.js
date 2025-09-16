import React from 'react';
import styles from './listaClientesExternos.module.css';

const EditableCell = ({
    value,
    field,
    isEditing,
    tempValue,
    onUpdateTempField,
    isEditable = true
}) => {
    const handleChange = (e) => {
        if (isEditable && isEditing) {
            onUpdateTempField(field, e.target.value);
        }
    };

    if (isEditing && isEditable) {
        return (
            <input
                type="text"
                value={tempValue !== undefined ? tempValue : value || ''}
                onChange={handleChange}
                className={styles.inputEdicion}
                onBlur={(e) => e.preventDefault()} // Prevenir blur
                onFocus={(e) => e.target.select()} // Seleccionar texto al enfocar
            />
        );
    }

    return (
        <div
            className={isEditable ? styles.celdaEditable : ''}
            title={isEditable ? "Haga clic en Editar para modificar" : ""}
        >
            {value == null ? '-' :
                typeof value === 'string' && value.length > 20
                    ? `${value.substring(0, 17)}...`
                    : value
            }
        </div>
    );
};

export default EditableCell;