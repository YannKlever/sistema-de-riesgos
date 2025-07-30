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
    
    if (!formData.name) newErrors.name = 'Nombre es requerido';
    if (!formData.email) newErrors.email = 'Email es requerido';
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Email inválido';
    
    if (!user && !formData.password) {
      newErrors.password = 'Contraseña es requerida';
    } else if (formData.password && formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    
    if (formData.password !== formData.confirmPassword) {
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

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formGroup}>
        <label>Nombre</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          required
        />
        {errors.name && <span className={styles.errorText}>{errors.name}</span>}
      </div>

      <div className={styles.formGroup}>
        <label>Email</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          required
        />
        {errors.email && <span className={styles.errorText}>{errors.email}</span>}
      </div>

      <div className={styles.formGroup}>
        <label>Rol</label>
        <select
          value={formData.role}
          onChange={(e) => setFormData({...formData, role: e.target.value})}
        >
          <option value="user">Usuario</option>
          <option value="admin">Administrador</option>
        </select>
      </div>

      {(!user || formData.password) && (
        <>
          <div className={styles.formGroup}>
            <label>Contraseña</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              placeholder={user ? "Dejar en blanco para no cambiar" : ""}
            />
            {errors.password && <span className={styles.errorText}>{errors.password}</span>}
          </div>

          <div className={styles.formGroup}>
            <label>Confirmar Contraseña</label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
            />
            {errors.confirmPassword && <span className={styles.errorText}>{errors.confirmPassword}</span>}
          </div>
        </>
      )}

      <div className={styles.buttonGroup}>
        <button type="button" onClick={onCancel} className={styles.cancelButton}>
          Cancelar
        </button>
        <button type="submit" className={styles.saveButton}>
          Guardar
        </button>
      </div>
    </form>
  );
};

export default UserForm;