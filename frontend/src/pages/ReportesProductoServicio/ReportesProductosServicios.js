import React from 'react';
import styles from './reportesProductosServicios.module.css';
import { ControlesReporte } from './ControlesReporte';
import { TablaReporte } from './TablaReporte';
import { useProductosServicios } from './useProductosServicios';
import { COLUMNAS_REPORTE_PRODUCTOS } from './constantes';

export const ReportesProductosServicios = () => {
    const {
        state,
        productosFiltrados,
        handleFiltroChange,
        actualizarReporte,
        validarTodosLosRiesgos
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
                columnas={COLUMNAS_REPORTE_PRODUCTOS} 
            />
            
            <TablaReporte 
                columnas={COLUMNAS_REPORTE_PRODUCTOS}
                datos={productosFiltrados}
                loading={state.loading}
            />

            {/* Sección de resumen agregada */}
            <div className={styles.resumen}>
                <p>Total en reporte: <strong>{productosFiltrados.length}</strong></p>
                {productosFiltrados.length > 0 && (
                    <>
                        <p>Promedio de probabilidad: <strong>
                            {(
                                productosFiltrados.reduce((sum, producto) => 
                                    sum + (producto.probabilidad || 0), 0) / 
                                productosFiltrados.length
                            ).toFixed(2)}
                        </strong></p>
                        <p>Promedio de impacto: <strong>
                            {(
                                productosFiltrados.reduce((sum, producto) => 
                                    sum + (producto.impacto || 0), 0) / 
                                productosFiltrados.length
                            ).toFixed(2)}
                        </strong></p>
                        <p>Promedio de riesgo calculado: <strong>
                            {(
                                productosFiltrados.reduce((sum, producto) => 
                                    sum + (producto.riesgoFactorProductosServicios || 0), 0) / 
                                productosFiltrados.length
                            ).toFixed(2)}
                        </strong></p>
                        <p>Promedio de riesgo validado: <strong>
                            {(
                                productosFiltrados.reduce((sum, producto) => 
                                    sum + (producto.promedio_riesgo_producto_servicio || 0), 0) / 
                                productosFiltrados.length
                            ).toFixed(2)}
                        </strong></p>
                    </>
                )}
            </div>
        </div>
    );
};

export default ReportesProductosServicios;