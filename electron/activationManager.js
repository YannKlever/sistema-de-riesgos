const { ipcMain, BrowserWindow, dialog, app } = require('electron');
const ProductKeyService = require('./services/ProductKeyService');
const { createActivationWindow } = require('./windows/activationWindows');
const { createMainWindow, mainWindow } = require('./windowManager');

const productKeyService = new ProductKeyService();

class ActivationManager {
    constructor() {
        this.activationWindow = null;
        this.lastValidationDate = null;
        this.setupHandlers();
    }

    setupHandlers() {
        // Manejar éxito de activación
        ipcMain.on('activation-success', async () => {
            console.log('Activación exitosa recibida');
            await this.handleActivationSuccess();
        });

        // Manejar solicitud de verificación de estado
        ipcMain.handle('check-activation-status', async () => {
            return await this.shouldValidateKey();
        });
    }

    async shouldValidateKey() {
        // Verificar si ya validamos hoy
        const today = new Date().toDateString();
        if (this.lastValidationDate === today) {
            console.log('Ya se validó la clave hoy, usando estado almacenado');
            return productKeyService.getStoredKeyInfo().then(info => info.validated);
        }

        // Si no se ha validado hoy, hacer la validación
        console.log('Validando clave (primera vez hoy)');
        const isValid = await productKeyService.isKeyValidated();
        this.lastValidationDate = today;
        return isValid;
    }

    async handleActivationSuccess() {
        try {
            // Cerrar ventana de activación si está abierta
            if (this.activationWindow) {
                this.activationWindow.close();
                this.activationWindow = null;
            }

            // Verificar que la clave sea válida
            const isValid = await productKeyService.isKeyValidated();
            if (isValid) {
                console.log('Clave validada correctamente, abriendo aplicación principal');
                this.lastValidationDate = new Date().toDateString();
                createMainWindow();
            } else {
                console.log('La clave no es válida después de la activación');
                this.showActivationError('La activación no fue completada correctamente');
            }
        } catch (error) {
            console.error('Error manejando éxito de activación:', error);
            this.showActivationError('Error al procesar la activación');
        }
    }

    async verifyOnStartup() {
        try {
            console.log('Verificando activación al inicio...');
            await productKeyService.init();
            const isValid = await this.shouldValidateKey();
            
            if (isValid) {
                console.log('Activación válida, iniciando aplicación principal');
                createMainWindow();
                return true;
            } else {
                console.log('Activación requerida, mostrando ventana de activación');
                this.showActivationWindow();
                return false;
            }
        } catch (error) {
            console.error('Error en verificación de inicio:', error);
            this.showActivationWindow();
            return false;
        }
    }

    showActivationWindow() {
        try {
            console.log('Mostrando ventana de activación...');
            this.activationWindow = createActivationWindow(null);
            
            this.activationWindow.on('closed', () => {
                console.log('Ventana de activación cerrada');
                this.activationWindow = null;
                
                // Verificar si se activó durante la sesión
                this.checkActivationAfterWindowClose();
            });

            this.activationWindow.on('ready-to-show', () => {
                this.activationWindow.show();
            });

            return this.activationWindow;
        } catch (error) {
            console.error('Error mostrando ventana de activación:', error);
            this.showActivationError('No se pudo abrir la ventana de activación');
            return null;
        }
    }

    async checkActivationAfterWindowClose() {
        try {
            const isValid = await this.shouldValidateKey();
            if (isValid) {
                console.log('Activación completada después de cerrar ventana');
                createMainWindow();
            } else {
                console.log('Usuario cerró ventana sin activar');
                this.promptRetryOrExit();
            }
        } catch (error) {
            console.error('Error verificando activación:', error);
            this.promptRetryOrExit();
        }
    }

    async promptRetryOrExit() {
        const result = await dialog.showMessageBox({
            type: 'question',
            buttons: ['Reintentar Activación', 'Salir'],
            title: 'Activación Requerida',
            message: 'Debe activar el producto para continuar. ¿Desea reintentar?',
            defaultId: 0,
            cancelId: 1
        });

        if (result.response === 0) {
            this.showActivationWindow();
        } else {
            app.quit();
        }
    }

    showActivationError(message) {
        dialog.showErrorBox('Error de Activación', message);
        this.showActivationWindow();
    }

    // Para verificación periódica (una vez al día)
    startPeriodicVerification() {
        this.verificationInterval = setInterval(async () => {
            try {
                const isValid = await productKeyService.isKeyValidated();
                if (!isValid) {
                    const { BrowserWindow } = require('electron');
                    const mainWindow = BrowserWindow.getFocusedWindow();
                    
                    if (mainWindow) {
                        mainWindow.webContents.send('product-key-expired');
                    }
                }
                this.lastValidationDate = new Date().toDateString();
            } catch (error) {
                console.error('Periodic verification error:', error);
            }
        }, 24 * 60 * 60 * 1000); // 24 horas
    }

    stopPeriodicVerification() {
        if (this.verificationInterval) {
            clearInterval(this.verificationInterval);
            this.verificationInterval = null;
        }
    }
}

module.exports = ActivationManager;