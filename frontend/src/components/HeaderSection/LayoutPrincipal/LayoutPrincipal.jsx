import React, { useState, useEffect } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import Sidebar from '../SideBar/SideBar';
import styles from './styles.module.css';

const LayoutPrincipal = ({ children, onLogout }) => {
  const [sidebarVisible, setSidebarVisible] = useState(() => {
    const saved = localStorage.getItem('sidebarVisible');
    return saved !== null ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem('sidebarVisible', JSON.stringify(sidebarVisible));
  }, [sidebarVisible]);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  return (
    <div className={styles.layoutContainer}>
      <Sidebar onLogout={onLogout} visible={sidebarVisible} />
      <main className={`${styles.mainContent} ${!sidebarVisible ? styles.fullWidth : ''}`}>
        <button 
          onClick={toggleSidebar}
          className={styles.toggleButton}
          aria-label={sidebarVisible ? 'Ocultar menú' : 'Mostrar menú'}
        >
          {sidebarVisible ? <FiChevronLeft size={20} /> : <FiChevronRight size={20} />}
        </button>
        {children}
      </main>
    </div>
  );
};

export default LayoutPrincipal;