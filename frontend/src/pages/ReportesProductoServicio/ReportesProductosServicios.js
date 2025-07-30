import React from 'react';
import styles from './reportesProductosServicios.module.css';
import { ControlesReporte } from './ControlesReporte';
import { TablaReporte } from './TablaReporte';
import { useProductosServicios } from './useProductosServicios';

export const ReportesProductosServicios = () => {
    const {
        state,
        productosFiltrados,
        handleFiltroChange,
        actualizarReporte,
        validarTodosLosRiesgos,
        COLUMNAS_REPORTE
    } = useProductosServicios();

    return (
        <div className={styles.contenedor}>
            <h1 className={styles.titulo}>Reporte de Productos y Servicios</h1>
            
            {state.error && (
                <div className={styles.error}>
                    Error: {state.error}
                </div>
            )}
            
            <ControlesReporte 
                filtro={state.filtro}
                onFiltroChange={handleFiltroChange}
                onActualizar={actualizarReporte}
                onValidarTodos={validarTodosLosRiesgos}
                datos={productosFiltrados}
                columnas={COLUMNAS_REPORTE}
            />
            
            <TablaReporte 
                columnas={COLUMNAS_REPORTE}
                datos={productosFiltrados}
                loading={state.loading}
            />
        </div>
    );
};

export default ReportesProductosServicios;