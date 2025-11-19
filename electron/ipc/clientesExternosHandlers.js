const ClienteExterno = require('../../backend/src/models/ClienteExterno');

function setupClientesExternosHandlers(ipcMain) {
    ipcMain.handle('crear-cliente', async (_, data) => {
        try {
            const resultado = await ClienteExterno.crear(data);
            return {
                success: resultado.success,
                id: resultado.id,
                changes: resultado.changes
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('listar-clientes-externos', async () => {
        try {
            const resultado = await ClienteExterno.listar();
            return resultado;
        } catch (error) {
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('eliminar-cliente-externo', async (_, id) => {
        try {
            const resultado = await ClienteExterno.eliminar(id);
            return resultado;
        } catch (error) {
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('listar-clientes-externos-con-riesgo-interno', async () => {
        try {
            return await ClienteExterno.listarClientesExternosConRiesgoInterno();
        } catch (error) {
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('listar-clientes-externos-con-riesgo-producto-servicio', async () => {
        try {
            return await ClienteExterno.listarClientesExternosConRiesgoProductoServicio();
        } catch (error) {
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('actualizar-cliente-externo', async (_, id, data) => {
        try {
            const resultado = await ClienteExterno.actualizar(id, data);
            return resultado;
        } catch (error) {
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('vincular-cliente-interno', async (_, idClienteExterno, idClienteInterno) => {
        try {
            return await ClienteExterno.vincularClienteInterno(idClienteExterno, idClienteInterno);
        } catch (error) {
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('bulk-create-clientes-externos', async (_, clientes) => {
        try {
            const resultado = await ClienteExterno.bulkCreate(clientes);
            return {
                ...resultado,
                message: resultado.success
                    ? `Importación completada: ${resultado.count} registros procesados`
                    : `Error en importación: ${resultado.error}`
            };
        } catch (error) {
            return {
                success: false,
                error: error.message || 'Error desconocido al importar',
                details: error.details || null,
                processed: error.processed || 0
            };
        }
    });

    ipcMain.handle('listar-clientes-con-alertas', async () => {
        try {
            return await ClienteExterno.listarClientesConAlertas();
        } catch (error) {
            return { success: false, error: error.message };
        }
    });
}

module.exports = setupClientesExternosHandlers;