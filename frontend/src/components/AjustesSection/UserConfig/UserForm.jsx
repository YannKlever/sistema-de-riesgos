import React, { useState } from 'react';
import styles from './styles.module.css';

const UserForm = ({ user, onCancel, onSubmit }) => {
  const [formData, setFormData] = useState(user || {
    name: '',
    email: '',
    role: 'user',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    
    // Validar nombre
    if (!formData.name || formData.name.trim().length < 2) {
      newErrors.name = 'Nombre es requerido (mínimo 2 caracteres)';
    } else if (formData.name.length > 100) {
      newErrors.name = 'Nombre no puede exceder 100 caracteres';
    }
    
    // Validar email
    if (!formData.email) {
      newErrors.email = 'Email es requerido';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    // Validar contraseña
    if (!user) {
      // Para creación: contraseña requerida
      if (!formData.password) {
        newErrors.password = 'Contraseña es requerida';
      } else if (formData.password.length < 8) {
        newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
      }
    } else {
      // Para edición: si se proporciona password, validar
      if (formData.password && formData.password.length < 8) {
        newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
      }
    }
    
    // Validar confirmación de contraseña
    if (formData.password && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formGroup}>
        <label>Nombre *</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          maxLength={100}
          placeholder="Ingrese el nombre completo"
        />
        {errors.name && <span className={styles.errorText}>{errors.name}</span>}
      </div>

      <div className={styles.formGroup}>
        <label>Email *</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          placeholder="ejemplo@correo.com"
        />
        {errors.email && <span className={styles.errorText}>{errors.email}</span>}
      </div>

      <div className={styles.formGroup}>
        <label>Rol *</label>
        <select
          value={formData.role}
          onChange={(e) => handleInputChange('role', e.target.value)}
        >
          <option value="user">Usuario</option>
          <option value="admin">Administrador</option>
        </select>
      </div>

      <div className={styles.formGroup}>
        <label>
          {user ? 'Nueva Contraseña' : 'Contraseña *'}
        </label>
        <input
          type="password"
          value={formData.password}
          onChange={(e) => handleInputChange('password', e.target.value)}
          placeholder={user ? "Dejar en blanco para mantener la actual" : "Mínimo 8 caracteres"}
        />
        {errors.password && <span className={styles.errorText}>{errors.password}</span>}
      </div>

      {(formData.password || !user) && (
        <div className={styles.formGroup}>
          <label>Confirmar Contraseña *</label>
          <input
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
            placeholder="Repita la contraseña"
          />
          {errors.confirmPassword && <span className={styles.errorText}>{errors.confirmPassword}</span>}
        </div>
      )}

      <div className={styles.buttonGroup}>
        <button type="button" onClick={onCancel} className={styles.cancelButton}>
          Cancelar
        </button>
        <button type="submit" className={styles.saveButton}>
          {user ? 'Actualizar' : 'Crear'} Usuario
        </button>
      </div>

      <div className={styles.formHelp}>
        <p><strong>* Campos obligatorios</strong></p>
        {user && (
          <p>Deje la contraseña en blanco si no desea cambiarla</p>
        )}
      </div>
    </form>
  );
};

export default UserForm;