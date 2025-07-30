import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { databaseService } from '../../services/database';
import { exportExcelFile } from '../../utils/export';
import ImportModal from '../../utils/import/components/ImportModal';
import { ACCIONISTAS_SCHEMA, ALLOWED_FILE_TYPES } from '../../utils/import/constants/accionistasSocios';
import { COLUMNAS_ACCIONISTAS_SOCIOS, DEFAULT_COLUMNAS_ACCIONISTAS } from './constants';
import SociosTable from './SociosTable';
import ColumnSelector from './ColumnSelector';
import styles from './listaAccionistasSocios.module.css';

const ListaAccionistasSocios = () => {
    const [state, setState] = useState({
        accionistas: [],
        loading: true,
        error: '',
        filtro: '',
        columnasVisibles: DEFAULT_COLUMNAS_ACCIONISTAS,
        mostrarSelectorColumnas: false,
        todasLasColumnas: false // Nuevo estado para controlar mostrar todas las columnas
    });

    const [showImportModal, setShowImportModal] = useState(false); // Estado para controlar el modal

    const navigate = useNavigate();

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

    useEffect(() => {
        cargarAccionistas();
    }, [cargarAccionistas]);

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

    const filtrarAccionistas = useCallback((accionista) => {
        if (!state.filtro) return true;
        const texto = state.filtro.toLowerCase();
        return Object.keys(accionista).some(key =>
            typeof accionista[key] === 'string' &&
            accionista[key].toLowerCase().includes(texto)
        );
    }, [state.filtro]);

    const formatearValor = useCallback((valor) => {
        if (valor == null) return '-';
        if (typeof valor === 'string' && valor.length > 20) {
            return `${valor.substring(0, 17)}...`;
        }
        return valor;
    }, []);

    const accionistasFiltrados = useMemo(() =>
        state.accionistas.filter(filtrarAccionistas),
        [state.accionistas, filtrarAccionistas]
    );

    const handleFiltroChange = useCallback((e) => {
        setState(prev => ({ ...prev, filtro: e.target.value }));
    }, []);

    const toggleSelectorColumnas = useCallback(() => {
        setState(prev => ({ ...prev, mostrarSelectorColumnas: !prev.mostrarSelectorColumnas }));
    }, []);

    const handleExportExcel = useCallback(() => {
        exportExcelFile(
            accionistasFiltrados,
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
    }, [accionistasFiltrados]);

    const renderImportButton = () => (
        <button
            onClick={() => setShowImportModal(true)}
            className={styles.botonImportar}
            disabled={state.loading}
        >
            Importar Excel
        </button>
    );
    const handleImportResult = useCallback((result) => {
        if (result?.success) {
            cargarAccionistas(); // Recargar la lista después de importar
            alert(`Importación completada: ${result.importedCount} registros importados`);
        }
    }, [cargarAccionistas]);

    return (
        <div className={styles.contenedor}>
            <h1>Accionistas y Socios</h1>

            {state.error && <div className={styles.error}>{state.error}</div>}

            <div className={styles.controles}>
                <input
                    type="text"
                    placeholder="Buscar accionistas/socios..."
                    value={state.filtro}
                    onChange={handleFiltroChange}
                    className={styles.buscador}
                    disabled={state.loading}
                />

                <div className={styles.controlesDerecha}>
                    {renderImportButton()}
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
                        disabled={state.loading || accionistasFiltrados.length === 0}
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
                        if (result?.success) cargarAccionistas();
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
                <SociosTable
                    visibleColumns={state.columnasVisibles}
                    filteredClients={accionistasFiltrados}
                    hasClients={state.accionistas.length > 0}
                    hasResults={accionistasFiltrados.length > 0}
                    formatValue={formatearValor}
                    onDelete={eliminarAccionista}
                />
            )}
        </div>
    );
};

export default ListaAccionistasSocios;