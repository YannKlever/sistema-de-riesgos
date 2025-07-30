import React from 'react';
import styles from './styles.module.css';

const ProductoActions = ({ productId, onEdit, onDelete, isLoading }) => {
    return (
        <div className={styles.acciones}>
            <button
                onClick={() => onEdit(productId)}
                className={styles.botonEditar}
                disabled={isLoading}
            >
                Editar
            </button>
            <button
                onClick={() => onDelete(productId)}
                className={styles.botonEliminar}
                disabled={isLoading}
            >
                Eliminar
            </button>
        </div>
    );
};

export default ProductoActions;