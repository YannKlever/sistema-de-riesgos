export const COLUMNAS_REPORTE_PRODUCTOS = [
    { id: 'oficina', nombre: 'Oficina' },
    { id: 'producto_servicio', nombre: 'Producto/Servicio' },
    { id: 'riesgo_producto', nombre: 'Riesgo Producto/Servicio' },
    { id: 'riesgo_producto_numerico', nombre: 'Riesgo Producto (Numérico)' },
    { id: 'riesgo_cliente', nombre: 'Riesgo Tipo Cliente' },
    { id: 'riesgo_cliente_numerico', nombre: 'Riesgo Cliente (Numérico)' },
    { id: 'riesgoFactorZonaGeografica', nombre: 'Riesgo Zona Geográfica' },
    { id: 'riesgoFactorCanalDistribucion', nombre: 'Riesgo Canal Distribución' }
];

export const COLUMNAS_NUMERICAS_PRODUCTOS = [
    ...COLUMNAS_REPORTE_PRODUCTOS.filter(col => col.id.endsWith('_numerico')),
    { id: 'riesgoFactorZonaGeografica', nombre: 'Riesgo Zona Geográfica' },
    { id: 'riesgoFactorCanalDistribucion', nombre: 'Riesgo Canal Distribución' }
];