
import React from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import CompanyForm from './CompanyForm';
import styles from './styles.module.css';

const GeneralConfig = () => {
  const navigate = useNavigate();
  const { currentUser, isAdmin } = useOutletContext();

  return (
    <div className={styles.container}>
      <button 
        className={styles.backButton}
        onClick={() => navigate('/ajustes')}
      >
        ← Volver
      </button>
      
      <h2>Configuración General de la Empresa</h2>
      <p>Usuario actual: {currentUser?.name} ({currentUser?.role})</p>
      
      <CompanyForm />
    </div>
  );
};

export default GeneralConfig;