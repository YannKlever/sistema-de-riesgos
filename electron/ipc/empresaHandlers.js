const Empresa = require('../../backend/src/models/Empresa');

function setupEmpresaHandlers(ipcMain) {
    // Obtener datos de la empresa
    ipcMain.handle('obtener-empresa', async () => {
        try {
            const resultado = await Empresa.obtener();
            return resultado;
        } catch (error) {
            console.error('Error obteniendo datos de la empresa:', error);
            return { success: false, error: error.message };
        }
    });

    // Guardar datos de la empresa
    ipcMain.handle('guardar-empresa', async (_, datosEmpresa) => {
        try {
            const resultado = await Empresa.guardar(datosEmpresa);
            return resultado;
        } catch (error) {
            console.error('Error guardando datos de la empresa:', error);
            return { success: false, error: error.message };
        }
    });
}

module.exports = setupEmpresaHandlers;