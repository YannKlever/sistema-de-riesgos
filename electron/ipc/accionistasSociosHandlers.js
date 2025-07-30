const AccionistaSocio = require('../../backend/src/models/AccionistaSocio');

function setupAccionistasSociosHandlers(ipcMain) {
    ipcMain.handle('crear-accionista-socio', async (_, data) => {
        try {
            const resultado = await AccionistaSocio.crear(data);
            return {
                success: resultado.success,
                id: resultado.id,
                changes: resultado.changes
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('listar-accionistas-socios', async () => {
        try {
            const resultado = await AccionistaSocio.listar();
            return resultado;
        } catch (error) {
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('obtener-accionista-socio', async (_, id) => {
        try {
            const resultado = await AccionistaSocio.obtenerPorId(id);
            return resultado;
        } catch (error) {
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('actualizar-accionista-socio', async (_, id, data) => {
        try {
            const resultado = await AccionistaSocio.actualizar(id, data);
            return resultado;
        } catch (error) {
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('eliminar-accionista-socio', async (_, id) => {
        try {
            const resultado = await AccionistaSocio.eliminar(id);
            return resultado;
        } catch (error) {
            return { success: false, error: error.message };
        }
    });
    ipcMain.handle('bulk-create-accionistas-socios', async (_, accionistas) => {
        try {
            console.log(`Iniciando importación de ${accionistas.length} registros`);
            const resultado = await AccionistaSocio.bulkCreate(accionistas);
            console.log('Importación completada:', resultado);
            return {
                ...resultado,
                message: resultado.success
                    ? `Importación completada: ${resultado.count} registros procesados`
                    : `Error en importación: ${resultado.error}`
            };
        } catch (error) {
            console.error('Error en bulk create:', error);
            return {
                success: false,
                error: error.message || 'Error desconocido al importar',
                details: error.details || null,
                processed: error.processed || 0
            };
        }
    });
}

module.exports = setupAccionistasSociosHandlers;