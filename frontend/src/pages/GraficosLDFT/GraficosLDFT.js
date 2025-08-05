import React, { useState, useMemo } from 'react';
import { useReportesLDFT } from '../ReportesFormularioLDFT/useReporteLDFT';
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
import styles from './graficosLDFT.module.css';

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

const GraficosLDFT = () => {
    const { state, evaluacionesFiltradas, handleFiltroChange, COLUMNAS_REPORTE } = useReportesLDFT();
    const [busqueda, setBusqueda] = useState('');

    // Obtener columnas numéricas
    const COLUMNAS_NUMERICAS = COLUMNAS_REPORTE.filter(col => col.id.endsWith('_numerico'));

    const redondearRiesgo = (valor) => {
        if (valor == null) return 0;
        return Math.round(valor);
    };

    const evaluacionesFiltradasBusqueda = useMemo(() => {
        if (!busqueda) return evaluacionesFiltradas;

        const termino = busqueda.toLowerCase();
        return evaluacionesFiltradas.filter(evaluacion =>
            `${evaluacion.usuario || ''} ${evaluacion.fecha_evaluacion || ''}`
                .toLowerCase()
                .includes(termino)
        );
    }, [evaluacionesFiltradas, busqueda]);

    const prepararDatosGrafico = () => {
        if (!evaluacionesFiltradasBusqueda.length) return { labels: [], datasets: [] };

        const evaluacionesOrdenadas = [...evaluacionesFiltradasBusqueda]
            .sort((a, b) => (b.promedio_riesgo || 0) - (a.promedio_riesgo || 0));

        const labels = evaluacionesOrdenadas.map(evaluacion => {
            return `${evaluacion.usuario || 'Sin usuario'} (${new Date(evaluacion.fecha_evaluacion).toLocaleDateString() || 'Sin fecha'})`;
        });

        const valoresRiesgo = evaluacionesOrdenadas.map(evaluacion => {
            const valor = evaluacion.promedio_riesgo;
            const redondeado = Math.min(5, Math.max(1, redondearRiesgo(valor)));
            return redondeado;
        });

        return {
            labels,
            datasets: [{
                label: 'Nivel de Riesgo LD/FT',
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
            evaluaciones: evaluacionesOrdenadas
        };
    };

    const { labels, datasets, evaluaciones } = prepararDatosGrafico();

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
                text: 'Análisis de Riesgo LD/FT por Evaluación',
                font: {
                    size: 16
                }
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        const value = context.raw;
                        const riskLevels = ['Minimo', 'Bajo', 'Moderado', 'Alto', 'Critico'];
                        const evaluacion = evaluaciones[context.dataIndex];
                        const valorOriginal = evaluacion.promedio_riesgo?.toFixed(2) || 'N/A';

                        return [
                            `Nivel de riesgo Ponderado: ${value} (${riskLevels[value - 1] || 'N/A'})`,
                            `Promedio de riesgo: ${valorOriginal}`,
                        ];
                    },
                    afterLabel: (context) => {
                        const evaluacion = evaluaciones[context.dataIndex];
                        const info = [];
                        
                        info.push(`Usuario: ${evaluacion.usuario || 'N/A'}`);
                        info.push(`Fecha: ${new Date(evaluacion.fecha_evaluacion).toLocaleDateString() || 'N/A'}`);
                        
                        // Mostrar campos numéricos de riesgo
                        
                        
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
                <h1>Análisis de Riesgo - LD/FT</h1>
                <p>Visualización del riesgo de Lavado de Dinero y Financiamiento al Terrorismo</p>
            </header>

            {state.error && <div className={styles.error}>{state.error}</div>}

            <div className={styles.controles}>
                <input
                    type="text"
                    placeholder="Buscar por usuario o fecha..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className={styles.buscador}
                />
                
            </div>

            {state.loading ? (
                <div className={styles.cargando}>Cargando evaluaciones LD/FT...</div>
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
                        <h3>Leyenda de Riesgo LD/FT:</h3>
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
                        <p>Total de evaluaciones en gráfico: <strong>{evaluacionesFiltradasBusqueda.length}</strong></p>
                        {evaluacionesFiltradasBusqueda.length > 0 && (
                            <p>Promedio general de riesgo: <strong>
                                {(
                                    evaluacionesFiltradasBusqueda.reduce((sum, evaluacion) => 
                                        sum + (evaluacion.promedio_riesgo || 0), 0) / 
                                    evaluacionesFiltradasBusqueda.length
                                ).toFixed(2)}
                            </strong></p>
                        )}
                    </div>
                </div>
            ) : (
                <div className={styles.sinDatos}>
                    {busqueda || state.filtro
                        ? 'No se encontraron evaluaciones que coincidan con los filtros'
                        : 'No hay datos suficientes para generar el análisis de riesgo LD/FT'}
                </div>
            )}
        </div>
    );
};

export default GraficosLDFT;