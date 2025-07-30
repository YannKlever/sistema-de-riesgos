export const COLUMNAS_CLIENTES_INTERNOS = [
    { id: 'id', nombre: 'ID', visible: false },
    { id: 'fecha_registro', nombre: 'Fecha de Registro', visible: true },
    { id: 'ejecutivo', nombre: 'Ejecutivo', visible: true },
    
    { id: 'nombres_cliente_interno', nombre: 'Nombres', visible: true },
    { id: 'apellidos_cliente_interno', nombre: 'Apellidos', visible: true },
    { id: 'tipo_documento_cliente_interno', nombre: 'Tipo Documento', visible: true },
    { id: 'nro_documento_cliente_interno', nombre: 'Nro. Documento', visible: true },
    { id: 'profesion', nombre: 'Profesión', visible: true },
    { id: 'categoria_pep', nombre: 'PEP', visible: true },
    { id: 'fecha_nacimiento', nombre: 'Fecha Nacimiento', visible: false },
    { id: 'lugar_nacimiento', nombre: 'Lugar Nacimiento', visible: false },
    { id: 'nacionalidad', nombre: 'Nacionalidad', visible: false },
    { id: 'estado_civil', nombre: 'Estado Civil', visible: false },
    { id: 'domicilio_persona_sucursal', nombre: 'Domicilio', visible: false },
    { id: 'observaciones', nombre: 'Observaciones', visible: false }
];

export const DEFAULT_COLUMNAS_CLIENTES = COLUMNAS_CLIENTES_INTERNOS.filter(col => col.visible);