import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/authService';
import LoginForm from '../../components/login/LoginForm';
import ErrorAlert from '../../components/ErrorAlert/ErrorAlert';
import FooterLinks from '../../components/FooterLinks/FooterLinks';
import styles from './styles.module.css';

// Añade onLoginSuccess como prop
const LoginPage = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginSubmit = async (credentials) => {
    setError('');
    setIsLoading(true);

    try {
      await login(credentials);
      onLoginSuccess(); 
      navigate('/home');
    } catch (err) {
      setError(err.message || 'Credenciales incorrectas');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <h1 className={styles.title}>Inicio de Sesion</h1>
        
        <ErrorAlert message={error} />
        
        <LoginForm 
          onSubmit={handleLoginSubmit} 
          isLoading={isLoading} 
        />
        
        <FooterLinks />
      </div>
    </div>
  );
};

export default LoginPage;