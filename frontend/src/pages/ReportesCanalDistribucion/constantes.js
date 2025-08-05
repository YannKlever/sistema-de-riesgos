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
    { id: 'medio_pago', nombre: 'Medio de pago' },
    { id: 'medio_pago_numerico', nombre: 'Riesgo de Medio de pago' }
];

export const COLUMNAS_CALCULO_RIESGO = [
    'frecuencia_contacto_fisico_numerico',
    'frecuencia_contacto_digital_numerico',
    'promedio_riesgo_cliente_interno',
    'medio_comunicacion_numerico',
    'medio_pago_numerico'
];