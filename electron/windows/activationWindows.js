const { BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const ProductKeyService = require('../services/ProductKeyService');

const productKeyService = new ProductKeyService();

function createActivationWindow(parentWindow) {
    const activationWindow = new BrowserWindow({
        width: 500,
        height: 400,
        parent: parentWindow,
        modal: !!parentWindow,
        resizable: false,
        
         titleBarStyle: 'default', 
        autoHideMenuBar: true,    
        menu: null,                
        frame: true,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false,
            preload: path.join(__dirname, '../preload/activationPreload.js')
        }
    });

    // Cargar el archivo HTML correctamente
    const activationHtmlPath = path.join(__dirname, 'activation/activation.html');
    console.log('Cargando activation HTML desde:', activationHtmlPath);
    
    activationWindow.loadFile(activationHtmlPath);
    
    // Manejar cierre de la ventana
    activationWindow.on('close', (e) => {
        console.log('Ventana de activación cerrada');
    });

    activationWindow.on('closed', () => {
        console.log('Ventana de activación completamente cerrada');
    });

    return activationWindow;
}

module.exports = { createActivationWindow };