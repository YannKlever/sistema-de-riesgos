// components/AjustesSection/ThemeConfig/ColorPicker.jsx
import React from 'react';
import { useTheme } from '../../../context/ThemeContext';
import styles from './styles.module.css';

const ColorPicker = () => {
  const { theme, updateTheme, toggleThemeMode } = useTheme();

  const handleColorChange = (colorType, value) => {
    updateTheme({ [colorType]: value });
  };

  return (
    <div>
      {/* Selector de tema claro/oscuro */}
      <div className={styles.themeToggle}>
        <h3 className={styles.toggleTitle}>Modo de Tema</h3>
        <div className={styles.toggleContainer}>
          <div 
            className={`${styles.toggleOption} ${theme.mode === 'light' ? styles.active : ''}`}
            onClick={() => theme.mode !== 'light' && toggleThemeMode()}
          >
            Claro
          </div>
          <div 
            className={`${styles.toggleOption} ${theme.mode === 'dark' ? styles.active : ''}`}
            onClick={() => theme.mode !== 'dark' && toggleThemeMode()}
          >
            Oscuro
          </div>
        </div>
      </div>

      {/* Selector de colores personalizados */}
      <div>
        <h3 className={styles.toggleTitle}>Colores Personalizados</h3>
        <div className={styles.colorGrid}>
          <div className={styles.colorItem}>
            <label>Color Principal</label>
            <input
              type="color"
              value={theme.primary}
              onChange={(e) => handleColorChange('primary', e.target.value)}
            />
            <div className={styles.colorValue}>{theme.primary}</div>
          </div>
          
          <div className={styles.colorItem}>
            <label>Color Secundario</label>
            <input
              type="color"
              value={theme.secondary}
              onChange={(e) => handleColorChange('secondary', e.target.value)}
            />
            <div className={styles.colorValue}>{theme.secondary}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorPicker;