import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReactTable, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, flexRender } from '@tanstack/react-table';
import { databaseService } from '../../services/database';
import SociosActions from './SocioActions';
import { exportExcelFile } from '../../utils/export';
import ImportModal from '../../utils/import/components/ImportModal';
import { ACCIONISTAS_SCHEMA, ALLOWED_FILE_TYPES } from '../../utils/import/constants/accionistasSocios';
import { COLUMNAS_ACCIONISTAS_SOCIOS, DEFAULT_COLUMNAS_ACCIONISTAS } from './constants';
import ColumnSelector from './ColumnSelector';
import styles from './listaAccionistasSocios.module.css';

const ListaAccionistasSocios = () => {
    // 1. Estados
    const [state, setState] = useState({
        accionistas: [],
        loading: true,
        error: '',
        columnasVisibles: DEFAULT_COLUMNAS_ACCIONISTAS,
        mostrarSelectorColumnas: false,
        todasLasColumnas: false
    });

    const [showImportModal, setShowImportModal] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const navigate = useNavigate();

    // 2. Funciones auxiliares (declaradas primero)
    const formatearValor = useCallback((valor) => {
        if (valor == null) return '-';
        if (typeof valor === 'string' && valor.length > 20) {
            return `${valor.substring(0, 17)}...`;
        }
        return valor;
    }, []);

    const cargarAccionistas = useCallback(async () => {
        try {
            setState(prev => ({ ...prev, loading: true, error: '' }));
            const resultado = await databaseService.listarAccionistasSocios();

            if (resultado.success) {
                setState(prev => ({ ...prev, accionistas: resultado.data }));
            } else {
                setState(prev => ({
                    ...prev,
                    accionistas: [],
                    error: resultado.error || 'Error al cargar accionistas/socios'
                }));
            }
        } catch (err) {
            setState(prev => ({
                ...prev,
                accionistas: [],
                error: 'Error de conexión con la base de datos'
            }));
            console.error('Error al cargar accionistas/socios:', err);
        } finally {
            setState(prev => ({ ...prev, loading: false }));
        }
    }, []);

    const eliminarAccionista = useCallback(async (id) => {
        if (window.confirm('¿Está seguro de eliminar este accionista/socio?')) {
            try {
                setState(prev => ({ ...prev, loading: true }));
                const resultado = await databaseService.eliminarAccionistaSocio(id);

                if (resultado.success) {
                    await cargarAccionistas();
                } else {
                    setState(prev => ({
                        ...prev,
                        error: resultado.error || 'Error al eliminar accionista/socio',
                        loading: false
                    }));
                }
            } catch (err) {
                setState(prev => ({
                    ...prev,
                    error: 'Error al conectar con el servidor',
                    loading: false
                }));
                console.error('Error al eliminar accionista/socio:', err);
            }
        }
    }, [cargarAccionistas]);

    // 3. Configuración de la tabla (usa las funciones ya declaradas)
    const columns = useMemo(() => [
        ...state.columnasVisibles.map(col => ({
            accessorKey: col.id,
            header: col.nombre,
            cell: info => formatearValor(info.getValue()),
            size: 150
        })),
        {
            id: 'acciones',
            header: 'Acciones',
            cell: info => (
                <SociosActions 
                    clientId={info.row.original.id} 
                    onDelete={eliminarAccionista} 
                />
            ),
            size: 120
        }
    ], [state.columnasVisibles, formatearValor, eliminarAccionista]);

    const table = useReactTable({
        data: state.accionistas,
        columns,
        state: {
            globalFilter
        },
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: {
            pagination: {
                pageSize: 20
            }
        }
    });

    // 4. Otras funciones
    const toggleColumna = useCallback((columnaId) => {
        setState(prev => {
            const existe = prev.columnasVisibles.some(col => col.id === columnaId);
            let nuevasColumnas;

            if (existe) {
                nuevasColumnas = prev.columnasVisibles.filter(col => col.id !== columnaId);
            } else {
                const columnaCompleta = COLUMNAS_ACCIONISTAS_SOCIOS.find(col => col.id === columnaId);
                nuevasColumnas = [...prev.columnasVisibles, columnaCompleta].sort((a, b) =>
                    COLUMNAS_ACCIONISTAS_SOCIOS.findIndex(col => col.id === a.id) -
                    COLUMNAS_ACCIONISTAS_SOCIOS.findIndex(col => col.id === b.id)
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
                ? COLUMNAS_ACCIONISTAS_SOCIOS
                : DEFAULT_COLUMNAS_ACCIONISTAS
        }));
    }, []);

    const handleExportExcel = useCallback(() => {
        exportExcelFile(
            table.getFilteredRowModel().rows.map(row => row.original),
            COLUMNAS_ACCIONISTAS_SOCIOS.map(col => ({ id: col.id, name: col.nombre })),
            `lista_accionistas_socios`,
            {
                sheetName: 'Accionistas y Socios',
                headerStyle: {
                    font: { bold: true, color: { rgb: 'FFFFFF' } },
                    fill: { fgColor: { rgb: '4472C4' } },
                    alignment: { horizontal: 'center' }
                }
            }
        );
    }, [table]);

    // 5. Efectos
    useEffect(() => {
        cargarAccionistas();
    }, [cargarAccionistas]);

    // 6. Renderizado
    return (
        <div className={styles.contenedor}>
            <h1>Accionistas y Socios</h1>

            {state.error && <div className={styles.error}>{state.error}</div>}

            <div className={styles.controles}>
                <input
                    type="text"
                    placeholder="Buscar accionistas/socios..."
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
                        onClick={() => navigate('/parametros/accionistas-directorio')}
                        className={styles.botonNuevo}
                    >
                        Nuevo Accionista/Socio
                    </button>
                </div>
            </div>

            {showImportModal && (
                <ImportModal
                    onClose={(result) => {
                        setShowImportModal(false);
                        if (result?.success) {
                            cargarAccionistas();
                            alert(`Importación completada: ${result.importedCount} registros importados`);
                        }
                    }}
                    databaseService={databaseService}
                    schema={ACCIONISTAS_SCHEMA}
                    title="Importar Accionistas/Socios"
                    importFunctionName="importarAccionistasSocios"
                    successMessage="Importación de accionistas/socios completada"
                    allowedFileTypes={ALLOWED_FILE_TYPES}
                />
            )}

            {state.mostrarSelectorColumnas && (
                <ColumnSelector
                    columns={COLUMNAS_ACCIONISTAS_SOCIOS}
                    visibleColumns={state.columnasVisibles}
                    onToggleColumn={toggleColumna}
                    loading={state.loading}
                />
            )}

            {state.loading ? (
                <div className={styles.cargando}>Cargando accionistas/socios...</div>
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
                            {table.getRowModel().rows.map(row => (
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
                            ))}
                        </tbody>
                    </table>

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
                </div>
            )}
        </div>
    );
};

export default ListaAccionistasSocios;