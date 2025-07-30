// components/AjustesSection/GeneralConfig/CompanyForm.jsx
import React, { useState } from 'react';
import styles from './styles.module.css';

const CompanyForm = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    address: '',
    phone: '',
    email: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Lógica para guardar los datos
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formGroup}>
        <label>Nombre de la Empresa</label>
        <input
          type="text"
          value={formData.companyName}
          onChange={(e) => setFormData({...formData, companyName: e.target.value})}
        />
      </div>
      
      <div className={styles.formGroup}>
        <label>Dirección de la sucursal</label>
        <input
          type="text"
          value={formData.address}
          onChange={(e) => setFormData({...formData, address: e.target.value})}
        />
      </div>
       <div className={styles.formGroup}>
        <label>Ejecutivo</label>
        <input
          type="text"
          value={formData.address}
          onChange={(e) => setFormData({...formData, address: e.target.value})}
        />
      </div>

      <button type="submit" className={styles.saveButton}>
        Guardar Cambios
      </button>
    </form>
  );
};

export default CompanyForm;