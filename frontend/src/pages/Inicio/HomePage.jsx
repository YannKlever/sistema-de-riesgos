// HomePage.js - Versión optimizada
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./styles.module.css";
import { databaseService } from "../../services/database";

// Precargar imágenes (hacerlo fuera del componente)
const preloadImages = () => {
  const images = ['/images/logo.jpg', '/images/registros-optimized.webp'];
  images.forEach(src => {
    const img = new Image();
    img.src = src;
  });
};

// Ejecutar precarga tan pronto como sea posible
if (typeof window !== 'undefined') {
  // Precargar después de que la página principal esté cargada
  if (document.readyState === 'complete') {
    preloadImages();
  } else {
    window.addEventListener('load', preloadImages);
  }
}

const HomePage = () => {
  const navigate = useNavigate();
  const [nombreEmpresa, setNombreEmpresa] = useState("");
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);

  React.useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
  }, [navigate]);

  const cargarDatosEmpresa = useCallback(async () => {
    try {
      const resultado = await databaseService.obtenerEmpresa();
      if (resultado.success && resultado.data?.nombre) {
        setNombreEmpresa(resultado.data.nombre);
      }
    } catch (error) {
      console.error('Error cargando datos de la empresa:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarDatosEmpresa();
  }, [cargarDatosEmpresa]);

  return (
    <div className={styles.container}>
      <div className={styles.background} />
      <div className={styles.content}>
        <img
          src="/images/logo.jpg"
          alt="Logo de la empresa"
          className={styles.logo}
          loading="lazy"
          style={{ opacity: imageLoaded ? 1 : 0 }}
          onLoad={() => setImageLoaded(true)}
        />

        <h1 className={styles.title}>
          Sistema de Gestión de Riesgos
          {nombreEmpresa && (
            <span className={styles.companyName}>de {nombreEmpresa}</span>
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

export default React.memo(HomePage);