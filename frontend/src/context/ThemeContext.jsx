// context/ThemeContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { lightenColor, darkenColor } from '../context/utils/colorUtils';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState({
    mode: 'light',
    primary: '#3498db',
    secondary: '#f1c40f',
    custom: false
  });

  // Aplicar el tema al cargar y cuando cambia
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const applyTheme = (currentTheme) => {
    const root = document.documentElement;
    
    // Establecer el atributo data-theme para CSS
    root.setAttribute('data-theme', currentTheme.mode);
    
    // Aplicar colores personalizados si están activos
    if (currentTheme.custom) {
      root.style.setProperty('--clr-prim', currentTheme.primary);
      root.style.setProperty('--clr-sec', currentTheme.secondary);
      
      // Generar variantes de colores
      root.style.setProperty('--clr-prim-claro', lightenColor(currentTheme.primary, 20));
      root.style.setProperty('--clr-prim-osc', darkenColor(currentTheme.primary, 15));
      root.style.setProperty('--clr-sec-claro', lightenColor(currentTheme.secondary, 20));
      root.style.setProperty('--clr-sec-osc', darkenColor(currentTheme.secondary, 15));
    }
  };

  const updateTheme = (updates) => {
    setTheme(prev => ({
      ...prev,
      ...updates,
      custom: true // Se activa el modo personalizado al cambiar colores
    }));
  };

  const toggleThemeMode = () => {
    setTheme(prev => ({
      ...prev,
      mode: prev.mode === 'light' ? 'dark' : 'light',
      custom: false // Al cambiar el modo, se desactiva el personalizado
    }));
  };

  return (
    <ThemeContext.Provider value={{ theme, updateTheme, toggleThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);