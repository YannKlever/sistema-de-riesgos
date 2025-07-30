const { ipcMain } = require('electron');
const setupAllHandlers = require('./ipc');

// Configurar todos los handlers
setupAllHandlers(ipcMain);