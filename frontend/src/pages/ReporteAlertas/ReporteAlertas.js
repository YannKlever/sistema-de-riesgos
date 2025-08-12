import React from 'react';
import { useAlertasData } from './useAlertasData';
import { AlertasTable } from './AlertasTable';
import { alertasColumns } from './columns';
import styles from './reporteAlertas.module.css';

const ReporteAlertas = () => {
    const { data, loading, error, refresh } = useAlertasData();

    if (loading) return (
        <div className={styles.loading} aria-live="polite">
            Cargando reporte de alertas...
        </div>
    );
    
    if (error) return (
        <div className={styles.error} role="alert">
            Error: {error}
            <button onClick={refresh} className={styles.retryButton}>
                Reintentar
            </button>
        </div>
    );

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>Reporte de Alertas</h1>
                <p>Clientes con alertas activas en el sistema</p>
                <button 
                    onClick={refresh} 
                    className={styles.refreshButton}
                    aria-label="Actualizar datos"
                >
                    Actualizar datos
                </button>
            </header>

            <main>
                <AlertasTable data={data} columns={alertasColumns} />
            </main>
        </div>
    );
};

export default ReporteAlertas;