// constantes.js
export const COLUMNAS_REPORTE_CANALES = [
    { id: 'oficina', nombre: 'Oficina' },
    { id: 'tipo_sociedad', nombre: 'Tipo de sociedad' },
    { id: 'nombres_propietario', nombre: 'Nombres' },
    { id: 'apellidos_propietario', nombre: 'Apellidos' },
    { id: 'nro_documento_propietario', nombre: 'Documento' },
    { id: 'razon_social', nombre: 'Razón Social' },
    { id: 'nit', nombre: 'NIT' },
    { id: 'fecha_inicio', nombre: 'Fecha Inicial' },
    { id: 'fecha_fin', nombre: 'Fecha Final' },
    { id: 'nro_poliza', nombre: 'Numero de Poliza' },
    { id: 'frecuencia_contacto_fisico', nombre: 'Frecuencia de contacto físico' },
    { id: 'frecuencia_contacto_fisico_numerico', nombre: 'Riesgo de frecuencia de contacto físico' },
    { id: 'frecuencia_contacto_digital', nombre: 'Frecuencia de contacto digital' },
    { id: 'frecuencia_contacto_digital_numerico', nombre: 'Riesgo de frecuencia de contacto digital' },
    { id: 'medio_comunicacion', nombre: 'Medio de comunicación' },
    { id: 'medio_comunicacion_numerico', nombre: 'Riesgo de medios de comunicación' },
    { id: 'ejecutivo', nombre: 'Ejecutivo' },
    { id: 'riesgo_residual', nombre: 'Riesgo del cliente interno' },
    { id: 'probabilidad_canal_distribucion', nombre: 'Probabilidad' },
    { id: 'impacto_canal_distribucion', nombre: 'Impacto' },
    { id: 'factor_riesgo_canal_distribucion', nombre: 'Factor Riesgo Canal Distribución' }
];

export const COLUMNAS_CALCULO_PROBABILIDAD = [
    'frecuencia_contacto_fisico_numerico',
    'frecuencia_contacto_digital_numerico',
    'medio_comunicacion_numerico',
    'riesgo_residual'
];