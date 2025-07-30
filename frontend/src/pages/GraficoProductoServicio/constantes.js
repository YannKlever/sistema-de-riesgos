export const COLUMNAS_REPORTE_PRODUCTOS = [
    { id: 'oficina', nombre: 'Oficina' },
    { id: 'codigo', nombre: 'Código' },
    { id: 'nombre', nombre: 'Nombre' },
    { id: 'descripcion', nombre: 'Descripción' },
    { id: 'categoria', nombre: 'Categoría' },
    { id: 'tipo', nombre: 'Tipo' },
    { id: 'moneda', nombre: 'Moneda' },
    { id: 'producto_servicio', nombre: 'Producto/Servicio' },
    { id: 'riesgo_producto', nombre: 'Riesgo Producto/Servicio' },
    { id: 'riesgo_producto_numerico', nombre: 'Riesgo Producto (Numérico)' },
    { id: 'riesgo_cliente', nombre: 'Riesgo Tipo Cliente' },
    { id: 'riesgo_cliente_numerico', nombre: 'Riesgo Cliente (Numérico)' },
    { id: 'riesgoFactorZonaGeografica', nombre: 'Riesgo Zona Geográfica' },
    { id: 'riesgoFactorCanalDistribucion', nombre: 'Riesgo Canal Distribución' },
    { id: 'riesgoFactorOperaciones', nombre: 'Riesgo Operaciones' },
    { id: 'riesgoFactorTecnologia', nombre: 'Riesgo Tecnología' },
    { id: 'riesgoFactorProveedores', nombre: 'Riesgo Proveedores' },
    { id: 'riesgoFactorRegulatorio', nombre: 'Riesgo Regulatorio' },
    { id: 'riesgoFactorProductosServicios', nombre: 'Factor de Riesgo Total' }
];

export const COLUMNAS_NUMERICAS_PRODUCTOS = [
    ...COLUMNAS_REPORTE_PRODUCTOS.filter(col => col.id.endsWith('_numerico')),
    { id: 'riesgoFactorZonaGeografica', nombre: 'Riesgo Zona Geográfica' },
    { id: 'riesgoFactorCanalDistribucion', nombre: 'Riesgo Canal Distribución' },
    { id: 'riesgoFactorOperaciones', nombre: 'Riesgo Operaciones' },
    { id: 'riesgoFactorTecnologia', nombre: 'Riesgo Tecnología' },
    { id: 'riesgoFactorProveedores', nombre: 'Riesgo Proveedores' },
    { id: 'riesgoFactorRegulatorio', nombre: 'Riesgo Regulatorio' },
    { id: 'riesgoFactorProductosServicios', nombre: 'Factor de Riesgo Total' }
];

// Niveles de riesgo consistentes
export const NIVELES_RIESGO_PRODUCTOS = [
    { nivel: 1, nombre: 'Mínimo', color: '#228B22', descripcion: 'Riesgo muy bajo, controles adecuados' },
    { nivel: 2, nombre: 'Bajo', color: '#9ACD32', descripcion: 'Riesgo bajo, controles generalmente efectivos' },
    { nivel: 3, nombre: 'Moderado', color: '#FFD700', descripcion: 'Riesgo moderado, requiere monitoreo adicional' },
    { nivel: 4, nombre: 'Alto', color: '#FF8C00', descripcion: 'Riesgo alto, necesita controles reforzados' },
    { nivel: 5, nombre: 'Crítico', color: '#FF0000', descripcion: 'Riesgo muy alto, requiere acción inmediata' }
];

// Categorías de factores de riesgo
export const CATEGORIAS_RIESGO_PRODUCTOS = {
    PRODUCTO: 'Riesgo Producto/Servicio',
    CLIENTE: 'Riesgo Tipo Cliente',
    ZONA: 'Riesgo Zona Geográfica',
    CANAL: 'Riesgo Canal Distribución',
    OPERACIONES: 'Riesgo Operaciones',
    TECNOLOGIA: 'Riesgo Tecnología',
    PROVEEDORES: 'Riesgo Proveedores',
    REGULATORIO: 'Riesgo Regulatorio'
};