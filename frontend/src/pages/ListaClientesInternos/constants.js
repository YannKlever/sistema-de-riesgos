export const COLUMNAS_CLIENTES_INTERNOS = [
    // Columnas básicas
    { id: 'id', nombre: 'ID', visible: false },
    { id: 'fecha_registro', nombre: 'Fecha de Registro', visible: true },
    { id: 'oficina', nombre: 'Oficina', visible: true },
    { id: 'ejecutivo', nombre: 'Ejecutivo', visible: true },
    
    // Información personal
    { id: 'nombres_cliente_interno', nombre: 'Nombres', visible: true },
    { id: 'apellidos_cliente_interno', nombre: 'Apellidos', visible: true },
    { id: 'tipo_documento_cliente_interno', nombre: 'Tipo Documento', visible: true },
    { id: 'nro_documento_cliente_interno', nombre: 'Nro. Documento', visible: true },
    { id: 'extension_cliente_interno', nombre: 'Extensión', visible: false },
    { id: 'otra_extension_cliente_interno', nombre: 'Otra Extensión', visible: false },
    { id: 'fecha_nacimiento', nombre: 'Fecha Nacimiento', visible: false },
    { id: 'lugar_nacimiento', nombre: 'Lugar Nacimiento', visible: false },
    { id: 'nacionalidad', nombre: 'Nacionalidad', visible: false },
    { id: 'nacionalidad_numerico', nombre: 'Nacionalidad (Valor)', visible: false },
    { id: 'estado_civil', nombre: 'Estado Civil', visible: false },
    { id: 'profesion', nombre: 'Profesión', visible: true },
    { id: 'domicilio_persona_sucursal', nombre: 'Domicilio', visible: false },
    
    // Información de riesgo
    { id: 'riesgo_profesion_actividad', nombre: 'Riesgo Profesión/Actividad', visible: false },
    { id: 'riesgo_profesion_actividad_numerico', nombre: 'Riesgo Profesión (Valor)', visible: false },
    { id: 'riesgo_zona', nombre: 'Riesgo Zona', visible: false },
    { id: 'riesgo_zona_numerico', nombre: 'Riesgo Zona (Valor)', visible: false },
    { id: 'categoria_pep', nombre: 'PEP', visible: true },
    { id: 'categoria_pep_numerico', nombre: 'PEP (Valor)', visible: false },
    
    // Información económica
    { id: 'ingresos_mensuales', nombre: 'Ingresos Mensuales', visible: false },
    { id: 'ingresos_mensuales_numerico', nombre: 'Ingresos Mensuales (Valor)', visible: false },
    { id: 'volumen_actividad', nombre: 'Volumen Actividad', visible: false },
    { id: 'volumen_actividad_numerico', nombre: 'Volumen Actividad (Valor)', visible: false },
    { id: 'frecuencia_actividad', nombre: 'Frecuencia Actividad', visible: false },
    { id: 'frecuencia_actividad_numerico', nombre: 'Frecuencia Actividad (Valor)', visible: false },
    
    // Evaluación documental
    { id: 'integridad_documental', nombre: 'Integridad Documental', visible: false },
    { id: 'integridad_documental_numerico', nombre: 'Integridad Documental (Valor)', visible: false },
    { id: 'exactitud_documental', nombre: 'Exactitud Documental', visible: false },
    { id: 'exactitud_documental_numerico', nombre: 'Exactitud Documental (Valor)', visible: false },
    { id: 'vigencia_documental', nombre: 'Vigencia Documental', visible: false },
    { id: 'vigencia_documental_numerico', nombre: 'Vigencia Documental (Valor)', visible: false },
    { id: 'relevancia_informacion', nombre: 'Relevancia Información', visible: false },
    { id: 'relevancia_informacion_numerico', nombre: 'Relevancia Información (Valor)', visible: false },
    { id: 'consistencia_informacion', nombre: 'Consistencia Información', visible: false },
    { id: 'consistencia_informacion_numerico', nombre: 'Consistencia Información (Valor)', visible: false },
    
    // Comportamiento y evaluación final
    { id: 'comportamiento_cliente', nombre: 'Comportamiento Cliente', visible: false },
    { id: 'comportamiento_cliente_numerico', nombre: 'Comportamiento Cliente (Valor)', visible: false },
    
    { id: 'observaciones', nombre: 'Observaciones', visible: false },
    { id: 'promedio_riesgo_cliente_interno', nombre: 'Promedio Riesgo', visible: true },
    
];

export const DEFAULT_COLUMNAS_CLIENTES = COLUMNAS_CLIENTES_INTERNOS.filter(col => col.visible);