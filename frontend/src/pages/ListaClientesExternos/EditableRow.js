import React, { useRef, useEffect } from 'react';
import EditableCell from './EditableCell';
import styles from './listaClientesExternos.module.css';

const EditableRow = ({
    row,
    columns,
    isEditing,
    tempData,
    onUpdateTempField,
    onStartEditing,
    onSaveEditing,
    onCancelEditing,
    onDelete,
    EDITABLE_COLUMNS
}) => {
    const rowRef = useRef(null);

    useEffect(() => {
        if (isEditing && rowRef.current) {
            // Enfocar el primer campo editable al iniciar edición
            const firstInput = rowRef.current.querySelector('input');
            if (firstInput) {
                setTimeout(() => {
                    firstInput.focus();
                    firstInput.select();
                }, 100);
            }
        }
    }, [isEditing]);

    const handleFieldChange = (field, value) => {
        onUpdateTempField(field, value);
    };

    return (
        <tr
            ref={rowRef}
            className={isEditing ? styles.editingRow : ''}
        >
            {columns.map(column => {
                if (column.id === 'acciones') {
                    return (
                        <td key={column.id}>
                            <div className={styles.accionesContainer}>
                                {isEditing ? (
                                    <>
                                        <button
                                            onClick={onSaveEditing}
                                            className={styles.botonGuardar}
                                            title="Guardar cambios"
                                        >
                                            ✓
                                        </button>
                                        <button
                                            onClick={onCancelEditing}
                                            className={styles.botonCancelar}
                                            title="Cancelar edición"
                                        >
                                            ✗
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => onStartEditing(row.id, row)}
                                            className={styles.botonEditar}
                                            title="Editar cliente completo"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => onDelete(row.id)}
                                            className={styles.botonEliminar}
                                            title="Eliminar cliente"
                                        >
                                            Eliminar
                                        </button>
                                    </>
                                )}
                            </div>
                        </td>
                    );
                }

                const isEditable = EDITABLE_COLUMNS.includes(column.id);
                const value = isEditing && tempData[column.id] !== undefined
                    ? tempData[column.id]
                    : row[column.id];

                return (
                    <td key={column.id}>
                        <EditableCell
                            value={value}
                            rowId={row.id}
                            field={column.id}
                            isEditing={isEditing}
                            tempValue={tempData[column.id]}
                            onUpdateTempField={handleFieldChange}
                            isEditable={isEditable && isEditing}
                        />
                    </td>
                );
            })}
        </tr>
    );
};

export default EditableRow;