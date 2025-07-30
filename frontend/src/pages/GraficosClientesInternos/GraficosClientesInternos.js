import React, { useMemo } from 'react';
import { COLUMNAS_NUMERICAS } from '../ReportesClientesInternos/constantes';
import { useClientesInternos } from '../ReportesClientesInternos/useClientesInternos';
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
import styles from './graficosClientesInternos.module.css';

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

const GraficosClientesInternos = () => {
    const { state, clientesFiltrados, handleFiltroChange } = useClientesInternos();

    // Función para redondear matemáticamente a entero (0.5 hacia arriba)
    const redondearRiesgo = (valor) => {
        if (valor == null) return 0;
        return Math.round(valor);
    };

    // Preparar datos para el gráfico
    const prepararDatosGrafico = () => {
        if (!clientesFiltrados.length) return { labels: [], datasets: [] };

        // Ordenar por riesgo (mayor a menor)
        const clientesOrdenados = [...clientesFiltrados]
            .sort((a, b) => (b.factorRiesgoClienteInterno || 0) - (a.factorRiesgoClienteInterno || 0));

        // Preparar etiquetas con nombre completo, documento y cargo
        const labels = clientesOrdenados.map(cliente => {
            return `${cliente.nombres || ''} ${cliente.apellidos || ''} (${cliente.nro_documento || 'N/A'}) - ${cliente.cargo || 'N/A'}`;
        });

        // Obtener valores de riesgo con redondeo matemático
        const valoresRiesgo = clientesOrdenados.map(cliente => {
            const valor = cliente.factorRiesgoClienteInterno;
            // Aseguramos que el valor esté entre 1 y 5 después del redondeo
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
            clientes: clientesOrdenados // Para usar en los tooltips
        };
    };

    const { labels, datasets, clientes } = prepararDatosGrafico();

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
                text: 'Análisis de Riesgo de Clientes Internos',
                font: {
                    size: 16
                }
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        const value = context.raw;
                        const riskLevels = ['Minimo', 'Bajo', 'Moderado', 'Alto', 'Critico'];
                        const cliente = clientes[context.dataIndex];
                        const valorOriginal = cliente.factorRiesgoClienteInterno?.toFixed(2) || 'N/A';

                        return [
                            `Nivel de riesgo Ponderado: ${value} (${riskLevels[value - 1] || 'N/A'})`,
                            `Nivel de riesgo: ${valorOriginal}`,
                        ];
                    },
                    afterLabel: (context) => {
                        const cliente = clientes[context.dataIndex];
                        const info = [];
                        
                        info.push(`Nombres: ${cliente.nombres || 'N/A'}`);
                        info.push(`Apellidos: ${cliente.apellidos || 'N/A'}`);
                        info.push(`Documento: ${cliente.nro_documento || 'N/A'}`);
                        info.push(`Cargo: ${cliente.cargo || 'N/A'}`);
                        info.push(`Oficina: ${cliente.oficina || 'N/A'}`);
                        info.push(`Área: ${cliente.area || 'N/A'}`);
                        
                        // Mostrar también los campos numéricos que contribuyen al riesgo
                        COLUMNAS_NUMERICAS.forEach(col => {
                            if (cliente[col.id] !== undefined) {
                                info.push(`${col.nombre}: ${cliente[col.id] || 'N/A'}`);
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
                <h1>Análisis de Riesgo - Clientes Internos</h1>
                <p>Visualización del factor de riesgo individual por cliente interno</p>
            </header>

            {state.error && <div className={styles.error}>{state.error}</div>}

            <div className={styles.controles}>
                <input
                    type="text"
                    placeholder="Buscar por nombre, apellido, documento, cargo u oficina..."
                    value={state.filtro}
                    onChange={handleFiltroChange}
                    className={styles.buscador}
                />
            </div>

            {state.loading ? (
                <div className={styles.cargando}>Cargando datos...</div>
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
                        <p>Total de clientes en gráfico: <strong>{clientesFiltrados.length}</strong></p>
                        {clientesFiltrados.length > 0 && (
                            <p>Promedio de riesgo: <strong>
                                {(
                                    clientesFiltrados.reduce((sum, cliente) => 
                                        sum + (cliente.factorRiesgoClienteInterno || 0), 0) / 
                                    clientesFiltrados.length
                                ).toFixed(2)}
                            </strong></p>
                        )}
                    </div>
                </div>
            ) : (
                <div className={styles.sinDatos}>
                    {state.filtro
                        ? 'No se encontraron clientes internos que coincidan con el filtro'
                        : 'No hay datos suficientes para generar el análisis de riesgo'}
                </div>
            )}
        </div>
    );
};

export default GraficosClientesInternos;