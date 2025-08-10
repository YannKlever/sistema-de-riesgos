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
        validarTodosLosRiesgos,
        COLUMNAS_REPORTE,
        setState // Añadimos setState aquí
    } = useClientesInternos();

    return (
        <div className={styles.contenedor}>
            <header className={styles.header}>
                <h1>Reporte de Clientes Internos</h1>
                <p>Información formal de evaluación de riesgos del personal interno</p>
            </header>

            {state.error && (
                <div className={styles.error}>
                    {state.error}
                    <button 
                        onClick={() => setState(prev => ({ ...prev, error: '' }))}
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
                <div className={styles.resumenItem}>
                    <span>Total de clientes:</span>
                    <strong>{clientesFiltrados.length}</strong>
                </div>
                
                {clientesFiltrados.length > 0 && (
                    <>
                        <div className={styles.resumenItem}>
                            <span>Promedio Probabilidad:</span>
                            <strong className={styles.valorNumerico}>
                                {(
                                    clientesFiltrados.reduce((sum, cliente) => 
                                        sum + (cliente.probabilidad || 0), 0) / 
                                    clientesFiltrados.length
                                ).toFixed(2)}
                            </strong>
                        </div>
                        
                        <div className={styles.resumenItem}>
                            <span>Promedio Impacto:</span>
                            <strong className={styles.valorNumerico}>
                                {(
                                    clientesFiltrados.reduce((sum, cliente) => 
                                        sum + (cliente.impacto || 0), 0) / 
                                    clientesFiltrados.length
                                ).toFixed(2)}
                            </strong>
                        </div>
                        
                        <div className={styles.resumenItem}>
                            <span>Promedio Riesgo Calculado:</span>
                            <strong className={styles.valorNumerico}>
                                {(
                                    clientesFiltrados.reduce((sum, cliente) => 
                                        sum + (cliente.factorRiesgoClienteInterno || 0), 0) / 
                                    clientesFiltrados.length
                                ).toFixed(2)}
                            </strong>
                        </div>
                        
                        <div className={styles.resumenItem}>
                            <span>Promedio Riesgo Validado:</span>
                            <strong className={styles.valorNumerico}>
                                {(
                                    clientesFiltrados.reduce((sum, cliente) => 
                                        sum + (cliente.promedio_riesgo_cliente_interno || 0), 0) / 
                                    clientesFiltrados.length
                                ).toFixed(2)}
                            </strong>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ReporteClientesInternos;