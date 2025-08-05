import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { databaseService } from '../../services/database';
import { exportExcelFile } from '../../utils/export';
import ImportModal from '../../utils/import/components/ImportModal';
import { PRODUCTOS_SERVICIOS_SCHEMA, ALLOWED_FILE_TYPES } from '../../utils/import/constants/productosServicios';
import { COLUMNAS_PRODUCTOS_SERVICIOS, DEFAULT_COLUMNAS_PRODUCTOS, NIVELES_RIESGO } from './constants';
import ProductoServicioTable from './ProductoServicioTable';
import ColumnSelector from './ColumnSelector';
import styles from './styles.module.css';

const initialFormData = {
  producto_servicio: '',
  riesgo_producto: '',
  riesgo_cliente: '',
  oficina: '',
  observaciones: '',
  fecha_registro: ''
};

const ListaProductoServicio = ({ onBack }) => {
  // Estados
  const [productos, setProductos] = useState([]);
  const [oficinas, setOficinas] = useState([]);
  const [formData, setFormData] = useState(initialFormData);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filtro, setFiltro] = useState('');
  const [columnasVisibles, setColumnasVisibles] = useState(DEFAULT_COLUMNAS_PRODUCTOS);
  const [mostrarSelectorColumnas, setMostrarSelectorColumnas] = useState(false);
  const [todasLasColumnas, setTodasLasColumnas] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  // Cargar oficinas
  const cargarOficinas = useCallback(async () => {
    try {
      const { success, data } = await databaseService.listarSucursales();
      if (success) {
        const oficinasUnicas = [...new Set(data.map(sucursal => sucursal.oficina))];
        setOficinas(oficinasUnicas);
      }
    } catch (error) {
      console.error('Error al cargar oficinas:', error);
    }
  }, []);

  // Cargar productos
  const cargarProductos = useCallback(async () => {
    setLoading(true);
    setError('');
    
    try {
      const { success, data, error: dbError } = await databaseService.listarProductosServicios();
      if (success) {
        setProductos(data);
      } else {
        setError(dbError || 'Error al cargar productos/servicios');
      }
    } catch (err) {
      setError('Error al cargar productos/servicios: ' + err.message);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarProductos();
    cargarOficinas();
  }, [cargarProductos, cargarOficinas]);

  // Gestión de columnas visibles
  const toggleColumna = useCallback((columnaId) => {
    setColumnasVisibles(prev => {
      const existe = prev.some(col => col.id === columnaId);
      
      if (existe) {
        return prev.filter(col => col.id !== columnaId);
      } else {
        const columnaCompleta = COLUMNAS_PRODUCTOS_SERVICIOS.find(col => col.id === columnaId);
        return [...prev, columnaCompleta].sort((a, b) =>
          COLUMNAS_PRODUCTOS_SERVICIOS.findIndex(col => col.id === a.id) -
          COLUMNAS_PRODUCTOS_SERVICIOS.findIndex(col => col.id === b.id)
        );
      }
    });
  }, []);

  const toggleTodasLasColumnas = useCallback(() => {
    setTodasLasColumnas(prev => !prev);
    setColumnasVisibles(todasLasColumnas 
      ? DEFAULT_COLUMNAS_PRODUCTOS 
      : COLUMNAS_PRODUCTOS_SERVICIOS
    );
  }, [todasLasColumnas]);

  // Manejo de cambios en el formulario
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  // Envío del formulario
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    if (!formData.producto_servicio || !formData.riesgo_producto || !formData.riesgo_cliente) {
      setError('Por favor complete todos los campos requeridos');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      let resultado;
      
      if (editingId !== null) {
        // Actualización
        resultado = await databaseService.actualizarProductoServicio(editingId, formData);
        
        if (resultado.success) {
          setProductos(prev => prev.map(item => 
            item.id === editingId ? { ...formData, id: editingId } : item
          ));
          setFormData(initialFormData);
          setEditingId(null);
        } else {
          throw new Error(resultado.error);
        }
      } else {
        // Creación
        const nuevoProducto = {
          ...formData,
          fecha_registro: new Date().toISOString()
        };
        
        resultado = await databaseService.crearProductoServicio(nuevoProducto);
        
        if (resultado.success) {
          setProductos(prev => [{ ...nuevoProducto, id: resultado.id }, ...prev]);
          setFormData(initialFormData);
        } else {
          throw new Error(resultado.error);
        }
      }
    } catch (error) {
      setError(error.message || 'Error al guardar producto/servicio');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }, [formData, editingId]);

  // Editar producto
  const handleEdit = useCallback((producto) => {
    setFormData({
      producto_servicio: producto.producto_servicio,
      riesgo_producto: producto.riesgo_producto,
      riesgo_cliente: producto.riesgo_cliente,
      oficina: producto.oficina || '',
      observaciones: producto.observaciones || '',
      fecha_registro: producto.fecha_registro
    });
    setEditingId(producto.id);
  }, []);

  // Eliminar producto
  const handleDelete = useCallback(async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este producto/servicio?')) {
      setLoading(true);
      setError('');
      
      try {
        const resultado = await databaseService.eliminarProductoServicio(id);
        
        if (resultado.success) {
          setProductos(prev => prev.filter(item => item.id !== id));
        } else {
          throw new Error(resultado.error);
        }
      } catch (error) {
        setError(error.message || 'Error al eliminar producto/servicio');
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }
  }, []);

  // Filtrado y exportación
  const productosFiltrados = useMemo(() => {
    if (!filtro) return productos;
    
    const texto = filtro.toLowerCase();
    return productos.filter(producto => 
      Object.values(producto).some(
        value => typeof value === 'string' && value.toLowerCase().includes(texto)
      )
    );
  }, [productos, filtro]);

  const handleFiltroChange = useCallback((e) => {
    setFiltro(e.target.value);
  }, []);

  const handleExportExcel = useCallback(() => {
    exportExcelFile(
      productosFiltrados,
      COLUMNAS_PRODUCTOS_SERVICIOS.map(col => ({ id: col.id, name: col.nombre })),
      `lista_productos_servicios`,
      {
        sheetName: 'Productos y Servicios',
        headerStyle: {
          font: { bold: true, color: { rgb: 'FFFFFF' } },
          fill: { fgColor: { rgb: '4472C4' } },
          alignment: { horizontal: 'center' }
        }
      }
    );
  }, [productosFiltrados]);

  // Importación
  const handleImportResult = useCallback((result) => {
    if (result?.success) {
      cargarProductos();
      alert(`Importación completada: ${result.importedCount} registros importados`);
    }
  }, [cargarProductos]);

  // Etiquetas de riesgo
  const getLabelRiesgo = useCallback((valor) => {
    const nivel = NIVELES_RIESGO.find(item => item.value === valor);
    return nivel ? nivel.label : valor;
  }, []);

  return (
    <div className={styles.container}>
      <h2>Lista de Producto/Servicio</h2>
      
      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.controles}>
        <input
          type="text"
          placeholder="Buscar productos/servicios..."
          value={filtro}
          onChange={handleFiltroChange}
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
            onClick={() => setMostrarSelectorColumnas(!mostrarSelectorColumnas)}
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
            {todasLasColumnas ? 'Mostrar menos' : 'Mostrar todas'}
          </button>

          <button
            onClick={handleExportExcel}
            className={styles.botonExportar}
            disabled={loading || productosFiltrados.length === 0}
          >
            Exportar Excel
          </button>
        </div>
      </div>

      {showImportModal && (
        <ImportModal
          onClose={(result) => {
            setShowImportModal(false);
            if (result?.success) cargarProductos();
          }}
          databaseService={databaseService}
          schema={PRODUCTOS_SERVICIOS_SCHEMA}
          title="Importar Productos/Servicios"
          importFunctionName="importarProductosServicios"
          successMessage="Importación de productos/servicios completada"
          allowedFileTypes={ALLOWED_FILE_TYPES}
        />
      )}

      {mostrarSelectorColumnas && (
        <ColumnSelector
          columns={COLUMNAS_PRODUCTOS_SERVICIOS}
          visibleColumns={columnasVisibles}
          onToggleColumn={toggleColumna}
          loading={loading}
        />
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Producto/Servicio:</label>
            <input
              type="text"
              name="producto_servicio"
              value={formData.producto_servicio}
              onChange={handleChange}
              placeholder="Ingrese el producto o servicio"
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label>Oficina:</label>
            <select
              name="oficina"
              value={formData.oficina}
              onChange={handleChange}
            >
              <option value="">Seleccione una oficina</option>
              {oficinas.map((oficina, index) => (
                <option key={`oficina-${index}`} value={oficina}>
                  {oficina}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Riesgo Producto/Servicio:</label>
            <select
              name="riesgo_producto"
              value={formData.riesgo_producto}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione un nivel</option>
              {NIVELES_RIESGO.map((nivel) => (
                <option key={`producto-${nivel.value}`} value={nivel.value}>
                  {nivel.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className={styles.formGroup}>
            <label>Riesgo Cliente:</label>
            <select
              name="riesgo_cliente"
              value={formData.riesgo_cliente}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione un nivel</option>
              {NIVELES_RIESGO.map((nivel) => (
                <option key={`cliente-${nivel.value}`} value={nivel.value}>
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
            placeholder="Ingrese observaciones adicionales"
            rows={3}
          />
        </div>
        
        <button 
          type="submit" 
          className={styles.saveButton}
          disabled={loading}
        >
          {loading ? 'Guardando...' : (editingId ? 'Actualizar' : 'Guardar')}
        </button>
      </form>

      <ProductoServicioTable
        productos={productosFiltrados}
        isLoading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        getLabelRiesgo={getLabelRiesgo}
        visibleColumns={columnasVisibles}
        hasProductos={productos.length > 0}
        hasResults={productosFiltrados.length > 0}
      />
    </div>
  );
};

export default ListaProductoServicio;