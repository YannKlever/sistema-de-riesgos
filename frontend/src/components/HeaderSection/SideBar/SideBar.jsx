import React from 'react';
import { 
  FiHome, 
  FiFileText, 
  FiUsers, 
  FiPieChart, 
  FiSettings,
  FiShield,
  FiSliders
} from 'react-icons/fi';
import NavItem from '../NavItem/NavItem';
import UserProfile from '../UserProfile/UserProfile';
import styles from './styles.module.css';

const Sidebar = ({ onLogout, visible }) => {
  const menuItems = [
    { path: '/home', icon: <FiHome size={20} />, label: 'Inicio' },
    { path: '/clientes', icon: <FiUsers size={20} />, label: 'Nuevo registro' },
    { path: '/parametros', icon: <FiSliders size={20} />, label: 'Parámetros' },
    { path: '/reportes', icon: <FiPieChart size={20} />, label: 'Reportes' },
    { path: '/graficos', icon: <FiFileText size={20} />, label: 'Gráficos' },
    { path: '/ajustes', icon: <FiSettings size={20} />, label: 'Ajustes' },
  ];

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