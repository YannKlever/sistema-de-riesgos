import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./styles.module.css";
import { databaseService } from "../../services/database";

const HomePage = () => {
  const navigate = useNavigate();
  const [nombreEmpresa, setNombreEmpresa] = useState("");
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
  }, [navigate]);

  // Cargar datos de la empresa al montar el componente
  useEffect(() => {
    const cargarDatosEmpresa = async () => {
      try {
        const resultado = await databaseService.obtenerEmpresa();
        if (resultado.success && resultado.data && resultado.data.nombre) {
          setNombreEmpresa(resultado.data.nombre);
        }
      } catch (error) {
        console.error('Error cargando datos de la empresa:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarDatosEmpresa();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.background} />
      <div className={styles.content}>
        <img 
          src="/images/logo.jpg"
          alt="Logo de la empresa" 
          className={styles.logo} 
        />
        
        <h1 className={styles.title}>
          {nombreEmpresa ? (
            <>
              Sistema de Gestión de Riesgos
              <span className={styles.companyName}>de {nombreEmpresa}</span>
            </>
          ) : (
            "Sistema de Gestión de Riesgos"
          )}
        </h1>
        
        <p className={styles.subtitle}>
          {nombreEmpresa 
            ? `Monitoreo integral de riesgos para ${nombreEmpresa}`
            : "Monitoreo integral de riesgos empresariales"
          }
        </p>

        {!loading && !nombreEmpresa && (
          <div className={styles.setupPrompt}>
            <p>Configura los datos de tu empresa en la sección de Ajustes</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;