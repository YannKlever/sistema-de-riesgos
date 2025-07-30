const ClienteInterno = require('../../backend/src/models/ClienteInterno');

function setupClientesInternosHandlers(ipcMain) {
    ipcMain.handle('crear-cliente-interno', async (_, data) => {
        try {
            const resultado = await ClienteInterno.crear(data);
            return {
                success: resultado.success,
                id: resultado.id,
                changes: resultado.changes
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('listar-clientes-internos', async () => {
        try {
            const resultado = await ClienteInterno.listar();
            return resultado;
        } catch (error) {
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('obtener-cliente-interno', async (_, id) => {
        try {
            const resultado = await ClienteInterno.obtenerPorId(id);
            return resultado;
        } catch (error) {
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('actualizar-cliente-interno', async (_, id, data) => {
        try {
            const resultado = await ClienteInterno.actualizar(id, data);
            return resultado;
        } catch (error) {
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('eliminar-cliente-interno', async (_, id) => {
        try {
            const resultado = await ClienteInterno.eliminar(id);
            return resultado;
        } catch (error) {
            return { success: false, error: error.message };
        }
    });
}

module.exports = setupClientesInternosHandlers;