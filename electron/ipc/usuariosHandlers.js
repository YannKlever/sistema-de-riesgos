const User = require('../../backend/src/models/User');

function setupUsuariosHandlers(ipcMain) {
    ipcMain.handle('crear-usuario', async (_, data) => {
  try {
    console.log('IPC crear-usuario - Datos recibidos:', data);
    
    const resultado = await User.crear(data);
    
    console.log('IPC crear-usuario - Resultado:', resultado);
    return {
      success: resultado.success,
      id: resultado.id,
      changes: resultado.changes
    };
  } catch (error) {
    console.error('IPC crear-usuario - Error:', error);
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



          // metodo para verificar estado inicial si hay datos en la tabla
      ipcMain.handle('verificar-estado-inicial', async () => {
          try {
              const resultado = await User.verificarEstadoInicial();
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
    
    if (resultado.success) {
      console.log('Login exitoso - Datos del usuario:', resultado.data);
      
      // Asegurar compatibilidad con el frontend
      const userData = {
        id: resultado.data.id,
        nombre: resultado.data.nombre,
        name: resultado.data.nombre, 
        email: resultado.data.email,
        rol: resultado.data.rol,
        role: resultado.data.rol    
      };
      
      return {
        success: true,
        data: userData
      };
    } else {
      return resultado;
    }
  } catch (error) {
    console.error('Error en verificar-credenciales:', error);
    return { success: false, error: error.message };
  }
});
}

module.exports = setupUsuariosHandlers;