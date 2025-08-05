export const CLIENTES_INTERNOS_SCHEMA = {
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
    'Nombres': 'nombres_cliente_interno',
    'Apellidos': 'apellidos_cliente_interno',
    'Tipo Documento': 'tipo_documento_cliente_interno',
    'Nro. Documento': 'nro_documento_cliente_interno',
    'Extensión': 'extension_cliente_interno',
    'Otra Extensión': 'otra_extension_cliente_interno',
    'Fecha Nacimiento': 'fecha_nacimiento',
    'Lugar Nacimiento': 'lugar_nacimiento',
    'Nacionalidad': 'nacionalidad',
    'Nacionalidad (Valor)': 'nacionalidad_numerico',
    'Estado Civil': 'estado_civil',
    'Profesión': 'profesion',
    'Domicilio': 'domicilio_persona_sucursal',
    'Riesgo Profesión/Actividad': 'riesgo_profesion_actividad',
    'Riesgo Profesión (Valor)': 'riesgo_profesion_actividad_numerico',
    'Riesgo Zona': 'riesgo_zona',
    'Riesgo Zona (Valor)': 'riesgo_zona_numerico',
    'PEP': 'categoria_pep',
    'PEP (Valor)': 'categoria_pep_numerico',
    'Ingresos Mensuales': 'ingresos_mensuales',
    'Ingresos Mensuales (Valor)': 'ingresos_mensuales_numerico',
    'Volumen Actividad': 'volumen_actividad',
    'Volumen Actividad (Valor)': 'volumen_actividad_numerico',
    'Frecuencia Actividad': 'frecuencia_actividad',
    'Frecuencia Actividad (Valor)': 'frecuencia_actividad_numerico',
    'Integridad Documental': 'integridad_documental',
    'Integridad Documental (Valor)': 'integridad_documental_numerico',
    'Exactitud Documental': 'exactitud_documental',
    'Exactitud Documental (Valor)': 'exactitud_documental_numerico',
    'Vigencia Documental': 'vigencia_documental',
    'Vigencia Documental (Valor)': 'vigencia_documental_numerico',
    'Relevancia Información': 'relevancia_informacion',
    'Relevancia Información (Valor)': 'relevancia_informacion_numerico',
    'Consistencia Información': 'consistencia_informacion',
    'Consistencia Información (Valor)': 'consistencia_informacion_numerico',
    'Comportamiento Cliente': 'comportamiento_cliente',
    'Comportamiento Cliente (Valor)': 'comportamiento_cliente_numerico',
    'Promedio Riesgo': 'promedio_riesgo_cliente_interno',
    'Observaciones': 'observaciones'
  }
};

export const ALLOWED_FILE_TYPES = [
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
  'text/csv'
];