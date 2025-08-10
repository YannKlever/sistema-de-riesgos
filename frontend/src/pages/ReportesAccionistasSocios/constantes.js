export const COLUMNAS_REPORTE = [
    { id: 'oficina', nombre: 'Oficina' },
    { id: 'nombres_accionistas_socios', nombre: 'Nombres' },
    { id: 'apellidos_accionistas_socios', nombre: 'Apellidos' },
    { id: 'nro_documento_accionistas_socios', nombre: 'Documento' },
    { id: 'nacionalidad', nombre: 'Nacionalidad' },
    { id: 'nacionalidad_numerico', nombre: 'Riesgo País' },
    { id: 'actividad', nombre: 'Actividad' },
    { id: 'riesgo_actividad_numerico', nombre: 'Riesgo Actividad' },
    { id: 'riesgo_zona_numerico', nombre: 'Riesgo Zona' },
    { id: 'categoria_pep', nombre: 'Categoría PEP' },
    { id: 'categoria_pep_numerico', nombre: 'Riesgo PEP' },
    { id: 'ingresos_mensuales', nombre: 'Ingresos' },
    { id: 'ingresos_mensuales_numerico', nombre: 'Riesgo Ingresos' },
    { id: 'volumen_actividad', nombre: 'Volumen de actividades' },
    { id: 'volumen_actividad_numerico', nombre: 'Riesgo Volumen' },
    { id: 'frecuencia_actividad', nombre: 'Frecuencia de actividades' },
    { id: 'frecuencia_actividad_numerico', nombre: 'Riesgo Frecuencia' },
    { id: 'participacion_accionaria', nombre: 'Participación Accionaria' },
    { id: 'participacion_accionaria_numerico', nombre: 'Riesgo de participación' },
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
    { id: 'probabilidad', nombre: 'Probabilidad' },
    { id: 'impacto', nombre: 'Impacto' },
    { id: 'factorRiesgoAccionistaSocio', nombre: 'Factor Riesgo' }
];

// Columnas para cálculo de probabilidad
export const COLUMNAS_PROBABILIDAD = [
    'nacionalidad_numerico',
    'riesgo_zona_numerico',
    'categoria_pep_numerico',
    'volumen_actividad_numerico',
    'frecuencia_actividad_numerico',
    'integridad_documental_numerico',
    'exactitud_documental_numerico',
    'vigencia_documental_numerico',
    'relevancia_informacion_numerico',
    'consistencia_informacion_numerico',
    'comportamiento_cliente_numerico'
];

// Columnas para cálculo de impacto
export const COLUMNAS_IMPACTO = [
    'riesgo_actividad_numerico',
    'ingresos_mensuales_numerico',
    'participacion_accionaria_numerico'
];