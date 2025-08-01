import React, { useState, useMemo } from 'react';
import { useAccionistasSocios } from '../ReportesAccionistasSocios/useAccionistasSocios';
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
import styles from './graficosAccionistasSocios.module.css';

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

const GraficosAccionistasSocios = () => {
    const { accionistasFiltrados } = useAccionistasSocios();
    const [busqueda, setBusqueda] = useState('');

    const redondearRiesgo = (valor) => {
        if (valor == null) return 0;
        return Math.round(valor);
    };

    const accionistasFiltradosBusqueda = useMemo(() => {
        if (!busqueda) return accionistasFiltrados;

        const termino = busqueda.toLowerCase();
        return accionistasFiltrados.filter(acc =>
            `${acc.nombres_accionistas_socios} ${acc.apellidos_accionistas_socios} ${acc.nro_documento_accionistas_socios}`
                .toLowerCase()
                .includes(termino)
        );
    }, [accionistasFiltrados, busqueda]);

    const prepararDatosHeatmap = () => {
        if (!accionistasFiltradosBusqueda.length) return { labels: [], datasets: [] };

        const accionistasOrdenados = [...accionistasFiltradosBusqueda]
            .sort((a, b) => (b.factorRiesgoAccionistaSocio || 0) - (a.factorRiesgoAccionistaSocio || 0));

        const labels = accionistasOrdenados.map(acc =>
            `${acc.nombres_accionistas_socios} ${acc.apellidos_accionistas_socios} (${acc.nro_documento_accionistas_socios})`
        );

        const valoresRiesgo = accionistasOrdenados.map(acc => {
            const valor = acc.factorRiesgoAccionistaSocio;
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
                        case 1: return '#228B22';
                        case 2: return '#9ACD32';
                        case 3: return '#FFD700';
                        case 4: return '#FF8C00';
                        case 5: return '#FF0000';
                        default: return '#f7f7f7';
                    }
                }),
                borderColor: '#ddd',
                borderWidth: 1,
                barThickness: 30, // Grosor fijo para las barras
            }],
            accionistas: accionistasOrdenados
        };
    };

    const { labels, datasets, accionistas } = prepararDatosHeatmap();

    const options = {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            title: {
                display: true,
                text: busqueda 
                    ? 'Resultados de búsqueda de Accionistas/Socios'
                    : 'Análisis de Riesgo de Accionistas/Socios',
                font: { size: 16 }
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        const value = context.raw;
                        const riskLevels = ['Minimo', 'Bajo', 'Moderado', 'Alto', 'Critico'];
                        const accionista = accionistas[context.dataIndex];
                        const valorOriginal = accionista.factorRiesgoAccionistaSocio?.toFixed(2) || 'N/A';

                        return [
                            `Nivel de riesgo Ponderado: ${value} (${riskLevels[value - 1] || 'N/A'})`,
                            `Nivel de riesgo: ${valorOriginal}`,
                        ];
                    }
                }
            }
        },
        scales: {
            x: {
                title: { display: true, text: 'Nivel de Riesgo' },
                min: 0,
                max: 5,
                ticks: { stepSize: 1 }
            },
            y: {
                ticks: {
                    autoSkip: false,
                    font: { size: 12 },
                    padding: 15 // Espacio entre etiquetas
                }
            }
        },
        layout: {
            padding: {
                left: 10,
                right: 10,
                top: 10,
                bottom: 10
            }
        }
    };

    return (
        <div className={styles.contenedor}>
            <header className={styles.header}>
                <h1>Análisis de Riesgo - Accionistas y Socios</h1>
                <p>Visualización del factor de riesgo individual por cliente</p>
            </header>

            <div className={styles.controles}>
                <input
                    type="text"
                    placeholder="Buscar por nombre, apellido o documento..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className={styles.buscador}
                />
            </div>

            {datasets?.length > 0 ? (
                <div className={styles.chartContainer}>
                    <div className={styles.chartWrapper} style={{ height: `${Math.max(400, labels.length * 50)}px` }}>
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
                                            backgroundColor: [
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
                </div>
            ) : (
                <div className={styles.sinDatos}>
                    {busqueda
                        ? 'No se encontraron accionistas/socios que coincidan con la búsqueda'
                        : 'No hay datos suficientes para generar el análisis de riesgo'}
                </div>
            )}
        </div>
    );
};

export default GraficosAccionistasSocios;