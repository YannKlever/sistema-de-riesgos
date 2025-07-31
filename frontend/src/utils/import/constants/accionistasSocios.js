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
    'Participación': 'participacion_accionaria',
    'Actividad': 'actividad',
    'Ingresos Mensuales': 'ingresos_mensuales',
    'Volumen Actividad': 'volumen_actividad',
    'Frecuencia Actividad': 'frecuencia_actividad',
    'Domicilio': 'domicilio_persona',
    'PEP': 'categoria_pep',
    'Riesgo Actividad': 'riesgo_actividad',
    'Riesgo Zona': 'riesgo_zona',
    'Integridad Documental': 'integridad_documental',
    'Exactitud Documental': 'exactitud_documental',
    'Vigencia Documental': 'vigencia_documental',
    'Relevancia Información': 'relevancia_informacion',
    'Consistencia Información': 'consistencia_informacion',
    'Comportamiento': 'comportamiento_cliente',
    'Observaciones': 'observaciones',
    'Riesgo Nacionalidad': 'nacionalidad_numerico',
    'Riesgo Actividad (Numérico)': 'riesgo_actividad_numerico',
    'Riesgo Zona (Numérico)': 'riesgo_zona_numerico',
    'Riesgo PEP (Numérico)': 'categoria_pep_numerico',
    'Riesgo Ingresos (Numérico)': 'ingresos_mensuales_numerico',
    'Riesgo Volumen (Numérico)': 'volumen_actividad_numerico',
    'Riesgo Frecuencia (Numérico)': 'frecuencia_actividad_numerico',
    'Riesgo Participación (Numérico)': 'participacion_accionaria_numerico',
    'Riesgo Integridad (Numérico)': 'integridad_documental_numerico',
    'Riesgo Exactitud (Numérico)': 'exactitud_documental_numerico',
    'Riesgo Vigencia (Numérico)': 'vigencia_documental_numerico',
    'Riesgo Relevancia (Numérico)': 'relevancia_informacion_numerico',
    'Riesgo Consistencia (Numérico)': 'consistencia_informacion_numerico',
    'Riesgo Comportamiento (Numérico)': 'comportamiento_cliente_numerico',
    'Promedio Riesgo Accionista Socio': 'promedio_riesgo_accionista_socio'
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