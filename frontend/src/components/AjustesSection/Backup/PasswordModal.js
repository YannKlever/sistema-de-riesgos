import React, { useState } from 'react';
import styles from './PasswordModal.module.css';

const PasswordModal = ({ isOpen, onConfirm, onCancel, title, message }) => {
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(password);
    setPassword('');
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h3 className={styles.modalTitle}>{title}</h3>
        <p className={styles.modalMessage}>{message}</p>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingrese la contraseña"
              required
              autoFocus
              className={styles.passwordInput}
            />
          </div>
          
          <div className={styles.modalActions}>
            <button 
              type="button" 
              className={styles.modalCancelButton}
              onClick={onCancel}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className={styles.modalConfirmButton}
            >
              Confirmar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordModal;