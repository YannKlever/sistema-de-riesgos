const { BrowserWindow, dialog } = require('electron');
const path = require('path');
const ProductKeyService = require('./services/ProductKeyService');

let mainWindow = null;
const productKeyService = new ProductKeyService();

function showMainWindow() {
    if (mainWindow && !mainWindow.isDestroyed()) {
        if (mainWindow.isMinimized()) mainWindow.restore();
        mainWindow.show();
        mainWindow.focus();
    }
}

function createMainWindow() {
    console.log('Creando ventana principal...');
    
    // Si ya existe una ventana, enfocarla
    if (mainWindow && !mainWindow.isDestroyed()) {
        showMainWindow();
        return mainWindow;
    }

    mainWindow = new BrowserWindow({
        width: 1400,
        height: 900,
        minWidth: 1200,
        minHeight: 700,
        show: false,
        backgroundColor: '#f5f5f5',
        title: 'Sistema de Gestión de Riesgos',
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: false,
            enableRemoteModule: false,
            preload: path.join(__dirname, 'preload.js'),
            webSecurity: true,
            allowRunningInsecureContent: false,
            experimentalFeatures: false
        },
        titleBarStyle: 'default'
    });

    // Optimizar rendimiento
    mainWindow.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
    
    mainWindow.webContents.on('will-navigate', (event, navigationUrl) => {
        const parsedUrl = new URL(navigationUrl);
        if (parsedUrl.origin !== 'http://localhost:3000') {
            event.preventDefault();
        }
    });

    // Evento cuando el contenido esté completamente cargado
    mainWindow.webContents.on('did-finish-load', () => {
        console.log('Contenido completamente cargado');
        if (mainWindow && !mainWindow.isDestroyed()) {
            setTimeout(() => {
                mainWindow.show();
                mainWindow.focus();
                console.log('Ventana mostrada y enfocada');
                
                // Iniciar verificación periódica
                try {
                    productKeyService.startPeriodicVerification();
                } catch (error) {
                    console.error('Error iniciando verificación periódica:', error);
                }
            }, 100);
        }
    });

    // Manejar errores de carga
    mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
        console.error('Error cargando aplicación:', errorCode, errorDescription, validatedURL);
        
        if (mainWindow && !mainWindow.isDestroyed()) {
            dialog.showMessageBox(mainWindow, {
                type: 'error',
                title: 'Error de Carga',
                message: 'No se pudo conectar con la aplicación',
                detail: 'Verifique que el servidor React esté ejecutándose en el puerto 3000.'
            }).catch(console.error);
        }
        
        // Reintentar después de 5 segundos
        setTimeout(() => {
            if (mainWindow && !mainWindow.isDestroyed()) {
                console.log('Reintentando carga...');
                mainWindow.loadURL('http://localhost:3000/login').catch(console.error);
            }
        }, 5000);
    });

    // Prevenir cambios de título
    mainWindow.on('page-title-updated', (e) => {
        e.preventDefault();
    });

    
    // Cargar la aplicación React
    console.log('Cargando aplicación React...');
    
    const loadApp = () => {
        try {
            mainWindow.loadURL('http://localhost:3000/login').catch(error => {
                console.error('Error en loadURL:', error);
                handleLoadError();
            });
            
            // Timeout para manejar carga lenta
            const loadTimeout = setTimeout(() => {
                if (mainWindow && mainWindow.webContents.isLoading()) {
                    console.log('Timeout de carga alcanzado');
                    mainWindow.webContents.stop();
                    handleLoadError();
                }
            }, 15000);

            mainWindow.webContents.on('did-finish-load', () => {
                clearTimeout(loadTimeout);
                // Ejecutar script para transición suave
                mainWindow.webContents.executeJavaScript(`
                    document.body.classList.add('loaded');
                `).catch(console.error);
            });

        } catch (error) {
            console.error('Error en loadApp:', error);
            handleLoadError();
        }
    };

    loadApp();

    // Manejar eventos de la ventana
    mainWindow.on('closed', () => {
        console.log('Ventana principal cerrada');
        try {
            productKeyService.stopPeriodicVerification();
        } catch (error) {
            console.error('Error deteniendo verificación periódica:', error);
        }
        mainWindow = null;
    });

    mainWindow.on('close', (e) => {
        console.log('Ventana principal cerrándose');
    });

    return mainWindow;
}

function handleLoadError() {
    if (mainWindow && !mainWindow.isDestroyed()) {
        dialog.showMessageBox(mainWindow, {
            type: 'error',
            title: 'Error de Carga',
            message: 'No se pudo cargar la aplicación',
            detail: 'Verifique que el servidor de desarrollo de React esté ejecutándose.'
        }).catch(console.error);
    }
}

// Función para verificar la clave al inicio
async function verifyProductKeyOnStart() {
    try {
        console.log('Verificando clave al iniciar...');
        await productKeyService.init();
        const isValid = await productKeyService.isKeyValidated();
        
        console.log('Estado de validación al inicio:', isValid);
        return { isValid };
    } catch (error) {
        console.error('Error en verificación inicial:', error);
        return { isValid: false, error: error.message };
    }
}

// Manejar clave expirada
async function handleProductKeyExpired() {
    console.log('Manejando clave expirada...');
    
    if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.hide();
    }
    
    try {
        const result = await dialog.showMessageBox({
            type: 'warning',
            buttons: ['Reactivar', 'Salir'],
            title: 'Licencia Expirada',
            message: 'Su licencia ha expirado o ha sido desactivada.',
            detail: 'Debe reactivar el producto para continuar.'
        });
        
        if (result.response === 0) {
            await productKeyService.clearProductKey();
            if (mainWindow && !mainWindow.isDestroyed()) {
                mainWindow.close();
            }
            return { action: 'reactivate' };
        } else {
            return { action: 'quit' };
        }
    } catch (error) {
        console.error('Error en handleProductKeyExpired:', error);
        return { action: 'quit' };
    }
}

// Función para obtener la ventana principal
function getMainWindow() {
    return mainWindow;
}

// Función para verificar si la ventana existe
function hasMainWindow() {
    return mainWindow && !mainWindow.isDestroyed();
}

// Función para recargar la ventana
function reloadMainWindow() {
    if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.reload();
    }
}

module.exports = { 
    createMainWindow, 
    getMainWindow,
    hasMainWindow,
    verifyProductKeyOnStart,
    handleProductKeyExpired,
    reloadMainWindow,
    showMainWindow,
    checkProductKeyStatus: () => productKeyService.isKeyValidated(),
    getProductKeyInfo: () => productKeyService.getStoredKeyInfo(),
    clearProductKey: () => productKeyService.clearProductKey()
};