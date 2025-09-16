import React, { useState, useEffect } from 'react';
import databaseService from '../../services/database';
import styles from './LicenseStatus.module.css';

const LicenseStatus = () => {
  const [licenseInfo, setLicenseInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLicense = async () => {
      try {
        const result = await databaseService.checkProductKeyStatus();
        setLicenseInfo(result);
      } catch (error) {
        console.error('Error checking license:', error);
        setLicenseInfo({ validated: false, error: 'Error verificando licencia' });
      } finally {
        setLoading(false);
      }
    };

    checkLicense();
    
    // Verificar cada hora
    const interval = setInterval(checkLicense, 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className={`${styles.licenseStatus} ${styles.licenseLoading}`}>
        Verificando licencia...
      </div>
    );
  }

  if (!licenseInfo || !licenseInfo.validated) {
    return (
      <div className={`${styles.licenseStatus} ${styles.licenseInvalid}`}>
        ⚠️ Licencia no válida
      </div>
    );
  }

  return (
    <div className={`${styles.licenseStatus} ${styles.licenseValid}`}>
      ✅ Licencia activa
    </div>
  );
};

export default LicenseStatus;