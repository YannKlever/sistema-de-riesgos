import React from 'react';
import { useSucursales } from './useSucursales';
import { ControlesReporte } from './ControlesReporte';
import { TablaReporte } from './TablaReporte';
import styles from './reportesZonaGeografica.module.css';

export const ReportesSucursales = () => {
    const {
        state,
        sucursalesFiltradas,
        handleFiltroChange,
        actualizarReporte,
        validarTodosLosRiesgos,
        COLUMNAS_REPORTE
    } = useSucursales();

    return (
        <div className={styles.contenedor}>
            <header className={styles.header}>
                <h1>Reporte de Ubicación Geográfica</h1>
                <p>Evaluación de riesgos por ubicación geográfica</p>
            </header>

            {state.error && <div className={styles.error}>{state.error}</div>}

            <ControlesReporte
                filtro={state.filtro}
                onFiltroChange={handleFiltroChange}
                onActualizar={actualizarReporte}
                onValidarTodos={validarTodosLosRiesgos}
                datos={sucursalesFiltradas}
                columnas={COLUMNAS_REPORTE}
                nombreReporte="reporte_sucursales"
                nombreHoja="Sucursales"
                validandoTodos={state.validandoTodos}
            />

            <TablaReporte
                columnas={COLUMNAS_REPORTE}
                datos={sucursalesFiltradas}
                loading={state.loading}
            />

            <div className={styles.resumen}>
                <p>Total en reporte: <strong>{sucursalesFiltradas.length}</strong></p>
                {sucursalesFiltradas.length > 0 && (
                    <p>Promedio de riesgo zona geográfica: <strong>
                        {(
                            sucursalesFiltradas.reduce((sum, sucursal) => 
                                sum + (sucursal.factorRiesgoZonaGeografica || 0), 0) / 
                            sucursalesFiltradas.length
                        ).toFixed(2)}
                    </strong></p>
                )}
            </div>
        </div>
    );
};

export default ReportesSucursales;