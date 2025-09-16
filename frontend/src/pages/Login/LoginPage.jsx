import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/authService';
import LoginForm from '../../components/login/LoginForm';
import ErrorAlert from '../../components/ErrorAlert/ErrorAlert';
import FooterLinks from '../../components/FooterLinks/FooterLinks';
import styles from './styles.module.css';

const LoginPage = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [locked, setLocked] = useState(false);
  const [lockTime, setLockTime] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  
  // Configuración de intentos y tiempo de bloqueo
  const MAX_INTENTOS = 8;
  const BLOQUEO_MINUTOS = 1;

  // Función para reiniciar completamente el contador
  const reiniciarContadorIntentos = () => {
    setAttempts(0);
    setLocked(false);
    setLockTime(0);
    setTimeRemaining(0);
    setError(''); // Limpiar el mensaje de error también
    localStorage.removeItem('loginAttempts');
    localStorage.removeItem('loginLockUntil');
  };

  useEffect(() => {
    // Cargar intentos previos desde localStorage
    const savedAttempts = localStorage.getItem('loginAttempts');
    if (savedAttempts) {
      setAttempts(parseInt(savedAttempts));
    }

    // Verificar si hay un bloqueo temporal
    const lockUntil = localStorage.getItem('loginLockUntil');
    if (lockUntil) {
      const lockTimeValue = parseInt(lockUntil);
      
      if (lockTimeValue > Date.now()) {
        // Bloqueo aún activo
        setLocked(true);
        setLockTime(lockTimeValue);
        setTimeRemaining(Math.ceil((lockTimeValue - Date.now()) / 1000));
        
        // Configurar el mensaje de error para el bloqueo
        setError(`Demasiados intentos fallidos. Intente nuevamente en ${BLOQUEO_MINUTOS} minuto${BLOQUEO_MINUTOS !== 1 ? 's' : ''}.`);
      } else {
        // Bloqueo ya expiró pero no se limpió - limpiar ahora
        reiniciarContadorIntentos();
      }
    }
  }, []);

  // Efecto para el contador dinámico
  useEffect(() => {
    let intervalId;
    
    if (locked && timeRemaining > 0) {
      intervalId = setInterval(() => {
        setTimeRemaining(prevTime => {
          if (prevTime <= 1) {
            clearInterval(intervalId);
            reiniciarContadorIntentos(); 
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [locked, timeRemaining]);

  const handleLoginSubmit = async (credentials) => {
    if (locked) return;
    
    setError(''); 
    setIsLoading(true);

    try {
      const result = await login(credentials);
      
      if (result.success) {
        // Reiniciar contador de intentos al login exitoso
        reiniciarContadorIntentos();
        
        onLoginSuccess(result.user);
        navigate('/home');
      } else {
        throw new Error(result.error || 'Credenciales incorrectas');
      }
    } catch (err) {
      console.error('Login error:', err);
      
      // Manejar intentos fallidos
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      localStorage.setItem('loginAttempts', newAttempts.toString());
      
      if (newAttempts >= MAX_INTENTOS) {
        const lockUntil = Date.now() + (BLOQUEO_MINUTOS * 60 * 1000);
        localStorage.setItem('loginLockUntil', lockUntil.toString());
        setLocked(true);
        setLockTime(lockUntil);
        setTimeRemaining(BLOQUEO_MINUTOS * 60);
        setError(`Demasiados intentos fallidos. Intente nuevamente en ${BLOQUEO_MINUTOS} minuto${BLOQUEO_MINUTOS !== 1 ? 's' : ''}.`);
      } else {
        setError(err.message || 'Error en el proceso de autenticación');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimeRemaining = () => {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (locked) {
    return (
      <div className={styles.loginContainer}>
        <div className={styles.loginCard}>
          <h1 className={styles.title}>Cuenta Bloqueada</h1>
          <div className={styles.lockMessage}>
            <p>Demasiados intentos fallidos. Por seguridad, su cuenta ha sido bloqueada temporalmente.</p>
            <p>Tiempo restante: {formatTimeRemaining()}</p>
          </div>
          <FooterLinks />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <h1 className={styles.title}>Inicio de Sesión</h1>
        
        <ErrorAlert message={error} />
        
        <LoginForm 
          onSubmit={handleLoginSubmit} 
          isLoading={isLoading} 
        />
        
        {attempts > 0 && (
          <div className={styles.attemptsWarning}>
            Intentos fallidos: {attempts} de {MAX_INTENTOS}
          </div>
        )}
        
        <FooterLinks />
      </div>
    </div>
  );
};

export default LoginPage;