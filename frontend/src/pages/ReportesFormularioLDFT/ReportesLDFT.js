import React, { useMemo } from 'react';
import { useReactTable, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, flexRender } from '@tanstack/react-table';
import { useReportesLDFT } from './useReporteLDFT';
import styles from './reportesLDFT.module.css';
import { databaseService } from '../../services/database';

export const ReportesLDFT = ({ onNuevaEvaluacion }) => {
    const {
        state,
        evaluacionesFiltradas,
        handleFiltroChange,
        actualizarReporte,
        actualizarEvaluacionLocal,
        COLUMNAS_REPORTE
    } = useReportesLDFT();

    // Función para limpiar errores
    const limpiarError = () => {
        handleFiltroChange({ target: { value: '' } });
        actualizarReporte();
    };

    // Configuración de columnas para react-table
    const columnasConPromedio = useMemo(() => [
        ...COLUMNAS_REPORTE.filter(col => col.id !== 'promedio_riesgo').map(col => ({
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
            size: col.ancho || 150
        })),
        {
            accessorKey: 'promedio_frontend',
            header: 'Promedio Calculado',
            cell: info => info.getValue()?.toFixed(2) || '-',
            size: 150
        },
        {
            accessorKey: 'promedio_riesgo',
            header: 'Promedio Validado',
            cell: info => info.getValue()?.toFixed(2) || '-',
            size: 150
        }
    ], [COLUMNAS_REPORTE]);

    // Configuración de la tabla
    const table = useReactTable({
        data: evaluacionesFiltradas,
        columns: columnasConPromedio,
        state: {
            globalFilter: state.filtro
        },
        onGlobalFilterChange: handleFiltroChange,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        globalFilterFn: (row, columnId, filterValue) => {
            const value = row.getValue(columnId);
            if (value === undefined || value === null) return false;
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

    const calcularPromedioGeneral = () => {
        if (evaluacionesFiltradas.length === 0) return '0.00';
        const total = evaluacionesFiltradas.reduce((sum, evaluacion) => 
            sum + (evaluacion.promedio_riesgo || evaluacion.promedio_frontend || 0), 0);
        return (total / evaluacionesFiltradas.length).toFixed(2);
    };

    const obtenerFechaMasReciente = () => {
        if (evaluacionesFiltradas.length === 0) return 'N/A';
        const fechas = evaluacionesFiltradas.map(e => new Date(e.fecha_evaluacion));
        const masReciente = new Date(Math.max(...fechas));
        return masReciente.toLocaleDateString();
    };

    const handleValidarTodo = async () => {
        try {
            const registrosAValidar = evaluacionesFiltradas.filter(
                e => e.promedio_frontend && !e.promedio_riesgo
            );

            if (registrosAValidar.length === 0) {
                alert('No hay registros pendientes de validación');
                return;
            }

            if (!window.confirm(`¿Está seguro que desea validar ${registrosAValidar.length} registros?`)) {
                return;
            }

            const resultados = await Promise.all(
                registrosAValidar.map(async (item) => {
                    const resultado = await databaseService.actualizarEvaluacionLDFT(item.id, {
                        promedio_riesgo: item.promedio_frontend
                    });
                    return { id: item.id, success: resultado.success };
                })
            );

            resultados.forEach(({ id, success }) => {
                if (success) {
                    actualizarEvaluacionLocal(id, {
                        promedio_riesgo: evaluacionesFiltradas.find(e => e.id === id).promedio_frontend
                    });
                }
            });

            alert(`Validación masiva completada: ${resultados.filter(r => r.success).length} de ${registrosAValidar.length} registros actualizados`);
            
        } catch (error) {
            console.error('Error en validación masiva:', error);
            alert('Error al realizar la validación masiva');
        }
    };

    return (
        <div className={styles.contenedor}>
            <header className={styles.header}>
                <h1>Reporte de Evaluaciones LGI/FT-FPADM</h1>
                <p>Histórico de evaluaciones de riesgo</p>
            </header>

            {state.error && (
                <div className={styles.error}>
                    {state.error}
                    <button 
                        onClick={limpiarError}
                        className={styles.botonCerrarError}
                    >
                        ×
                    </button>
                </div>
            )}

            <div className={styles.controles}>
                <input
                    type="text"
                    placeholder="Buscar evaluaciones..."
                    value={state.filtro}
                    onChange={(e) => handleFiltroChange(e)}
                    className={styles.buscador}
                    disabled={state.loading}
                />

                <div className={styles.controlesDerecha}>
                   {/* <button
                        onClick={onNuevaEvaluacion}
                        className={styles.botonNuevo}
                    >
                        Nueva Evaluación
                    </button>*/}

                    <button
                        onClick={actualizarReporte}
                        className={styles.botonActualizar}
                        disabled={state.loading}
                    >
                        Actualizar
                    </button>
                    
                    <button
                        onClick={handleValidarTodo}
                        className={styles.botonValidar}
                        disabled={state.loading}
                    >
                        Validar Todo
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
                                <td colSpan={columnasConPromedio.length} className={styles.sinResultados}>
                                    {state.loading 
                                        ? 'Cargando evaluaciones...' 
                                        : evaluacionesFiltradas.length === 0 
                                            ? 'No hay evaluaciones registradas' 
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
                    <strong>{evaluacionesFiltradas.length}</strong>
                </div>
                
                {evaluacionesFiltradas.length > 0 && (
                    <>
                        <div className={styles.resumenItem}>
                            <span>Promedio general:</span>
                            <strong className={styles.valorNumerico}>
                                {calcularPromedioGeneral()}
                            </strong>
                        </div>
                        
                        <div className={styles.resumenItem}>
                            <span>Evaluación más reciente:</span>
                            <strong>{obtenerFechaMasReciente()}</strong>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ReportesLDFT;