const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('activationAPI', {
  validateProductKey: (productKey) => 
    ipcRenderer.invoke('validate-product-key', productKey),
  
  notifyActivationSuccess: () => {
    console.log('Notificando éxito de activación...');
    ipcRenderer.send('activation-success');
  },
  
  checkActivationStatus: () => 
    ipcRenderer.invoke('check-activation-status'),
  
  onActivationSuccess: (callback) => 
    ipcRenderer.on('activation-success', callback),
  
  onActivationError: (callback) => 
    ipcRenderer.on('activation-error', callback),
  
  removeAllListeners: (channel) => {
    ipcRenderer.removeAllListeners(channel);
  }
});