// utils/colorUtils.js
/**
 * Aclara un color hexadecimal
 * @param {string} color - Color hexadecimal (#RRGGBB o #RGB)
 * @param {number} percent - Porcentaje de aclarado (0-100)
 * @returns {string} Color hexadecimal aclarado
 */
export const lightenColor = (color, percent) => {
  // Validar el formato del color
  if (!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color)) {
    console.error('Formato de color inválido:', color);
    return color;
  }

  // Convertir color 3-digit a 6-digit
  if (color.length === 4) {
    color = `#${color[1]}${color[1]}${color[2]}${color[2]}${color[3]}${color[3]}`;
  }

  // Convertir a valores R, G, B
  const num = parseInt(color.slice(1), 16);
  const r = (num >> 16) + Math.round((255 - (num >> 16)) * (percent / 100));
  const g = ((num >> 8) & 0x00FF) + Math.round((255 - ((num >> 8) & 0x00FF)) * (percent / 100));
  const b = (num & 0x0000FF) + Math.round((255 - (num & 0x0000FF)) * (percent / 100));

  // Asegurar que los valores estén en el rango correcto
  const clamp = (value) => Math.min(255, Math.max(0, value));
  
  // Convertir de vuelta a hexadecimal
  return `#${(
    (1 << 24) + 
    (clamp(r) << 16) + 
    (clamp(g) << 8) + 
    clamp(b)
  ).toString(16).slice(1).toUpperCase()}`;
};

/**
 * Oscurece un color hexadecimal
 * @param {string} color - Color hexadecimal (#RRGGBB o #RGB)
 * @param {number} percent - Porcentaje de oscurecimiento (0-100)
 * @returns {string} Color hexadecimal oscurecido
 */
export const darkenColor = (color, percent) => {
  // Validar el formato del color
  if (!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color)) {
    console.error('Formato de color inválido:', color);
    return color;
  }

  // Convertir color 3-digit a 6-digit
  if (color.length === 4) {
    color = `#${color[1]}${color[1]}${color[2]}${color[2]}${color[3]}${color[3]}`;
  }

  // Convertir a valores R, G, B
  const num = parseInt(color.slice(1), 16);
  const r = Math.round((num >> 16) * (1 - percent / 100));
  const g = Math.round(((num >> 8) & 0x00FF) * (1 - percent / 100));
  const b = Math.round((num & 0x0000FF) * (1 - percent / 100));

  // Asegurar que los valores estén en el rango correcto
  const clamp = (value) => Math.min(255, Math.max(0, value));
  
  // Convertir de vuelta a hexadecimal
  return `#${(
    (1 << 24) + 
    (clamp(r) << 16) + 
    (clamp(g) << 8) + 
    clamp(b)
  ).toString(16).slice(1).toUpperCase()}`;
};

/**
 * Convierte un color hexadecimal a RGB
 * @param {string} hex - Color hexadecimal
 * @returns {object} Objeto con propiedades r, g, b
 */
export const hexToRgb = (hex) => {
  // Eliminar el # si está presente
  hex = hex.replace('#', '');

  // Convertir 3-digit a 6-digit
  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('');
  }

  // Obtener componentes
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return { r, g, b };
};

/**
 * Convierte RGB a hexadecimal
 * @param {number} r - Componente rojo (0-255)
 * @param {number} g - Componente verde (0-255)
 * @param {number} b - Componente azul (0-255)
 * @returns {string} Color hexadecimal
 */
export const rgbToHex = (r, g, b) => {
  const toHex = (c) => {
    const hex = c.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
};