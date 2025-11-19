const ProductKeyService = require('../services/ProductKeyService');

function setupProductKeyHandlers(ipcMain) {
    const productKeyService = new ProductKeyService();
    
    ipcMain.handle('validate-product-key', async (event, productKey) => {
        try {
            const result = await productKeyService.validateProductKey(productKey);
            return result;
        } catch (error) {
            return { 
                success: false, 
                error: 'Error interno durante la validación: ' + error.message 
            };
        }
    });

    ipcMain.handle('check-product-key-status', async () => {
        try {
            return await productKeyService.isKeyValidated();
        } catch (error) {
            return false;
        }
    });

    ipcMain.handle('get-product-key-info', async () => {
        try {
            return await productKeyService.getStoredKeyInfo();
        } catch (error) {
            return null;
        }
    });

    ipcMain.handle('clear-product-key', async () => {
        try {
            await productKeyService.clearProductKey();
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    });
}

module.exports = setupProductKeyHandlers;