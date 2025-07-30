const ProductoServicio = require('../../backend/src/models/ProductoServicio');

function setupProductosServiciosHandlers(ipcMain) {
    ipcMain.handle('crear-producto-servicio', async (_, data) => {
        try {
            const resultado = await ProductoServicio.crear(data);
            return {
                success: resultado.success,
                id: resultado.id,
                changes: resultado.changes
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('listar-productos-servicios', async () => {
        try {
            const resultado = await ProductoServicio.listar();
            return resultado;
        } catch (error) {
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('obtener-producto-servicio', async (_, id) => {
        try {
            const resultado = await ProductoServicio.obtenerPorId(id);
            return resultado;
        } catch (error) {
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('actualizar-producto-servicio', async (_, id, data) => {
        try {
            const resultado = await ProductoServicio.actualizar(id, data);
            return resultado;
        } catch (error) {
            return { success: false, error: error.message };
        }
    });


    //factores
       ipcMain.handle('obtener-riesgo-zona', async (_, oficina) => {
        try {
            const riesgo = await ProductoServicio.obtenerRiesgoZonaPorOficina(oficina);
            return { success: true, data: riesgo };
        } catch (error) {
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('obtener-riesgo-canal', async (_, oficina) => {
        try {
            const riesgo = await ProductoServicio.obtenerRiesgoCanalPorOficina(oficina);
            return { success: true, data: riesgo };
        } catch (error) {
            return { success: false, error: error.message };
        }
    });






    ipcMain.handle('eliminar-producto-servicio', async (_, id) => {
        try {
            const resultado = await ProductoServicio.eliminar(id);
            return resultado;
        } catch (error) {
            return { success: false, error: error.message };
        }
    });
}

module.exports = setupProductosServiciosHandlers;