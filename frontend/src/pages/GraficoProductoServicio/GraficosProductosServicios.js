import React, { useState, useMemo } from 'react';
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
    const { productosFiltrados } = useProductosServicios();
    const [busqueda, setBusqueda] = useState('');

    // Función para redondear matemáticamente a entero (0.5 hacia arriba)
    const redondearRiesgo = (valor) => {
        if (valor == null) return 0;
        return Math.round(valor);
    };

    // Filtrar productos según la búsqueda
    const productosFiltradosBusqueda = useMemo(() => {
        if (!busqueda) return productosFiltrados;

        const termino = busqueda.toLowerCase();
        return productosFiltrados.filter(producto =>
            `${producto.producto_servicio || ''} ${producto.oficina || ''} ${producto.riesgo_producto || ''} ${producto.riesgo_cliente || ''}`
                .toLowerCase()
                .includes(termino)
        );
    }, [productosFiltrados, busqueda]);

    // Preparar datos para el gráfico
    const prepararDatosGrafico = () => {
        if (!productosFiltradosBusqueda.length) return { labels: [], datasets: [] };

        // Ordenar por riesgo (mayor a menor)
        const productosOrdenados = [...productosFiltradosBusqueda]
            .sort((a, b) => (b.promedio_riesgo_producto_servicio || 0) - (a.promedio_riesgo_producto_servicio || 0));

        // Preparar etiquetas con nombre del producto/servicio y oficina
        const labels = productosOrdenados.map(producto => {
            return `${producto.producto_servicio || 'Sin nombre'} - ${producto.oficina || 'Sin oficina'}`;
        });

        // Obtener valores de riesgo con redondeo matemático
        const valoresRiesgo = productosOrdenados.map(producto => {
            const valor = producto.promedio_riesgo_producto_servicio;
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
                        const valorOriginal = producto.promedio_riesgo_producto_servicio?.toFixed(2) || 'N/A';

                        return [
                            `Nivel de riesgo Ponderado: ${value} (${riskLevels[value - 1] || 'N/A'})`,
                            `Nivel de riesgo: ${valorOriginal}`,
                        ];
                    },
                    afterLabel: (context) => {
                        const producto = productos[context.dataIndex];
                        const info = [];
                        
                        info.push(`Producto/Servicio: ${producto.producto_servicio || 'N/A'}`);
                        info.push(`Oficina: ${producto.oficina || 'N/A'}`);
                        
                        
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
                <p>Visualización del factor de riesgo individual por producto/servicio</p>
            </header>

            <div className={styles.controles}>
                <input
                    type="text"
                    placeholder="Buscar por producto, oficina o tipo de riesgo..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className={styles.buscador}
                />
            </div>

            {datasets?.length > 0 ? (
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
                </div>
            ) : (
                <div className={styles.sinDatos}>
                    {busqueda
                        ? 'No se encontraron productos/servicios que coincidan con la búsqueda'
                        : 'No hay datos suficientes para generar el análisis de riesgo'}
                </div>
            )}
        </div>
    );
};

export default GraficosProductosServicios;