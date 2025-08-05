import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { databaseService } from '../../services/database';
import { exportExcelFile } from '../../utils/export';
import ImportModal from '../../utils/import/components/ImportModal';
import { SUCURSALES_SCHEMA, ALLOWED_FILE_TYPES } from '../../utils/import/constants/sucursales';
import { COLUMNAS_SUCURSALES, DEFAULT_COLUMNAS_SUCURSALES, NIVELES_RIESGO } from './constants';
import SucursalTable from './SucursalTable';
import ColumnSelector from './ColumnSelector';
import styles from './styles.module.css';

const ListaSucursales = ({ onBack }) => {
    const [state, setState] = useState({
        sucursales: [],
        loading: true,
        error: '',
        filtro: '',
        columnasVisibles: DEFAULT_COLUMNAS_SUCURSALES,
        mostrarSelectorColumnas: false,
        todasLasColumnas: false
    });

    const [showImportModal, setShowImportModal] = useState(false);
    const [formData, setFormData] = useState({
        oficina: '',
        ubicacion: '',
        departamento: '',
        riesgo_departamento: '',
        riesgo_departamento_numerico: null,
        municipio: '',
        riesgo_municipio: '',
        riesgo_municipio_numerico: null,
        zona: '',
        riesgo_zona: '',
        riesgo_zona_numerico: null,
        frontera: '',
        riesgo_frontera: '',
        riesgo_frontera_numerico: null,
        observaciones: '',
        fecha_registro: ''
    });
    const [editingId, setEditingId] = useState(null);

    const departamentosBolivia = [
        'La Paz', 'Santa Cruz', 'Cochabamba', 
        'Oruro', 'Potosí', 'Beni', 
        'Pando', 'Chuquisaca', 'Tarija'
    ];

    const cargarSucursales = useCallback(async () => {
        try {
            setState(prev => ({ ...prev, loading: true, error: '' }));
            const resultado = await databaseService.listarSucursales();

            if (resultado.success) {
                const sucursalesConDatos = resultado.data.map(item => ({
                    ...item,
                    riesgo_departamento_numerico: item.riesgo_departamento_numerico || 
                        NIVELES_RIESGO.find(n => n.value === item.riesgo_departamento)?.valorNumerico || null,
                    riesgo_municipio_numerico: item.riesgo_municipio_numerico || 
                        NIVELES_RIESGO.find(n => n.value === item.riesgo_municipio)?.valorNumerico || null,
                    riesgo_zona_numerico: item.riesgo_zona_numerico || 
                        NIVELES_RIESGO.find(n => n.value === item.riesgo_zona)?.valorNumerico || null,
                    riesgo_frontera_numerico: item.riesgo_frontera_numerico || 
                        NIVELES_RIESGO.find(n => n.value === item.riesgo_frontera)?.valorNumerico || null
                }));
                setState(prev => ({ ...prev, sucursales: sucursalesConDatos }));
            } else {
                setState(prev => ({
                    ...prev,
                    sucursales: [],
                    error: resultado.error || 'Error al cargar sucursales'
                }));
            }
        } catch (err) {
            setState(prev => ({
                ...prev,
                sucursales: [],
                error: 'Error de conexión con la base de datos'
            }));
            console.error('Error al cargar sucursales:', err);
        } finally {
            setState(prev => ({ ...prev, loading: false }));
        }
    }, []);

    useEffect(() => {
        cargarSucursales();
    }, [cargarSucursales]);

    const toggleColumna = useCallback((columnaId) => {
        setState(prev => {
            const existe = prev.columnasVisibles.some(col => col.id === columnaId);
            let nuevasColumnas;

            if (existe) {
                nuevasColumnas = prev.columnasVisibles.filter(col => col.id !== columnaId);
            } else {
                const columnaCompleta = COLUMNAS_SUCURSALES.find(col => col.id === columnaId);
                nuevasColumnas = [...prev.columnasVisibles, columnaCompleta].sort((a, b) =>
                    COLUMNAS_SUCURSALES.findIndex(col => col.id === a.id) -
                    COLUMNAS_SUCURSALES.findIndex(col => col.id === b.id)
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
                ? COLUMNAS_SUCURSALES
                : DEFAULT_COLUMNAS_SUCURSALES
        }));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        if (name.startsWith('riesgo_') && !name.endsWith('_numerico')) {
            const nivelSeleccionado = NIVELES_RIESGO.find(nivel => nivel.value === value);
            const nombreNumerico = `${name}_numerico`;
            
            setFormData(prev => ({
                ...prev,
                [name]: value,
                [nombreNumerico]: nivelSeleccionado ? nivelSeleccionado.valorNumerico : null
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.oficina || !formData.ubicacion || !formData.departamento || !formData.riesgo_departamento) {
            setState(prev => ({ ...prev, error: 'Por favor complete los campos requeridos' }));
            return;
        }

        setState(prev => ({ ...prev, loading: true, error: '' }));
        
        try {
            let resultado;
            if (editingId !== null) {
                const sucursalOriginal = state.sucursales.find(s => s.id === editingId);
                const datosActualizados = {
                    ...formData,
                    fecha_registro: sucursalOriginal.fecha_registro
                };
                
                resultado = await databaseService.actualizarSucursal(editingId, datosActualizados);
                if (resultado.success) {
                    setState(prev => ({
                        ...prev,
                        sucursales: prev.sucursales.map(item => 
                            item.id === editingId ? { ...datosActualizados, id: editingId } : item
                        )
                    }));
                    setEditingId(null);
                } else {
                    throw new Error(resultado.error);
                }
            } else {
                const nuevaSucursal = {
                    ...formData,
                    fecha_registro: new Date().toISOString()
                };
                
                resultado = await databaseService.crearSucursal(nuevaSucursal);
                if (resultado.success) {
                    setState(prev => ({
                        ...prev,
                        sucursales: [{ ...nuevaSucursal, id: resultado.id }, ...prev.sucursales]
                    }));
                } else {
                    throw new Error(resultado.error);
                }
            }
            
            setFormData({
                oficina: '',
                ubicacion: '',
                departamento: '',
                riesgo_departamento: '',
                riesgo_departamento_numerico: null,
                municipio: '',
                riesgo_municipio: '',
                riesgo_municipio_numerico: null,
                zona: '',
                riesgo_zona: '',
                riesgo_zona_numerico: null,
                frontera: '',
                riesgo_frontera: '',
                riesgo_frontera_numerico: null,
                observaciones: '',
                fecha_registro: ''
            });
        } catch (error) {
            setState(prev => ({ ...prev, error: error.message || 'Error al guardar sucursal' }));
            console.error('Error:', error);
        } finally {
            setState(prev => ({ ...prev, loading: false }));
        }
    };

    const handleEdit = (sucursal) => {
        setFormData({
            oficina: sucursal.oficina,
            ubicacion: sucursal.ubicacion,
            departamento: sucursal.departamento,
            riesgo_departamento: sucursal.riesgo_departamento,
            riesgo_departamento_numerico: sucursal.riesgo_departamento_numerico,
            municipio: sucursal.municipio || '',
            riesgo_municipio: sucursal.riesgo_municipio || '',
            riesgo_municipio_numerico: sucursal.riesgo_municipio_numerico || null,
            zona: sucursal.zona || '',
            riesgo_zona: sucursal.riesgo_zona || '',
            riesgo_zona_numerico: sucursal.riesgo_zona_numerico || null,
            frontera: sucursal.frontera || '',
            riesgo_frontera: sucursal.riesgo_frontera || '',
            riesgo_frontera_numerico: sucursal.riesgo_frontera_numerico || null,
            observaciones: sucursal.observaciones || '',
            fecha_registro: sucursal.fecha_registro
        });
        setEditingId(sucursal.id);
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar esta sucursal?')) {
            setState(prev => ({ ...prev, loading: true, error: '' }));
            try {
                const resultado = await databaseService.eliminarSucursal(id);
                if (resultado.success) {
                    setState(prev => ({
                        ...prev,
                        sucursales: prev.sucursales.filter(item => item.id !== id)
                    }));
                } else {
                    throw new Error(resultado.error);
                }
            } catch (error) {
                setState(prev => ({ ...prev, error: error.message || 'Error al eliminar sucursal' }));
                console.error('Error:', error);
            } finally {
                setState(prev => ({ ...prev, loading: false }));
            }
        }
    };

    const filtrarSucursales = useCallback((sucursal) => {
        if (!state.filtro) return true;
        const texto = state.filtro.toLowerCase();
        return Object.keys(sucursal).some(key =>
            typeof sucursal[key] === 'string' &&
            sucursal[key].toLowerCase().includes(texto)
        );
    }, [state.filtro]);

    const formatearValor = useCallback((valor) => {
        if (valor == null) return '-';
        if (typeof valor === 'string' && valor.length > 20) {
            return `${valor.substring(0, 17)}...`;
        }
        return valor;
    }, []);

    const sucursalesFiltradas = useMemo(() =>
        state.sucursales.filter(filtrarSucursales),
        [state.sucursales, filtrarSucursales]
    );

    const handleFiltroChange = useCallback((e) => {
        setState(prev => ({ ...prev, filtro: e.target.value }));
    }, []);

    const toggleSelectorColumnas = useCallback(() => {
        setState(prev => ({ ...prev, mostrarSelectorColumnas: !prev.mostrarSelectorColumnas }));
    }, []);

    const handleExportExcel = useCallback(() => {
        exportExcelFile(
            sucursalesFiltradas,
            COLUMNAS_SUCURSALES.map(col => ({ id: col.id, name: col.nombre })),
            `lista_sucursales`,
            {
                sheetName: 'Sucursales',
                headerStyle: {
                    font: { bold: true, color: { rgb: 'FFFFFF' } },
                    fill: { fgColor: { rgb: '4472C4' } },
                    alignment: { horizontal: 'center' }
                }
            }
        );
    }, [sucursalesFiltradas]);

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
            cargarSucursales();
            alert(`Importación completada: ${result.importedCount} registros importados`);
        }
    }, [cargarSucursales]);

    const getLabelRiesgo = (valor) => {
        const nivel = NIVELES_RIESGO.find(item => item.value === valor);
        return nivel ? nivel.label : valor;
    };

    return (
        <div className={styles.container}>
            <h2>Lista de Sucursales</h2>

            {state.error && <div className={styles.error}>{state.error}</div>}

            <div className={styles.controles}>
                <input
                    type="text"
                    placeholder="Buscar sucursales..."
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
                        disabled={state.loading || sucursalesFiltradas.length === 0}
                    >
                        Exportar Excel
                    </button>

                    {onBack && (
                        <button
                            onClick={onBack}
                            className={styles.botonRegresar}
                        >
                            Regresar
                        </button>
                    )}
                </div>
            </div>

            {showImportModal && (
                <ImportModal
                    onClose={(result) => {
                        setShowImportModal(false);
                        if (result?.success) cargarSucursales();
                    }}
                    databaseService={databaseService}
                    schema={SUCURSALES_SCHEMA}
                    title="Importar Sucursales"
                    importFunctionName="importarSucursales"
                    successMessage="Importación de sucursales completada"
                    allowedFileTypes={ALLOWED_FILE_TYPES}
                />
            )}

            {state.mostrarSelectorColumnas && (
                <ColumnSelector
                    columns={COLUMNAS_SUCURSALES}
                    visibleColumns={state.columnasVisibles}
                    onToggleColumn={toggleColumna}
                    loading={state.loading}
                />
            )}

            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                        <label>Oficina:</label>
                        <input
                            type="text"
                            name="oficina"
                            value={formData.oficina}
                            onChange={handleChange}
                            placeholder="Nombre de la oficina"
                            required
                        />
                    </div>
                    
                    <div className={styles.formGroup}>
                        <label>Dirección:</label>
                        <input
                            type="text"
                            name="ubicacion"
                            value={formData.ubicacion}
                            onChange={handleChange}
                            placeholder="Dirección exacta"
                            required
                        />
                    </div>
                </div>
                
                <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                        <label>Departamento:</label>
                        <select
                            name="departamento"
                            value={formData.departamento}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Seleccione departamento</option>
                            {departamentosBolivia.map(depto => (
                                <option key={depto} value={depto}>{depto}</option>
                            ))}
                        </select>
                    </div>
                    
                    <div className={styles.formGroup}>
                        <label>Riesgo Depto.:</label>
                        <select
                            name="riesgo_departamento"
                            value={formData.riesgo_departamento}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Nivel de riesgo</option>
                            {NIVELES_RIESGO.map(nivel => (
                                <option key={`depto-${nivel.value}`} value={nivel.value}>
                                    {nivel.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                
                <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                        <label>Municipio:</label>
                        <input
                            type="text"
                            name="municipio"
                            value={formData.municipio}
                            onChange={handleChange}
                            placeholder="Municipio"
                        />
                    </div>
                    
                    <div className={styles.formGroup}>
                        <label>Riesgo Mun.:</label>
                        <select
                            name="riesgo_municipio"
                            value={formData.riesgo_municipio}
                            onChange={handleChange}
                        >
                            <option value="">Nivel de riesgo</option>
                            {NIVELES_RIESGO.map(nivel => (
                                <option key={`mun-${nivel.value}`} value={nivel.value}>
                                    {nivel.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                
                <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                        <label>Zona:</label>
                        <input
                            type="text"
                            name="zona"
                            value={formData.zona}
                            onChange={handleChange}
                            placeholder="Zona"
                        />
                    </div>
                    
                    <div className={styles.formGroup}>
                        <label>Riesgo Zona:</label>
                        <select
                            name="riesgo_zona"
                            value={formData.riesgo_zona}
                            onChange={handleChange}
                        >
                            <option value="">Nivel de riesgo</option>
                            {NIVELES_RIESGO.map(nivel => (
                                <option key={`zona-${nivel.value}`} value={nivel.value}>
                                    {nivel.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                
                <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                        <label>Frontera:</label>
                        <input
                            type="text"
                            name="frontera"
                            value={formData.frontera}
                            onChange={handleChange}
                            placeholder="Frontera"
                        />
                    </div>
                    
                    <div className={styles.formGroup}>
                        <label>Riesgo Frontera:</label>
                        <select
                            name="riesgo_frontera"
                            value={formData.riesgo_frontera}
                            onChange={handleChange}
                        >
                            <option value="">Nivel de riesgo</option>
                            {NIVELES_RIESGO.map(nivel => (
                                <option key={`frontera-${nivel.value}`} value={nivel.value}>
                                    {nivel.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                
                <div className={styles.formGroup}>
                    <label>Observaciones:</label>
                    <textarea
                        name="observaciones"
                        value={formData.observaciones}
                        onChange={handleChange}
                        placeholder="Observaciones adicionales"
                        rows={3}
                    />
                </div>
                
                <button 
                    type="submit" 
                    className={styles.saveButton}
                    disabled={state.loading}
                >
                    {state.loading ? 'Guardando...' : (editingId !== null ? 'Actualizar' : 'Guardar')}
                </button>
            </form>

            <SucursalTable
                sucursales={sucursalesFiltradas}
                isLoading={state.loading}
                onEdit={handleEdit}
                onDelete={handleDelete}
                getLabelRiesgo={getLabelRiesgo}
                visibleColumns={state.columnasVisibles}
                hasSucursales={state.sucursales.length > 0}
                hasResults={sucursalesFiltradas.length > 0}
                formatValue={formatearValor}
            />
        </div>
    );
};

export default ListaSucursales;