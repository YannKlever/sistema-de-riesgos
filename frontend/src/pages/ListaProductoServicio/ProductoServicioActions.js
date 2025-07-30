import React from 'react';
import styles from './styles.module.css';

const ProductoServicioActions = ({ id, onEdit, onDelete, isLoading }) => {
  return (
    <div className={styles.acciones}>
      <button
        onClick={() => onEdit(id)}
        className={styles.editButton}
        disabled={isLoading}
        title="Editar producto/servicio"
      >
        Editar
      </button>
      <button
        onClick={() => onDelete(id)}
        className={styles.deleteButton}
        disabled={isLoading}
        title="Eliminar producto/servicio"
      >
        Eliminar
      </button>
    </div>
  );
};

export default ProductoServicioActions;