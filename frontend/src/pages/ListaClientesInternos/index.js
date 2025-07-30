import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { databaseService } from '../../services/database';
import { exportExcelFile } from '../../utils/export';
import { COLUMNAS_CLIENTES_INTERNOS, DEFAULT_COLUMNAS_CLIENTES } from './constants';
import ClientTable from './ClientTable';
import ColumnSelector from './ColumnSelector';
import styles from './listaClientesInternos.module.css';

const ListaClientesInternos = () => {
    const [state, setState] = useState({
        clientes: [],
        loading: true,
        error: '',
        filtro: '',
        columnasVisibles: DEFAULT_COLUMNAS_CLIENTES,
        mostrarSelectorColumnas: false,
        todasLasColumnas: false
    });

    const navigate = useNavigate();

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

    const filtrarClientes = useCallback((cliente) => {
        if (!state.filtro) return true;
        const texto = state.filtro.toLowerCase();
        return Object.values(cliente).some(
            valor => valor && valor.toString().toLowerCase().includes(texto)
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
            COLUMNAS_CLIENTES_INTERNOS.map(col => ({ id: col.id, name: col.nombre })),
            `reporte_clientes_internos_${new Date().toISOString().slice(0, 10)}`,
            {
                sheetName: 'Clientes Internos',
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
            <h1>Clientes Internos</h1>

            {state.error && <div className={styles.error}>{state.error}</div>}

            <div className={styles.controles}>
                <input
                    type="text"
                    placeholder="Buscar clientes internos..."
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
                        onClick={handleExportExcel}
                        className={styles.botonExportar}
                        disabled={state.loading || clientesFiltrados.length === 0}
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
                <ClientTable
                    visibleColumns={state.columnasVisibles}
                    filteredClients={clientesFiltrados}
                    hasClients={state.clientes.length > 0}
                    hasResults={clientesFiltrados.length > 0}
                    formatValue={formatearValor}
                    onDelete={eliminarCliente}
                />
            )}
        </div>
    );
};

export default ListaClientesInternos;