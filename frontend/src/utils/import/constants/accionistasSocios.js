export const ACCIONISTAS_SCHEMA = {
  requiredFields: [
    'Nombres',
    'Nro. Documento',
    'Tipo Documento'
  ],
  fieldMappings: {
    'ID': 'id',
    'Fecha de Registro': 'fecha_registro',
    'Oficina': 'oficina',
    'Ejecutivo': 'ejecutivo',
    'Nombres': 'nombres_accionistas_socios',
    'Apellidos': 'apellidos_accionistas_socios',
    'Tipo Documento': 'tipo_documento_accionistas_socios',
    'Nro. Documento': 'nro_documento_accionistas_socios',
    'Extensión': 'extension_accionistas_socios',
    'Otra Extensión': 'otra_extension_accionistas_socios',
    'Fecha Nacimiento': 'fecha_nacimiento',
    'Lugar Nacimiento': 'lugar_nacimiento',
    'Nacionalidad': 'nacionalidad',
    'Estado Civil': 'estado_civil',
    'Domicilio': 'domicilio_persona',
    'Actividad': 'actividad',
    'Riesgo Actividad': 'riesgo_actividad',
    'Riesgo Zona': 'riesgo_zona',
    'PEP': 'categoria_pep',
    'Ingresos Mensuales': 'ingresos_mensuales',
    'Volumen Actividad': 'volumen_actividad',
    'Frecuencia Actividad': 'frecuencia_actividad',
    'Participación': 'participacion_accionaria',
    'Integridad Documental': 'integridad_documental',
    'Exactitud Documental': 'exactitud_documental',
    'Vigencia Documental': 'vigencia_documental',
    'Relevancia Información': 'relevancia_informacion',
    'Consistencia Información': 'consistencia_informacion',
    'Comportamiento': 'comportamiento_cliente',
    'Observaciones': 'observaciones',
    'Riesgo Nacionalidad': 'nacionalidad_numerico',
    'Riesgo Actividad (Ponderado)': 'riesgo_actividad_numerico',
    'Riesgo Zona (Ponderado)': 'riesgo_zona_numerico',
    'Riesgo Ingresos (Ponderado)': 'ingresos_mensuales_numerico',
    'Riesgo Volumen (Ponderado)': 'volumen_actividad_numerico',
    'Riesgo Frecuencia (Ponderado)': 'frecuencia_actividad_numerico',
    'Riesgo PEP (Ponderado)': 'categoria_pep_numerico',
    'Riesgo Participación (Ponderado)': 'participacion_accionaria_numerico',
    'Riesgo Integridad (Ponderado)': 'integridad_documental_numerico',
    'Riesgo Exactitud (Ponderado)': 'exactitud_documental_numerico',
    'Riesgo Vigencia (Ponderado)': 'vigencia_documental_numerico',
    'Riesgo Relevancia (Ponderado)': 'relevancia_informacion_numerico',
    'Riesgo Consistencia (Ponderado)': 'consistencia_informacion_numerico',
    'Riesgo Comportamiento (Ponderado)': 'comportamiento_cliente_numerico',
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