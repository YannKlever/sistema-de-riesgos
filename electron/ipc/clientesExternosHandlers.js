const ClienteExterno = require('../../backend/src/models/ClienteExterno');

function setupClientesExternosHandlers(ipcMain) {
    ipcMain.handle('crear-cliente', async (_, data) => {
        try {
            const resultado = await ClienteExterno.crear(data);
            console.log('DEBUG IPC Handler - Resultado:', resultado);
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
            console.log('Listando clientes externos...');
            const resultado = await ClienteExterno.listar();
            console.log('Resultado:', resultado);
            return resultado;
        } catch (error) {
            console.error('Error en handler:', error);
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

    //listado de nuevos metodos
    // Nuevo handler para listar con riesgo interno
    ipcMain.handle('listar-clientes-externos-con-riesgo-interno', async () => {
        try {
            return await ClienteExterno.listarClientesExternosConRiesgoInterno();
        } catch (error) {
            return { success: false, error: error.message };
        }
    });


    //editar cliente externo
      ipcMain.handle('actualizar-cliente-externo', async (_, id, data) => {
        try {
            const resultado = await ClienteExterno.actualizar(id, data);
            return resultado;
        } catch (error) {
            return { success: false, error: error.message };
        }
    });

    // Nuevo handler para vincular cliente interno
    ipcMain.handle('vincular-cliente-interno', async (_, idClienteExterno, idClienteInterno) => {
        try {
            return await ClienteExterno.vincularClienteInterno(idClienteExterno, idClienteInterno);
        } catch (error) {
            return { success: false, error: error.message };
        }
    });





}

module.exports = setupClientesExternosHandlers;