const { app } = require('electron');
const { createMainWindow } = require('./windowManager');

// Inicializar la base de datos
require('../backend/src/database/db');

// Cargar handlers IPC
require('./ipcHandlers');

// Configurar la ventana principal cuando la app esté lista
app.whenReady().then(() => {
    createMainWindow();

    // Para macOS (recrear ventana si se clickea el icono del dock)
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
    });
});

// Salir cuando todas las ventanas estén cerradas (excepto en macOS)
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});