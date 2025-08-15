import React, { useMemo } from 'react';
import { useReactTable, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, flexRender } from '@tanstack/react-table';
import { useClientesExternos } from './useClientesExternos';
import styles from './reportesClientesExternos.module.css';

export const ReporteClientesExternos = () => {
    const {
        state,
        clientesFiltrados,
        handleFiltroChange,
        actualizarReporte,
        validarTodo,
        COLUMNAS_REPORTE,
        setState
    } = useClientesExternos();

    // Configuración de columnas para react-table
    const columns = useMemo(() => 
        COLUMNAS_REPORTE.map(col => ({
            accessorKey: col.id,
            header: col.nombre,
            cell: info => {
                const value = info.getValue();
                if (value == null) return '-';
                if (typeof value === 'string' && value.length > 20) {
                    return `${value.substring(0, 17)}...`;
                }
                return value;
            },
            size: col.ancho || 150,
            enableColumnFilter: col.filtrable !== false
        }))
    , [COLUMNAS_REPORTE]);

    // Configuración de la tabla
    const table = useReactTable({
        data: clientesFiltrados,
        columns,
        state: {
            globalFilter: state.filtro
        },
        onGlobalFilterChange: handleFiltroChange,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        globalFilterFn: (row, columnId, filterValue) => {
            const value = row.getValue(columnId);
            
            if (value === undefined || value === null) {
                return false;
            }
            
            const safeValue = String(value).toLowerCase();
            const safeFilter = filterValue.toLowerCase();
            
            return safeValue.includes(safeFilter);
        },
        initialState: {
            pagination: {
                pageSize: 20
            }
        }
    });

    // Calcular promedios para el resumen
    const promedios = useMemo(() => {
        if (clientesFiltrados.length === 0) return {};
        
        const suma = clientesFiltrados.reduce((acc, cliente) => ({
            probabilidad: acc.probabilidad + (cliente.probabilidad || 0),
            impacto: acc.impacto + (cliente.impacto || 0),
            factorRiesgo: acc.factorRiesgo + (cliente.factorRiesgoClienteExterno || 0),
            riesgoProductoServicio: acc.riesgoProductoServicio + (cliente.promedio_riesgo_producto_servicio || 0)
        }), { 
            probabilidad: 0, 
            impacto: 0, 
            factorRiesgo: 0,
            riesgoProductoServicio: 0
        });
        
        return {
            probabilidad: (suma.probabilidad / clientesFiltrados.length).toFixed(2),
            impacto: (suma.impacto / clientesFiltrados.length).toFixed(2),
            factorRiesgo: (suma.factorRiesgo / clientesFiltrados.length).toFixed(2),
            riesgoProductoServicio: (suma.riesgoProductoServicio / clientesFiltrados.length).toFixed(2)
        };
    }, [clientesFiltrados]);

    return (
        <div className={styles.contenedor}>
            <header className={styles.header}>
                <h1>Reporte de Clientes Externos</h1>
                <p>Información formal de evaluación de riesgos</p>
            </header>

            {state.error && (
                <div className={styles.error}>
                    {state.error}
                    <button 
                        onClick={() => setState(prev => ({ ...prev, error: '' }))}
                        className={styles.botonCerrarError}
                    >
                        ×
                    </button>
                </div>
            )}

            <div className={styles.controles}>
                <input
                    type="text"
                    placeholder="Buscar en todos los campos..."
                    value={state.filtro}
                    onChange={(e) => handleFiltroChange(e.target.value)}
                    className={styles.buscador}
                    disabled={state.loading}
                />

                <div className={styles.controlesDerecha}>
                    <button
                        onClick={actualizarReporte}
                        className={styles.botonExportar}
                        disabled={state.loading}
                    >
                        Actualizar Reporte
                    </button>
                    
                    <button
                        onClick={validarTodo}
                        className={styles.botonMostrarTodas}
                        disabled={state.loading}
                    >
                        Validar Todos
                    </button>
                </div>
            </div>

            <div className={styles.tablaContenedor}>
                <table className={styles.tabla}>
                    <thead>
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <th key={header.id} style={{ width: header.getSize() }}>
                                        {flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {table.getRowModel().rows.length > 0 ? (
                            table.getRowModel().rows.map(row => (
                                <tr key={row.id}>
                                    {row.getVisibleCells().map(cell => (
                                        <td key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length} className={styles.sinResultados}>
                                    {state.loading 
                                        ? 'Cargando datos...' 
                                        : clientesFiltrados.length === 0 
                                            ? 'No hay clientes externos registrados' 
                                            : 'No se encontraron resultados con los filtros aplicados'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {table.getFilteredRowModel().rows.length > 0 && (
                    <div className={styles.paginacion}>
                        <button
                            onClick={() => table.setPageIndex(0)}
                            disabled={!table.getCanPreviousPage()}
                        >
                            {'<<'}
                        </button>
                        <button
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            {'<'}
                        </button>
                        <button
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            {'>'}
                        </button>
                        <button
                            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                            disabled={!table.getCanNextPage()}
                        >
                            {'>>'}
                        </button>

                        <span>
                            Página{' '}
                            <strong>
                                {table.getState().pagination.pageIndex + 1} de{' '}
                                {table.getPageCount()}
                            </strong>
                        </span>

                        <select
                            value={table.getState().pagination.pageSize}
                            onChange={e => {
                                table.setPageSize(Number(e.target.value))
                            }}
                        >
                            {[10, 20, 30, 40, 50].map(pageSize => (
                                <option key={pageSize} value={pageSize}>
                                    Mostrar {pageSize}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            <div className={styles.resumen}>
                <div className={styles.resumenItem}>
                    <span>Total de clientes:</span>
                    <strong>{clientesFiltrados.length}</strong>
                </div>
                
                {clientesFiltrados.length > 0 && (
                    <>
                        <div className={styles.resumenItem}>
                            <span>Promedio Probabilidad:</span>
                            <strong className={styles.valorNumerico}>
                                {promedios.probabilidad}
                            </strong>
                        </div>
                        
                        <div className={styles.resumenItem}>
                            <span>Promedio Impacto:</span>
                            <strong className={styles.valorNumerico}>
                                {promedios.impacto}
                            </strong>
                        </div>
                        
                        <div className={styles.resumenItem}>
                            <span>Promedio Factor de Riesgo:</span>
                            <strong className={styles.valorNumerico}>
                                {promedios.factorRiesgo}
                            </strong>
                        </div>
                        
                        <div className={styles.resumenItem}>
                            <span>Promedio Riesgo Producto/Servicio:</span>
                            <strong className={styles.valorNumerico}>
                                {promedios.riesgoProductoServicio}
                            </strong>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ReporteClientesExternos;