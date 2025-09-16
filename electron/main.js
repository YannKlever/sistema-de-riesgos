const { app, ipcMain, BrowserWindow, dialog } = require('electron');
const path = require('path');
const ActivationManager = require('./activationManager');
const { createMenu } = require('./menu');
const { handleProductKeyExpired } = require('./windowManager');

// Configurar manejo de excepciones
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    dialog.showErrorBox('Error Inesperado', `Ocurrió un error inesperado: ${error.message}`);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Evitar múltiples instancias
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
    console.log('Otra instancia ya está ejecutándose. Cerrando...');
    app.quit();
} else {
    app.on('second-instance', (event, commandLine, workingDirectory) => {
        console.log('Segunda instancia detectada, enfocando ventana existente');
        
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

// Inicializar la base de datos
try {
    require('../backend/src/database/db');
    console.log('Base de datos inicializada correctamente');
} catch (error) {
    console.error('Error inicializando base de datos:', error);
}

// Cargar handlers IPC
try {
    const setupAllHandlers = require('./ipc');
    setupAllHandlers(ipcMain);
    console.log('Handlers IPC cargados correctamente');
} catch (error) {
    console.error('Error cargando handlers IPC:', error);
}

let activationManager;

// Configurar eventos de la aplicación
app.whenReady().then(async () => {
    console.log('Aplicación lista, inicializando...');
    
    try {
        // Crear el activation manager
        activationManager = new ActivationManager();
        
        // Verificar activación al inicio
        const activationValid = await activationManager.verifyOnStartup();
        
        if (activationValid) {
            console.log('Activación válida, creando ventana principal...');
            const { createMainWindow } = require('./windowManager');
            const mainWindow = createMainWindow();
            
            // Crear menú personalizado cuando la ventana esté lista
            if (mainWindow) {
                mainWindow.once('ready-to-show', () => {
                    try {
                        createMenu(mainWindow);
                        console.log('Menú personalizado creado correctamente');
                    } catch (error) {
                        console.error('Error creando menú:', error);
                    }
                });
            }
            
            // Iniciar verificación periódica (una vez al día)
            activationManager.startPeriodicVerification();
        } else {
            console.log('Activación requerida, mostrando ventana de activación');
        }
        
    } catch (error) {
        console.error('Error durante la inicialización:', error);
        dialog.showErrorBox('Error de Inicio', 'No se pudo inicializar la aplicación: ' + error.message);
        app.quit();
    }
});

// Manejar eventos de activación (macOS)
app.on('activate', async () => {
    console.log('Evento activate (macOS) detectado');
    
    if (!activationManager) {
        activationManager = new ActivationManager();
    }
    
    // Verificar si hay ventanas abiertas
    const allWindows = BrowserWindow.getAllWindows();
    if (allWindows.length === 0) {
        console.log('No hay ventanas abiertas, verificando activación...');
        const activationValid = await activationManager.verifyOnStartup();
        
        if (activationValid) {
            const { createMainWindow } = require('./windowManager');
            createMainWindow();
            
            // Iniciar verificación periódica
            activationManager.startPeriodicVerification();
        }
    } else {
        // Traer ventanas existentes al frente
        console.log('Enfocando ventanas existentes');
        allWindows.forEach(win => {
            if (win.isMinimized()) win.restore();
            win.focus();
        });
    }
});

// Manejar cierre de todas las ventanas
app.on('window-all-closed', () => {
    console.log('Todas las ventanas cerradas');
    
    if (activationManager) {
        activationManager.stopPeriodicVerification();
    }
    
    // En macOS es común que las aplicaciones se mantengan ejecutándose
    if (process.platform !== 'darwin') {
        console.log('Cerrando aplicación (no macOS)');
        app.quit();
    } else {
        console.log('Manteniendo aplicación ejecutándose (macOS)');
    }
});

// Manejar cierre de aplicación
app.on('before-quit', async (event) => {
    console.log('Aplicación cerrando...');
    
    if (activationManager) {
        activationManager.stopPeriodicVerification();
    }
    
    try {
        // Guardar estado de la aplicación si es necesario
    } catch (error) {
        console.error('Error durante el cierre:', error);
    }
});

// Manejar eventos de clave expirada
ipcMain.on('product-key-expired', async () => {
    console.log('Evento product-key-expired recibido');
    
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
        arch: process.arch
    };
});

// Manejar cierre forzado
app.on('will-quit', (event) => {
    console.log('Aplicación will-quit - limpieza final');
});

// Manejar cuando la aplicación se está cerrando
app.on('quit', () => {
    console.log('Aplicación completamente cerrada');
});

// Configurar protocolo personalizado (opcional)
app.setAsDefaultProtocolClient('risk-management');

// Manejar enlaces profundos (opcional)
app.on('open-url', (event, url) => {
    event.preventDefault();
    console.log('Enlace profundo recibido:', url);
    // Manejar el enlace según tu lógica de negocio
});

// Exportar para uso en otros módulos
module.exports = { app, activationManager };