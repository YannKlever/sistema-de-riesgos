import React from 'react';
import styles from './styles.module.css';

const DeleteConfirmationModal = ({ isOpen, onCancel, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h3 className={styles.modalTitle}>Confirmar Eliminación</h3>
        <p className={styles.modalMessage}>
          ¿Estás seguro de que deseas eliminar este usuario? 
          Esta acción no se puede deshacer.
        </p>
        <div className={styles.modalActions}>
          <button 
            className={styles.modalCancelButton}
            onClick={onCancel}
          >
            Cancelar
          </button>
          <button 
            className={styles.modalConfirmButton}
            onClick={onConfirm}
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;