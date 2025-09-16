// components/AjustesSection/Backup/index.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PasswordModal from './PasswordModal';
import DirectorySelector from './DirectorySelector';
import BackupProgress from './BackupProgress';
import { databaseService } from '../../../services/database';
import styles from './styles.module.css';

const Backup = () => {
  const navigate = useNavigate();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDirectorySelector, setShowDirectorySelector] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [backupPath, setBackupPath] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [backupInfo, setBackupInfo] = useState(null);

  // Contraseña hardcodeada 
  const BACKUP_PASSWORD = 'admin_backup_2023';

  const handlePasswordSubmit = (password) => {
    if (password === BACKUP_PASSWORD) {
      setShowPasswordModal(false);
      setShowDirectorySelector(true);
    } else {
      setError('Contraseña incorrecta');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleDirectorySelected = async (path) => {
    setBackupPath(path);
    setShowDirectorySelector(false);
    await startBackup(path);
  };

  const startBackup = async (path) => {
    setShowProgress(true);
    setStatus('Iniciando backup de la base de datos...');
    
    try {
      setStatus('Exportando datos de usuarios...');
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setStatus('Exportando configuraciones del sistema...');
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setStatus('Exportando historial de riesgos...');
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setStatus('Exportando programaciones...');
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setStatus('Creando archivo de backup...');
      
      // Llamar al servicio de base de datos para hacer backup
      const result = await databaseService.backupDatabase(path);
      
      if (result.success) {
        setBackupInfo({
          fileName: result.fileName,
          filePath: result.filePath,
          fileSize: result.fileSize,
          timestamp: new Date().toLocaleString()
        });
        
        setStatus('Backup completado exitosamente');
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Navegar de regreso después de mostrar el éxito
        setTimeout(() => {
          navigate('/ajustes');
        }, 1000);
      } else {
        setError(result.error || 'Error al realizar el backup');
        setShowProgress(false);
      }
    } catch (err) {
      console.error('Error en backup:', err);
      setError('Error inesperado: ' + (err.message || 'Error desconocido'));
      setShowProgress(false);
    }
  };

  const handleCancel = () => {
    navigate('/ajustes');
  };

  const handleSelectDirectory = async () => {
    try {
      const result = await databaseService.selectDirectory();
      if (result.success) {
        handleDirectorySelected(result.directoryPath);
      } else {
        setError(result.error || 'Error al seleccionar directorio');
      }
    } catch (err) {
      setError('Error al abrir el selector de directorios: ' + err.message);
    }
  };

  return (
    <div className={styles.container}>
      <button 
        className={styles.backButton}
        onClick={handleCancel}
      >
        ← Volver a Ajustes
      </button>

      <div className={styles.header}>
        <h2>Backup de Base de Datos</h2>
        <p className={styles.description}>
          Crea una copia de seguridad de todos los datos del sistema. 
          Esta operación requiere permisos de administrador.
        </p>
      </div>

      {error && (
        <div className={styles.error}>
          {error}
        </div>
      )}

      {backupInfo && (
        <div className={styles.success}>
          <h3>✓ Backup Completado Exitosamente</h3>
          <p><strong>Archivo:</strong> {backupInfo.fileName}</p>
          <p><strong>Ubicación:</strong> {backupInfo.filePath}</p>
          <p><strong>Tamaño:</strong> {(backupInfo.fileSize / 1024 / 1024).toFixed(2)} MB</p>
          <p><strong>Fecha:</strong> {backupInfo.timestamp}</p>
        </div>
      )}

      {!showPasswordModal && !showDirectorySelector && !showProgress && !backupInfo && (
        <div className={styles.actionContainer}>
          <div className={styles.infoBox}>
            <h3>¿Qué se incluye en el backup?</h3>
            <ul>
              <li>Datos de usuarios y permisos</li>
              <li>Configuraciones del sistema</li>
              <li>Historial de riesgos y evaluaciones</li>
              <li>Datos de clientes internos y externos</li>
              <li>Información de accionistas y socios</li>
              <li>Configuraciones de productos y servicios</li>
              <li>Datos de sucursales y oficinas</li>
            </ul>
            
            <div className={styles.warning}>
              <strong>⚠️ Importante:</strong> El backup crea una copia completa de la base de datos. 
              Asegúrese de guardar el archivo en una ubicación segura.
            </div>
          </div>

          <div className={styles.buttonGroup}>
            <button 
              className={styles.primaryButton}
              onClick={() => setShowPasswordModal(true)}
            >
              Iniciar Backup
            </button>
            
           
          </div>
        </div>
      )}

      <PasswordModal
        isOpen={showPasswordModal}
        onConfirm={handlePasswordSubmit}
        onCancel={() => setShowPasswordModal(false)}
        title="Autenticación requerida"
        message="Ingrese la contraseña de administrador para realizar el backup:"
      />

      <DirectorySelector
        isOpen={showDirectorySelector}
        onSelect={handleDirectorySelected}
        onCancel={() => setShowDirectorySelector(false)}
        mode="backup"
      />

      <BackupProgress
        isOpen={showProgress}
        status={status}
        filePath={backupPath}
        backupInfo={backupInfo}
      />
    </div>
  );
};

export default Backup;