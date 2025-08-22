export const COLUMNAS_REPORTE = [
    { id: 'oficina', nombre: 'Oficina' },
    { id: 'ejecutivo', nombre: 'Ejecutivo' },
    { id: 'nombres_cliente_interno', nombre: 'Nombres' },
    { id: 'apellidos_cliente_interno', nombre: 'Apellidos' },
    { id: 'nacionalidad', nombre: 'Nacionalidad' },
    { id: 'nacionalidad_numerico', nombre: 'Riesgo País' },
    { id: 'profesion', nombre: 'Actividad' },
    { id: 'riesgo_profesion_actividad', nombre: 'Riesgo de Actividad' },
    { id: 'riesgo_profesion_actividad_numerico', nombre: 'Riesgo Actividad' },
    { id: 'otra_actividad', nombre: 'Otra Actividad' },
    { id: 'riesgo_otra_actividad', nombre: 'Riesgo de otra Actividad' },
    { id: 'otra_actividad_numerico', nombre: 'Riesgo Otra Actividad' },
    { id: 'riesgo_zona_numerico', nombre: 'Riesgo Zona' },
    { id: 'ingresos_mensuales', nombre: 'Ingresos' },
    { id: 'ingresos_mensuales_numerico', nombre: 'Riesgo Ingresos' },
    { id: 'volumen_actividad', nombre: 'Volumen de actividades' },
    { id: 'volumen_actividad_numerico', nombre: 'Riesgo Volumen' },
    { id: 'frecuencia_actividad', nombre: 'Frecuencia de actividades' },
    { id: 'frecuencia_actividad_numerico', nombre: 'Riesgo Frecuencia' },
    { id: 'categoria_pep', nombre: 'Categoría PEP' },
    { id: 'categoria_pep_numerico', nombre: 'Riesgo PEP' },
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
    { id: 'riesgo_inherente', nombre: 'Riesgo Inherente' },
    { id: 'mitigacion', nombre: 'Mitigación' },
    { id: 'mitigacion_numerico', nombre: 'Mitigación (%)' },
    { id: 'riesgo_residual', nombre: 'Riesgo Residual' }
];

export const OPCIONES_MITIGACION = [
    { id: 1, texto: 'Capacitación en prevención de lavado de activos' },
    { id: 2, texto: 'Sistema de monitoreo continuo' },
    { id: 3, texto: 'Controles de supervisión reforzados' },
    { id: 4, texto: 'Limitación de transacciones' },
    { id: 5, texto: 'Revisión documental adicional' },
    { id: 6, texto: 'Reportes periódicos de actividad' }
];

// Columnas para cálculo de probabilidad (igual que accionistas/socios)
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

// Columnas para cálculo de impacto (igual que accionistas/socios)
export const COLUMNAS_IMPACTO = [
    'riesgo_profesion_actividad_numerico',
    'otra_actividad_numerico',
    'ingresos_mensuales_numerico'
];