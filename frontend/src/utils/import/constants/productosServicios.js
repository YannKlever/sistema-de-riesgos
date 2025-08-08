export const PRODUCTOS_SERVICIOS_SCHEMA = {
  requiredFields: [
    'Producto/Servicio',
    'Riesgo Producto/Servicio',
    'Riesgo Cliente'
  ],
  fieldMappings: {
    'ID': 'id',
    'Fecha Registro': 'fecha_registro',
    'Oficina': 'oficina',
    'Producto/Servicio': 'producto_servicio',
    'Riesgo Producto/Servicio': 'riesgo_producto',
    'Riesgo Cliente': 'riesgo_cliente',
    'Observaciones': 'observaciones',
    'Riesgo Producto/Servicio (Ponderado)': 'riesgo_producto_numerico',
    'Riesgo Cliente (Ponderado)': 'riesgo_cliente_numerico',
  },
  fieldValidations: {
    'Riesgo Producto/Servicio': {
      validate: value => ['bajo', 'medio_bajo', 'medio', 'medio_alto', 'alto'].includes(value),
      errorMessage: 'Debe ser uno de: bajo, medio_bajo, medio, medio_alto, alto'
    },
    'Riesgo Cliente': {
      validate: value => ['bajo', 'medio_bajo', 'medio', 'medio_alto', 'alto'].includes(value),
      errorMessage: 'Debe ser uno de: bajo, medio_bajo, medio, medio_alto, alto'
    }
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