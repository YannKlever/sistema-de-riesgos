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
    const [paginaActual, setPaginaActual] = useState(0);
    const [tamanoPagina, setTamanoPagina] = useState(10);

    // Función para redondear matemáticamente a entero (0.5 hacia arriba)
    const redondearRiesgo = (valor) => {
        if (valor == null) return 0;
        return Math.round(valor);
    };

    // Filtrar productos basado en la búsqueda
    const productosFiltradosBusqueda = useMemo(() => {
        if (!busqueda) return productosFiltrados;
        
        const termino = busqueda.toLowerCase();
        return productosFiltrados.filter(producto => {
            const camposBusqueda = [
                producto.producto_servicio || '',
                producto.oficina || '',
                producto.riesgo_producto || '',
                producto.riesgo_cliente || '',
                producto.categoria || '',
                producto.descripcion || ''
            ];
            
            return camposBusqueda.some(campo => 
                campo.toLowerCase().includes(termino)
            );
        });
    }, [productosFiltrados, busqueda]);

    // Paginación manual
    const paginasTotales = Math.ceil(productosFiltradosBusqueda.length / tamanoPagina);
    const inicio = paginaActual * tamanoPagina;
    const fin = inicio + tamanoPagina;
    const productosPaginados = productosFiltradosBusqueda.slice(inicio, fin);

    const irAPagina = (pagina) => {
        setPaginaActual(Math.max(0, Math.min(pagina, paginasTotales - 1)));
    };

    const siguientePagina = () => {
        if (paginaActual < paginasTotales - 1) {
            setPaginaActual(paginaActual + 1);
        }
    };

    const paginaAnterior = () => {
        if (paginaActual > 0) {
            setPaginaActual(paginaActual - 1);
        }
    };

    // Preparar datos para el gráfico
    const prepararDatosGrafico = () => {
        if (!productosPaginados.length) return { labels: [], datasets: [] };

        // Ordenar por riesgo (mayor a menor)
        const productosOrdenados = [...productosPaginados]
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
            }],
            productos: productosOrdenados
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
                text: busqueda 
                    ? `Resultados de búsqueda (${productosFiltradosBusqueda.length} encontrados)`
                    : 'Análisis de Riesgo de Productos/Servicios',
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
                    },
                    padding: 15
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
                <h1>Análisis de Riesgo - Productos/Servicios</h1>
                <p>Visualización del factor de riesgo individual por producto/servicio</p>
            </header>

            <div className={styles.controles}>
                <input
                    type="text"
                    placeholder="Buscar por producto, oficina, categoría, descripción o tipo de riesgo..."
                    value={busqueda}
                    onChange={(e) => {
                        setBusqueda(e.target.value);
                        setPaginaActual(0);
                    }}
                    className={styles.buscador}
                />
                {busqueda && (
                    <span className={styles.contadorBusqueda}>
                        {productosFiltradosBusqueda.length} de {productosFiltrados.length} productos encontrados
                    </span>
                )}
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

                    {/* Controles de paginación manual */}
                    {paginasTotales > 1 && (
                        <div className={styles.paginacion}>
                            <button
                                onClick={() => irAPagina(0)}
                                disabled={paginaActual === 0}
                                className={styles.botonPaginacion}
                            >
                                {'<<'}
                            </button>
                            <button
                                onClick={paginaAnterior}
                                disabled={paginaActual === 0}
                                className={styles.botonPaginacion}
                            >
                                {'<'}
                            </button>
                            
                            <span className={styles.infoPagina}>
                                Página{' '}
                                <strong>
                                    {paginaActual + 1} de {paginasTotales}
                                </strong>
                            </span>

                            <button
                                onClick={siguientePagina}
                                disabled={paginaActual >= paginasTotales - 1}
                                className={styles.botonPaginacion}
                            >
                                {'>'}
                            </button>
                            <button
                                onClick={() => irAPagina(paginasTotales - 1)}
                                disabled={paginaActual >= paginasTotales - 1}
                                className={styles.botonPaginacion}
                            >
                                {'>>'}
                            </button>

                            <select
                                value={tamanoPagina}
                                onChange={(e) => {
                                    setTamanoPagina(Number(e.target.value));
                                    setPaginaActual(0);
                                }}
                                className={styles.selectorPagina}
                            >
                                {[5, 10, 20, 30, 50].map(pageSize => (
                                    <option key={pageSize} value={pageSize}>
                                        Mostrar {pageSize}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div className={styles.resumen}>
                        <p>Total de productos/servicios: <strong>{productosFiltrados.length}</strong></p>
                        {busqueda && (
                            <p>Productos encontrados: <strong>{productosFiltradosBusqueda.length}</strong></p>
                        )}
                        <p>Mostrando: <strong>{productosPaginados.length}</strong> productos</p>
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