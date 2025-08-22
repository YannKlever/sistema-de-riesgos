import React, { useState, useMemo } from 'react';
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
    const { clientesFiltrados } = useClientesInternos();
    const [busqueda, setBusqueda] = useState('');
    const [paginaActual, setPaginaActual] = useState(0);
    const [tamanoPagina, setTamanoPagina] = useState(10);

    // Función para redondear matemáticamente a entero (0.5 hacia arriba)
    const redondearRiesgo = (valor) => {
        if (valor == null) return 0;
        return Math.round(valor);
    };

    // Filtrar clientes internos basado en la búsqueda
    const clientesFiltradosBusqueda = useMemo(() => {
        if (!busqueda) return clientesFiltrados;

        const termino = busqueda.toLowerCase();
        return clientesFiltrados.filter(cliente => {
            const camposBusqueda = [
                cliente.nombres_cliente_interno || '',
                cliente.apellidos_cliente_interno || '',
                cliente.nro_documento_cliente_interno || '',
                cliente.oficina || '',
                cliente.categoria_pep || '',
                cliente.correo || '',
                cliente.telefono || ''
            ];

            return camposBusqueda.some(campo =>
                campo.toLowerCase().includes(termino)
            );
        });
    }, [clientesFiltrados, busqueda]);

    // Paginación manual
    const paginasTotales = Math.ceil(clientesFiltradosBusqueda.length / tamanoPagina);
    const inicio = paginaActual * tamanoPagina;
    const fin = inicio + tamanoPagina;
    const clientesPaginados = clientesFiltradosBusqueda.slice(inicio, fin);

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

    // Preparar datos para el gráfico usando solo los clientes paginados
    const prepararDatosGrafico = () => {
        if (!clientesPaginados.length) return { labels: [], datasets: [] };

        // MODIFICACIÓN: Usar riesgo_residual en lugar de promedio_riesgo_cliente_interno
        const clientesOrdenados = [...clientesPaginados]
            .sort((a, b) => (b.riesgo_residual || 0) - (a.riesgo_residual || 0));

        // Preparar etiquetas con nombre completo, documento y cargo/oficina
        const labels = clientesOrdenados.map(cliente => {
            return `${cliente.nombres_cliente_interno || ''} ${cliente.apellidos_cliente_interno || ''} (${cliente.nro_documento_cliente_interno || 'N/A'}) - ${cliente.oficina || 'N/A'}`;
        });

        // MODIFICACIÓN: Usar riesgo_residual en lugar de promedio_riesgo_cliente_interno
        const valoresRiesgo = clientesOrdenados.map(cliente => {
            const valor = cliente.riesgo_residual; // Cambiado aquí
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
                text: busqueda
                    ? `Resultados de búsqueda (${clientesFiltradosBusqueda.length} encontrados)`
                    : 'Análisis de Riesgo de Clientes Internos',
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
                        // MODIFICACIÓN: Usar riesgo_residual en lugar de promedio_riesgo_cliente_interno
                        const valorOriginal = cliente.riesgo_residual?.toFixed(2) || 'N/A';

                        return [
                            `Nivel de riesgo Ponderado: ${value} (${riskLevels[value - 1] || 'N/A'})`,
                            `Riesgo Residual: ${valorOriginal}`,
                        ];
                    },
                    afterLabel: (context) => {
                        const cliente = clientes[context.dataIndex];
                        return [
                            `Riesgo Profesión: ${cliente.riesgo_profesion_actividad || 'N/A'}`,
                        ];
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
                <h1>Análisis de Riesgo - Clientes Internos</h1>
                <p>Visualización del factor de riesgo individual por cliente interno</p>
            </header>

            <div className={styles.controles}>
                <input
                    type="text"
                    placeholder="Buscar por nombre, apellido, documento, oficina, categoría PEP, teléfono o correo..."
                    value={busqueda}
                    onChange={(e) => {
                        setBusqueda(e.target.value);
                        setPaginaActual(0); // Resetear a primera página al buscar
                    }}
                    className={styles.buscador}
                />
                {busqueda && (
                    <span className={styles.contadorBusqueda}>
                        {clientesFiltradosBusqueda.length} de {clientesFiltrados.length} clientes internos encontrados
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
                        <p>Total de clientes internos: <strong>{clientesFiltrados.length}</strong></p>
                        {busqueda && (
                            <p>Clientes internos encontrados: <strong>{clientesFiltradosBusqueda.length}</strong></p>
                        )}
                        <p>Mostrando: <strong>{clientesPaginados.length}</strong> clientes internos</p>
                    </div>
                </div>
            ) : (
                <div className={styles.sinDatos}>
                    {busqueda
                        ? 'No se encontraron clientes internos que coincidan con la búsqueda'
                        : 'No hay datos suficientes para generar el análisis de riesgo'}
                </div>
            )}
        </div>
    );
};

export default GraficosClientesInternos;