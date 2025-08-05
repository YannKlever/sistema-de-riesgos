export const SUCURSALES_SCHEMA = {
  requiredFields: [
    'Oficina',
    'Ubicación',
    'Departamento',
    'Riesgo Depto.'
  ],
  fieldMappings: {
    'ID': 'id',
    'Oficina': 'oficina',
    'Ubicación': 'ubicacion',
    'Departamento': 'departamento',
    'Riesgo Depto.': 'riesgo_departamento',
    'Riesgo Depto. Numérico': 'riesgo_departamento_numerico',
    'Municipio': 'municipio',
    'Riesgo Mun.': 'riesgo_municipio',
    'Riesgo Mun. Numérico': 'riesgo_municipio_numerico',
    'Zona': 'zona',
    'Riesgo Zona': 'riesgo_zona',
    'Riesgo Zona Numérico': 'riesgo_zona_numerico',
    'Frontera': 'frontera',
    'Riesgo Frontera': 'riesgo_frontera',
    'Riesgo Frontera Numérico': 'riesgo_frontera_numerico',
    'Promedio Riesgo': 'promedio_riesgo_zona_geografica',
    'Fecha Registro': 'fecha_registro',
    'Observaciones': 'observaciones'
  }
};

export const IMPORT_STEPS = {
  SELECT_FILE: 1,
  PREVIEW: 2,
  CONFIRM: 3
};

export const ALLOWED_FILE_TYPES = [
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
  'text/csv'
];