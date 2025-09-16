const ProductKeyService = require('../services/ProductKeyService');

function setupProductKeyHandlers(ipcMain) {
    const productKeyService = new ProductKeyService();
    
    ipcMain.handle('validate-product-key', async (event, productKey) => {
        try {
            console.log('Validando clave de producto:', productKey);
            const result = await productKeyService.validateProductKey(productKey);
            console.log('Resultado de validación:', result);
            return result;
        } catch (error) {
            console.error('Error en validate-product-key handler:', error);
            return { 
                success: false, 
                error: 'Error interno durante la validación: ' + error.message 
            };
        }
    });

    // verificar el estado de la clave
    ipcMain.handle('check-product-key-status', async () => {
        try {
            return await productKeyService.isKeyValidated();
        } catch (error) {
            console.error('Error checking product key status:', error);
            return false;
        }
    });

    // obtener información de la clave
    ipcMain.handle('get-product-key-info', async () => {
        try {
            return await productKeyService.getStoredKeyInfo();
        } catch (error) {
            console.error('Error getting product key info:', error);
            return null;
        }
    });

    // cerrar sesión/eliminar clave
    ipcMain.handle('clear-product-key', async () => {
        try {
            await productKeyService.clearProductKey();
            return { success: true };
        } catch (error) {
            console.error('Error clearing product key:', error);
            return { success: false, error: error.message };
        }
    });

    console.log('Product key handlers registrados correctamente');
}

module.exports = setupProductKeyHandlers;