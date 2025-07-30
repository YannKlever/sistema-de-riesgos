import api from './api';

export const login = async (credentials) => {
  try {
    // En producción, usar esta implementación real
    //const response = await api.post('/auth/login', credentials);
    /* localStorage.setItem('token', response.data.token);
    return response.data; */
    
    // Para testing temporal (comentar la implementación real y usar esta)
    localStorage.setItem('token', 'fake-token-valid');
    return { success: true };
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

export const logout = () => {
  localStorage.removeItem('token');
};

export const getToken = () => {
  return localStorage.getItem('token');
};

export const isAuthenticated = async () => {
  const token = getToken();
  if (!token) return false;

  try {
    // Verificación real con el backend
    const response = await api.get('/auth/validate', {
      headers: { Authorization: `Bearer ${token}` }
    });
   // return response.data.isValid;
    
    // Para testing temporal (comentar la validación real y usar esta)
     return token === 'fake-token-valid'; // Simula token válido
  } catch (error) {
    logout();
    return false;
  }
};