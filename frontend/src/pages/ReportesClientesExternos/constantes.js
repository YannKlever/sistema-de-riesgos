export const COLUMNAS_REPORTE = [
    { id: 'oficina', nombre: 'Oficina' },
    { id: 'tipo_sociedad', nombre: 'Tipo de sociedad' },
    { id: 'nombres_propietario', nombre: 'Nombres' },
    { id: 'apellidos_propietario', nombre: 'Apellidos' },
    { id: 'nro_documento_propietario', nombre: 'Documento' },
    { id: 'razon_social', nombre: 'Razón Social' },
    { id: 'nit', nombre: 'NIT' },
    { id: 'ramo_seguro', nombre: 'Ramo' },
    { id: 'tipo_documento', nombre: 'Tipo de documento' },
    { id: 'fecha_inicio', nombre: 'Fecha Inicial' },
    { id: 'fecha_fin', nombre: 'Fecha Final' },
    { id: 'nro_poliza', nombre: 'Numero de Poliza' },
    { id: 'nacionalidad', nombre: 'Nacionalidad' },
    { id: 'nacionalidad_numerico', nombre: 'Riesgo país' },
    { id: 'profesion', nombre: 'Profesion' },
    { id: 'actividad', nombre: 'actividad' },
    { id: 'riesgo_profesion_actividad_numerico', nombre: 'Riesgo Profesión o actividad' },
    { id: 'lugar_trabajo', nombre: 'Lugar o zona de trabajo' },
    { id: 'riesgo_zona_numerico', nombre: 'Riesgo Zona' },
    { id: 'ingresos_mensuales', nombre: 'Ingresos Mensuales Percibidos' },
    { id: 'ingresos_mensuales_numerico', nombre: 'Riesgo en Ingresos Percibidos' },
    { id: 'volumen_actividad', nombre: 'Volumen de la actividad que realiza' },
    { id: 'volumen_actividad_numerico', nombre: 'Riesgo en volumen de actividad' },
    { id: 'frecuencia_actividad', nombre: 'Frecuencia de la actividad que realiza' },
    { id: 'frecuencia_actividad_numerico', nombre: 'Riesgo en frecuencia de actividad' },
    { id: 'categoria_pep', nombre: 'Categoría PEP' },
    { id: 'categoria_pep_numerico', nombre: 'Riesgo en categoría PEP' },
    { id: 'ramo_seguro', nombre: 'Ramo del producto/servicio' },
    { id: 'ramo_seguro_numerico', nombre: 'Riesgo en el ramo del producto/servicio' },
    { id: 'tipo_documento', nombre: 'Tipo de documento de producto/servicio' },
    { id: 'tipo_documento_numerico', nombre: 'Riesgo en tipo de producto/servicio' },
    { id: 'valor_prima_dolares', nombre: 'Valor de la prima en dolares' },
    { id: 'valor_prima_dolares_numerico', nombre: 'Riesgo en el importe de producto/servicio' },
    { id: 'integridad_documental', nombre: 'Integridad en la documentación' },
    { id: 'integridad_documental_numerico', nombre: 'Riesgo de integridad en la documentación' },
    { id: 'exactitud_documental', nombre: 'Exactitud en la documentación' },
    { id: 'exactitud_documental_numerico', nombre: 'Riesgo de exactitud en la documentación' },
    { id: 'vigencia_documental', nombre: 'Vigencia en la documentación' },
    { id: 'vigencia_documental_numerico', nombre: 'Riesgo de vigencia en la documentación' },
    { id: 'relevancia_informacion', nombre: 'Relevancia en la información' },
    { id: 'relevancia_informacion_numerico', nombre: 'Riesgo de relevancia en la información' },
    { id: 'consistencia_informacion', nombre: 'Consistencia en información' },
    { id: 'consistencia_informacion_numerico', nombre: 'Riesgo de consistencia en información' },
    { id: 'comportamiento_cliente', nombre: 'Comportamiento' },
    { id: 'comportamiento_cliente_numerico', nombre: 'Riesgo de Comportamiento' },
    { id: 'promedio_riesgo_canal_distribucion', nombre: 'Promedio Riesgo Canal Distribución' }
];

export const COLUMNAS_NUMERICAS = COLUMNAS_REPORTE.filter(col => 
    col.id.endsWith('_numerico') || 
    col.id === 'promedio_riesgo_canal_distribucion'
);