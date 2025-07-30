import React, { useState } from "react";
import { FiLogIn, FiLock, FiMail } from "react-icons/fi";
import styles from "./styles.module.css";

const LoginForm = ({ onSubmit, isLoading }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ email, password });
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formGroup}>
        <label>Email</label>
        <div className={styles.inputContainer}>
          <FiMail className={styles.inputIcon} />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={styles.input}
            placeholder="ejemplo@empresa.com"
          />
        </div>
      </div>
      
      <div className={styles.formGroup}>
        <label>Contraseña</label>
        <div className={styles.inputContainer}>
          <FiLock className={styles.inputIcon} />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={styles.input}
            placeholder="••••••••"
          />
        </div>
      </div>
      
      <button 
        type="submit" 
        disabled={isLoading}
        className={styles.button}
      >
        {isLoading ? (
          <>
            <div className={styles.loadingSpinner} />
            Cargando...
          </>
        ) : (
          <>
            <FiLogIn className={styles.buttonIcon} />
            Iniciar Sesión
          </>
        )}
      </button>
    </form>
  );
};

export default LoginForm;