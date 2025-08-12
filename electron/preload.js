const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    //Tabla clientes externos
    crearCliente: (data) => ipcRenderer.invoke('crear-cliente', data),
    listarClientesExternos: () => ipcRenderer.invoke('listar-clientes-externos'),
    listarClientesConAlertas: () => ipcRenderer.invoke('listar-clientes-con-alertas'),
    crearClienteExterno: (cliente) => ipcRenderer.invoke('crear-cliente-externo', cliente),
    eliminarClienteExterno: (id) => ipcRenderer.invoke('eliminar-cliente-externo', id),
    actualizarClienteExterno: (id, data) => ipcRenderer.invoke('actualizar-cliente-externo', id, data),
    bulkCreateClientesExternos: (data) => ipcRenderer.invoke('bulk-create-clientes-externos', data),
    // Nuevos métodos
    listarClientesExternosConRiesgoInterno: () => ipcRenderer.invoke('listar-clientes-externos-con-riesgo-interno'),
    listarClientesExternosConRiesgoProductoServicio: () => ipcRenderer.invoke('listar-clientes-externos-con-riesgo-producto-servicio'),
    vincularClienteInterno: (idClienteExterno, idClienteInterno) =>
        ipcRenderer.invoke('vincular-cliente-interno', idClienteExterno, idClienteInterno),
    //Tabla accionistas socios
    crearAccionistaSocio: (data) => ipcRenderer.invoke('crear-accionista-socio', data),
    listarAccionistasSocios: () => ipcRenderer.invoke('listar-accionistas-socios'),
    obtenerAccionistaSocio: (id) => ipcRenderer.invoke('obtener-accionista-socio', id),
    actualizarAccionistaSocio: (id, data) => ipcRenderer.invoke('actualizar-accionista-socio', id, data),
    eliminarAccionistaSocio: (id) => ipcRenderer.invoke('eliminar-accionista-socio', id),
    bulkCreateAccionistasSocios: (data) => ipcRenderer.invoke('bulk-create-accionistas-socios', data),
    //Tabla evaluacion LDTF
    crearEvaluacionRiesgoLDFT: (data) => ipcRenderer.invoke('crear-evaluacion-riesgo-ld-ft', data),
    listarEvaluacionesRiesgoLDFT: () => ipcRenderer.invoke('listar-evaluaciones-riesgo-ld-ft'),
    actualizarEvaluacionRiesgoLDFT: (id, data) => ipcRenderer.invoke('actualizar-evaluacion-riesgo-ld-ft', { id, data }),
    //Table clientes internos
    crearClienteInterno: (data) => ipcRenderer.invoke('crear-cliente-interno', data),
    listarClientesInternos: () => ipcRenderer.invoke('listar-clientes-internos'),
    obtenerClienteInterno: (id) => ipcRenderer.invoke('obtener-cliente-interno', id),
    actualizarClienteInterno: (id, data) => ipcRenderer.invoke('actualizar-cliente-interno', id, data),
    eliminarClienteInterno: (id) => ipcRenderer.invoke('eliminar-cliente-interno', id),
    bulkCreateClientesInternos: (data) => ipcRenderer.invoke('bulk-create-clientes-internos', data),
    //Tabla producto servicio
    crearProductoServicio: (data) => ipcRenderer.invoke('crear-producto-servicio', data),
    listarProductosServicios: () => ipcRenderer.invoke('listar-productos-servicios'),
    obtenerProductoServicio: (id) => ipcRenderer.invoke('obtener-producto-servicio', id),
    actualizarProductoServicio: (id, data) => ipcRenderer.invoke('actualizar-producto-servicio', id, data),
    bulkCreateProductosServicios: (data) => ipcRenderer.invoke('bulk-create-productos-servicios', data),

    obtenerRiesgoZona: (oficina) => ipcRenderer.invoke('obtener-riesgo-zona', oficina),
    obtenerRiesgoCanal: (oficina) => ipcRenderer.invoke('obtener-riesgo-canal', oficina),
    eliminarProductoServicio: (id) => ipcRenderer.invoke('eliminar-producto-servicio', id),
    //Tabla sucursal
    crearSucursal: (data) => ipcRenderer.invoke('crear-sucursal', data),
    listarSucursales: () => ipcRenderer.invoke('listar-sucursales'),
    obtenerSucursal: (id) => ipcRenderer.invoke('obtener-sucursal', id),
    actualizarSucursal: (id, data) => ipcRenderer.invoke('actualizar-sucursal', id, data),

    bulkCreateSucursales: (data) => ipcRenderer.invoke('bulk-create-sucursales', data),
    eliminarSucursal: (id) => ipcRenderer.invoke('eliminar-sucursal', id),
    //Tabla usuarios
    crearUsuario: (data) => ipcRenderer.invoke('crear-usuario', data),
    listarUsuarios: () => ipcRenderer.invoke('listar-usuarios'),
    obtenerUsuario: (id) => ipcRenderer.invoke('obtener-usuario', id),
    actualizarUsuario: (id, data) => ipcRenderer.invoke('actualizar-usuario', id, data),
    eliminarUsuario: (id) => ipcRenderer.invoke('eliminar-usuario', id),
    verificarCredenciales: (email, password) => ipcRenderer.invoke('verificar-credenciales', email, password)
});
