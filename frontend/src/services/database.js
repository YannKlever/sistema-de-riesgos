// Verificar Electron
const isElectron = () => {
    return !!(window && window.process && window.process.versions && window.process.versions.electron);
};

// Función para manejar errores de conexión
const handleConnectionError = (error) => {
    console.error('Error de conexión con la base de datos:', error);
    return {
        success: false,
        error: 'Error de conexión con la base de datos. Por favor, verifique que la aplicación esté funcionando correctamente.'
    };
};

// Función para sanitizar datos antes de enviarlos
const sanitizeData = (data) => {
    if (typeof data !== 'object' || data === null) return data;

    const sanitized = {};
    Object.keys(data).forEach(key => {
        if (typeof data[key] === 'string') {
            sanitized[key] = data[key].trim().replace(/[<>]/g, '');
            if (sanitized[key].length > 255) {
                sanitized[key] = sanitized[key].substring(0, 255);
            }
        } else {
            sanitized[key] = data[key];
        }
    });

    return sanitized;
};

// Función para verificar y esperar electronAPI
const ensureElectronAPI = () => {
    return new Promise((resolve, reject) => {
        if (window.electronAPI) {
            resolve(window.electronAPI);
            return;
        }

        // Intentar esperar a que electronAPI esté disponible
        let attempts = 0;
        const checkAPI = () => {
            attempts++;
            if (window.electronAPI) {
                resolve(window.electronAPI);
            } else if (attempts < 10) {
                setTimeout(checkAPI, 100);
            } else {
                reject(new Error('Electron API no disponible después de 10 intentos'));
            }
        };

        setTimeout(checkAPI, 100);
    });
};
export const databaseService = {
    // Métodos existentes para Clientes Externos
    async crearCliente(data) {
        if (!window.electronAPI) throw new Error('API no disponible');
        return window.electronAPI.crearCliente(data);
    },

    async listarClientesExternos() {
        if (!window.electronAPI) throw new Error('API no disponible');
        return window.electronAPI.listarClientesExternos();
    },

    async actualizarClienteExterno(id, data) {
        if (!window.electronAPI) throw new Error('API no disponible');
        return window.electronAPI.actualizarClienteExterno(id, data);
    },

    // Método para importación masiva de clientes externos
    async importarClientesExternos(data) {
        if (!window.electronAPI) {
            console.error('Electron API no disponible');
            throw new Error('API no disponible');
        }
        try {
            const resultado = await window.electronAPI.bulkCreateClientesExternos(data);
            return {
                success: resultado.success,
                count: resultado.count,
                errors: resultado.errors,
                message: resultado.message || 'Importación completada'
            };
        } catch (error) {
            console.error('Error en importación de clientes externos:', error);
            return {
                success: false,
                error: error.message || 'Error desconocido al importar',
                details: error.details || null
            };
        }
    },

    async listarClientesConAlertas() {
        if (!window.electronAPI) throw new Error('API no disponible');
        return window.electronAPI.listarClientesConAlertas();
    },

    // Nuevo método para listar con riesgo interno
    async listarClientesExternosConRiesgoInterno() {
        if (!window.electronAPI) throw new Error('API no disponible');
        return window.electronAPI.listarClientesExternosConRiesgoInterno();
    },

    //metodo para listar con producto servicio
    async listarClientesExternosConRiesgoProductoServicio() {
        if (!window.electronAPI) throw new Error('API no disponible');
        return window.electronAPI.listarClientesExternosConRiesgoProductoServicio();
    },

    async crearClienteExterno(cliente) {
        if (!window.electronAPI) throw new Error('API no disponible');
        return window.electronAPI.crearClienteExterno(cliente);
    },

    async eliminarClienteExterno(id) {
        if (!window.electronAPI) throw new Error('API no disponible');
        return window.electronAPI.eliminarClienteExterno(id);
    },

    // Método para vincular cliente interno
    async vincularClienteInterno(idClienteExterno, idClienteInterno) {
        if (!window.electronAPI) throw new Error('API no disponible');
        return window.electronAPI.vincularClienteInterno(idClienteExterno, idClienteInterno);
    },

    // Métodos existentes para Accionistas/Socios
    async crearAccionistaSocio(data) {
        if (!window.electronAPI) throw new Error('API no disponible');
        return window.electronAPI.crearAccionistaSocio(data);
    },

    async listarAccionistasSocios() {
        if (!window.electronAPI) throw new Error('API no disponible');
        return window.electronAPI.listarAccionistasSocios();
    },

    async obtenerAccionistaSocio(id) {
        if (!window.electronAPI) throw new Error('API no disponible');
        return window.electronAPI.obtenerAccionistaSocio(id);
    },

    async actualizarAccionistaSocio(id, data) {
        if (!window.electronAPI) throw new Error('API no disponible');
        return window.electronAPI.actualizarAccionistaSocio(id, data);
    },

    async eliminarAccionistaSocio(id) {
        if (!window.electronAPI) throw new Error('API no disponible');
        return window.electronAPI.eliminarAccionistaSocio(id);
    },

    async importarAccionistasSocios(data) {
        if (!window.electronAPI) {
            console.error('Electron API no disponible');
            throw new Error('API no disponible');
        }
        return window.electronAPI.bulkCreateAccionistasSocios(data);
    },

    // Nuevos métodos para Clientes Internos
    async crearClienteInterno(data) {
        if (!window.electronAPI) throw new Error('API no disponible');
        return window.electronAPI.crearClienteInterno(data);
    },

    //importar
    async importarClientesInternos(data) {
        if (!window.electronAPI) {
            console.error('Electron API no disponible');
            throw new Error('API no disponible');
        }
        return window.electronAPI.bulkCreateClientesInternos(data);
    },

    async listarClientesInternos() {
        if (!window.electronAPI) {
            console.error('Electron API no disponible');
            throw new Error('API no disponible');
        }
        console.log('Solicitando clientes internos...');
        const resultado = await window.electronAPI.listarClientesInternos();
        console.log('Respuesta:', resultado);
        return resultado;
    },

    async obtenerClienteInterno(id) {
        if (!window.electronAPI) throw new Error('API no disponible');
        return window.electronAPI.obtenerClienteInterno(id);
    },

    async actualizarClienteInterno(id, data) {
        if (!window.electronAPI) throw new Error('API no disponible');
        return window.electronAPI.actualizarClienteInterno(id, data);
    },

    async eliminarClienteInterno(id) {
        if (!window.electronAPI) throw new Error('API no disponible');
        return window.electronAPI.eliminarClienteInterno(id);
    },

    // Métodos para Productos/Servicios
    async crearProductoServicio(data) {
        if (!window.electronAPI) {
            console.error('Electron API no disponible');
            return { success: false, error: 'API no disponible' };
        }
        try {
            const resultado = await window.electronAPI.crearProductoServicio(data);
            return { success: true, id: resultado.id, data: resultado };
        } catch (error) {
            console.error('Error al crear producto/servicio:', error);
            return { success: false, error: error.message };
        }
    },

    async listarProductosServicios() {
        if (!window.electronAPI) {
            console.error('Electron API no disponible');
            return { success: false, error: 'API no disponible', data: [] };
        }
        try {
            const resultado = await window.electronAPI.listarProductosServicios();
            return { success: true, data: resultado.data || resultado };
        } catch (error) {
            console.error('Error al listar productos/servicios:', error);
            return { success: false, error: error.message, data: [] };
        }
    },

    async actualizarProductoServicio(id, data) {
        if (!window.electronAPI) {
            console.error('Electron API no disponible');
            return { success: false, error: 'API no disponible' };
        }
        try {
            const resultado = await window.electronAPI.actualizarProductoServicio(id, data);
            return { success: true, changes: resultado.changes };
        } catch (error) {
            console.error('Error al actualizar producto/servicio:', error);
            return { success: false, error: error.message };
        }
    },

    async eliminarProductoServicio(id) {
        if (!window.electronAPI) {
            console.error('Electron API no disponible');
            return { success: false, error: 'API no disponible' };
        }
        try {
            const resultado = await window.electronAPI.eliminarProductoServicio(id);
            return { success: true, changes: resultado.changes };
        } catch (error) {
            console.error('Error al eliminar producto/servicio:', error);
            return { success: false, error: error.message };
        }
    },

    /// importar
    async importarProductosServicios(data) {
        if (!window.electronAPI) {
            console.error('Electron API no disponible');
            throw new Error('API no disponible');
        }
        return window.electronAPI.bulkCreateProductosServicios(data);
    },

    // Nuevos métodos para obtener riesgos específicos
    async obtenerRiesgoZonaGeografica(oficina) {
        if (!window.electronAPI) {
            console.error('Electron API no disponible');
            return { success: false, error: 'API no disponible', data: 0 };
        }
        try {
            const resultado = await window.electronAPI.obtenerRiesgoZona(oficina);
            return {
                success: true,
                data: resultado.success ? resultado.data : 0
            };
        } catch (error) {
            console.error('Error al obtener riesgo zona geográfica:', error);
            return { success: false, error: error.message, data: 0 };
        }
    },

    async obtenerRiesgoCanalDistribucion(oficina) {
        if (!window.electronAPI) {
            console.error('Electron API no disponible');
            return { success: false, error: 'API no disponible', data: 0 };
        }
        try {
            const resultado = await window.electronAPI.obtenerRiesgoCanal(oficina);
            return {
                success: true,
                data: resultado.success ? resultado.data : 0
            };
        } catch (error) {
            console.error('Error al obtener riesgo canal distribución:', error);
            return { success: false, error: error.message, data: 0 };
        }
    },

    // Métodos para Evaluaciones LD/FT
    async crearEvaluacionLDFT(data) {
        if (!window.electronAPI) {
            console.error('Electron API no disponible');
            return { success: false, error: 'API no disponible' };
        }
        try {
            const resultado = await window.electronAPI.crearEvaluacionRiesgoLDFT(data);
            return { success: true, id: resultado.id, data: resultado };
        } catch (error) {
            console.error('Error al crear evaluación LD/FT:', error);
            return { success: false, error: error.message };
        }
    },

    async listarEvaluacionesLDFT() {
        if (!window.electronAPI) {
            console.error('Electron API no disponible');
            return { success: false, error: 'API no disponible', data: [] };
        }
        try {
            const resultado = await window.electronAPI.listarEvaluacionesRiesgoLDFT();
            return { success: true, data: resultado.data || resultado };
        } catch (error) {
            console.error('Error al listar evaluaciones LD/FT:', error);
            return { success: false, error: error.message, data: [] };
        }
    },

    async actualizarEvaluacionLDFT(id, data) {
        if (!window.electronAPI) {
            console.error('Electron API no disponible');
            return { success: false, error: 'API no disponible' };
        }
        try {
            const resultado = await window.electronAPI.actualizarEvaluacionRiesgoLDFT(id, data);
            return { success: true, changes: resultado.changes };
        } catch (error) {
            console.error('Error al actualizar evaluación LD/FT:', error);
            return { success: false, error: error.message };
        }
    },

    async eliminarEvaluacionLDFT(id) {
        if (!window.electronAPI) {
            console.error('Electron API no disponible');
            return { success: false, error: 'API no disponible' };
        }
        try {
            const resultado = await window.electronAPI.eliminarEvaluacionRiesgoLDFT(id);
            return { success: true, changes: resultado.changes };
        } catch (error) {
            console.error('Error al eliminar evaluación LD/FT:', error);
            return { success: false, error: error.message };
        }
    },

    // Métodos para Sucursales
    async crearSucursal(data) {
        if (!window.electronAPI) {
            console.error('Electron API no disponible');
            return { success: false, error: 'API no disponible' };
        }
        try {
            const resultado = await window.electronAPI.crearSucursal(data);
            return {
                success: true,
                id: resultado.id,
                changes: resultado.changes
            };
        } catch (error) {
            console.error('Error al crear sucursal:', error);
            return { success: false, error: error.message };
        }
    },

    //importar
    async importarSucursales(data) {
        if (!window.electronAPI) {
            console.error('Electron API no disponible');
            throw new Error('API no disponible');
        }
        return window.electronAPI.bulkCreateSucursales(data);
    },

    async listarSucursales() {
        if (!window.electronAPI) {
            console.error('Electron API no disponible');
            return { success: false, error: 'API no disponible', data: [] };
        }
        try {
            const resultado = await window.electronAPI.listarSucursales();
            return {
                success: true,
                data: resultado.data || resultado // Compatibilidad con ambos formatos
            };
        } catch (error) {
            console.error('Error al listar sucursales:', error);
            return { success: false, error: error.message, data: [] };
        }
    },

    async obtenerSucursal(id) {
        if (!window.electronAPI) {
            console.error('Electron API no disponible');
            return { success: false, error: 'API no disponible' };
        }
        try {
            const resultado = await window.electronAPI.obtenerSucursal(id);
            return {
                success: true,
                data: resultado.data || resultado
            };
        } catch (error) {
            console.error('Error al obtener sucursal:', error);
            return { success: false, error: error.message };
        }
    },

    async actualizarSucursal(id, data) {
        if (!window.electronAPI) {
            console.error('Electron API no disponible');
            return { success: false, error: 'API no disponible' };
        }
        try {
            const resultado = await window.electronAPI.actualizarSucursal(id, data);
            return {
                success: true,
                changes: resultado.changes
            };
        } catch (error) {
            console.error('Error al actualizar sucursal:', error);
            return { success: false, error: error.message };
        }
    },

    async eliminarSucursal(id) {
        if (!window.electronAPI) {
            console.error('Electron API no disponible');
            return { success: false, error: 'API no disponible' };
        }
        try {
            const resultado = await window.electronAPI.eliminarSucursal(id);
            return {
                success: true,
                changes: resultado.changes
            };
        } catch (error) {
            console.error('Error al eliminar sucursal:', error);
            return { success: false, error: error.message };
        }
    },

    async crearUsuario(data) {
        try {
            console.log('=== Crear Usuario - Datos recibidos en databaseService ===', data);

            const electronAPI = await ensureElectronAPI();
            const sanitizedData = sanitizeData(data);

            console.log('Datos sanitizados:', sanitizedData);
            console.log('Llamando a electronAPI.crearUsuario...');

            const resultado = await electronAPI.crearUsuario(sanitizedData);

            console.log('Resultado de electronAPI.crearUsuario:', resultado);
            return resultado;
        } catch (error) {
            console.error('Error completo en crearUsuario:', error);
            return handleConnectionError(error);
        }
    },

    async listarUsuarios() {
        try {
            console.log('=== Iniciando listarUsuarios ===');

            const electronAPI = await ensureElectronAPI();

            if (typeof electronAPI.listarUsuarios !== 'function') {
                throw new Error('Método listarUsuarios no disponible en electronAPI');
            }

            console.log('Llamando a electronAPI.listarUsuarios()...');
            const resultado = await electronAPI.listarUsuarios();
            console.log('Resultado recibido:', resultado);

            return resultado;
        } catch (error) {
            console.error('Error en listarUsuarios:', error);
            return handleConnectionError(error);
        }
    },

    async obtenerUsuario(id) {
        try {
            const electronAPI = await ensureElectronAPI();

            if (isNaN(id) || id <= 0) {
                return { success: false, error: 'ID de usuario inválido' };
            }

            return await electronAPI.obtenerUsuario(id);
        } catch (error) {
            console.error('Error en obtenerUsuario:', error);
            return handleConnectionError(error);
        }
    },

    async actualizarUsuario(id, data) {
        try {
            const electronAPI = await ensureElectronAPI();

            if (isNaN(id) || id <= 0) {
                return { success: false, error: 'ID de usuario inválido' };
            }

            const sanitizedData = sanitizeData(data);
            return await electronAPI.actualizarUsuario(id, sanitizedData);
        } catch (error) {
            console.error('Error en actualizarUsuario:', error);
            return handleConnectionError(error);
        }
    },

    async eliminarUsuario(id) {
        try {
            const electronAPI = await ensureElectronAPI();

            if (isNaN(id) || id <= 0) {
                return { success: false, error: 'ID de usuario inválido' };
            }

            if (id === 1) {
                return { success: false, error: 'No se puede eliminar el usuario administrador principal' };
            }

            return await electronAPI.eliminarUsuario(id);
        } catch (error) {
            console.error('Error en eliminarUsuario:', error);
            return handleConnectionError(error);
        }
    },

    async verificarCredenciales(email, password) {
        try {
            const electronAPI = await ensureElectronAPI();

            const sanitizedEmail = email.trim().toLowerCase();
            if (!sanitizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sanitizedEmail)) {
                return { success: false, error: 'Email inválido' };
            }

            if (!password || password.length < 1) {
                return { success: false, error: 'Contraseña requerida' };
            }

            return await electronAPI.verificarCredenciales(sanitizedEmail, password);
        } catch (error) {
            console.error('Error en verificarCredenciales:', error);
            return handleConnectionError(error);
        }
    },

    // Métodos adicionales de seguridad
    async cambiarPassword(userId, currentPassword, newPassword) {
        try {
            if (!isElectron() || !window.electronAPI) {
                throw new Error('API no disponible - La aplicación debe ejecutarse en Electron');
            }

            // Validar nueva contraseña
            if (!newPassword || newPassword.length < 8) {
                return { success: false, error: 'La nueva contraseña debe tener al menos 8 caracteres' };
            }

            // Primero verificar la contraseña actual
            const userResult = await this.obtenerUsuario(userId);
            if (!userResult.success) {
                return { success: false, error: 'Usuario no encontrado' };
            }

            const user = userResult.data;
            const verification = await this.verificarCredenciales(user.email, currentPassword);

            if (!verification.success) {
                return { success: false, error: 'La contraseña actual es incorrecta' };
            }

            // Actualizar con la nueva contraseña
            return await this.actualizarUsuario(userId, { password: newPassword });
        } catch (error) {
            return handleConnectionError(error);
        }
    },



    async reactivarUsuario(id) {
        try {
            if (!isElectron() || !window.electronAPI) {
                throw new Error('API no disponible - La aplicación debe ejecutarse en Electron');
            }



            return await this.actualizarUsuario(id, { activo: 1, intentos_fallidos: 0 });
        } catch (error) {
            return handleConnectionError(error);
        }
    },


   // Métodos de backup
    async backupDatabase(backupPath) {
        if (!window.electronAPI) throw new Error('API no disponible');
        return window.electronAPI.backupDatabase(backupPath);
    },

    async restoreDatabase(backupFilePath) {
        if (!window.electronAPI) throw new Error('API no disponible');
        return window.electronAPI.restoreDatabase(backupFilePath);
    },

    async listBackups(directoryPath) {
        if (!window.electronAPI) throw new Error('API no disponible');
        return window.electronAPI.listBackups(directoryPath);
    },

    async selectDirectory() {
        if (!window.electronAPI) throw new Error('API no disponible');
        return window.electronAPI.selectDirectory();
    },
    // Métodos para Empresa
    async guardarEmpresa(datos) {
        if (!window.electronAPI) {
            console.error('Electron API no disponible');
            return { success: false, error: 'API no disponible' };
        }
        try {
            const resultado = await window.electronAPI.guardarEmpresa(datos);
            return resultado;
        } catch (error) {
            console.error('Error al guardar datos de la empresa:', error);
            return { success: false, error: error.message };
        }
    },
    async obtenerEmpresa() {
        if (window.electronAPI && window.electronAPI.obtenerEmpresa) {
            try {
                return await window.electronAPI.obtenerEmpresa();
            } catch (error) {
                console.error('Error al obtener datos de la empresa:', error);
                return { 
                    success: false, 
                    error: error.message,
                    data: null 
                };
            }
        } else {
            console.error('Electron API no disponible');
            return { 
                success: false, 
                error: 'API no disponible',
                data: null 
            };
        }
    }
};

export default databaseService;