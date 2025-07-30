import React, { useState, useEffect } from 'react';
import { databaseService } from '../../services/database';
import styles from './styles.module.css';
import SucursalTable from './SucursalTable';

const ListaSucursales = ({ onBack }) => {
  const [sucursales, setSucursales] = useState([]);
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
    observaciones: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const departamentosBolivia = [
    'La Paz', 'Santa Cruz', 'Cochabamba', 
    'Oruro', 'Potosí', 'Beni', 
    'Pando', 'Chuquisaca', 'Tarija'
  ];

  const nivelesRiesgo = [
    { value: 'bajo', label: 'Bajo', valorNumerico: 1 },
    { value: 'medio_bajo', label: 'Medio Bajo', valorNumerico: 2 },
    { value: 'medio', label: 'Medio', valorNumerico: 3 },
    { value: 'medio_alto', label: 'Medio Alto', valorNumerico: 4 },
    { value: 'alto', label: 'Alto', valorNumerico: 5 }
  ];

  useEffect(() => {
    cargarSucursales();
  }, []);

  const cargarSucursales = async () => {
    setIsLoading(true);
    setError('');
    try {
      const { success, data, error } = await databaseService.listarSucursales();
      if (success) {
        setSucursales(data);
      } else {
        setError(error || 'Error al cargar sucursales');
      }
    } catch (error) {
      setError('Error al cargar sucursales: ' + error.message);
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Actualizar tanto el valor textual como el numérico para los campos de riesgo
    if (name.startsWith('riesgo_') && !name.endsWith('_numerico')) {
      const nivelSeleccionado = nivelesRiesgo.find(nivel => nivel.value === value);
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
    
    // Validar campos requeridos
    if (!formData.oficina || !formData.ubicacion || !formData.departamento || !formData.riesgo_departamento) {
      setError('Por favor complete los campos requeridos');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      let resultado;
      if (editingId !== null) {
        resultado = await databaseService.actualizarSucursal(editingId, formData);
        if (resultado.success) {
          setSucursales(sucursales.map(item => 
            item.id === editingId ? { ...formData, id: editingId } : item
          ));
          setEditingId(null);
        } else {
          throw new Error(resultado.error);
        }
      } else {
        resultado = await databaseService.crearSucursal(formData);
        if (resultado.success) {
          const nuevaSucursal = { ...formData, id: resultado.id };
          setSucursales([nuevaSucursal, ...sucursales]);
        } else {
          throw new Error(resultado.error);
        }
      }
      
      // Resetear formulario sin valores predeterminados
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
        observaciones: ''
      });
    } catch (error) {
      setError(error.message || 'Error al guardar sucursal');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (sucursal) => {
    setFormData({
      oficina: sucursal.oficina,
      ubicacion: sucursal.ubicacion,
      departamento: sucursal.departamento,
      riesgo_departamento: sucursal.riesgo_departamento || '',
      riesgo_departamento_numerico: sucursal.riesgo_departamento_numerico || null,
      municipio: sucursal.municipio || '',
      riesgo_municipio: sucursal.riesgo_municipio || '',
      riesgo_municipio_numerico: sucursal.riesgo_municipio_numerico || null,
      zona: sucursal.zona || '',
      riesgo_zona: sucursal.riesgo_zona || '',
      riesgo_zona_numerico: sucursal.riesgo_zona_numerico || null,
      frontera: sucursal.frontera || '',
      riesgo_frontera: sucursal.riesgo_frontera || '',
      riesgo_frontera_numerico: sucursal.riesgo_frontera_numerico || null,
      observaciones: sucursal.observaciones || ''
    });
    setEditingId(sucursal.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta sucursal?')) {
      setIsLoading(true);
      setError('');
      try {
        const resultado = await databaseService.eliminarSucursal(id);
        if (resultado.success) {
          setSucursales(sucursales.filter(item => item.id !== id));
        } else {
          throw new Error(resultado.error);
        }
      } catch (error) {
        setError(error.message || 'Error al eliminar sucursal');
        console.error('Error:', error);
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
      
      <h2>Lista de Sucursales</h2>
      
      {error && <div className={styles.error}>{error}</div>}
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label>Oficina:</label>
          <input
            type="text"
            name="oficina"
            value={formData.oficina}
            onChange={handleChange}
            placeholder="Ingrese el nombre de la oficina"
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
            placeholder="Ingrese la ubicación exacta"
            required
          />
        </div>
        
        <div className={styles.formGroup}>
          <label>Departamento:</label>
          <select
            name="departamento"
            value={formData.departamento}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione un departamento</option>
            {departamentosBolivia.map(depto => (
              <option key={depto} value={depto}>{depto}</option>
            ))}
          </select>
        </div>
        
        <div className={styles.formGroup}>
          <label>Riesgo del departamento:</label>
          <select
            name="riesgo_departamento"
            value={formData.riesgo_departamento}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione un nivel de riesgo</option>
            {nivelesRiesgo.map((nivel) => (
              <option key={`departamento-${nivel.value}`} value={nivel.value}>
                {nivel.label}
              </option>
            ))}
          </select>
          <input 
            type="hidden" 
            name="riesgo_departamento_numerico" 
            value={formData.riesgo_departamento_numerico || ''} 
          />
        </div>
        
        <div className={styles.formGroup}>
          <label>Municipio:</label>
          <input
            type="text"
            name="municipio"
            value={formData.municipio}
            onChange={handleChange}
            placeholder="Ingrese el municipio (opcional)"
          />
        </div>
        
        <div className={styles.formGroup}>
          <label>Riesgo del municipio:</label>
          <select
            name="riesgo_municipio"
            value={formData.riesgo_municipio}
            onChange={handleChange}
          >
            <option value="">Seleccione un nivel de riesgo (opcional)</option>
            {nivelesRiesgo.map((nivel) => (
              <option key={`municipio-${nivel.value}`} value={nivel.value}>
                {nivel.label}
              </option>
            ))}
          </select>
          <input 
            type="hidden" 
            name="riesgo_municipio_numerico" 
            value={formData.riesgo_municipio_numerico || ''} 
          />
        </div>
        
        <div className={styles.formGroup}>
          <label>Zona:</label>
          <input
            type="text"
            name="zona"
            value={formData.zona}
            onChange={handleChange}
            placeholder="Ingrese la zona (opcional)"
          />
        </div>
        
        <div className={styles.formGroup}>
          <label>Riesgo de zona:</label>
          <select
            name="riesgo_zona"
            value={formData.riesgo_zona}
            onChange={handleChange}
          >
            <option value="">Seleccione un nivel de riesgo (opcional)</option>
            {nivelesRiesgo.map((nivel) => (
              <option key={`zona-${nivel.value}`} value={nivel.value}>
                {nivel.label}
              </option>
            ))}
          </select>
          <input 
            type="hidden" 
            name="riesgo_zona_numerico" 
            value={formData.riesgo_zona_numerico || ''} 
          />
        </div>
        
        <div className={styles.formGroup}>
          <label>Frontera:</label>
          <input
            type="text"
            name="frontera"
            value={formData.frontera}
            onChange={handleChange}
            placeholder="Ingrese la frontera (opcional)"
          />
        </div>
        
        <div className={styles.formGroup}>
          <label>Riesgo de frontera:</label>
          <select
            name="riesgo_frontera"
            value={formData.riesgo_frontera}
            onChange={handleChange}
          >
            <option value="">Seleccione un nivel de riesgo (opcional)</option>
            {nivelesRiesgo.map((nivel) => (
              <option key={`frontera-${nivel.value}`} value={nivel.value}>
                {nivel.label}
              </option>
            ))}
          </select>
          <input 
            type="hidden" 
            name="riesgo_frontera_numerico" 
            value={formData.riesgo_frontera_numerico || ''} 
          />
        </div>
        
        <div className={styles.formGroup}>
          <label>Observaciones:</label>
          <textarea
            name="observaciones"
            value={formData.observaciones}
            onChange={handleChange}
            placeholder="Ingrese observaciones adicionales (opcional)"
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

      <SucursalTable
        sucursales={sucursales}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        getLabelRiesgo={getLabelRiesgo}
      />
    </div>
  );
};

export default ListaSucursales;