const Sucursal = require('../../backend/src/models/Sucursal');

function setupSucursalesHandlers(ipcMain) {
    ipcMain.handle('crear-sucursal', async (_, data) => {
        try {
            const resultado = await Sucursal.crear(data);
            return {
                success: resultado.success,
                id: resultado.id,
                changes: resultado.changes
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('listar-sucursales', async () => {
        try {
            const resultado = await Sucursal.listar();
            return resultado;
        } catch (error) {
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('obtener-sucursal', async (_, id) => {
        try {
            const resultado = await Sucursal.obtenerPorId(id);
            return resultado;
        } catch (error) {
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('actualizar-sucursal', async (_, id, data) => {
        try {
            const resultado = await Sucursal.actualizar(id, data);
            return resultado;
        } catch (error) {
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('eliminar-sucursal', async (_, id) => {
        try {
            const resultado = await Sucursal.eliminar(id);
            return resultado;
        } catch (error) {
            return { success: false, error: error.message };
        }
    });
}

module.exports = setupSucursalesHandlers;