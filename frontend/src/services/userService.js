// services/userService.js
export const getUsers = async () => {
  try {
    // Implementa tu llamada API real aquí
    const response = await fetch('/api/users');
    const data = await response.json();
    return data.users || [];
  } catch (error) {
    throw new Error('Error al obtener usuarios');
  }
};