const EvaluacionRiesgoLDFT = require('../../backend/src/models/EvaluacionRiesgoLDFT');

function setupEvaluacionesLDFTHandlers(ipcMain) {
    ipcMain.handle('crear-evaluacion-riesgo-ld-ft', async (_, data) => {
        try {
            console.log('Recibiendo datos para evaluación LD/FT:', data);
            const resultado = await EvaluacionRiesgoLDFT.crear(data);
            console.log('Resultado de la creación:', resultado);
            return {
                success: resultado.success,
                id: resultado.id,
                changes: resultado.changes,
                puntuacion: resultado.puntuacion,
                nivelRiesgo: resultado.nivelRiesgo
            };
        } catch (error) {
            console.error('Error en handler crear-evaluacion-riesgo-ld-ft:', error);
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

    // AÑADE ESTE NUEVO HANDLER PARA ACTUALIZACIÓN
    ipcMain.handle('actualizar-evaluacion-riesgo-ld-ft', async (_, { id, data }) => {
        try {
            console.log('Actualizando evaluación LD/FT ID:', id, 'con datos:', data);
            const resultado = await EvaluacionRiesgoLDFT.actualizar(id, data);
            return resultado;
        } catch (error) {
            console.error('Error al actualizar evaluación LD/FT:', error);
            return { success: false, error: error.message };
        }
    });
}

module.exports = setupEvaluacionesLDFTHandlers;