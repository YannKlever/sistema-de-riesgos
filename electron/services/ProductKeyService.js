const { machineIdSync } = require('node-machine-id');
const axios = require('axios');

let Store;

async function initializeStore() {
  if (!Store) {
    const { default: ElectronStore } = await import('electron-store');
    Store = ElectronStore;
  }
  return new Store();
}

async function getDeviceId() {
  const store = await initializeStore();
  let deviceId = store.get('deviceId');
  if (!deviceId) {
    deviceId = machineIdSync();
    store.set('deviceId', deviceId);
  }
  return deviceId;
}

const API_BASE_URL = 'https://sistema-claves-producto-risk-9thf.vercel.app/api';

class ProductKeyService {
  constructor() {
    this.deviceId = null;
    this.store = null;
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    this.verificationInterval = null;
  }

  async init() {
    if (!this.store) {
      this.store = await initializeStore();
    }
    if (!this.deviceId) {
      this.deviceId = await getDeviceId();
    }
  }

  async validateProductKey(productKey) {
    try {
      await this.init();

      console.log('Enviando validación para clave:', productKey);
      console.log('Device ID:', this.deviceId);

      const response = await this.api.post('/keys/validate', {
        productKey,
        deviceId: this.deviceId
      });

      console.log('Respuesta del servidor:', response.data);

      if (response.data.valid) {
        this.store.set('productKey', productKey);
        this.store.set('keyValidated', true);
        this.store.set('keyValidationDate', new Date().toISOString());
        this.store.set('keyValidUntil', response.data.validUntil);

        return { success: true, data: response.data };
      } else {
        return {
          success: false,
          error: response.data.error || 'Clave no válida'
        };
      }
    } catch (error) {
      console.error('Error validating product key:', error);

      if (error.code === 'ECONNABORTED' || error.code === 'ENETUNREACH') {
        return {
          success: false,
          error: 'No se pudo conectar con el servidor de validación. Verifica tu conexión a internet.'
        };
      }

      return {
        success: false,
        error: error.response?.data?.error || 'Error de conexión con el servidor'
      };
    }
  }

  async isKeyValidated() {
    await this.init();

    const storedKey = this.store.get('productKey');
    const storedValidated = this.store.get('keyValidated');
    const lastValidationDate = this.store.get('keyValidationDate');

    // Si no hay clave almacenada, no está validada
    if (!storedKey || !storedValidated) {
      return false;
    }

    // Verificar si ya validamos hoy
    const today = new Date().toDateString();
    const lastValidationDay = lastValidationDate ? new Date(lastValidationDate).toDateString() : null;

    if (lastValidationDay === today) {
      console.log('Ya se validó la clave hoy, usando estado almacenado');
      return true;
    }

    try {
      //console.log('Verificando clave con servidor:', storedKey);
      const response = await this.api.post('/keys/check', {
        productKey: storedKey
      });

      //console.log('Respuesta de verificación:', response.data);

      if (response.data.valid) {
        this.store.set('keyValidationDate', new Date().toISOString());
        return true;
      } else {
        // Clave no válida, limpiar
        this.clearProductKey();
        return false;
      }
    } catch (error) {
      console.error('Error verifying product key with server:', error);

      // MANEJO ESPECÍFICO PARA ERROR 403 (CLAVE DESACTIVADA)
      if (error.response?.status === 403) {
        console.log('Clave desactivada en el servidor. Limpiando almacenamiento local.');
        this.clearProductKey();
        return false;
      }

      // Manejo de error mejorado
      if (error.response?.status === 404) {
        console.error('Endpoint no encontrado. Verifica la ruta de la API.');
        this.clearProductKey();
        return false;
      }

      if (lastValidationDate) {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        if (new Date(lastValidationDate) > sevenDaysAgo) {
          console.log('Usando clave validada previamente (modo offline por 7 días)');
          return true;
        }
      }

      // Si no hay conexión y la validación es vieja, requerir nueva activación
      this.clearProductKey();
      return false;
    }
  }

  startPeriodicVerification() {
    if (this.verificationInterval) {
      clearInterval(this.verificationInterval);
    }

    // Verificar una vez al día en lugar de cada hora
    this.verificationInterval = setInterval(async () => {
      try {
        const isValid = await this.isKeyValidated();
        if (!isValid) {
          const { BrowserWindow } = require('electron');
          const mainWindow = BrowserWindow.getFocusedWindow();

          if (mainWindow) {
            mainWindow.webContents.send('product-key-expired');
          }
        }
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

  async getStoredKeyInfo() {
    await this.init();
    return {
      productKey: this.store.get('productKey'),
      validated: this.store.get('keyValidated'),
      validationDate: this.store.get('keyValidationDate'),
      validUntil: this.store.get('keyValidUntil'),
      deviceId: this.deviceId
    };
  }

  async clearProductKey() {
    await this.init();
    this.store.delete('productKey');
    this.store.delete('keyValidated');
    this.store.delete('keyValidationDate');
    this.store.delete('keyValidUntil');
    this.stopPeriodicVerification();
    console.log('Clave de producto limpiada del almacenamiento local');
  }

  async checkProductKey(productKey) {
    try {
      const response = await this.api.post('/keys/check', {
        productKey
      });
      return response.data.valid || false;
    } catch (error) {
      console.error('Error checking product key:', error);
      return false;
    }
  }
}

module.exports = ProductKeyService;