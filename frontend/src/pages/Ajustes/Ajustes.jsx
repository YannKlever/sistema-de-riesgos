// pages/Ajustes/Ajustes.jsx
import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import styles from './styles.module.css';

const Ajustes = () => {
  const navigate = useNavigate();
  const isAdmin = true; //rol de usuario

  const settingsCards = [
    {
      title: 'Configuración de Usuarios',
      path: 'usuarios',
      icon: '👤'
    },
    {
      title: 'Apariencia',
      path: 'apariencia',
      icon: '🎨'
    }
  ];

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Panel de Ajustes</h1>
      
      <div className={styles.grid}>
        {settingsCards.map((card) => {
          if (card.adminOnly && !isAdmin) return null;
          
          return (
            <div 
              key={card.path}
              className={styles.card}
              onClick={() => navigate(`/ajustes/${card.path}`)}
            >
              <div className={styles.cardIcon}>{card.icon}</div>
              <h3 className={styles.cardTitle}>{card.title}</h3>
            </div>
          );
        })}
      </div>
      
      <Outlet /> {/* Para mostrar las sub-rutas */}
    </div>
  );
};

export default Ajustes;