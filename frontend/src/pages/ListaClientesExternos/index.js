import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReactTable, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, flexRender } from '@tanstack/react-table';
import { databaseService } from '../../services/database';
import { exportExcelFile } from '../../utils/export';
import ImportModal from '../../utils/import/components/ImportModal';
import { CLIENTES_EXTERNOS_SCHEMA } from '../../utils/import/constants/clientesExternos';
import { TODAS_LAS_COLUMNAS, DEFAULT_VISIBLE_COLUMNS, EDITABLE_COLUMNS } from './constants';
import ColumnSelector from './ColumnSelector';
import ClientActions from './ClientActions';
import EditableCell from './EditableCell';
import { useEditableTable } from './useEditableTable';
import EditableRow from './EditableRow';
import styles from './listaClientesExternos.module.css';

const ListaClientesExternos = () => {
    const [state, setState] = useState({
        columnasVisibles: DEFAULT_VISIBLE_COLUMNS,
        mostrarSelectorColumnas: false,
        todasLasColumnas: false
    });

    const [showImportModal, setShowImportModal] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const navigate = useNavigate();

    //Para la funcionalidad de edición
    const {
        data: clientes,
        setData: setClientes,
        editingRow,
        tempData,
        loading,
        error,
        startEditing,
        cancelEditing,
        updateTempField,
        saveEditing,
        clearError,
        isEditing
    } = useEditableTable([]);

    const dataColumns = useMemo(() => {
        const columnasActuales = state.columnasVisibles.length > 0
            ? state.columnasVisibles
            : DEFAULT_VISIBLE_COLUMNS;

        return columnasActuales.map(col => ({
            id: col.id,
            header: col.nombre,
            accessorKey: col.id,
            size: 150,
            enableColumnFilter: true
        }));
    }, [state.columnasVisibles]);

    const cargarClientes = useCallback(async () => {
        try {
            const resultado = await databaseService.listarClientesExternos();

            if (resultado.success) {
                setClientes(resultado.data);
            } else {
                setClientes([]);
            }
        } catch (err) {
            setClientes([]);
            console.error('Error al cargar clientes:', err);
        }
    }, [setClientes]);

    const eliminarCliente = useCallback(async (id) => {
        if (window.confirm('¿Está seguro de eliminar este cliente?')) {
            try {
                const resultado = await databaseService.eliminarClienteExterno(id);

                if (resultado.success) {
                    await cargarClientes();
                }
            } catch (err) {
                console.error('Error al eliminar cliente:', err);
            }
        }
    }, [cargarClientes]);

    // Funciones de manejo de columnas
    const toggleColumna = useCallback((columnaId) => {
        setState(prev => {
            const existe = prev.columnasVisibles.some(col => col.id === columnaId);
            let nuevasColumnas;

            if (existe) {
                nuevasColumnas = prev.columnasVisibles.filter(col => col.id !== columnaId);
            } else {
                const columnaCompleta = TODAS_LAS_COLUMNAS.find(col => col.id === columnaId);
                nuevasColumnas = [...prev.columnasVisibles, columnaCompleta].sort((a, b) =>
                    TODAS_LAS_COLUMNAS.findIndex(col => col.id === a.id) -
                    TODAS_LAS_COLUMNAS.findIndex(col => col.id === b.id)
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
                ? TODAS_LAS_COLUMNAS
                : DEFAULT_VISIBLE_COLUMNS
        }));
    }, []);

    const handleExportExcel = useCallback(() => {
        exportExcelFile(
            clientes,
            TODAS_LAS_COLUMNAS.map(col => ({ id: col.id, name: col.nombre })),
            `lista_clientes_externos`,
            {
                sheetName: 'Clientes Externos',
                headerStyle: {
                    font: { bold: true, color: { rgb: 'FFFFFF' } },
                    fill: { fgColor: { rgb: '4472C4' } },
                    alignment: { horizontal: 'center' }
                }
            }
        );
    }, [clientes]);

    // Configuración de la tabla
    const columns = useMemo(() => [
        ...dataColumns,
        {
            id: 'acciones',
            header: 'Acciones',
            size: 120,
            enableColumnFilter: false
        }
    ], [dataColumns]);

    const table = useReactTable({
        data: clientes,
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

    useEffect(() => {
        cargarClientes();
    }, [cargarClientes]);

    return (
        <div className={styles.contenedor}>
            <h1>Clientes Externos</h1>
            {error && (
                <div className={styles.error}>
                    {error}
                    <button
                        onClick={clearError}
                        className={styles.botonCerrarError}
                        style={{ marginLeft: '10px', background: 'none', border: 'none', color: 'inherit' }}
                    >
                        ×
                    </button>
                </div>
            )}
            <div className={styles.controles}>
                <input
                    type="text"
                    placeholder="Buscar en todos los campos..."
                    value={globalFilter}
                    onChange={e => setGlobalFilter(e.target.value)}
                    className={styles.buscador}
                    disabled={loading}
                />

                <div className={styles.controlesDerecha}>
                    <button
                        onClick={() => setShowImportModal(true)}
                        className={styles.botonImportar}
                        disabled={loading}
                    >
                        Importar Excel
                    </button>

                    <button
                        onClick={() => setState(prev => ({ ...prev, mostrarSelectorColumnas: !prev.mostrarSelectorColumnas }))}
                        className={styles.botonColumnas}
                        disabled={loading}
                    >
                        Columnas
                    </button>

                    <button
                        onClick={toggleTodasLasColumnas}
                        className={styles.botonMostrarTodas}
                        disabled={loading}
                    >
                        {state.todasLasColumnas ? 'Mostrar menos' : 'Mostrar todas'}
                    </button>

                    <button
                        onClick={handleExportExcel}
                        className={styles.botonExportar}
                        disabled={loading || clientes.length === 0}
                    >
                        Exportar Excel
                    </button>

                    <button
                        onClick={() => navigate('/clientes')}
                        className={styles.botonNuevo}
                    >
                        Nuevo Cliente
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
                    schema={CLIENTES_EXTERNOS_SCHEMA}
                    title="Importar Clientes Externos"
                    importFunctionName="importarClientesExternos"
                    successMessage="Importación de clientes externos completada"
                />
            )}

            {state.mostrarSelectorColumnas && (
                <ColumnSelector
                    columns={TODAS_LAS_COLUMNAS}
                    visibleColumns={state.columnasVisibles}
                    onToggleColumn={toggleColumna}
                    loading={loading}
                />
            )}

            {loading ? (
                <div className={styles.cargando}>Cargando clientes...</div>
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
                                    <EditableRow
                                        key={row.id}
                                        row={row.original}
                                        columns={columns}
                                        isEditing={isEditing(row.original.id)}
                                        tempData={tempData}
                                        onUpdateTempField={updateTempField}
                                        onStartEditing={startEditing}
                                        onSaveEditing={saveEditing}
                                        onCancelEditing={cancelEditing}
                                        onDelete={eliminarCliente}
                                        EDITABLE_COLUMNS={EDITABLE_COLUMNS}
                                    />
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={columns.length} className={styles.sinResultados}>
                                        {clientes.length === 0
                                            ? 'No hay clientes registrados'
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

export default ListaClientesExternos;