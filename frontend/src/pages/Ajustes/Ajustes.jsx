import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import styles from './styles.module.css';
import { getCurrentUser } from '../../services/authService';

const Ajustes = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);
    setIsAdmin(user?.role === 'admin');
    console.log('Ajustes - Usuario actual:', user);
    console.log('Ajustes - Es admin:', user?.role === 'admin');
  }, []);

  const settingsCards = [
    {
      title: 'Configuración de Usuarios',
      path: 'usuarios',
      icon: '👤',
      adminOnly: true 
    },
    {
      title: 'Configuración General',
      path: 'generales',
      icon: '⚙️',
      adminOnly: true
    }
  ];

  const isSubRoute = location.pathname !== '/ajustes';

  return (
    <div className={styles.container}>
      {isSubRoute ? (
        <Outlet context={{ currentUser, isAdmin }} />
      ) : (
        <>
          <h1 className={styles.title}>Panel de Ajustes</h1>
          <div className={styles.userInfo}>
            <p>Usuario: <strong>{currentUser?.name}</strong></p>
            <p>Rol: <strong>{currentUser?.role}</strong></p>
            <p>Email: <strong>{currentUser?.email}</strong></p>
          </div>
          
          <div className={styles.grid}>
            {settingsCards.map((card) => {
              if (card.adminOnly && !isAdmin) {
                console.log(`Ocultando ${card.title} - No es admin`);
                return null;
              }
              
              console.log(`Mostrando ${card.title} - Admin: ${isAdmin}, Card requiere admin: ${card.adminOnly}`);
              
              return (
                <div 
                  key={card.path}
                  className={styles.card}
                  onClick={() => {
                    console.log(`Navegando a: /ajustes/${card.path}`);
                    navigate(`/ajustes/${card.path}`);
                  }}
                >
                  <div className={styles.cardIcon}>{card.icon}</div>
                  <h3 className={styles.cardTitle}>{card.title}</h3>
                  <p className={styles.cardDescription}>
                    {card.adminOnly ? '(Solo administradores)' : ''}
                  </p>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default Ajustes;