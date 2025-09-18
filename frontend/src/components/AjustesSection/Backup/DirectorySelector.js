import React, { useState, useEffect } from 'react';
import styles from './DirectorySelector.module.css';

const DirectorySelector = ({ isOpen, onSelect, onCancel, mode }) => {
  const [selectedPath, setSelectedPath] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setSelectedPath('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelect = async () => {
    setIsLoading(true);
    try {
      const result = await window.electronAPI.openDialog({
        properties: [mode === 'backup' ? 'openDirectory' : 'openFile'],
        filters: mode === 'restore' ? [
          { name: 'Backup Files', extensions: ['db', 'sqlite'] }
        ] : [],
        title: mode === 'backup' 
          ? 'Seleccionar carpeta para guardar el backup' 
          : 'Seleccionar archivo de backup para restaurar'
      });
      
      if (!result.canceled && result.filePaths.length > 0) {
        const path = result.filePaths[0];
        setSelectedPath(path);
        
        // Verificación básica para restore
        if (mode === 'restore') {
          try {
            // Verificar que el archivo existe y tiene un tamaño razonable
            const stats = await window.electronAPI.invoke('get-file-stats', path);
            if (stats.size < 1000) { // Menos de 1KB probablemente no es válido
              alert('El archivo seleccionado parece no ser un backup válido');
              setSelectedPath('');
            }
          } catch (error) {
            console.warn('No se pudo verificar el archivo de backup:', error);
          }
        }
      }
    } catch (error) {
      console.error('Error selecting directory:', error);
      alert('Error al seleccionar la ubicación: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = () => {
    if (selectedPath) {
      onSelect(selectedPath);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h3 className={styles.modalTitle}>
          {mode === 'backup' 
            ? 'Seleccionar carpeta para backup' 
            : 'Seleccionar archivo de backup'}
        </h3>
        
        <div className={styles.pathSection}>
          <div className={styles.pathDisplay}>
            <label>Ruta seleccionada:</label>
            <div className={styles.pathText}>
              {selectedPath || 'Ninguna ubicación seleccionada'}
            </div>
          </div>
          
          <button 
            className={styles.selectButton}
            onClick={handleSelect}
            disabled={isLoading}
          >
            {isLoading ? 'Buscando...' : 
              (mode === 'backup' ? 'Seleccionar Carpeta' : 'Seleccionar Archivo')}
          </button>
        </div>
        
        <div className={styles.modalActions}>
          <button 
            className={styles.modalCancelButton}
            onClick={onCancel}
          >
            Cancelar
          </button>
          <button 
            className={styles.modalConfirmButton}
            onClick={handleConfirm}
            disabled={!selectedPath}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DirectorySelector;