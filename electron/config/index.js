const { app } = require('electron');

// Detectar entorno de forma nativa sin electron-is-dev
function isDevelopment() {
    // Método 1: Variable de entorno
    if (process.env.NODE_ENV === 'development') return true;

    // Método 2: Electron en modo desarrollo
    if (process.defaultApp) return true;

    // Método 3: Ejecutando desde node_modules/electron/
    if (process.execPath && process.execPath.includes('node_modules\\electron\\')) return true;

    // Método 4: Verificar si estamos empaquetados
    if (process.mainModule && process.mainModule.filename.includes('app.asar')) return false;

    // Por defecto, asumir producción si no hay indicios de desarrollo
    return false;
}

const development = require('./development');
const production = require('./production');

module.exports = isDevelopment() ? development : production;