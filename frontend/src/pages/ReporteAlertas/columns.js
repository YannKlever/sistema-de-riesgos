export const alertasColumns = [
    {
        header: 'Oficina',
        accessorKey: 'oficina',
        cell: info => info.getValue() || '-'
    },
    {
        header: 'Nombres',
        accessorKey: 'nombres_propietario',
        cell: info => info.getValue() || '-'
    },
    {
        header: 'Apellidos',
        accessorKey: 'apellidos_propietario',
        cell: info => info.getValue() || '-'
    },
    {
        header: 'Documento',
        accessorKey: 'nro_documento_propietario',
        cell: info => info.getValue() || '-'
    },
    {
        header: 'Razón Social',
        accessorKey: 'razon_social',
        cell: info => info.getValue() || '-'
    },
    {
        header: 'NIT',
        accessorKey: 'nit',
        cell: info => info.getValue() || '-'
    },
    {
        header: 'Compañía',
        accessorKey: 'compania',
        cell: info => info.getValue() || '-'
    },
    {
        header: 'Ramo Seguro',
        accessorKey: 'ramo_seguro',
        cell: info => info.getValue() || '-'
    },
    {
        header: 'Tipo Documento',
        accessorKey: 'tipo_documento',
        cell: info => info.getValue() || '-'
    },
    {
        header: 'Fecha Inicial',
        accessorKey: 'fecha_inicio',
        cell: info => {
            const value = info.getValue();
            return value ? new Date(value).toLocaleDateString() : '-';
        }
    },
    {
        header: 'Fecha Final',
        accessorKey: 'fecha_fin',
        cell: info => {
            const value = info.getValue();
            return value ? new Date(value).toLocaleDateString() : '-';
        }
    },
    {
        header: 'Alertas Vinculación',
        accessorKey: 'alertas_vinculacion',
        cell: info => info.getValue() || 'N/A'
    },
    {
        header: 'Alertas Emisión/Renovación',
        accessorKey: 'alertas_emision_renovacion',
        cell: info => info.getValue() || 'N/A'
    },
    {
        header: 'Alertas Rescisión',
        accessorKey: 'alertas_rescision',
        cell: info => info.getValue() || 'N/A'
    },
    {
        header: 'Alertas Activos Virtuales',
        accessorKey: 'alertas_activos_virtuales',
        cell: info => info.getValue() || 'N/A'
    },
];