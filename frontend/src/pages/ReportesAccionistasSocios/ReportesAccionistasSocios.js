import React from 'react';
import { useAccionistasSocios } from './useAccionistasSocios';
import { ControlesReporte } from './ControlesReporte';
import { TablaReporte } from './TablaReporte';
import styles from './reportesAccionistasSocios.module.css';

export const ReportesAccionistasSocios = () => {
    const {
        state,
        accionistasFiltrados,
        handleFiltroChange,
        actualizarReporte,
        validarRiesgos,
        COLUMNAS_REPORTE
    } = useAccionistasSocios();

    return (
        <div className={styles.contenedor}>
            <header className={styles.header}>
                <h1>Reporte de Accionistas y Socios</h1>
                <p>Información formal de evaluación de riesgos</p>
            </header>

            {state.error && <div className={styles.error}>{state.error}</div>}

            <ControlesReporte
                filtro={state.filtro}
                onFiltroChange={handleFiltroChange}
                onActualizar={actualizarReporte}
                onValidarRiesgo={validarRiesgos}
                accionistas={accionistasFiltrados}
                columnas={COLUMNAS_REPORTE}
                validando={state.validando}
            />

            <TablaReporte
                columnas={COLUMNAS_REPORTE}
                accionistas={accionistasFiltrados}
                loading={state.loading}
            />

            <div className={styles.resumen}>
                <p>Total en reporte: <strong>{accionistasFiltrados.length}</strong></p>
                {accionistasFiltrados.length > 0 && (
                    <p>Promedio de riesgo: <strong>
                        {(
                            accionistasFiltrados.reduce((sum, accionista) => 
                                sum + (accionista.factorRiesgoAccionistaSocio || 0), 0) / 
                            accionistasFiltrados.length
                        ).toFixed(2)}
                    </strong></p>
                )}
            </div>
        </div>
    );
};

export default ReportesAccionistasSocios;