export const SUCURSALES_SCHEMA = {
  requiredFields: [
    'Oficina',
    'Dirección',
    'Departamento',
    'Riesgo Departamento'
  ],
  fieldMappings: {
    'ID': 'id',
    'Fecha Registro': 'fecha_registro',
    'Oficina': 'oficina',
    'Dirección': 'ubicacion',
    'Departamento': 'departamento',
    'Riesgo Departamento': 'riesgo_departamento',
    'Municipio': 'municipio',
    'Riesgo Municipio': 'riesgo_municipio',
    'Zona': 'zona',
    'Riesgo Zona': 'riesgo_zona',
    'Frontera': 'frontera',
    'Riesgo Frontera': 'riesgo_frontera',
    'Observaciones': 'observaciones',
    'Riesgo Departamento (Ponderado)': 'riesgo_departamento_numerico',
    'Riesgo Municipio (Ponderado)': 'riesgo_municipio_numerico',
    'Riesgo Frontera (Ponderado)': 'riesgo_frontera_numerico',
    'Riesgo Zona (Ponderado)': 'riesgo_zona_numerico',
    'Valores de Impacto': 'impacto_texto',
    'Impacto': 'impacto',
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