import React, { useState } from 'react';
import { useCanalesDistribucion } from './useCanalesDistribucion';
import { ControlesReporte } from './ControlesReporte';
import { TablaReporte } from './TablaReporte';
import styles from './reportesCanalesDistribucion.module.css';

export const ReporteCanalesDistribucion = () => {
    const {
        state,
        canalesFiltrados,
        handleFiltroChange,
        actualizarReporte,
        validarTodo,
        validarTodosLosRiesgos,
        COLUMNAS_REPORTE
    } = useCanalesDistribucion();

    const [localError, setLocalError] = useState('');

    const handleCloseError = () => {
        setLocalError('');
    };

    return (
        <div className={styles.contenedor}>
            <header className={styles.header}>
                <h1>Reporte de Canales de Distribución</h1>
                <p>Evaluación de riesgos en canales de distribución</p>
            </header>

            {(state.error || localError) && (
                <div className={styles.error}>
                    {state.error || localError}
                    <button 
                        onClick={handleCloseError}
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
                onValidarTodo={validarTodo}
                onValidarTodosLosRiesgos={validarTodosLosRiesgos}
                clientes={canalesFiltrados}
                columnas={COLUMNAS_REPORTE}
                loading={state.loading}
            />

            <TablaReporte
                columnas={COLUMNAS_REPORTE}
                datos={canalesFiltrados}
                loading={state.loading}
            />

            <div className={styles.resumen}>
                <p>Total en reporte: <strong>{canalesFiltrados.length}</strong></p>
                {canalesFiltrados.length > 0 && (
                    <>
                        <p>Promedio de riesgo calculado: <strong>
                            {(
                                canalesFiltrados.reduce((sum, canal) => 
                                    sum + (canal.factorRiesgoCanal || 0), 0) / 
                                canalesFiltrados.length
                            ).toFixed(2)}
                        </strong></p>
                        <p>Promedio de riesgo cliente interno: <strong>
                            {(
                                canalesFiltrados.reduce((sum, canal) => 
                                    sum + (canal.promedio_riesgo_cliente_interno || 0), 0) / 
                                canalesFiltrados.length
                            ).toFixed(2)}
                        </strong></p>
                        <p>Promedio de riesgo validado: <strong>
                            {(
                                canalesFiltrados.reduce((sum, canal) => 
                                    sum + (canal.promedio_riesgo_canal_distribucion || 0), 0) / 
                                canalesFiltrados.length
                            ).toFixed(2)}
                        </strong></p>
                        <p>Promedio riesgo total: <strong>
                            {(
                                canalesFiltrados.reduce((sum, canal) => 
                                    sum + (parseFloat(canal.riesgoTotal) || 0), 0) / 
                                canalesFiltrados.length
                            ).toFixed(2)}
                        </strong></p>
                    </>
                )}
            </div>
        </div>
    );
};

export default ReporteCanalesDistribucion;