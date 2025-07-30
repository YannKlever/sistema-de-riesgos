// components/AjustesSection/GeneralConfig/GeneralConfig.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import CompanyForm from './CompanyForm';
import styles from './styles.module.css';

const GeneralConfig = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <button 
        className={styles.backButton}
        onClick={() => navigate('/ajustes')}
      >
        ← Volver
      </button>
      
      <h2>Configuración General de la Empresa</h2>
      <CompanyForm />
    </div>
  );
};

export default GeneralConfig;