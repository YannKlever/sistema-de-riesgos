import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { databaseService } from '../../services/database';
import { exportExcelFile } from '../../utils/export';
import ImportModal from '../../utils/import/components/ImportModal';
import { CLIENTES_EXTERNOS_SCHEMA } from '../../utils/import/constants/clientesExternos';
import { TODAS_LAS_COLUMNAS, DEFAULT_VISIBLE_COLUMNS } from './constants';
import ColumnSelector from './ColumnSelector';
import ClientTable from './ClientTable';
import styles from './listaClientesExternos.module.css';

const ListaClientesExternos = () => {
    const [state, setState] = useState({
        clientes: [],
        loading: true,
        error: '',
        filtro: '',
        columnasVisibles: DEFAULT_VISIBLE_COLUMNS,
        mostrarSelectorColumnas: false,
        todasLasColumnas: false // Nuevo estado para controlar mostrar todas las columnas
    });
    const [showImportModal, setShowImportModal] = useState(false);
    const navigate = useNavigate();

    const cargarClientes = useCallback(async () => {
        try {
            setState(prev => ({ ...prev, loading: true, error: '' }));
            const resultado = await databaseService.listarClientesExternos();

            if (resultado.success) {
                setState(prev => ({ ...prev, clientes: resultado.data }));
            } else {
                setState(prev => ({
                    ...prev,
                    clientes: [],
                    error: resultado.error || 'Error al cargar clientes'
                }));
            }
        } catch (err) {
            setState(prev => ({
                ...prev,
                clientes: [],
                error: 'Error de conexión con la base de datos'
            }));
            console.error('Error al cargar clientes:', err);
        } finally {
            setState(prev => ({ ...prev, loading: false }));
        }
    }, []);

    useEffect(() => {
        cargarClientes();
    }, [cargarClientes]);

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

    const eliminarCliente = useCallback(async (id) => {
        if (window.confirm('¿Está seguro de eliminar este cliente?')) {
            try {
                setState(prev => ({ ...prev, loading: true }));
                const resultado = await databaseService.eliminarClienteExterno(id);

                if (resultado.success) {
                    await cargarClientes();
                } else {
                    setState(prev => ({
                        ...prev,
                        error: resultado.error || 'Error al eliminar cliente',
                        loading: false
                    }));
                }
            } catch (err) {
                setState(prev => ({
                    ...prev,
                    error: 'Error al conectar con el servidor',
                    loading: false
                }));
                console.error('Error al eliminar cliente:', err);
            }
        }
    }, [cargarClientes]);

    const filtrarClientes = useCallback((cliente) => {
        if (!state.filtro) return true;
        const texto = state.filtro.toLowerCase();
        return Object.keys(cliente).some(key =>
            typeof cliente[key] === 'string' &&
            cliente[key].toLowerCase().includes(texto)
        );
    }, [state.filtro]);

    const formatearValor = useCallback((valor) => {
        if (valor == null) return '-';
        if (typeof valor === 'string' && valor.length > 20) {
            return `${valor.substring(0, 17)}...`;
        }
        return valor;
    }, []);

    const clientesFiltrados = useMemo(() =>
        state.clientes.filter(filtrarClientes),
        [state.clientes, filtrarClientes]
    );

    const handleFiltroChange = useCallback((e) => {
        setState(prev => ({ ...prev, filtro: e.target.value }));
    }, []);

    const toggleSelectorColumnas = useCallback(() => {
        setState(prev => ({ ...prev, mostrarSelectorColumnas: !prev.mostrarSelectorColumnas }));
    }, []);

    const handleExportExcel = useCallback(() => {
        exportExcelFile(
            clientesFiltrados,
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
    }, [clientesFiltrados]);

    return (
        <div className={styles.contenedor}>
            <h1>Clientes Externos</h1>

            {state.error && <div className={styles.error}>{state.error}</div>}

            <div className={styles.controles}>
                <input
                    type="text"
                    placeholder="Buscar clientes..."
                    value={state.filtro}
                    onChange={handleFiltroChange}
                    className={styles.buscador}
                    disabled={state.loading}
                />

                <div className={styles.controlesDerecha}>
                    <button
                        onClick={toggleSelectorColumnas}
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
                        onClick={() => setShowImportModal(true)}
                        className={styles.botonImportar}
                        disabled={state.loading}
                    >
                        Importar Excel
                    </button>
                    <button
                        onClick={handleExportExcel}
                        className={styles.botonExportar}
                        disabled={state.loading || clientesFiltrados.length === 0}
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

            {state.mostrarSelectorColumnas && (
                <ColumnSelector
                    columns={TODAS_LAS_COLUMNAS}
                    visibleColumns={state.columnasVisibles}
                    onToggleColumn={toggleColumna}
                    loading={state.loading}
                />
            )}

            {state.loading ? (
                <div className={styles.cargando}>Cargando clientes...</div>
            ) : (
                <ClientTable
                    visibleColumns={state.columnasVisibles}
                    filteredClients={clientesFiltrados}
                    hasClients={state.clientes.length > 0}
                    hasResults={clientesFiltrados.length > 0}
                    formatValue={formatearValor}
                    onDelete={eliminarCliente}
                />
            )}
            {showImportModal && (
                <ImportModal
                    onClose={(result) => {
                        setShowImportModal(false);
                        if (result?.success) {
                            cargarClientes(); // Recargar la lista después de importar
                        }
                    }}
                    databaseService={databaseService}
                    schema={CLIENTES_EXTERNOS_SCHEMA}
                    title="Importar Clientes Externos"
                    importFunctionName="importarClientesExternos"
                    successMessage="Clientes externos importados correctamente"
                />
            )}
        </div>
    );
};

export default ListaClientesExternos;
