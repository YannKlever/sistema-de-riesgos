import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './styles.module.css';

const NavItem = ({ path, icon, label }) => {
  return (
    <li className={styles.navItem}>
      <NavLink 
        to={path} 
        className={({ isActive }) => 
          isActive ? `${styles.link} ${styles.active}` : styles.link
        }
        end // Añade esta prop
      >
        <span className={styles.icon}>{icon}</span>
        <span className={styles.label}>{label}</span>
      </NavLink>
    </li>
  );
};

export default NavItem;