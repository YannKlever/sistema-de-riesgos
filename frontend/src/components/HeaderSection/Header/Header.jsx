import React from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
import styles from './styles.module.css';

const Header = ({ toggleSidebar, sidebarVisible }) => {
  return (
    <header className={styles.header}>
      <button 
        onClick={toggleSidebar}
        className={styles.toggleButton}
        aria-label={sidebarVisible ? 'Ocultar menú' : 'Mostrar menú'}
      >
        {sidebarVisible ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>
      <div className={styles.headerContent}>
        {/* Aquí puedes agregar otros elementos del header */}
        <h1 className={styles.pageTitle}>Sistema de Gestión de Riesgos</h1>
      </div>
    </header>
  );
};

export default Header;