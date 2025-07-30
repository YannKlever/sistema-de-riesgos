// components/AjustesSection/ThemeConfig/ThemeConfig.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import ColorPicker from './ColorPicker';
import styles from './styles.module.css';

const ThemeConfig = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.themeConfigContainer}>
      <button 
        className={styles.backButton}
        onClick={() => navigate('/ajustes')}
      >
        ← Volver a Ajustes
      </button>
      
      <div className={styles.header}>
        <h2>Personalización de Apariencia</h2>
        <p className={styles.subtitle}>Cambia el tema y colores de la aplicación</p>
      </div>
      
      <div className={styles.configSection}>
        <ColorPicker />
      </div>
    </div>
  );
};

export default ThemeConfig;