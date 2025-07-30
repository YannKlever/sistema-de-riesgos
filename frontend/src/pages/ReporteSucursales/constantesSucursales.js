export const COLUMNAS_REPORTE_SUCURSALES = [
    { id: 'oficina', nombre: 'Oficina' },
    { id: 'ubicacion', nombre: 'Ubicación' },
    { id: 'departamento', nombre: 'Departamento' },
    { id: 'riesgo_departamento', nombre: 'Riesgo Departamento' },
    { id: 'riesgo_departamento_numerico', nombre: 'Riesgo Dep. (Núm)' },
    { id: 'municipio', nombre: 'Municipio' },
    { id: 'riesgo_municipio', nombre: 'Riesgo Municipio' },
    { id: 'riesgo_municipio_numerico', nombre: 'Riesgo Mun. (Núm)' },
    { id: 'zona', nombre: 'Zona' },
    { id: 'riesgo_zona', nombre: 'Riesgo Zona' },
    { id: 'riesgo_zona_numerico', nombre: 'Riesgo Zona (Núm)' },
    { id: 'frontera', nombre: 'Frontera' },
    { id: 'riesgo_frontera', nombre: 'Riesgo Frontera' },
    { id: 'riesgo_frontera_numerico', nombre: 'Riesgo Frontera (Núm)' }
];

export const COLUMNAS_NUMERICAS_SUCURSALES = COLUMNAS_REPORTE_SUCURSALES.filter(
    col => col.id.endsWith('_numerico')
);