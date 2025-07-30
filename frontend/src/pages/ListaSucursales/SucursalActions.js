import React from 'react';
import styles from './styles.module.css';

const SucursalActions = ({ id, onEdit, onDelete, isLoading }) => {
  return (
    <div className={styles.acciones}>
      <button
        onClick={() => onEdit(id)}
        className={styles.editButton}
        disabled={isLoading}
        title="Editar sucursal"
      >
        Editar
      </button>
      <button
        onClick={() => onDelete(id)}
        className={styles.deleteButton}
        disabled={isLoading}
        title="Eliminar sucursal"
      >
        Eliminar
      </button>
    </div>
  );
};

export default SucursalActions;