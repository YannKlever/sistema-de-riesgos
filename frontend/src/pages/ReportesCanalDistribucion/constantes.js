// constantes.js
export const COLUMNAS_REPORTE_CANALES = [
    { id: 'id', nombre: 'ID' },
    { id: 'nro_documento_propietario', nombre: 'CI o NIT' },
    { id: 'ejecutivo', nombre: 'Ejecutivo' },
    { id: 'razon_social', nombre: 'Nombre o Razón Social' },
    { id: 'tipo_sociedad', nombre: 'Tipo de Persona' },
    { id: 'frecuencia_contacto_fisico', nombre: 'Frecuencia de contacto físico' },
    { id: 'frecuencia_contacto_fisico_numerico', nombre: 'Riesgo de frecuencia de contacto físico' },
    { id: 'frecuencia_contacto_digital', nombre: 'Frecuencia de contacto digital' },
    { id: 'frecuencia_contacto_digital_numerico', nombre: 'Riesgo de frecuencia de contacto digital' },
    { id: 'promedio_riesgo_cliente_interno', nombre: 'Riesgo del cliente interno' },
    { id: 'medio_comunicacion', nombre: 'Medio de comunicación' },
    { id: 'medio_comunicacion_numerico', nombre: 'Riesgo de medios de comunicación' },
    
    { id: 'probabilidad_canal_distribucion', nombre: 'Probabilidad' },
    { id: 'impacto_canal_distribucion', nombre: 'Impacto' }, 
    { id: 'factor_riesgo_canal_distribucion', nombre: 'Factor Riesgo Canal Distribución' }
];

export const COLUMNAS_CALCULO_PROBABILIDAD = [
    'frecuencia_contacto_fisico_numerico',
    'frecuencia_contacto_digital_numerico',
    'medio_comunicacion_numerico',
    
    'promedio_riesgo_cliente_interno'
];