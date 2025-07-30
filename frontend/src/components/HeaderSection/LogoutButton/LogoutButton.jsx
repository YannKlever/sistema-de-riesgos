import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLogOut } from 'react-icons/fi';
import { logout } from '../../../services/authService';
import styles from './styles.module.css';

const LogoutButton = ({ onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    onLogout();
    navigate('/login');
  };

  return (
    <button 
      onClick={handleLogout}
      className={styles.logoutButton}
      aria-label="Cerrar sesión"
    >
      <FiLogOut className={styles.icon} size={18} />
      <span className={styles.text}>Cerrar sesión</span>
    </button>
  );
};

export default LogoutButton;