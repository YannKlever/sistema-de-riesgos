import React from 'react';
import styles from './styles.module.css';

const SucursalActions = ({ id, onEdit, onDelete, isLoading }) => {
    return (
        <div className={styles.acciones}>
            <button
                onClick={onEdit}
                className={styles.botonEditar}
                disabled={isLoading}
            >
                Editar
            </button>
            <button
                onClick={() => onDelete(id)}
                className={styles.botonEliminar}
                disabled={isLoading}
            >
                Eliminar
            </button>
        </div>
    );
};

export default SucursalActions;