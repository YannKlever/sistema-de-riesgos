import CryptoJS from 'crypto-js';

// Clave para encriptar datos sensibles en el almacenamiento de sesión
const STORAGE_KEY = 'risk_management_app_encryption_key';

// Función para generar/obtener clave de encriptación
const getEncryptionKey = () => {
  let key = sessionStorage.getItem(STORAGE_KEY);
  if (!key) {
    // Generar una clave segura si no existe
    key = CryptoJS.lib.WordArray.random(256 / 8).toString();
    sessionStorage.setItem(STORAGE_KEY, key);
  }
  return key;
};

// Función para encriptar datos
const encryptData = (data) => {
  const key = getEncryptionKey();
  return CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
};

// Función para desencriptar datos
const decryptData = (ciphertext) => {
  try {
    const key = getEncryptionKey();
    const bytes = CryptoJS.AES.decrypt(ciphertext, key);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedData);
  } catch (error) {
    console.error('Error desencriptando datos:', error);
    return null;
  }
};

export const login = async (credentials) => {
  try {
    if (!credentials.email || !credentials.password) {
      throw new Error('Email y contraseña son requeridos');
    }
    
    const sanitizedEmail = credentials.email.trim().toLowerCase();
    const sanitizedPassword = credentials.password.trim();
    
    if (!window.electronAPI) {
      throw new Error('API de Electron no disponible');
    }
    
    const response = await window.electronAPI.verificarCredenciales(sanitizedEmail, sanitizedPassword);
    
    if (response.success) {
      console.log('Respuesta del backend:', response.data);
      
      // Normalizar los datos del usuario
      const userData = {
        id: response.data.id,
        name: response.data.name || response.data.nombre,
        nombre: response.data.nombre || response.data.name,
        email: response.data.email,
        role: response.data.role || response.data.rol,
        rol: response.data.rol || response.data.role
      };
      
      // Crear objeto de sesión
      const sessionData = {
        user: userData,
        timestamp: Date.now(),
        expires: Date.now() + (24 * 60 * 60 * 1000) // 24 horas
      };
      
      const encryptedSession = encryptData(sessionData);
      sessionStorage.setItem('session', encryptedSession);
      
      return { success: true, user: userData };
    } else {
      throw new Error(response.error || 'Credenciales inválidas');
    }
  } catch (error) {
    console.error('Error en login:', error);
    throw new Error(error.message || 'Error en el proceso de autenticación');
  }
};

export const logout = () => {
  // Limpiar todos los datos de sesión
  sessionStorage.removeItem('session');
  sessionStorage.removeItem(STORAGE_KEY);
  console.log('Sesión cerrada y datos limpiados');
};

export const getToken = () => {
  const session = getSession();
  return session ? 'session-active' : null;
};

export const getSession = () => {
  try {
    const encryptedSession = sessionStorage.getItem('session');
    if (!encryptedSession) {
      console.log('No se encontró sesión en sessionStorage');
      return null;
    }
    
    const session = decryptData(encryptedSession);
    
    // Verificar si la sesión ha expirado
    if (session && session.expires > Date.now()) {
      return session;
    } else {
      console.log('Sesión expirada, realizando logout');
      logout();
      return null;
    }
  } catch (error) {
    console.error('Error obteniendo sesión:', error);
    logout();
    return null;
  }
};

export const isAuthenticated = async () => {
  const session = getSession();
  return !!session;
};

export const getCurrentUser = () => {
  try {
    const encryptedSession = sessionStorage.getItem('session');
    if (!encryptedSession) {
      console.log('No hay sesión en sessionStorage');
      return null;
    }
    
    const session = decryptData(encryptedSession);
    
    if (session && session.expires > Date.now()) {
      console.log('Usuario actual desde sesión:', session.user);
      return session.user;
    } else {
      console.log('Sesión expirada');
      logout();
      return null;
    }
  } catch (error) {
    console.error('Error obteniendo usuario actual:', error);
    logout();
    return null;
  }
};

// Función para cambiar contraseña
export const changePassword = async (currentPassword, newPassword) => {
  try {
    const user = getCurrentUser();
    if (!user) throw new Error('Usuario no autenticado');
    
    // Verificar contraseña actual
    if (!window.electronAPI) {
      throw new Error('API de Electron no disponible');
    }
    
    const verification = await window.electronAPI.verificarCredenciales(user.email, currentPassword);
    if (!verification.success) {
      throw new Error('La contraseña actual es incorrecta');
    }
    
    // Actualizar contraseña
    const updateResult = await window.electronAPI.actualizarUsuario(user.id, { 
      password: newPassword 
    });
    
    if (!updateResult.success) {
      throw new Error(updateResult.error || 'Error al cambiar la contraseña');
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error cambiando contraseña:', error);
    throw new Error(error.message || 'Error al cambiar la contraseña');
  }
};

// Función para limpiar completamente toda la sesión (para uso en desarrollo)
export const forceCleanup = () => {
  sessionStorage.clear();
  console.log('Limpieza forzada de sessionStorage completada');
};