import React from 'react';
import styles from './listaClientesExternos.module.css';

const ClientActions = ({ 
    clientId, 
    clientData, 
    onDelete, 
    onEdit, 
    onSave, 
    onCancel, 
    isEditing 
}) => (
    <div className={styles.accionesContainer}>
        {isEditing ? (
            <>
                <button
                    onClick={onSave}
                    className={styles.botonGuardar}
                    title="Guardar cambios"
                >
                    ✓
                </button>
                <button
                    onClick={onCancel}
                    className={styles.botonCancelar}
                    title="Cancelar edición"
                >
                    ✗
                </button>
            </>
        ) : (
            <>
                <button
                    onClick={() => onEdit(clientId, clientData)}
                    className={styles.botonEditar}
                    title="Editar cliente completo"
                >
                    Editar
                </button>
                <button
                    onClick={() => onDelete(clientId)}
                    className={styles.botonEliminar}
                    title="Eliminar cliente"
                >
                    Eliminar
                </button>
            </>
        )}
    </div>
);

export default ClientActions;