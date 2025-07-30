import React from 'react';
import { Link } from 'react-router-dom';
import styles from './styles.module.css';

const FooterLinks = () => {
  return (
    <div className={styles.footerLinks}>
      <Link to="/forgot-password" className={styles.link}>
        ¿Olvidaste tu contraseña?
      </Link>
      
    </div>
  );
};

export default FooterLinks;