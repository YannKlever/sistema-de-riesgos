export const DEPARTAMENTOS_BOLIVIA = [
    'La Paz', 'Santa Cruz', 'Cochabamba',
    'Oruro', 'Potosí', 'Beni',
    'Pando', 'Chuquisaca', 'Tarija'
];
export const COLUMNAS_SUCURSALES = [
    { id: 'id', nombre: 'ID', visible: false },
    { id: 'fecha_registro', nombre: 'Fecha Registro', visible: false },
    { id: 'oficina', nombre: 'Oficina', visible: true },
    { id: 'ubicacion', nombre: 'Dirección', visible: true },
    { id: 'departamento', nombre: 'Departamento', visible: true },
    { id: 'riesgo_departamento', nombre: 'Riesgo Departamento', visible: false },
    { id: 'municipio', nombre: 'Municipio', visible: true },
    { id: 'riesgo_municipio', nombre: 'Riesgo Municipio', visible: false },
    { id: 'zona', nombre: 'Zona', visible: true },
    { id: 'riesgo_zona', nombre: 'Riesgo Zona', visible: false },
    { id: 'frontera', nombre: 'Frontera', visible: true },
    { id: 'riesgo_frontera', nombre: 'Riesgo Frontera', visible: false },
    { id: 'observaciones', nombre: 'Observaciones', visible: false },
    { id: 'riesgo_departamento_numerico', nombre: 'Riesgo Departamento (Ponderado)', visible: false },
    { id: 'riesgo_municipio_numerico', nombre: 'Riesgo Municipio (Ponderado)', visible: false },
    { id: 'riesgo_zona_numerico', nombre: 'Riesgo Zona (Ponderado)', visible: false },
    { id: 'riesgo_frontera_numerico', nombre: 'Riesgo Frontera (Ponderado)', visible: false },
    { id: 'probabilidad', nombre: 'Probabilidad', visible: false },
    { id: 'impacto', nombre: 'Impacto', visible: false },
    { id: 'promedio_riesgo_zona_geografica', nombre: 'Riesgo Zona Geográfica', visible: false }
];

export const DEFAULT_COLUMNAS_SUCURSALES = COLUMNAS_SUCURSALES.filter(col => col.visible);

export const NIVELES_RIESGO = [
    { value: 'bajo', label: 'Bajo', valorNumerico: 1 },
    { value: 'medio bajo', label: 'Medio Bajo', valorNumerico: 2 },
    { value: 'medio', label: 'Medio', valorNumerico: 3 },
    { value: 'medio alto', label: 'Medio Alto', valorNumerico: 4 },
    { value: 'alto', label: 'Alto', valorNumerico: 5 }
];