import React from 'react';
import styles from './BackupProgress.module.css';

const BackupProgress = ({ isOpen, status, filePath, mode = 'backup' }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h3 className={styles.modalTitle}>
          {mode === 'backup' ? 'Realizando Backup' : 'Restaurando Sistema'}
        </h3>
        
        <div className={styles.progressContainer}>
          <div className={styles.spinner}></div>
          <p className={styles.statusText}>{status}</p>
          
          {filePath && (
            <div className={styles.fileInfo}>
              <label>
                {mode === 'backup' ? 'Guardando en:' : 'Restaurando desde:'}
              </label>
              <div className={styles.filePath}>{filePath}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BackupProgress;