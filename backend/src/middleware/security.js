// middleware/security.js
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const bcrypt = require('bcrypt');

// Configuración de límite de intentos de login
const loginLimiter = rateLimit({
  windowMs: 1, // 15 minutos
  max: 5, // máximo 5 intentos por ventana de tiempo
  message: {
    success: false,
    error: 'Demasiados intentos de login, intente nuevamente en 15 minutos'
  },
  skipSuccessfulRequests: true
});

// Middleware para validar y sanitizar entradas
const sanitizeInput = (req, res, next) => {
  // Función recursiva para sanitizar objetos
  const sanitize = (obj) => {
    if (typeof obj !== 'object' || obj === null) return obj;
    
    Object.keys(obj).forEach(key => {
      if (typeof obj[key] === 'string') {
        // Eliminar espacios en blanco y caracteres potencialmente peligrosos
        obj[key] = obj[key].trim().replace(/[<>]/g, '');
        
        // Limitar longitud para prevenir ataques de desbordamiento
        if (obj[key].length > 255) {
          obj[key] = obj[key].substring(0, 255);
        }
      } else if (typeof obj[key] === 'object') {
        sanitize(obj[key]);
      }
    });
  };
  
  if (req.body) sanitize(req.body);
  if (req.query) sanitize(req.query);
  if (req.params) sanitize(req.params);
  
  next();
};

// Middleware para verificar autenticación
const requireAuth = (req, res, next) => {
  // En una app Electron, la autenticación se maneja en el frontend
  // pero podemos verificar en la base de datos si es necesario
  next();
};

module.exports = {
  loginLimiter,
  sanitizeInput,
  requireAuth
};