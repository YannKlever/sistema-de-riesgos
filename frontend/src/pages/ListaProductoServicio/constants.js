export const COLUMNAS_PRODUCTOS_SERVICIOS = [
    { id: 'id', nombre: 'ID', visible: false },
    { id: 'producto_servicio', nombre: 'Producto/Servicio', visible: true },
    { id: 'oficina', nombre: 'Oficina', visible: true }, // Nueva columna
    { id: 'riesgo_producto', nombre: 'Riesgo Producto', visible: true },
    { id: 'riesgo_cliente', nombre: 'Riesgo Cliente', visible: true },
    { id: 'fecha_registro', nombre: 'Fecha Registro', visible: true },
    { id: 'observaciones', nombre: 'Observaciones', visible: false }
];
export const DEFAULT_COLUMNAS_PRODUCTOS = COLUMNAS_PRODUCTOS_SERVICIOS.filter(col => col.visible);

/*export const NIVELES_RIESGO = [
    { value: 'bajo', label: 'Bajo' },
    { value: 'medio_bajo', label: 'Medio Bajo' },
    { value: 'medio', label: 'Medio' },
    { value: 'medio_alto', label: 'Medio Alto' },
    { value: 'alto', label: 'Alto' }
];*/