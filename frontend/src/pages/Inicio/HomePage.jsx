import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./styles.module.css";

const HomePage = () => {
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className={styles.container}>
      <div className={styles.background} />
      <div className={styles.content}>
        <img 
          src="/images/logo.jpg"
          alt="Logo de la empresa" 
          className={styles.logo} 
        />
        <h1 className={styles.title}>Sistema de Gestión de Riesgos</h1>
        <p className={styles.subtitle}>Monitoreo integral de riesgos empresariales</p>
      </div>
    </div>
  );
};

export default HomePage;