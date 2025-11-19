const EvaluacionRiesgoLDFT = require('../../backend/src/models/EvaluacionRiesgoLDFT');

function setupEvaluacionesLDFTHandlers(ipcMain) {
    ipcMain.handle('crear-evaluacion-riesgo-ld-ft', async (_, data) => {
        try {
            const resultado = await EvaluacionRiesgoLDFT.crear(data);
            return {
                success: resultado.success,
                id: resultado.id,
                changes: resultado.changes,
                puntuacion: resultado.puntuacion,
                nivelRiesgo: resultado.nivelRiesgo
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    });
       // NUEVO MÉTODO - Obtener evaluación por ID
    ipcMain.handle('obtener-evaluacion-riesgo-ld-ft', async (_, id) => {
        try {
            const resultado = await EvaluacionRiesgoLDFT.obtenerPorId(id);
            return resultado;
        } catch (error) {
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('listar-evaluaciones-riesgo-ld-ft', async () => {
        try {
            const resultado = await EvaluacionRiesgoLDFT.listar();
            return resultado;
        } catch (error) {
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('actualizar-evaluacion-riesgo-ld-ft', async (_, { id, data }) => {
        try {
            const resultado = await EvaluacionRiesgoLDFT.actualizar(id, data);
            return resultado;
        } catch (error) {
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('eliminar-evaluacion-riesgo-ld-ft', async (_, id) => {
        try {
            const resultado = await EvaluacionRiesgoLDFT.eliminar(id);
            return resultado;
        } catch (error) {
            return { success: false, error: error.message };
        }
    });
}

module.exports = setupEvaluacionesLDFTHandlers;