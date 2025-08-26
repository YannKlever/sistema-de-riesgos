import React, { useState, useEffect } from 'react';
import { 
  FiHome, 
  FiFileText, 
  FiUsers, 
  FiPieChart, 
  FiSettings,
  FiShield,
  FiSliders
} from 'react-icons/fi';
import { getCurrentUser } from '../../../services/authService'; 
import NavItem from '../NavItem/NavItem';
import UserProfile from '../UserProfile/UserProfile';
import styles from './styles.module.css';

const Sidebar = ({ onLogout, visible }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Obtener información del usuario actual
    const user = getCurrentUser();
    setCurrentUser(user);
    setIsAdmin(user?.role === 'admin');
    console.log('Sidebar - Usuario actual:', user);
    console.log('Sidebar - Es admin:', user?.role === 'admin');
  }, []);

  // Definir todos los elementos del menú
  const allMenuItems = [
    { path: '/home', icon: <FiHome size={20} />, label: 'Inicio', adminOnly: false },
    { path: '/clientes', icon: <FiUsers size={20} />, label: 'Nuevo registro', adminOnly: false },
    { path: '/parametros', icon: <FiSliders size={20} />, label: 'Parámetros', adminOnly: true },
    { path: '/reportes', icon: <FiPieChart size={20} />, label: 'Reportes', adminOnly: true },
    { path: '/graficos', icon: <FiFileText size={20} />, label: 'Gráficos', adminOnly: true },
    { path: '/ajustes', icon: <FiSettings size={20} />, label: 'Ajustes', adminOnly: false },
  ];

  // Filtrar elementos del menú según el rol del usuario
  const menuItems = allMenuItems.filter(item => {
    if (item.adminOnly && !isAdmin) {
      console.log(`Ocultando ${item.label} - No es admin`);
      return false;
    }
    console.log(`Mostrando ${item.label} - Admin: ${isAdmin}, Item requiere admin: ${item.adminOnly}`);
    return true;
  });

  return (
    <aside className={`${styles.sidebar} ${visible ? styles.visible : styles.hidden}`}>
      <div className={styles.sidebarContent}>
        <div className={styles.sidebarHeader}>
          <FiShield size={28} className={styles.logoIcon} />
          <h1 className={styles.appTitle}>Gestión de Riesgos</h1>
        </div>
        <UserProfile onLogout={onLogout} />
        <nav className={styles.nav}>
          <ul className={styles.navList}>
            {menuItems.map((item, index) => (
              <NavItem 
                key={index}
                path={item.path}
                icon={item.icon}
                label={item.label}
              />
            ))}
          </ul>
        </nav>
      </div>
      
      <div className={styles.footer}>
        <p className={styles.footerText}>
          Sistema de Gestión de Riesgos®<br />
          Derechos Reservados© 2025<br />
          Diseño y Programación: KeyAxisSystem
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;