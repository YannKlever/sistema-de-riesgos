const { BrowserWindow, dialog, app, nativeImage } = require('electron');
const path = require('path');
const fs = require('fs');
const ProductKeyService = require('./services/ProductKeyService');

const config = require('./config');

let mainWindow = null;
const productKeyService = new ProductKeyService();

function getIconPath() {
    // Definir todas las rutas posibles
    const searchPaths = [
        // Desarrollo
        path.join(__dirname, '..', 'assets', 'icon.ico'),
        path.join(__dirname, '..', 'assets', 'icon.png'),
        path.join(__dirname, '..', 'assets', 'logo512.png'),
        
        // Producción - rutas principales
        path.join(process.resourcesPath, 'assets', 'icon.ico'),
        path.join(process.resourcesPath, 'assets', 'icon.png'),
        path.join(process.resourcesPath, 'assets', 'logo512.png'),
        
        // Producción - rutas alternativas
        path.join(process.resourcesPath, 'icon.ico'),
        path.join(process.resourcesPath, 'icon.png'),
        path.join(__dirname, 'assets', 'icon.ico'),
        path.join(__dirname, '..', '..', 'assets', 'icon.ico'),
    ];

    for (const iconPath of searchPaths) {
        try {
            if (fs.existsSync(iconPath)) {
                return iconPath;
            }
        } catch (error) {
            // Continuar con la siguiente ruta
        }
    }
    return null;
}

function createAppIcon() {
    const iconPath = getIconPath();
    if (!iconPath) {
        return null;
    }

    try {
        const icon = nativeImage.createFromPath(iconPath);
        
        if (icon.isEmpty()) {
            return null;
        }
        
        return icon;
        
    } catch (error) {
        return null;
    }
}

function showMainWindow() {
    if (mainWindow && !mainWindow.isDestroyed()) {
        if (mainWindow.isMinimized()) mainWindow.restore();
        mainWindow.show();
        mainWindow.focus();
    }
}

function createMainWindow() {
    const appIcon = createAppIcon();
    
    const windowOptions = {
        width: 1200,
        height: 800,
        minWidth: 800,
        minHeight: 600,
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
            experimentalFeatures: false,
            nodeIntegrationInWorker: false,
            nodeIntegrationInSubFrames: false,
            devTools: !config.isProduction
        },
        titleBarStyle: 'default',
        autoHideMenuBar: true,
        menu: null,
        frame: true
    };

    // Solo establecer icono si se encontró uno válido
    if (appIcon) {
        windowOptions.icon = appIcon;
    }

    mainWindow = new BrowserWindow(windowOptions);

    // Forzar establecer el icono múltiples veces (especialmente en Windows)
    if (appIcon) {
        mainWindow.setIcon(appIcon);
        
        // Múltiples llamadas para asegurar que se aplique
        setTimeout(() => {
            if (mainWindow && !mainWindow.isDestroyed()) {
                mainWindow.setIcon(appIcon);
            }
        }, 500);
        
        setTimeout(() => {
            if (mainWindow && !mainWindow.isDestroyed()) {
                mainWindow.setIcon(appIcon);
            }
        }, 1000);
    }

    mainWindow.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));

    mainWindow.webContents.on('will-navigate', (event, navigationUrl) => {
        if (config.isProduction && !navigationUrl.startsWith('file://')) {
            event.preventDefault();
        }

        if (!config.isProduction && !navigationUrl.startsWith('http://localhost:3000')) {
            event.preventDefault();
        }
    });

    mainWindow.webContents.on('did-finish-load', () => {
        if (mainWindow && !mainWindow.isDestroyed()) {
            setTimeout(() => {
                mainWindow.show();
                mainWindow.focus();

                // Reforzar icono en Windows después de mostrar
                if (process.platform === 'win32' && appIcon) {
                    mainWindow.setIcon(appIcon);
                }

                try {
                    productKeyService.startPeriodicVerification();
                } catch (error) {
                    // Silenciar error
                }
            }, 100);
        }
    });

    // Manejar errores de carga
    mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
        if (mainWindow && !mainWindow.isDestroyed()) {
            dialog.showMessageBox(mainWindow, {
                type: 'error',
                title: 'Error de Carga',
                message: 'No se pudo cargar la aplicación',
                detail: `Error ${errorCode}: ${errorDescription}`
            }).catch(() => { });
        }

        if (!config.isProduction) {
            setTimeout(() => {
                if (mainWindow && !mainWindow.isDestroyed()) {
                    loadApp();
                }
            }, 5000);
        }
    });

    // Prevenir cambios de título
    mainWindow.on('page-title-updated', (e) => {
        e.preventDefault();
    });

    // Reforzar icono cuando la ventana recibe foco (Windows)
    mainWindow.on('focus', () => {
        if (process.platform === 'win32' && appIcon) {
            setTimeout(() => {
                if (mainWindow && !mainWindow.isDestroyed()) {
                    mainWindow.setIcon(appIcon);
                }
            }, 100);
        }
    });

    // Cargar la aplicación
    loadApp();

    // Manejar eventos de la ventana
    mainWindow.on('closed', () => {
        try {
            productKeyService.stopPeriodicVerification();
        } catch (error) {
            // Silenciar error
        }
        mainWindow = null;
    });

    mainWindow.on('close', (event) => {
        try {
            productKeyService.stopPeriodicVerification();
        } catch (error) {
            // Silenciar error
        }
    });

    return mainWindow;
}

function loadApp() {
    try {
        if (config.isProduction) {
            const buildPath = path.join(process.resourcesPath, 'frontend-build', 'index.html');

            if (fs.existsSync(buildPath)) {
                const appUrl = `file://${buildPath}#/login`;
                console.log('📦 Cargando aplicación desde:', appUrl);
                mainWindow.loadURL(appUrl);
            } else {
                throw new Error(`No se pudo encontrar: ${buildPath}`);
            }
        } else {
            const devUrl = 'http://localhost:3000/#/login';
            console.log('🔧 Cargando aplicación desde:', devUrl);
            mainWindow.loadURL(devUrl);
        }
    } catch (error) {
        handleLoadError(error);
    }
}

function handleLoadError(error) {
    console.error('❌ Error cargando la aplicación:', error);
    
    if (mainWindow && !mainWindow.isDestroyed()) {
        dialog.showMessageBox(mainWindow, {
            type: 'error',
            title: 'Error de Carga',
            message: 'No se pudo cargar la aplicación',
            detail: config.isProduction
                ? `Error: ${error.message}\n\nVerifique que los archivos de la aplicación estén completos.`
                : `Error: ${error.message}\n\nVerifique que el servidor de desarrollo de React esté ejecutándose en puerto 3000.`
        }).catch(() => { });
    }
}

// Función para verificar la clave al inicio
async function verifyProductKeyOnStart() {
    try {
        await productKeyService.init();
        const isValid = await productKeyService.isKeyValidated();
        return { isValid };
    } catch (error) {
        return { isValid: false, error: error.message };
    }
}

// Manejar clave expirada
async function handleProductKeyExpired() {
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