import React, { useMemo } from 'react';
import { useSucursales } from '../ReporteSucursales/useSucursales';
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
import styles from './graficosZonaGeografica.module.css';

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

const GraficosSucursales = () => {
    const { state, sucursalesFiltradas, handleFiltroChange, COLUMNAS_REPORTE } = useSucursales();
    
    // Obtener columnas numéricas del hook o definirlas localmente
    const COLUMNAS_NUMERICAS = COLUMNAS_REPORTE.filter(col => col.id.endsWith('_numerico'));

    const redondearRiesgo = (valor) => {
        if (valor == null) return 0;
        return Math.round(valor);
    };

    const prepararDatosGrafico = () => {
        if (!sucursalesFiltradas.length) return { labels: [], datasets: [] };

        const sucursalesOrdenadas = [...sucursalesFiltradas]
            .sort((a, b) => (b.factorRiesgoZonaGeografica || 0) - (a.factorRiesgoZonaGeografica || 0));

        const labels = sucursalesOrdenadas.map(sucursal => {
            return `${sucursal.oficina || 'Sin nombre'} (${sucursal.municipio || 'Sin municipio'}, ${sucursal.departamento || 'Sin depto.'})`;
        });

        const valoresRiesgo = sucursalesOrdenadas.map(sucursal => {
            const valor = sucursal.factorRiesgoZonaGeografica;
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
            sucursales: sucursalesOrdenadas
        };
    };

    const { labels, datasets, sucursales } = prepararDatosGrafico();

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
                text: 'Análisis de Riesgo por Sucursal',
                font: {
                    size: 16
                }
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        const value = context.raw;
                        const riskLevels = ['Minimo', 'Bajo', 'Moderado', 'Alto', 'Critico'];
                        const sucursal = sucursales[context.dataIndex];
                        const valorOriginal = sucursal.factorRiesgoZonaGeografica?.toFixed(2) || 'N/A';

                        return [
                            `Nivel de riesgo Ponderado: ${value} (${riskLevels[value - 1] || 'N/A'})`,
                            `Nivel de riesgo: ${valorOriginal}`,
                        ];
                    },
                    afterLabel: (context) => {
                        const sucursal = sucursales[context.dataIndex];
                        const info = [];
                        
                    
                        
                        
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
                <h1>Análisis de Riesgo - Ubicación Geográfica</h1>
                <p>Visualización del factor de riesgo por ubicación geográfica</p>
            </header>

            {state.error && <div className={styles.error}>{state.error}</div>}

            <div className={styles.controles}>
                <input
                    type="text"
                    placeholder="Buscar por oficina, municipio, departamento..."
                    value={state.filtro}
                    onChange={handleFiltroChange}
                    className={styles.buscador}
                />
            </div>

            {state.loading ? (
                <div className={styles.cargando}>Cargando datos de sucursales...</div>
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
                        <h3>Leyenda de Riesgo Geográfico:</h3>
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
                        <p>Total de sucursales en gráfico: <strong>{sucursalesFiltradas.length}</strong></p>
                        {sucursalesFiltradas.length > 0 && (
                            <p>Promedio de riesgo geográfico: <strong>
                                {(
                                    sucursalesFiltradas.reduce((sum, sucursal) => 
                                        sum + (sucursal.factorRiesgoZonaGeografica || 0), 0) / 
                                    sucursalesFiltradas.length
                                ).toFixed(2)}
                            </strong></p>
                        )}
                    </div>
                </div>
            ) : (
                <div className={styles.sinDatos}>
                    {state.filtro
                        ? 'No se encontraron sucursales que coincidan con el filtro'
                        : 'No hay datos suficientes para generar el análisis de riesgo geográfico'}
                </div>
            )}
        </div>
    );
};

export default GraficosSucursales;