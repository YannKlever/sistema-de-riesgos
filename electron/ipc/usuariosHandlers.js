const User = require('../../backend/src/models/User');

function setupUsuariosHandlers(ipcMain) {
    ipcMain.handle('crear-usuario', async (_, data) => {
        try {
            const resultado = await User.crear(data);
            return {
                success: resultado.success,
                id: resultado.id,
                changes: resultado.changes
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('listar-usuarios', async () => {
        try {
            const resultado = await User.listar();
            return resultado;
        } catch (error) {
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('obtener-usuario', async (_, id) => {
        try {
            const resultado = await User.obtenerPorId(id);
            return resultado;
        } catch (error) {
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('actualizar-usuario', async (_, id, data) => {
        try {
            const resultado = await User.actualizar(id, data);
            return resultado;
        } catch (error) {
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('eliminar-usuario', async (_, id) => {
        try {
            const resultado = await User.eliminar(id);
            return resultado;
        } catch (error) {
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('verificar-credenciales', async (_, email, password) => {
        try {
            const resultado = await User.verificarCredenciales(email, password);
            return resultado;
        } catch (error) {
            return { success: false, error: error.message };
        }
    });
}

module.exports = setupUsuariosHandlers;