import { useState, useEffect } from 'react';
import styles from './styles.module.css';

const ListaSucursales = ({ onBack }) => {
  const [sucursales, setSucursales] = useState([]);
  const [formData, setFormData] = useState({
    oficina: '',
    ubicacion: '',
    departamento: '',
    riesgo_departamento: 'bajo',
    municipio: '',
    riesgo_municipio: 'bajo',
    zona: '',
    riesgo_zona: 'bajo',
    frontera: '',
    riesgo_frontera: 'bajo',
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
    cargarSucursales();
  }, []);

  const cargarSucursales = async () => {
    setIsLoading(true);
    try {
      const resultado = await window.electronAPI.listarSucursales();
      if (resultado.success) {
        setSucursales(resultado.data);
      } else {
        console.error('Error al cargar sucursales:', resultado.error);
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
        const resultado = await window.electronAPI.actualizarSucursal(editingId, formData);
        if (resultado.success) {
          setSucursales(sucursales.map(item => 
            item.id === editingId ? { ...formData, id: editingId } : item
          ));
          setEditingId(null);
        }
      } else {
        const resultado = await window.electronAPI.crearSucursal(formData);
        if (resultado.success) {
          const nuevaSucursal = { ...formData, id: resultado.id };
          setSucursales([nuevaSucursal, ...sucursales]);
        }
      }
      setFormData({
        oficina: '',
        ubicacion: '',
        departamento: '',
        riesgo_departamento: 'bajo',
        municipio: '',
        riesgo_municipio: 'bajo',
        zona: '',
        riesgo_zona: 'bajo',
        frontera: '',
        riesgo_frontera: 'bajo',
        observaciones: ''
      });
    } catch (error) {
      console.error('Error al guardar sucursal:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (sucursal) => {
    setFormData({
      oficina: sucursal.oficina,
      ubicacion: sucursal.ubicacion,
      departamento: sucursal.departamento,
      riesgo_departamento: sucursal.riesgo_departamento,
      municipio: sucursal.municipio || '',
      riesgo_municipio: sucursal.riesgo_municipio || 'bajo',
      zona: sucursal.zona || '',
      riesgo_zona: sucursal.riesgo_zona || 'bajo',
      frontera: sucursal.frontera || '',
      riesgo_frontera: sucursal.riesgo_frontera || 'bajo',
      observaciones: sucursal.observaciones || ''
    });
    setEditingId(sucursal.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta sucursal?')) {
      setIsLoading(true);
      try {
        const resultado = await window.electronAPI.eliminarSucursal(id);
        if (resultado.success) {
          setSucursales(sucursales.filter(item => item.id !== id));
        }
      } catch (error) {
        console.error('Error al eliminar sucursal:', error);
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
      <h2>Lista de Sucursales</h2>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label>Oficina:</label>
          <input
            type="text"
            name="oficina"
            value={formData.oficina}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className={styles.formGroup}>
          <label>Ubicación:</label>
          <input
            type="text"
            name="ubicacion"
            value={formData.ubicacion}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className={styles.formGroup}>
          <label>Departamento:</label>
          <input
            type="text"
            name="departamento"
            value={formData.departamento}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className={styles.formGroup}>
          <label>Riesgo del departamento:</label>
          <select
            name="riesgo_departamento"
            value={formData.riesgo_departamento}
            onChange={handleChange}
            required
          >
            {nivelesRiesgo.map((nivel) => (
              <option key={`departamento-${nivel.value}`} value={nivel.value}>
                {nivel.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className={styles.formGroup}>
          <label>Municipio:</label>
          <input
            type="text"
            name="municipio"
            value={formData.municipio}
            onChange={handleChange}
          />
        </div>
        
        <div className={styles.formGroup}>
          <label>Riesgo del municipio:</label>
          <select
            name="riesgo_municipio"
            value={formData.riesgo_municipio}
            onChange={handleChange}
          >
            {nivelesRiesgo.map((nivel) => (
              <option key={`municipio-${nivel.value}`} value={nivel.value}>
                {nivel.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className={styles.formGroup}>
          <label>Zona:</label>
          <input
            type="text"
            name="zona"
            value={formData.zona}
            onChange={handleChange}
          />
        </div>
        
        <div className={styles.formGroup}>
          <label>Riesgo de zona:</label>
          <select
            name="riesgo_zona"
            value={formData.riesgo_zona}
            onChange={handleChange}
          >
            {nivelesRiesgo.map((nivel) => (
              <option key={`zona-${nivel.value}`} value={nivel.value}>
                {nivel.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className={styles.formGroup}>
          <label>Frontera:</label>
          <input
            type="text"
            name="frontera"
            value={formData.frontera}
            onChange={handleChange}
          />
        </div>
        
        <div className={styles.formGroup}>
          <label>Riesgo de frontera:</label>
          <select
            name="riesgo_frontera"
            value={formData.riesgo_frontera}
            onChange={handleChange}
          >
            {nivelesRiesgo.map((nivel) => (
              <option key={`frontera-${nivel.value}`} value={nivel.value}>
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

      {isLoading && sucursales.length === 0 ? (
        <p>Cargando sucursales...</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Oficina</th>
              <th>Ubicación</th>
              <th>Departamento</th>
              <th>Riesgo Depto.</th>
              <th>Municipio</th>
              <th>Riesgo Mun.</th>
              <th>Fecha Registro</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {sucursales.map((item) => (
              <tr key={item.id}>
                <td>{item.oficina}</td>
                <td>{item.ubicacion}</td>
                <td>{item.departamento}</td>
                <td>{getLabelRiesgo(item.riesgo_departamento)}</td>
                <td>{item.municipio || '-'}</td>
                <td>{item.municipio ? getLabelRiesgo(item.riesgo_municipio) : '-'}</td>
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

export default ListaSucursales;