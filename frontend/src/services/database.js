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


    // Nuevo método para listar con riesgo interno
    async listarClientesExternosConRiesgoInterno() {
        if (!window.electronAPI) throw new Error('API no disponible');
        return window.electronAPI.listarClientesExternosConRiesgoInterno();
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



    //metodos para usuarios
     async crearUsuario(data) {
    if (!window.electronAPI) throw new Error('API no disponible');
    return window.electronAPI.crearUsuario(data);
  },

  async listarUsuarios() {
    if (!window.electronAPI) throw new Error('API no disponible');
    return window.electronAPI.listarUsuarios();
  },

  async obtenerUsuario(id) {
    if (!window.electronAPI) throw new Error('API no disponible');
    return window.electronAPI.obtenerUsuario(id);
  },

  async actualizarUsuario(id, data) {
    if (!window.electronAPI) throw new Error('API no disponible');
    return window.electronAPI.actualizarUsuario(id, data);
  },

  async eliminarUsuario(id) {
    if (!window.electronAPI) throw new Error('API no disponible');
    return window.electronAPI.eliminarUsuario(id);
  },

  async verificarCredenciales(email, password) {
    if (!window.electronAPI) throw new Error('API no disponible');
    return window.electronAPI.verificarCredenciales(email, password);
  }

};


