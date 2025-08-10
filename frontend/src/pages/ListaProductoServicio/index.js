import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useReactTable, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, flexRender } from '@tanstack/react-table';
import { databaseService } from '../../services/database';
import { exportExcelFile } from '../../utils/export';
import ImportModal from '../../utils/import/components/ImportModal';
import { PRODUCTOS_SERVICIOS_SCHEMA, ALLOWED_FILE_TYPES } from '../../utils/import/constants/productosServicios';
import { COLUMNAS_PRODUCTOS_SERVICIOS, DEFAULT_COLUMNAS_PRODUCTOS, NIVELES_RIESGO } from './constants';
import ColumnSelector from './ColumnSelector';
import ProductosFormModal from './ProductosFormModal';
import styles from './styles.module.css';

const ListaProductosServicios = ({ onBack }) => {
  const [state, setState] = useState({
    productos: [],
    oficinas: [],
    loading: true,
    error: '',
    columnasVisibles: DEFAULT_COLUMNAS_PRODUCTOS,
    mostrarSelectorColumnas: false,
    todasLasColumnas: false
  });

  const [showImportModal, setShowImportModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [globalFilter, setGlobalFilter] = useState('');

  const cargarDatos = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: '' }));

      // Cargar productos y oficinas en paralelo
      const [productosRes, oficinasRes] = await Promise.all([
        databaseService.listarProductosServicios(),
        databaseService.listarSucursales()
      ]);

      if (productosRes.success) {
        setState(prev => ({ ...prev, productos: productosRes.data }));
      } else {
        throw new Error(productosRes.error || 'Error al cargar productos');
      }

      if (oficinasRes.success) {
        const oficinasUnicas = [...new Set(oficinasRes.data.map(s => s.oficina))];
        setState(prev => ({ ...prev, oficinas: oficinasUnicas }));
      }
    } catch (err) {
      setState(prev => ({
        ...prev,
        error: err.message || 'Error al cargar datos',
        productos: [],
        oficinas: []
      }));
      console.error('Error:', err);
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  const toggleColumna = useCallback((columnaId) => {
    setState(prev => {
      const existe = prev.columnasVisibles.some(col => col.id === columnaId);
      let nuevasColumnas;

      if (existe) {
        nuevasColumnas = prev.columnasVisibles.filter(col => col.id !== columnaId);
      } else {
        const columnaCompleta = COLUMNAS_PRODUCTOS_SERVICIOS.find(col => col.id === columnaId);
        nuevasColumnas = [...prev.columnasVisibles, columnaCompleta].sort((a, b) =>
          COLUMNAS_PRODUCTOS_SERVICIOS.findIndex(col => col.id === a.id) -
          COLUMNAS_PRODUCTOS_SERVICIOS.findIndex(col => col.id === b.id)
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
        ? COLUMNAS_PRODUCTOS_SERVICIOS
        : DEFAULT_COLUMNAS_PRODUCTOS
    }));
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este producto/servicio?')) {
      setState(prev => ({ ...prev, loading: true, error: '' }));
      try {
        const resultado = await databaseService.eliminarProductoServicio(id);
        if (resultado.success) {
          setState(prev => ({
            ...prev,
            productos: prev.productos.filter(item => item.id !== id)
          }));
        } else {
          throw new Error(resultado.error);
        }
      } catch (error) {
        setState(prev => ({ ...prev, error: error.message || 'Error al eliminar' }));
      } finally {
        setState(prev => ({ ...prev, loading: false }));
      }
    }
  };

  const formatearValor = useCallback((valor) => {
    if (valor == null) return '-';
    if (typeof valor === 'string' && valor.length > 20) {
      return `${valor.substring(0, 17)}...`;
    }
    return valor;
  }, []);

  const getLabelRiesgo = (valor) => {
    const nivel = NIVELES_RIESGO.find(item => item.value === valor);
    return nivel ? nivel.label : valor;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Fecha no disponible';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Fecha inválida';
      return date.toLocaleString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return 'Fecha inválida';
    }
  };

  // Configuración de la tabla
  const columns = useMemo(() => [
    ...state.columnasVisibles.map(col => ({
      accessorKey: col.id,
      header: col.nombre,
      cell: info => {
        const value = info.getValue();
        if (col.id === 'fecha_registro') {
          return formatDate(value);
        } else if (col.id === 'riesgo_producto' || col.id === 'riesgo_cliente') {
          return getLabelRiesgo(value) || '-';
        }
        return formatearValor(value);
      },
      size: 150
    })),
    {
      id: 'acciones',
      header: 'Acciones',
      cell: info => (
        <div className={styles.acciones}>
          <button
            onClick={() => {
              setEditingId(info.row.original.id);
              setShowFormModal(true);
            }}
            className={styles.botonEditar}
            disabled={state.loading}
          >
            Editar
          </button>
          <button
            onClick={() => handleDelete(info.row.original.id)}
            className={styles.botonEliminar}
            disabled={state.loading}
          >
            Eliminar
          </button>
        </div>
      ),
      size: 120
    }
  ], [state.columnasVisibles, state.loading, formatearValor]);

  const table = useReactTable({
    data: state.productos,
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

  const handleExportExcel = useCallback(() => {
    exportExcelFile(
      table.getFilteredRowModel().rows.map(row => row.original),
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
  }, [table]);

  return (
    <div className={styles.container}>
      <h1>Productos y Servicios</h1>

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
            onClick={() => {
              setEditingId(null);
              setShowFormModal(true);
            }}
            className={styles.botonNuevo}
          >
            Nuevo Producto/Servicio
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
            if (result?.success) {
              cargarDatos();
              alert(`Importación completada: ${result.importedCount} registros importados`);
            }
          }}
          databaseService={databaseService}
          schema={PRODUCTOS_SERVICIOS_SCHEMA}
          title="Importar Productos/Servicios"
          importFunctionName="importarProductosServicios"
          successMessage="Importación completada"
          allowedFileTypes={ALLOWED_FILE_TYPES}
        />
      )}

      {state.mostrarSelectorColumnas && (
        <ColumnSelector
          columns={COLUMNAS_PRODUCTOS_SERVICIOS}
          visibleColumns={state.columnasVisibles}
          onToggleColumn={toggleColumna}
          loading={state.loading}
        />
      )}

      {state.loading && state.productos.length === 0 ? (
        <div className={styles.cargando}>Cargando productos/servicios...</div>
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
                    {state.productos.length === 0
                      ? 'No hay productos/servicios registrados'
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

      {showFormModal && (
        <ProductosFormModal
          editingId={editingId}
          productos={state.productos}
          oficinas={state.oficinas}
          onClose={() => {
            setShowFormModal(false);
            setEditingId(null);
          }}
          onSuccess={() => {
            cargarDatos();
            setShowFormModal(false);
            setEditingId(null);
          }}
          onError={(error) => {
            setState(prev => ({ ...prev, error }));
          }}
        />
      )}
    </div>
  );
};

export default ListaProductosServicios;