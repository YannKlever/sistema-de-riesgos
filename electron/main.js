// AGREGAR AL INICIO - VERSIÓN LIMPIA
const config = require('./config');

const { app, ipcMain, BrowserWindow, dialog } = require('electron');
const path = require('path');
const ActivationManager = require('./activationManager');
const { createMenu } = require('./menu');
const { handleProductKeyExpired } = require('./windowManager');

// Configurar manejo de excepciones SIN LOGS
process.on('uncaughtException', (error) => {
    // Solo mostrar diálogo de error, sin logging
    dialog.showErrorBox('Error Inesperado', `Ocurrió un error inesperado: ${error.message}`);
});

process.on('unhandledRejection', (reason, promise) => {
    // Silenciar completamente los unhandled rejections
});

// Evitar múltiples instancias
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
    app.quit(); // Cerrar silenciosamente
} else {
    app.on('second-instance', (event, commandLine, workingDirectory) => {
        const { getMainWindow, showMainWindow } = require('./windowManager');
        const existingWindow = getMainWindow();
        
        if (existingWindow) {
            showMainWindow();
        } else {
            // Si no hay ventana, crear una nueva
            const { createMainWindow } = require('./windowManager');
            createMainWindow();
        }
    });
}

// Configurar nombre de la aplicación
app.setName('Sistema de Gestión de Riesgos');

// Inicializar la base de datos SILENCIOSAMENTE
try {
    require('../backend/src/database/db');
    // Sin log de éxito
} catch (error) {
    // Solo mostrar error en diálogo, sin log
    dialog.showErrorBox('Error de Base de Datos', `No se pudo inicializar la base de datos: ${error.message}`);
}

// Cargar handlers IPC SILENCIOSAMENTE
try {
    const setupAllHandlers = require('./ipc');
    setupAllHandlers(ipcMain);
    
    // Handler para logs del renderer - VACÍO
    ipcMain.handle('log-message', (event, level, message, data) => {
        // No hacer nada - silenciar completamente
    });
    
} catch (error) {
    dialog.showErrorBox('Error de IPC', `Error cargando handlers IPC: ${error.message}`);
}

let activationManager;

// Configurar eventos de la aplicación
app.whenReady().then(async () => {
    try {
        // Crear el activation manager
        activationManager = new ActivationManager();
        
        // Verificar activación al inicio
        const activationValid = await activationManager.verifyOnStartup();
        
        // Sin logs de activación
        
    } catch (error) {
        dialog.showErrorBox('Error de Inicio', 'No se pudo inicializar la aplicación: ' + error.message);
        app.quit();
    }
});

// Manejar eventos de activación (macOS)
app.on('activate', async () => {
    if (!activationManager) {
        activationManager = new ActivationManager();
    }
    
    // Verificar si hay ventanas abiertas
    const allWindows = BrowserWindow.getAllWindows();
    if (allWindows.length === 0) {
        const activationValid = await activationManager.verifyOnStartup();
        
        if (activationValid) {
            const { createMainWindow } = require('./windowManager');
            createMainWindow();
            
            // Iniciar verificación periódica
            activationManager.startPeriodicVerification();
        }
    } else {
        // Traer ventanas existentes al frente
        allWindows.forEach(win => {
            if (win.isMinimized()) win.restore();
            win.focus();
        });
    }
});

// Manejar cierre de todas las ventanas
app.on('window-all-closed', () => {
    if (activationManager) {
        activationManager.stopPeriodicVerification();
    }
    
    // En macOS es común que las aplicaciones se mantengan ejecutándose
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// Manejar cierre de aplicación
app.on('before-quit', async (event) => {
    if (activationManager) {
        activationManager.stopPeriodicVerification();
    }
    
    try {
        // Guardar estado de la aplicación si es necesario
    } catch (error) {
        // Silenciar errores de cierre
    }
});

// Manejar eventos de clave expirada
ipcMain.on('product-key-expired', async () => {
    const result = await handleProductKeyExpired();
    if (result.action === 'quit') {
        app.quit();
    } else if (result.action === 'reactivate' && activationManager) {
        activationManager.showActivationWindow();
    }
});

// Manejar solicitud de información del sistema
ipcMain.handle('get-app-info', async () => {
    return {
        version: app.getVersion(),
        name: app.getName(),
        platform: process.platform,
        arch: process.arch,
        isProduction: config.isProduction
    };
});

// Manejar cierre forzado - SILENCIOSO
app.on('will-quit', (event) => {
    // Limpieza silenciosa
});

// Manejar cuando la aplicación se está cerrando - SILENCIOSO
app.on('quit', () => {
    // Cierre silencioso
});

// Configurar protocolo personalizado (opcional)
app.setAsDefaultProtocolClient('risk-management');

// Manejar enlaces profundos (opcional)
app.on('open-url', (event, url) => {
    event.preventDefault();
    // Manejar el enlace según tu lógica de negocio
});

// Exportar para uso en otros módulos
module.exports = { app, activationManager };