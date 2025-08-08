import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReactTable, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, flexRender } from '@tanstack/react-table';
import { databaseService } from '../../services/database';
import { exportExcelFile } from '../../utils/export';
import ImportModal from '../../utils/import/components/ImportModal';
import { CLIENTES_INTERNOS_SCHEMA, ALLOWED_FILE_TYPES } from '../../utils/import/constants/clientesInternos';
import { COLUMNAS_CLIENTES_INTERNOS, DEFAULT_COLUMNAS_CLIENTES } from './constants';
import ColumnSelector from './ColumnSelector';
import ClientActions from './ClientActions';
import styles from './listaClientesInternos.module.css';

const ListaClientesInternos = () => {
    const [state, setState] = useState({
        clientes: [],
        loading: true,
        error: '',
        columnasVisibles: DEFAULT_COLUMNAS_CLIENTES,
        mostrarSelectorColumnas: false,
        todasLasColumnas: false
    });

    const [showImportModal, setShowImportModal] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const navigate = useNavigate();

    // Funciones auxiliares
    const formatearValor = useCallback((valor) => {
        if (valor == null) return '-';
        if (typeof valor === 'string' && valor.length > 20) {
            return `${valor.substring(0, 17)}...`;
        }
        return valor;
    }, []);

    const cargarClientes = useCallback(async () => {
        try {
            setState(prev => ({ ...prev, loading: true, error: '' }));
            const resultado = await databaseService.listarClientesInternos();

            if (resultado.success) {
                setState(prev => ({ ...prev, clientes: resultado.data }));
            } else {
                setState(prev => ({
                    ...prev,
                    clientes: [],
                    error: resultado.error || 'Error al cargar clientes internos'
                }));
            }
        } catch (err) {
            setState(prev => ({
                ...prev,
                clientes: [],
                error: 'Error de conexión con la base de datos'
            }));
            console.error('Error al cargar clientes internos:', err);
        } finally {
            setState(prev => ({ ...prev, loading: false }));
        }
    }, []);

    const eliminarCliente = useCallback(async (id) => {
        if (window.confirm('¿Está seguro de eliminar este cliente interno?')) {
            try {
                setState(prev => ({ ...prev, loading: true }));
                const resultado = await databaseService.eliminarClienteInterno(id);

                if (resultado.success) {
                    await cargarClientes();
                } else {
                    setState(prev => ({
                        ...prev,
                        error: resultado.error || 'Error al eliminar cliente interno',
                        loading: false
                    }));
                }
            } catch (err) {
                setState(prev => ({
                    ...prev,
                    error: 'Error al conectar con el servidor',
                    loading: false
                }));
                console.error('Error al eliminar cliente interno:', err);
            }
        }
    }, [cargarClientes]);

    // Configuración de la tabla con filtrado mejorado
    const columns = useMemo(() => [
        ...state.columnasVisibles.map(col => ({
            accessorKey: col.id,
            header: col.nombre,
            cell: info => formatearValor(info.getValue()),
            size: 150,
            enableColumnFilter: true
        })),
        {
            id: 'acciones',
            header: 'Acciones',
            cell: info => (
                <ClientActions 
                    clientId={info.row.original.id} 
                    onDelete={eliminarCliente} 
                />
            ),
            size: 120,
            enableColumnFilter: false
        }
    ], [state.columnasVisibles, formatearValor, eliminarCliente]);

    const table = useReactTable({
        data: state.clientes,
        columns,
        state: {
            globalFilter
        },
        onGlobalFilterChange: setGlobalFilter,
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

    // Funciones de manejo de columnas
    const toggleColumna = useCallback((columnaId) => {
        setState(prev => {
            const existe = prev.columnasVisibles.some(col => col.id === columnaId);
            let nuevasColumnas;

            if (existe) {
                nuevasColumnas = prev.columnasVisibles.filter(col => col.id !== columnaId);
            } else {
                const columnaCompleta = COLUMNAS_CLIENTES_INTERNOS.find(col => col.id === columnaId);
                nuevasColumnas = [...prev.columnasVisibles, columnaCompleta].sort((a, b) =>
                    COLUMNAS_CLIENTES_INTERNOS.findIndex(col => col.id === a.id) -
                    COLUMNAS_CLIENTES_INTERNOS.findIndex(col => col.id === b.id)
                );
            }

            return { ...prev, columnasVisibles: nuevasColumnas };
        });
    }, []);

    const toggleTodasLasColumnas = useCallback(() => {
        setState(prev => ({
            ...prev,
            todasLasColumnas: !prev.todasLasColumnas,
            columnasVisibles: !prev.todasLasColumnas
                ? COLUMNAS_CLIENTES_INTERNOS
                : DEFAULT_COLUMNAS_CLIENTES
        }));
    }, []);

    const handleExportExcel = useCallback(() => {
        exportExcelFile(
            table.getFilteredRowModel().rows.map(row => row.original),
            COLUMNAS_CLIENTES_INTERNOS.map(col => ({ id: col.id, name: col.nombre })),
            `lista_clientes_internos`,
            {
                sheetName: 'Clientes Internos',
                headerStyle: {
                    font: { bold: true, color: { rgb: 'FFFFFF' } },
                    fill: { fgColor: { rgb: '4472C4' } },
                    alignment: { horizontal: 'center' }
                }
            }
        );
    }, [table]);

    // Efectos
    useEffect(() => {
        cargarClientes();
    }, [cargarClientes]);

    // Renderizado
    return (
        <div className={styles.contenedor}>
            <h1>Clientes Internos</h1>

            {state.error && <div className={styles.error}>{state.error}</div>}

            <div className={styles.controles}>
                <input
                    type="text"
                    placeholder="Buscar en todos los campos..."
                    value={globalFilter}
                    onChange={e => setGlobalFilter(e.target.value)}
                    className={styles.buscador}
                    disabled={state.loading}
                />

                <div className={styles.controlesDerecha}>
                    <button
                        onClick={() => setShowImportModal(true)}
                        className={styles.botonImportar}
                        disabled={state.loading}
                    >
                        Importar Excel
                    </button>
                    
                    <button
                        onClick={() => setState(prev => ({ ...prev, mostrarSelectorColumnas: !prev.mostrarSelectorColumnas }))}
                        className={styles.botonColumnas}
                        disabled={state.loading}
                    >
                        Columnas
                    </button>

                    <button
                        onClick={toggleTodasLasColumnas}
                        className={styles.botonMostrarTodas}
                        disabled={state.loading}
                    >
                        {state.todasLasColumnas ? 'Mostrar menos' : 'Mostrar todas'}
                    </button>

                    <button
                        onClick={handleExportExcel}
                        className={styles.botonExportar}
                        disabled={state.loading || table.getFilteredRowModel().rows.length === 0}
                    >
                        Exportar Excel
                    </button>

                    <button
                        onClick={() => navigate('/parametros/clientes-internos')}
                        className={styles.botonNuevo}
                    >
                        Nuevo Cliente Interno
                    </button>
                </div>
            </div>

            {showImportModal && (
                <ImportModal
                    onClose={(result) => {
                        setShowImportModal(false);
                        if (result?.success) {
                            cargarClientes();
                            alert(`Importación completada: ${result.importedCount} registros importados`);
                        }
                    }}
                    databaseService={databaseService}
                    schema={CLIENTES_INTERNOS_SCHEMA}
                    title="Importar Clientes Internos"
                    importFunctionName="importarClientesInternos"
                    successMessage="Importación de clientes internos completada"
                    allowedFileTypes={ALLOWED_FILE_TYPES}
                />
            )}

            {state.mostrarSelectorColumnas && (
                <ColumnSelector
                    columns={COLUMNAS_CLIENTES_INTERNOS}
                    visibleColumns={state.columnasVisibles}
                    onToggleColumn={toggleColumna}
                    loading={state.loading}
                />
            )}

            {state.loading ? (
                <div className={styles.cargando}>Cargando clientes internos...</div>
            ) : (
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
                                        {state.clientes.length === 0 
                                            ? 'No hay clientes internos registrados' 
                                            : 'No se encontraron resultados'}
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
            )}
        </div>
    );
};

export default ListaClientesInternos;