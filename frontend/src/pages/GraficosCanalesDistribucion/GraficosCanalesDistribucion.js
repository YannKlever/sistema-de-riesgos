import React, { useState, useMemo } from 'react';
import { useCanalesDistribucion } from '../ReportesCanalDistribucion/useCanalesDistribucion';
import { Chart } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    LinearScale,
    CategoryScale,
    BarElement,
    PointElement,
    LineElement,
    Legend,
    Tooltip,
    Title,
    Colors
} from 'chart.js';
import styles from './graficosCanalesDistribucion.module.css';

ChartJS.register(
    LinearScale,
    CategoryScale,
    BarElement,
    PointElement,
    LineElement,
    Legend,
    Tooltip,
    Title,
    Colors
);

const GraficosCanalesDistribucion = () => {
    const { state, canalesFiltrados, handleFiltroChange, COLUMNAS_REPORTE } = useCanalesDistribucion();
    
    // Obtener columnas numéricas del hook o definirlas localmente
    const COLUMNAS_NUMERICAS = COLUMNAS_REPORTE.filter(col => col.id.endsWith('_numerico'));

    const redondearRiesgo = (valor) => {
        if (valor == null) return 0;
        return Math.round(valor);
    };

    const prepararDatosGrafico = () => {
        if (!canalesFiltrados.length) return { labels: [], datasets: [] };

        const canalesOrdenados = [...canalesFiltrados]
            .sort((a, b) => (b.factorRiesgoCanal || 0) - (a.factorRiesgoCanal || 0));

        const labels = canalesOrdenados.map(canal => {
            return `${canal.nombre_canal || 'Sin nombre'} (${canal.tipo_canal || 'Sin tipo'})`;
        });

        const valoresRiesgo = canalesOrdenados.map(canal => {
            const valor = canal.factorRiesgoCanal;
            const redondeado = Math.min(5, Math.max(1, redondearRiesgo(valor)));
            return redondeado;
        });

        return {
            labels,
            datasets: [{
                label: 'Nivel de Riesgo',
                data: valoresRiesgo,
                backgroundColor: valoresRiesgo.map(value => {
                    switch (value) {
                        case 1: return '#228B22'; // Verde bajo
                        case 2: return '#9ACD32'; // Verde claro
                        case 3: return '#FFD700'; // Amarillo
                        case 4: return '#FF8C00'; // Naranja
                        case 5: return '#FF0000'; // Rojo
                        default: return '#f7f7f7'; // Gris
                    }
                }),
                borderColor: '#ddd',
                borderWidth: 1
            }],
            canales: canalesOrdenados
        };
    };

    const { labels, datasets, canales } = prepararDatosGrafico();

    const options = {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            title: {
                display: true,
                text: 'Análisis de Riesgo por Canal de Distribución',
                font: {
                    size: 16
                }
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        const value = context.raw;
                        const riskLevels = ['Minimo', 'Bajo', 'Moderado', 'Alto', 'Critico'];
                        const canal = canales[context.dataIndex];
                        const valorOriginal = canal.factorRiesgoCanal?.toFixed(2) || 'N/A';

                        return [
                            `Nivel de riesgo Ponderado: ${value} (${riskLevels[value - 1] || 'N/A'})`,
                            `Nivel de riesgo: ${valorOriginal}`,
                        ];
                    },
                    afterLabel: (context) => {
                        const canal = canales[context.dataIndex];
                        const info = [];
                        
                        info.push(`Nombre: ${canal.nombre_canal || 'N/A'}`);
                        info.push(`Tipo: ${canal.tipo_canal || 'N/A'}`);
                        info.push(`Identificador: ${canal.identificador_canal || 'N/A'}`);
                        
                        // Mostrar campos numéricos de riesgo si existen
                        COLUMNAS_NUMERICAS.forEach(col => {
                            if (canal[col.id] !== undefined) {
                                info.push(`${col.nombre}: ${canal[col.id] || 'N/A'}`);
                            }
                        });
                        
                        return info;
                    }
                }
            }
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Nivel de Riesgo'
                },
                min: 0,
                max: 5,
                ticks: {
                    stepSize: 1
                }
            },
            y: {
                ticks: {
                    autoSkip: false,
                    font: {
                        size: 12
                    }
                }
            }
        }
    };

    return (
        <div className={styles.contenedor}>
            <header className={styles.header}>
                <h1>Análisis de Riesgo - Canales de Distribución</h1>
                <p>Visualización del factor de riesgo por canal de distribución</p>
            </header>

            {state.error && <div className={styles.error}>{state.error}</div>}

            <div className={styles.controles}>
                <input
                    type="text"
                    placeholder="Buscar por nombre, tipo o identificador..."
                    value={state.filtro}
                    onChange={handleFiltroChange}
                    className={styles.buscador}
                />
            </div>

            {state.loading ? (
                <div className={styles.cargando}>Cargando datos de canales...</div>
            ) : datasets?.length > 0 ? (
                <div className={styles.chartContainer}>
                    <div className={styles.chartWrapper} style={{ height: `${Math.max(400, labels.length * 40)}px` }}>
                        <Chart
                            type='bar'
                            data={{ labels, datasets }}
                            options={options}
                        />
                    </div>

                    <div className={styles.leyenda}>
                        <h3>Leyenda de Riesgo:</h3>
                        <div className={styles.leyendaItems}>
                            {[1, 2, 3, 4, 5].map(nivel => (
                                <div key={nivel} className={styles.leyendaItem}>
                                    <span
                                        className={styles.leyendaColor}
                                        style={{
                                            background: [
                                                '#228B22',
                                                '#9ACD32',
                                                '#FFD700',
                                                '#FF8C00',
                                                '#FF0000'
                                            ][nivel - 1]
                                        }}
                                    />
                                    <span>Nivel {nivel} - {[
                                        'Minimo',
                                        'Bajo',
                                        'Moderado',
                                        'Alto',
                                        'Critico'
                                    ][nivel - 1]}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={styles.resumen}>
                        <p>Total de canales en gráfico: <strong>{canalesFiltrados.length}</strong></p>
                        {canalesFiltrados.length > 0 && (
                            <p>Promedio de riesgo: <strong>
                                {(
                                    canalesFiltrados.reduce((sum, canal) => 
                                        sum + (canal.factorRiesgoCanal || 0), 0) / 
                                    canalesFiltrados.length
                                ).toFixed(2)}
                            </strong></p>
                        )}
                    </div>
                </div>
            ) : (
                <div className={styles.sinDatos}>
                    {state.filtro
                        ? 'No se encontraron canales que coincidan con el filtro'
                        : 'No hay datos suficientes para generar el análisis de riesgo'}
                </div>
            )}
        </div>
    );
};

export default GraficosCanalesDistribucion;