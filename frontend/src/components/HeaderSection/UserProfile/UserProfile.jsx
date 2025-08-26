import React from 'react';
import { FiUser, FiMail } from 'react-icons/fi';

import { getCurrentUser } from '../../../services/authService';
import LogoutButton from '../LogoutButton/LogoutButton';
import styles from './styles.module.css';

const UserProfile = ({ onLogout }) => {
  // Obtener el usuario actual del sistema de autenticación
  const user = getCurrentUser();

  return (
    <div className={styles.profile}>
      <div className={styles.avatarContainer}>
        <div className={styles.avatar}>
          <FiUser size={24} />
        </div>
      </div>
      <div className={styles.userInfo}>
        <h3 className={styles.userName}>
          <FiUser className={styles.icon} size={14} />
          {user?.name || 'Usuario'} {}
        </h3>
        <p className={styles.userEmail}>
          <FiMail className={styles.icon} size={14} />
          {user?.email || 'email@ejemplo.com'} {}
        </p>
      </div>
      <LogoutButton onLogout={onLogout} />
    </div>
  );
};

export default UserProfile;