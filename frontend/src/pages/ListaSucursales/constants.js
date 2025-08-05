export const COLUMNAS_SUCURSALES = [
    { id: 'id', nombre: 'ID', visible: true },
    { id: 'fecha_registro', nombre: 'Fecha Registro', visible: true },
    { id: 'oficina', nombre: 'Oficina', visible: true },
    { id: 'ubicacion', nombre: 'Ubicación', visible: true },
    { id: 'departamento', nombre: 'Departamento', visible: true },
    { id: 'riesgo_departamento', nombre: 'Riesgo Depto.', visible: true },
    { id: 'riesgo_departamento_numerico', nombre: 'Riesgo Depto. Numérico', visible: true },
    { id: 'municipio', nombre: 'Municipio', visible: true },
    { id: 'riesgo_municipio', nombre: 'Riesgo Mun.', visible: true },
    { id: 'riesgo_municipio_numerico', nombre: 'Riesgo Mun. Numérico', visible: true },
    { id: 'zona', nombre: 'Zona', visible: true },
    { id: 'riesgo_zona', nombre: 'Riesgo Zona', visible: true },
    { id: 'riesgo_zona_numerico', nombre: 'Riesgo Zona Numérico', visible: true },
    { id: 'frontera', nombre: 'Frontera', visible: true },
    { id: 'riesgo_frontera', nombre: 'Riesgo Frontera', visible: true },
    { id: 'riesgo_frontera_numerico', nombre: 'Riesgo Frontera Numérico', visible: true },
    
    
    { id: 'observaciones', nombre: 'Observaciones', visible: true },
    { id: 'promedio_riesgo_zona_geografica', nombre: 'Promedio Riesgo', visible: true }
];

export const DEFAULT_COLUMNAS_SUCURSALES = COLUMNAS_SUCURSALES.filter(col => col.visible);

export const NIVELES_RIESGO = [
    { value: 'bajo', label: 'Bajo', valorNumerico: 1 },
    { value: 'medio_bajo', label: 'Medio Bajo', valorNumerico: 2 },
    { value: 'medio', label: 'Medio', valorNumerico: 3 },
    { value: 'medio_alto', label: 'Medio Alto', valorNumerico: 4 },
    { value: 'alto', label: 'Alto', valorNumerico: 5 }
];