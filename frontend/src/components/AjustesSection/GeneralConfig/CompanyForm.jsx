import React, { useState, useEffect } from 'react';
import styles from './styles.module.css';
import { databaseService } from '../../../services/database';

const CompanyForm = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    nit: '',
    direccion: '',
    telefono: ''
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // Cargar datos de la empresa al montar el componente
  useEffect(() => {
    cargarDatosEmpresa();
  }, []);

  const cargarDatosEmpresa = async () => {
    try {
      setLoading(true);
      const resultado = await databaseService.obtenerEmpresa();
      
      if (resultado.success && resultado.data) {
        setFormData({
          nombre: resultado.data.nombre || '',
          nit: resultado.data.nit || '',
          direccion: resultado.data.direccion || '',
          telefono: resultado.data.telefono || ''
        });
        setIsEditing(!!resultado.data.nombre);
      }
    } catch (error) {
      console.error('Error cargando datos de la empresa:', error);
      setMessage('Error al cargar los datos de la empresa');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.nombre.trim()) {
      setMessage('El nombre de la empresa es requerido');
      return;
    }

    if (!formData.nit.trim()) {
      setMessage('El NIT es requerido');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const resultado = await databaseService.guardarEmpresa(formData);
      
      if (resultado.success) {
        setMessage(resultado.message || 'Datos guardados correctamente');
        setIsEditing(true);
        // Limpiar mensaje después de 3 segundos
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage(resultado.error || 'Error al guardar los datos');
      }
    } catch (error) {
      console.error('Error guardando datos de la empresa:', error);
      setMessage('Error al guardar los datos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Datos de la Empresa</h2>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="nombre">Nombre de la Empresa *</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
            disabled={loading}
            placeholder="Ingrese el nombre de la empresa"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="nit">NIT *</label>
          <input
            type="text"
            id="nit"
            name="nit"
            value={formData.nit}
            onChange={handleChange}
            required
            disabled={loading}
            placeholder="Ingrese el NIT de la empresa"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="direccion">Dirección</label>
          <input
            type="text"
            id="direccion"
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
            disabled={loading}
            placeholder="Ingrese la dirección de la empresa"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="telefono">Teléfono</label>
          <input
            type="tel"
            id="telefono"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            disabled={loading}
            placeholder="Ingrese el teléfono de la empresa"
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className={styles.saveButton}
        >
          {loading ? 'Guardando...' : isEditing ? 'Actualizar Datos' : 'Guardar Datos'}
        </button>

        {message && (
          <div style={{
            padding: '1rem',
            borderRadius: '8px',
            marginTop: '1rem',
            backgroundColor: message.includes('Error') ? '#f8d7da' : '#d4edda',
            color: message.includes('Error') ? '#721c24' : '#155724',
            border: `1px solid ${message.includes('Error') ? '#f5c6cb' : '#c3e6cb'}`,
            fontSize: '0.95rem'
          }}>
            {message}
          </div>
        )}
      </form>
    </div>
  );
};

export default CompanyForm;