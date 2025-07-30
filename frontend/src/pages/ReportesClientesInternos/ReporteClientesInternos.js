import React from 'react';
import { useClientesInternos } from './useClientesInternos';
import { ControlesReporte } from './ControlesReporte';
import { TablaReporte } from './TablaReporte';
import styles from './reportesClientesInternos.module.css';

export const ReporteClientesInternos = () => {
    const {
        state,
        clientesFiltrados,
        handleFiltroChange,
        actualizarReporte,
        validarRiesgo,
        validarTodosLosRiesgos,
        COLUMNAS_REPORTE
    } = useClientesInternos();

    return (
        <div className={styles.contenedor}>
            <header className={styles.header}>
                <h1>Reporte de Clientes Internos</h1>
                <p>Información formal de evaluación de riesgos del personal interno</p>
            </header>

            {state.error && <div className={styles.error}>{state.error}</div>}

            <ControlesReporte
                filtro={state.filtro}
                onFiltroChange={handleFiltroChange}
                onActualizar={actualizarReporte}
                onValidarTodos={validarTodosLosRiesgos}
                clientes={clientesFiltrados}
                columnas={COLUMNAS_REPORTE}
                validandoTodos={state.validandoTodos}
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
                        <p>Promedio de riesgo calculado: <strong>
                            {(
                                clientesFiltrados.reduce((sum, cliente) => 
                                    sum + (cliente.factorRiesgoClienteInterno || 0), 0) / 
                                clientesFiltrados.length
                            ).toFixed(2)}
                        </strong></p>
                        <p>Promedio de riesgo validado: <strong>
                            {(
                                clientesFiltrados.reduce((sum, cliente) => 
                                    sum + (cliente.promedio_riesgo_cliente_interno || 0), 0) / 
                                clientesFiltrados.length
                            ).toFixed(2)}
                        </strong></p>
                    </>
                )}
            </div>
        </div>
    );
};

export default ReporteClientesInternos;