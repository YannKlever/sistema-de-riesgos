const setupClientesExternosHandlers = require('./clientesExternosHandlers');
const setupAccionistasSociosHandlers = require('./accionistasSociosHandlers');
const setupEvaluacionesLDFTHandlers = require('./evaluacionesLDFTHandlers');
const setupClientesInternosHandlers = require('./clientesInternosHandlers');
const setupProductosServiciosHandlers = require('./productosServiciosHandlers');
const setupSucursalesHandlers = require('./sucursalesHandlers');
const setupUsuariosHandlers = require('./usuariosHandlers');
const setupEmpresaHandlers = require('./empresaHandlers');

function setupAllHandlers(ipcMain) {
    setupClientesExternosHandlers(ipcMain);
    setupAccionistasSociosHandlers(ipcMain);
    setupEvaluacionesLDFTHandlers(ipcMain);
    setupClientesInternosHandlers(ipcMain);
    setupProductosServiciosHandlers(ipcMain);
    setupSucursalesHandlers(ipcMain);
    setupUsuariosHandlers(ipcMain);
    setupEmpresaHandlers(ipcMain);
    
    console.log('Todos los handlers IPC han sido registrados correctamente');
}

module.exports = setupAllHandlers;