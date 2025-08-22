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
    const { state, canalesFiltrados } = useCanalesDistribucion();
    const [busqueda, setBusqueda] = useState('');
    const [paginaActual, setPaginaActual] = useState(0);
    const [tamanoPagina, setTamanoPagina] = useState(10);

    // Función para redondear matemáticamente a entero (0.5 hacia arriba)
    const redondearRiesgo = (valor) => {
        if (valor == null) return 0;
        return Math.round(valor);
    };

    // Filtrar canales basado en la búsqueda
    const canalesFiltradosBusqueda = useMemo(() => {
        if (!busqueda) return canalesFiltrados;
        
        const termino = busqueda.toLowerCase();
        return canalesFiltrados.filter(cliente => {
            const camposBusqueda = [
                cliente.nombres_propietario || '',
                cliente.apellidos_propietario || '',
                cliente.nro_documento_propietario || '',
                cliente.razon_social || '',
                cliente.nit || '',
                cliente.tipo_documento_propietario || '',
                cliente.correo || '',
                cliente.telefono || ''
            ];
            
            return camposBusqueda.some(campo => 
                campo.toLowerCase().includes(termino)
            );
        });
    }, [canalesFiltrados, busqueda]);

    // Paginación manual
    const paginasTotales = Math.ceil(canalesFiltradosBusqueda.length / tamanoPagina);
    const inicio = paginaActual * tamanoPagina;
    const fin = inicio + tamanoPagina;
    const canalesPaginados = canalesFiltradosBusqueda.slice(inicio, fin);

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

    // Preparar datos para el gráfico usando solo los canales paginados
    const prepararDatosGrafico = () => {
        if (!canalesPaginados.length) return { labels: [], datasets: [] };

        // MODIFICACIÓN: Usar factor_riesgo_canal_distribucion
        const canalesOrdenados = [...canalesPaginados]
            .sort((a, b) => (b.factor_riesgo_canal_distribucion || 0) - (a.factor_riesgo_canal_distribucion || 0));

        // Preparar etiquetas con los 3 campos más importantes: nombre/razón social, documento/NIT y riesgo
        const labels = canalesOrdenados.map(cliente => {
            const nombre = cliente.razon_social 
                ? cliente.razon_social 
                : `${cliente.nombres_propietario || ''} ${cliente.apellidos_propietario || ''}`;
            
            const identificador = cliente.nit || cliente.nro_documento_propietario || 'N/A';
            // MODIFICACIÓN: Usar factor_riesgo_canal_distribucion
            const riesgo = cliente.factor_riesgo_canal_distribucion?.toFixed(2) || 'N/A';

            return `${nombre} (${identificador}) - Factor: ${riesgo}`;
        });

        // MODIFICACIÓN: Usar factor_riesgo_canal_distribucion
        const valoresRiesgo = canalesOrdenados.map(cliente => {
            const valor = cliente.factor_riesgo_canal_distribucion;
            const redondeado = Math.min(5, Math.max(1, redondearRiesgo(valor)));
            return redondeado;
        });

        return {
            labels,
            datasets: [{
                label: 'Factor Canal de Distribución',
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
                text: busqueda 
                    ? `Resultados de búsqueda (${canalesFiltradosBusqueda.length} encontrados)`
                    : 'Factor Canal de Distribución',
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
                        // MODIFICACIÓN: Usar factor_riesgo_canal_distribucion
                        const valorOriginal = canal.factor_riesgo_canal_distribucion?.toFixed(2) || 'N/A';

                        return [
                            `Factor Canal de Distribución: ${value} (${riskLevels[value - 1] || 'N/A'})`,
                            `Valor Original: ${valorOriginal}`,
                        ];
                    },
                    afterLabel: (context) => {
                        const canal = canales[context.dataIndex];
                        const info = [];
                        
                        if (canal.razon_social) {
                            info.push(`Razón Social: ${canal.razon_social}`);
                            info.push(`NIT: ${canal.nit || 'N/A'}`);
                        } else {
                            info.push(`Nombre: ${canal.nombres_propietario || ''} ${canal.apellidos_propietario || ''}`);
                            info.push(`Documento: ${canal.nro_documento_propietario || 'N/A'}`);
                        }
                        
                        // MODIFICACIÓN: Usar factor_riesgo_canal_distribucion
                        info.push(`Factor: ${canal.factor_riesgo_canal_distribucion?.toFixed(2) || 'N/A'}`);
                        
                        return info;
                    }
                }
            }
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Factor Canal de Distribución'
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
                <h1>Factor Canal de Distribución</h1>
                <p>Visualización del factor de riesgo individual por canal de distribución</p>
            </header>

            <div className={styles.controles}>
                <input
                    type="text"
                    placeholder="Buscar por nombre, razón social, documento, NIT, teléfono o correo..."
                    value={busqueda}
                    onChange={(e) => {
                        setBusqueda(e.target.value);
                        setPaginaActual(0); // Resetear a primera página al buscar
                    }}
                    className={styles.buscador}
                />
                {busqueda && (
                    <span className={styles.contadorBusqueda}>
                        {canalesFiltradosBusqueda.length} de {canalesFiltrados.length} canales encontrados
                    </span>
                )}
            </div>

            {state?.loading ? (
                <div className={styles.cargando}>Cargando datos...</div>
            ) : datasets?.length > 0 ? (
                <div className={styles.chartContainer}>
                    <div className={styles.chartWrapper} style={{ height: `${Math.max(400, labels.length * 50)}px` }}>
                        <Chart
                            type='bar'
                            data={{ labels, datasets }}
                            options={options}
                        />
                    </div>

                    <div className={styles.leyenda}>
                        <h3>Leyenda de Factor Canal de Distribución:</h3>
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
                        <p>Total de canales de distribución: <strong>{canalesFiltrados.length}</strong></p>
                        {busqueda && (
                            <p>Canales encontrados: <strong>{canalesFiltradosBusqueda.length}</strong></p>
                        )}
                        <p>Mostrando: <strong>{canalesPaginados.length}</strong> canales</p>
                    </div>
                </div>
            ) : (
                <div className={styles.sinDatos}>
                    {busqueda
                        ? 'No se encontraron canales que coincidan con la búsqueda'
                        : 'No hay datos suficientes para generar el análisis de riesgo'}
                </div>
            )}
        </div>
    );
};

export default GraficosCanalesDistribucion;