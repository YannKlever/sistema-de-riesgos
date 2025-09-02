import React, { useMemo, useState } from 'react';
import { useReactTable, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, flexRender } from '@tanstack/react-table';
import { useSucursales } from './useSucursales';
import { exportarReporteSucursalesPDF } from './reportePDFsucursales';
import styles from './reportesZonaGeografica.module.css';

export const ReportesSucursales = () => {
    const {
        state,
        sucursalesFiltradas,
        handleFiltroChange,
        actualizarReporte,
        validarTodosLosRiesgos,
        COLUMNAS_REPORTE,
        setExporting
    } = useSucursales();

    const [notificacion, setNotificacion] = useState({ mensaje: '', tipo: '' });

    const mostrarNotificacion = (mensaje, tipo = 'info') => {
        setNotificacion({ mensaje, tipo });
        setTimeout(() => setNotificacion({ mensaje: '', tipo: '' }), 5000);
    };

    const handleExportPDF = async () => {
        try {
            setExporting(true);

            const opcionesExportacion = {
                creador: 'Sistema de Gestión de Riesgos'
            };

            exportarReporteSucursalesPDF(
                sucursalesFiltradas,
                COLUMNAS_REPORTE,
                'Reporte_Sucursales_Ubicacion_Geografica',
                opcionesExportacion
            );

            mostrarNotificacion('Reporte exportado a PDF exitosamente', 'exito');
        } catch (error) {
            console.error('Error en exportación PDF:', error);
            mostrarNotificacion(`Error al exportar PDF: ${error.message}`, 'error');
        } finally {
            setExporting(false);
        }
    };

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
        data: sucursalesFiltradas,
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

    // Calcular promedios
    const calcularPromedio = (campo, campoAlternativo = null) => {
        if (sucursalesFiltradas.length === 0) return '0.00';
        const total = sucursalesFiltradas.reduce((sum, sucursal) =>
            sum + (sucursal[campo] || (campoAlternativo ? sucursal[campoAlternativo] : 0) || 0), 0);
        return (total / sucursalesFiltradas.length).toFixed(2);
    };

    return (
        <div className={styles.contenedor}>
            <header className={styles.header}>
                <h1>Reporte de Ubicación Geográfica</h1>
                <p>Evaluación de riesgos por ubicación geográfica</p>
            </header>

            {notificacion.mensaje && (
                <div className={`${styles.notificacion} ${styles[notificacion.tipo]}`}>
                    {notificacion.mensaje}
                    <button
                        onClick={() => setNotificacion({ mensaje: '', tipo: '' })}
                        className={styles.botonCerrarNotificacion}
                    >
                        ×
                    </button>
                </div>
            )}

            {state.error && (
        <div className={styles.error}>
            {state.error}
            <button 
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
                        className={styles.botonActualizar}
                        disabled={state.loading}
                    >
                        Actualizar Reporte
                    </button>

                    <button
                        onClick={validarTodosLosRiesgos}
                        className={styles.botonValidar}
                        disabled={state.loading || state.validandoTodos}
                    >
                        {state.validandoTodos ? 'Validando...' : 'Validar Todos'}
                    </button>
                    <button
                        onClick={handleExportPDF}
                        className={styles.botonExportar}
                        disabled={sucursalesFiltradas.length === 0 || state.loading || state.exporting}
                        title="Exportar a PDF"
                    >
                        {state.exporting ? (
                            <span>⏳ Generando PDF...</span>
                        ) : (
                            <>
                                <span className={styles.iconoPdf}>📄</span> Exportar a PDF
                            </>
                        )}
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
                                        : sucursalesFiltradas.length === 0
                                            ? 'No hay sucursales registradas'
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
                    <span>Total en reporte:</span>
                    <strong>{sucursalesFiltradas.length}</strong>
                </div>

                {sucursalesFiltradas.length > 0 && (
                    <>
                        <div className={styles.resumenItem}>
                            <span>Promedio de probabilidad:</span>
                            <strong className={styles.valorNumerico}>
                                {calcularPromedio('probabilidad')}
                            </strong>
                        </div>

                        <div className={styles.resumenItem}>
                            <span>Promedio de impacto:</span>
                            <strong className={styles.valorNumerico}>
                                {calcularPromedio('impacto')}
                            </strong>
                        </div>

                        <div className={styles.resumenItem}>
                            <span>Promedio de riesgo calculado:</span>
                            <strong className={styles.valorNumerico}>
                                {calcularPromedio('factorRiesgoZonaGeografica')}
                            </strong>
                        </div>

                        <div className={styles.resumenItem}>
                            <span>Promedio de riesgo validado:</span>
                            <strong className={styles.valorNumerico}>
                                {calcularPromedio('promedio_riesgo_zona_geografica', 'factorRiesgoZonaGeografica')}
                            </strong>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ReportesSucursales;