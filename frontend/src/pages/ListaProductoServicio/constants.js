export const COLUMNAS_PRODUCTOS_SERVICIOS = [
    { id: 'id', nombre: 'ID', visible: false },
    { id: 'fecha_registro', nombre: 'Fecha Registro', visible: true },
    { id: 'oficina', nombre: 'Oficina', visible: true },
    { id: 'producto_servicio', nombre: 'Producto/Servicio', visible: true },
    { id: 'riesgo_producto', nombre: 'Riesgo Producto/Servicio', visible: true },
    { id: 'riesgo_cliente', nombre: 'Tipo de cliente recurrente', visible: true },
    { id: 'observaciones', nombre: 'Observaciones', visible: true },
    { id: 'riesgo_producto_numerico', nombre: 'Riesgo Producto/Servicio (Ponderado)', visible: false },
    { id: 'riesgo_cliente_numerico', nombre: 'Riesgo Cliente (Ponderado)', visible: false },
    { id: 'probabilidad', nombre: 'Probabilidad', visible: false },
    { id: 'impacto_texto', nombre: 'Valores de Impacto', visible: false },
    { id: 'impacto', nombre: 'Impacto', visible: false },
    { id: 'promedio_riesgo_producto_servicio', nombre: 'Riesgo Promedio del Producto Servicio', visible: false }
];

export const DEFAULT_COLUMNAS_PRODUCTOS = COLUMNAS_PRODUCTOS_SERVICIOS.filter(col => col.visible);

export const NIVELES_RIESGO = [
    { value: 'bajo', label: 'Bajo', valorNumerico: 1 },
    { value: 'medio bajo', label: 'Medio Bajo', valorNumerico: 2 },
    { value: 'medio', label: 'Medio', valorNumerico: 3 },
    { value: 'medio alto', label: 'Medio Alto', valorNumerico: 4 },
    { value: 'alto', label: 'Alto', valorNumerico: 5 }
];
export const NIVELES_RIESGO_CLIENTE = [
    { value: 'natural', label: 'Persona Natural', valorNumerico: 1 },
    { value: 'empresa unipersonal', label: 'Empresa Unipersonal', valorNumerico: 2 },
    { value: 'persona juridica', label: 'Persona Jurídica', valorNumerico: 3 },
    { value: 'empresa publica', label: 'Empresa Pública', valorNumerico: 4 },
    {
        value: 'empresas dedicadas a minería, metales preciosos, ong, personas pep, otros con alto riesgo',
        label: 'Empresas dedicadas a minería, metales preciosos, ONG, Personas PEP, otros con alto riesgo',
        valorNumerico: 5
    }
];
export const OPCIONES_IMPACTO = [
    { value: 'legal', label: 'Legal', peso: 1 },
    { value: 'economico', label: 'Afectación económica', peso: 1 },
    { value: 'reputacional', label: 'Reputacional', peso: 1 },
    { value: 'contagio', label: 'Contagio', peso: 1 },
    { value: 'multas', label: 'Multas', peso: 1 }
];