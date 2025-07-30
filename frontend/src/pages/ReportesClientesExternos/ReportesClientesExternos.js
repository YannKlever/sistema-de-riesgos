import React from 'react';
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
                    <p>Promedio de riesgo: <strong>
                        {(
                            clientesFiltrados.reduce((sum, cliente) => 
                                sum + (cliente.factorRiesgoClienteExterno || 0), 0) / 
                            clientesFiltrados.length
                        ).toFixed(2)}
                    </strong></p>
                )}
            </div>
        </div>
    );
};

export default ReporteClientesExternos;