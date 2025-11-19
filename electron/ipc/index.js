const setupClientesExternosHandlers = require('./clientesExternosHandlers');
const setupAccionistasSociosHandlers = require('./accionistasSociosHandlers');
const setupEvaluacionesLDFTHandlers = require('./evaluacionesLDFTHandlers');
const setupClientesInternosHandlers = require('./clientesInternosHandlers');
const setupProductosServiciosHandlers = require('./productosServiciosHandlers');
const setupSucursalesHandlers = require('./sucursalesHandlers');
const setupUsuariosHandlers = require('./usuariosHandlers');
const setupEmpresaHandlers = require('./empresaHandlers');
const setupProductKeyHandlers = require('./productKeyHandlers');
const setupBackupHandlers = require('./backupHandlers'); 

function setupAllHandlers(ipcMain) {
    setupClientesExternosHandlers(ipcMain);
    setupAccionistasSociosHandlers(ipcMain);
    setupEvaluacionesLDFTHandlers(ipcMain);
    setupClientesInternosHandlers(ipcMain);
    setupProductosServiciosHandlers(ipcMain);
    setupSucursalesHandlers(ipcMain);
    setupUsuariosHandlers(ipcMain);
    setupEmpresaHandlers(ipcMain);
    setupProductKeyHandlers(ipcMain);
    setupBackupHandlers(ipcMain);
}

module.exports = setupAllHandlers;