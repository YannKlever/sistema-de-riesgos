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

    //importar
    ipcMain.handle('bulk-create-sucursales', async (_, sucursales) => {
    try {
        console.log(`Iniciando importación de ${sucursales.length} registros`);
        const resultado = await Sucursal.bulkCreate(sucursales);
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