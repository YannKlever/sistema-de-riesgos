import React, { useMemo } from 'react';
import { useClientesExternos } from './useClientesExternos';
import { ControlesReporte } from './ControlesReporte';
import { TablaReporte } from './TablaReporte';
import styles from './reportesClientesExternos.module.css';

export const ReporteClientesExternos = () => {
    const {
        state,
        clientesFiltrados,
        handleFiltroChange,
        actualizarReporte,
        validarTodo,
        COLUMNAS_REPORTE
    } = useClientesExternos();

    // Calcular promedios para el resumen
   
    const promedios = useMemo(() => {
        if (clientesFiltrados.length === 0) return {};
        
        const suma = clientesFiltrados.reduce((acc, cliente) => ({
            probabilidad: acc.probabilidad + (cliente.probabilidad || 0),
            impacto: acc.impacto + (cliente.impacto || 0),
            factorRiesgo: acc.factorRiesgo + (cliente.factorRiesgoClienteExterno || 0),
            riesgoProductoServicio: acc.riesgoProductoServicio + (cliente.promedio_riesgo_producto_servicio || 0)
        }), { 
            probabilidad: 0, 
            impacto: 0, 
            factorRiesgo: 0,
            riesgoProductoServicio: 0
        });
        
        return {
            probabilidad: (suma.probabilidad / clientesFiltrados.length).toFixed(2),
            impacto: (suma.impacto / clientesFiltrados.length).toFixed(2),
            factorRiesgo: (suma.factorRiesgo / clientesFiltrados.length).toFixed(2),
            riesgoProductoServicio: (suma.riesgoProductoServicio / clientesFiltrados.length).toFixed(2)
        };
    }, [clientesFiltrados]);

    return (
        <div className={styles.contenedor}>
            <header className={styles.header}>
                <h1>Reporte de Clientes Externos</h1>
                <p>Información formal de evaluación de riesgos</p>
            </header>

            {state.error && <div className={styles.error}>{state.error}</div>}

            <ControlesReporte
                filtro={state.filtro}
                onFiltroChange={handleFiltroChange}
                onActualizar={actualizarReporte}
                onValidarTodo={validarTodo}
                clientes={clientesFiltrados}
                columnas={COLUMNAS_REPORTE}
                loading={state.loading}
            />

            <TablaReporte
                columnas={COLUMNAS_REPORTE}
                clientes={clientesFiltrados}
                loading={state.loading}
            />

            <div className={styles.resumen}>
                <p>Total de clientes en reporte: <strong>{clientesFiltrados.length}</strong></p>
                {clientesFiltrados.length > 0 && (
                    <>
                        <p>Promedio de probabilidad: <strong>{promedios.probabilidad}</strong></p>
                        <p>Promedio de impacto: <strong>{promedios.impacto}</strong></p>
                        <p>Promedio de factor de riesgo: <strong>{promedios.factorRiesgo}</strong></p>
                        <p>Promedio de riesgo producto/servicio: <strong>{promedios.riesgoProductoServicio}</strong></p>
                    </>
                )}
            </div>
        </div>
    );
};

export default ReporteClientesExternos;