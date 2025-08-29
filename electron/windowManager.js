const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;

function createMainWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        },
        title: 'Sistema de Gestión de Riesgos S.R.G.'
    });

    mainWindow.loadURL('http://localhost:3000/login');

    // Descomentar solo para desarrollo
    // mainWindow.webContents.openDevTools();

    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    return mainWindow;
}

// Mover el evento whenReady al main.js
module.exports = { createMainWindow, mainWindow };