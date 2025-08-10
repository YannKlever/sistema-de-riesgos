// constantes.js
export const COLUMNAS_REPORTE_PRODUCTOS = [
    { id: 'oficina', nombre: 'Oficina' },
    { id: 'producto_servicio', nombre: 'Producto/Servicio' },
    { id: 'riesgo_producto', nombre: 'Riesgo Producto/Servicio' },
    { id: 'riesgo_producto_numerico', nombre: 'Riesgo Producto (Numérico)' },
    { id: 'riesgo_cliente', nombre: 'Riesgo Tipo Cliente' },
    { id: 'riesgo_cliente_numerico', nombre: 'Riesgo Cliente (Numérico)' },
    { id: 'riesgoFactorZonaGeografica', nombre: 'Riesgo Zona Geográfica' },
    { id: 'probabilidad', nombre: 'Probabilidad', tipo: 'numero' },
    { id: 'impacto', nombre: 'Impacto', tipo: 'numero' },
    { id: 'riesgoFactorProductosServicios', nombre: 'Factor Riesgo Productos/Servicios', tipo: 'numero' }
];

export const COLUMNAS_NUMERICAS_PRODUCTOS = [
    'riesgo_producto_numerico',
    'riesgo_cliente_numerico',
    'riesgoFactorZonaGeografica'
];