import React, { useMemo } from 'react';
import { COLUMNAS_NUMERICAS_PRODUCTOS } from '../ReportesProductoServicio/constantes';
import { useProductosServicios } from '../ReportesProductoServicio/useProductosServicios';
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
import styles from './graficosProductosServicios.module.css';

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

const GraficosProductosServicios = () => {
    const { state, productosFiltrados, handleFiltroChange } = useProductosServicios();

    // Función para redondear matemáticamente a entero (0.5 hacia arriba)
    const redondearRiesgo = (valor) => {
        if (valor == null) return 0;
        return Math.round(valor);
    };

    // Preparar datos para el gráfico
    const prepararDatosGrafico = () => {
        if (!productosFiltrados.length) return { labels: [], datasets: [] };

        // Ordenar por riesgo (mayor a menor)
        const productosOrdenados = [...productosFiltrados]
            .sort((a, b) => (b.riesgoFactorProductosServicios || 0) - (a.riesgoFactorProductosServicios || 0));

        // Preparar etiquetas con nombre, código y categoría
        const labels = productosOrdenados.map(producto => {
            return `${producto.nombre || 'Sin nombre'} (${producto.codigo || 'Sin código'}) - ${producto.categoria || 'Sin categoría'}`;
        });

        // Obtener valores de riesgo con redondeo matemático
        const valoresRiesgo = productosOrdenados.map(producto => {
            const valor = producto.riesgoFactorProductosServicios;
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
            productos: productosOrdenados // Para usar en los tooltips
        };
    };

    const { labels, datasets, productos } = prepararDatosGrafico();

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
                text: 'Análisis de Riesgo de Productos/Servicios',
                font: {
                    size: 16
                }
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        const value = context.raw;
                        const riskLevels = ['Minimo', 'Bajo', 'Moderado', 'Alto', 'Critico'];
                        const producto = productos[context.dataIndex];
                        const valorOriginal = producto.riesgoFactorProductosServicios?.toFixed(2) || 'N/A';

                        return [
                            `Nivel de riesgo Ponderado: ${value} (${riskLevels[value - 1] || 'N/A'})`,
                            `Nivel de riesgo: ${valorOriginal}`,
                        ];
                    },
                    afterLabel: (context) => {
                        const producto = productos[context.dataIndex];
                        const info = [];
                        
                        info.push(`Nombre: ${producto.nombre || 'N/A'}`);
                        info.push(`Código: ${producto.codigo || 'N/A'}`);
                        info.push(`Categoría: ${producto.categoria || 'N/A'}`);
                        info.push(`Tipo: ${producto.tipo || 'N/A'}`);
                        
                        // Mostrar campos numéricos que contribuyen al riesgo
                        COLUMNAS_NUMERICAS_PRODUCTOS.forEach(col => {
                            if (producto[col.id] !== undefined) {
                                info.push(`${col.nombre}: ${producto[col.id] || 'N/A'}`);
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
                <h1>Análisis de Riesgo - Productos/Servicios</h1>
                <p>Visualización del factor de riesgo por producto/servicio</p>
            </header>

            {state.error && <div className={styles.error}>{state.error}</div>}

            <div className={styles.controles}>
                <input
                    type="text"
                    placeholder="Buscar por nombre, código, categoría o tipo..."
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
                        <p>Total de productos/servicios en gráfico: <strong>{productosFiltrados.length}</strong></p>
                        {productosFiltrados.length > 0 && (
                            <p>Promedio de riesgo: <strong>
                                {(
                                    productosFiltrados.reduce((sum, producto) => 
                                        sum + (producto.riesgoFactorProductosServicios || 0), 0) / 
                                    productosFiltrados.length
                                ).toFixed(2)}
                            </strong></p>
                        )}
                    </div>
                </div>
            ) : (
                <div className={styles.sinDatos}>
                    {state.filtro
                        ? 'No se encontraron productos/servicios que coincidan con el filtro'
                        : 'No hay datos suficientes para generar el análisis de riesgo'}
                </div>
            )}
        </div>
    );
};

export default GraficosProductosServicios;