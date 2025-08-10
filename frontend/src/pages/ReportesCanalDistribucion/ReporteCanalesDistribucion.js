import React from 'react';
import styles from './reportesCanalesDistribucion.module.css';
import { ControlesReporte } from './ControlesReporte';
import { TablaReporte } from './TablaReporte';
import { useCanalesDistribucion } from './useCanalesDistribucion';

export const ReporteCanalesDistribucion = () => {
    const {
        state,
        canalesFiltrados,
        handleFiltroChange,
        actualizarReporte,
        validarTodosLosRiesgos,
        COLUMNAS_REPORTE
    } = useCanalesDistribucion();

    // Función para limpiar el error
    const limpiarError = () => {
        actualizarReporte();
    };

    return (
        <div className={styles.contenedor}>
            <h1 className={styles.titulo}>Reporte de Canales de Distribución</h1>
            
            {state.error && (
                <div className={styles.error}>
                    Error: {state.error}
                    <button 
                        onClick={limpiarError}
                        className={styles.botonCerrarError}
                    >
                        ×
                    </button>
                </div>
            )}
            
            <ControlesReporte 
                filtro={state.filtro}
                onFiltroChange={handleFiltroChange}
                onActualizar={actualizarReporte}
                onValidarTodos={validarTodosLosRiesgos}
                datos={canalesFiltrados}
                columnas={COLUMNAS_REPORTE}
                loading={state.loading}
            />
            
            <TablaReporte 
                columnas={COLUMNAS_REPORTE}
                datos={canalesFiltrados}
                loading={state.loading}
            />

            {canalesFiltrados.length > 0 && (
                <div className={styles.resumen}>
                    <p>Total canales: <strong>{canalesFiltrados.length}</strong></p>
                    <p>Promedio probabilidad: <strong>
                        {(
                            canalesFiltrados.reduce((sum, canal) => 
                                sum + (canal.probabilidad_canal_distribucion || 0), 0) / 
                            canalesFiltrados.length
                        ).toFixed(2)}
                    </strong></p>
                    <p>Promedio impacto: <strong>
                        {(
                            canalesFiltrados.reduce((sum, canal) => 
                                sum + (canal.impacto_canal_distribucion || 0), 0) / 
                            canalesFiltrados.length
                        ).toFixed(2)}
                    </strong></p>
                    <p>Promedio factor riesgo: <strong>
                        {(
                            canalesFiltrados.reduce((sum, canal) => 
                                sum + (canal.factor_riesgo_canal_distribucion || 0), 0) / 
                            canalesFiltrados.length
                        ).toFixed(2)}
                    </strong></p>
                    <p>Promedio riesgo validado: <strong>
                        {(
                            canalesFiltrados.reduce((sum, canal) => 
                                sum + (canal.promedio_riesgo_canal_distribucion || 0), 0) / 
                            canalesFiltrados.length
                        ).toFixed(2)}
                    </strong></p>
                </div>
            )}
        </div>
    );
};

export default ReporteCanalesDistribucion;