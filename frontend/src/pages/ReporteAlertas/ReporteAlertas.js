import React, { useState } from 'react';
import { useAlertasData } from './useAlertasData';
import { AlertasTable } from './AlertasTable';
import { alertasColumns } from './columns';
import { exportarReporteAlertasPDF } from './reportePDFalertas'; // Importa la nueva función
import styles from './reporteAlertas.module.css';

const ReporteAlertas = () => {
    const { data, loading, error, refresh } = useAlertasData();
    const [exporting, setExporting] = useState(false);
    const [notificacion, setNotificacion] = useState({ mensaje: '', tipo: '' });

    const mostrarNotificacion = (mensaje, tipo = 'info') => {
        setNotificacion({ mensaje, tipo });
        setTimeout(() => setNotificacion({ mensaje: '', tipo: '' }), 5000);
    };

    const handleExportPDF = async () => {
        if (data.length === 0) {
            mostrarNotificacion('No hay datos para exportar', 'error');
            return;
        }

        try {
            setExporting(true);

            await exportarReporteAlertasPDF(
                data,
                alertasColumns.map(col => ({
                    id: col.accessorKey,
                    nombre: col.header
                })),
                'Reporte_Alertas',
                {
                    creador: 'Sistema de Gestión de Alertas'
                }
            );

            mostrarNotificacion('Reporte exportado a PDF exitosamente', 'exito');
        } catch (error) {
            console.error('Error en exportación PDF:', error);
            mostrarNotificacion(`Error al exportar PDF: ${error.message}`, 'error');
        } finally {
            setExporting(false);
        }
    };

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

                <div className={styles.headerButtons}>
                    <button
                        onClick={refresh}
                        className={styles.refreshButton}
                        aria-label="Actualizar datos"
                        disabled={loading}
                    >
                        {loading ? 'Actualizando...' : 'Actualizar datos'}
                    </button>

                    <button
                        onClick={handleExportPDF}
                        className={styles.exportButton}
                        aria-label="Exportar a PDF"
                        disabled={exporting || data.length === 0}
                    >
                        {exporting ? 'Exportando...' : '📄 Exportar PDF'}
                    </button>
                </div>
            </header>

            {/* Notificación */}
            {notificacion.mensaje && (
                <div className={`${styles.notificacion} ${styles[notificacion.tipo]}`}>
                    {notificacion.mensaje}
                    <button
                        onClick={() => setNotificacion({ mensaje: '', tipo: '' })}
                        className={styles.botonCerrarNotificacion}
                    >
                        ×
                    </button>
                </div>
            )}

            <main>
                <AlertasTable data={data} columns={alertasColumns} />
            </main>
        </div>
    );
};

export default ReporteAlertas;