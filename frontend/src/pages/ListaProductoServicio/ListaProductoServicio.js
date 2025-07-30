import { useState, useEffect } from 'react';
import styles from './styles.module.css';

const ListaProductoServicio = ({ onBack }) => {
  const [productos, setProductos] = useState([]);
  const [formData, setFormData] = useState({
    producto_servicio: '',
    riesgo_producto: 'bajo',
    riesgo_cliente: 'bajo',
    observaciones: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const nivelesRiesgo = [
    { value: 'bajo', label: 'Bajo' },
    { value: 'medio_bajo', label: 'Medio Bajo' },
    { value: 'medio', label: 'Medio' },
    { value: 'medio_alto', label: 'Medio Alto' },
    { value: 'alto', label: 'Alto' }
  ];

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    setIsLoading(true);
    try {
      const resultado = await window.electronAPI.listarProductosServicios();
      if (resultado.success) {
        setProductos(resultado.data);
      } else {
        console.error('Error al cargar productos:', resultado.error);
      }
    } catch (error) {
      console.error('Error en la comunicación con el backend:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (editingId !== null) {
        const resultado = await window.electronAPI.actualizarProductoServicio(editingId, formData);
        if (resultado.success) {
          setProductos(productos.map(item => 
            item.id === editingId ? { ...formData, id: editingId } : item
          ));
          setEditingId(null);
        }
      } else {
        const resultado = await window.electronAPI.crearProductoServicio(formData);
        if (resultado.success) {
          const nuevoProducto = { ...formData, id: resultado.id };
          setProductos([nuevoProducto, ...productos]);
        }
      }
      setFormData({
        producto_servicio: '',
        riesgo_producto: 'bajo',
        riesgo_cliente: 'bajo',
        observaciones: ''
      });
    } catch (error) {
      console.error('Error al guardar producto:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (producto) => {
    setFormData({
      producto_servicio: producto.producto_servicio,
      riesgo_producto: producto.riesgo_producto,
      riesgo_cliente: producto.riesgo_cliente,
      observaciones: producto.observaciones || ''
    });
    setEditingId(producto.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este producto/servicio?')) {
      setIsLoading(true);
      try {
        const resultado = await window.electronAPI.eliminarProductoServicio(id);
        if (resultado.success) {
          setProductos(productos.filter(item => item.id !== id));
        }
      } catch (error) {
        console.error('Error al eliminar producto:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const getLabelRiesgo = (valor) => {
    const nivel = nivelesRiesgo.find(item => item.value === valor);
    return nivel ? nivel.label : valor;
  };

  return (
    <div className={styles.container}>
      <button onClick={onBack} className={styles.backButton}>← Volver</button>
      <h2>Lista de Producto/Servicio</h2>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label>Producto/Servicio:</label>
          <input
            type="text"
            name="producto_servicio"
            value={formData.producto_servicio}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className={styles.formGroup}>
          <label>Riesgo de producto/servicio:</label>
          <select
            name="riesgo_producto"
            value={formData.riesgo_producto}
            onChange={handleChange}
            required
          >
            {nivelesRiesgo.map((nivel) => (
              <option key={`producto-${nivel.value}`} value={nivel.value}>
                {nivel.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className={styles.formGroup}>
          <label>Riesgo del tipo de cliente:</label>
          <select
            name="riesgo_cliente"
            value={formData.riesgo_cliente}
            onChange={handleChange}
            required
          >
            {nivelesRiesgo.map((nivel) => (
              <option key={`cliente-${nivel.value}`} value={nivel.value}>
                {nivel.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className={styles.formGroup}>
          <label>Observaciones:</label>
          <textarea
            name="observaciones"
            value={formData.observaciones}
            onChange={handleChange}
            rows="3"
          />
        </div>
        
        <button 
          type="submit" 
          className={styles.saveButton}
          disabled={isLoading}
        >
          {isLoading ? 'Guardando...' : (editingId !== null ? 'Actualizar' : 'Guardar')}
        </button>
      </form>

      {isLoading && productos.length === 0 ? (
        <p>Cargando productos...</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Producto/Servicio</th>
              <th>Riesgo Producto/Servicio</th>
              <th>Riesgo Tipo Cliente</th>
              <th>Fecha Registro</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((item) => (
              <tr key={item.id}>
                <td>{item.producto_servicio}</td>
                <td>{getLabelRiesgo(item.riesgo_producto)}</td>
                <td>{getLabelRiesgo(item.riesgo_cliente)}</td>
                <td>{new Date(item.fecha_registro).toLocaleDateString()}</td>
                <td>
                  <button 
                    onClick={() => handleEdit(item)} 
                    className={styles.editButton}
                    disabled={isLoading}
                  >
                    Editar
                  </button>
                  <button 
                    onClick={() => handleDelete(item.id)} 
                    className={styles.deleteButton}
                    disabled={isLoading}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ListaProductoServicio;