// src/components/ListaSucursales/constants.js
export const COLUMNAS_SUCURSALES = [
    { id: 'id', nombre: 'ID', visible: false },
    { id: 'oficina', nombre: 'Oficina', visible: true },
    { id: 'ubicacion', nombre: 'Ubicación', visible: true },
    { id: 'departamento', nombre: 'Departamento', visible: true },
    { id: 'riesgo_departamento', nombre: 'Riesgo Depto.', visible: true },
    { id: 'municipio', nombre: 'Municipio', visible: true },
    { id: 'riesgo_municipio', nombre: 'Riesgo Mun.', visible: true },
    { id: 'zona', nombre: 'Zona', visible: false },
    { id: 'riesgo_zona', nombre: 'Riesgo Zona', visible: false },
    { id: 'frontera', nombre: 'Frontera', visible: false },
    { id: 'riesgo_frontera', nombre: 'Riesgo Frontera', visible: false },
    { id: 'fecha_registro', nombre: 'Fecha Registro', visible: true },
    { id: 'observaciones', nombre: 'Observaciones', visible: false }
];

export const DEFAULT_COLUMNAS_SUCURSALES = COLUMNAS_SUCURSALES.filter(col => col.visible);

export const NIVELES_RIESGO = [
    { value: 'bajo', label: 'Bajo' },
    { value: 'medio_bajo', label: 'Medio Bajo' },
    { value: 'medio', label: 'Medio' },
    { value: 'medio_alto', label: 'Medio Alto' },
    { value: 'alto', label: 'Alto' }
];