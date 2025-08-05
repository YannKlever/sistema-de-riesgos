export const COLUMNAS_PRODUCTOS_SERVICIOS = [
    { id: 'id', nombre: 'ID', visible: true },
    { id: 'fecha_registro', nombre: 'Fecha Registro', visible: true },
    { id: 'producto_servicio', nombre: 'Producto/Servicio', visible: true },
    { id: 'riesgo_producto', nombre: 'Riesgo Producto/Servicio', visible: true },
    { id: 'riesgo_producto_numerico', nombre: 'Riesgo Producto/Servicio Numérico', visible: false },
    { id: 'riesgo_cliente', nombre: 'Riesgo Cliente', visible: true },
    { id: 'riesgo_cliente_numerico', nombre: 'Riesgo Cliente Numérico', visible: false },
    { id: 'promedio_riesgo_producto_servicio', nombre: 'Promedio Riesgo', visible: true },
    { id: 'oficina', nombre: 'Oficina', visible: true },
    
    { id: 'observaciones', nombre: 'Observaciones', visible: true },
    { id: 'promedio_riesgo_producto_servicio', nombre: 'Promedio Riesgo', visible: true },
];

export const DEFAULT_COLUMNAS_PRODUCTOS = COLUMNAS_PRODUCTOS_SERVICIOS.filter(col => col.visible);

export const NIVELES_RIESGO = [
    { value: 'bajo', label: 'Bajo', valorNumerico: 1 },
    { value: 'medio bajo', label: 'Medio Bajo', valorNumerico: 2 },
    { value: 'medio', label: 'Medio', valorNumerico: 3 },
    { value: 'medio alto', label: 'Medio Alto', valorNumerico: 4 },
    { value: 'alto', label: 'Alto', valorNumerico: 5 }
];