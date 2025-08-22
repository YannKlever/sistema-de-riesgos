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
    const [paginaActual, setPaginaActual] = useState(0);
    const [tamanoPagina, setTamanoPagina] = useState(10);

    // Función para redondear matemáticamente a entero (0.5 hacia arriba)
    const redondearRiesgo = (valor) => {
        if (valor == null) return 0;
        return Math.round(valor);
    };

    // Filtrar accionistas basado en la búsqueda (similar a clientes externos)
    const accionistasFiltradosBusqueda = useMemo(() => {
        if (!busqueda) return accionistasFiltrados;
        
        const termino = busqueda.toLowerCase();
        return accionistasFiltrados.filter(accionista => {
            const camposBusqueda = [
                accionista.nombres_accionistas_socios || '',
                accionista.apellidos_accionistas_socios || '',
                accionista.nro_documento_accionistas_socios || '',
                accionista.tipo_documento_accionistas_socios || '',
                accionista.correo || '',
                accionista.telefono || ''
            ];
            
            return camposBusqueda.some(campo => 
                campo.toLowerCase().includes(termino)
            );
        });
    }, [accionistasFiltrados, busqueda]);

    // Paginación manual (similar a clientes externos)
    const paginasTotales = Math.ceil(accionistasFiltradosBusqueda.length / tamanoPagina);
    const inicio = paginaActual * tamanoPagina;
    const fin = inicio + tamanoPagina;
    const accionistasPaginados = accionistasFiltradosBusqueda.slice(inicio, fin);

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

    const prepararDatosHeatmap = () => {
        if (!accionistasPaginados.length) return { labels: [], datasets: [] };

        // MODIFICACIÓN: Usar riesgo_residual en lugar de factorRiesgoAccionistaSocio
        const accionistasOrdenados = [...accionistasPaginados]
            .sort((a, b) => (b.riesgo_residual || 0) - (a.riesgo_residual || 0));

        const labels = accionistasOrdenados.map(acc =>
            `${acc.nombres_accionistas_socios} ${acc.apellidos_accionistas_socios} (${acc.nro_documento_accionistas_socios})`
        );

        // MODIFICACIÓN: Usar riesgo_residual en lugar de factorRiesgoAccionistaSocio
        const valoresRiesgo = accionistasOrdenados.map(acc => {
            const valor = acc.riesgo_residual; // Cambiado aquí
            const redondeado = Math.min(5, Math.max(1, redondearRiesgo(valor)));
            return redondeado;
        });

        return {
            labels,
            datasets: [{
                label: 'Nivel del Factor Cliente Accionista/Socio',
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
                    ? `Resultados de búsqueda (${accionistasFiltradosBusqueda.length} encontrados)`
                    : 'Análisis del Factor Cliente Accionista/Socio',
                font: { size: 16 }
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        const value = context.raw;
                        const riskLevels = ['Minimo', 'Bajo', 'Moderado', 'Alto', 'Critico'];
                        const accionista = accionistas[context.dataIndex];
                        const valorOriginal = accionista.riesgo_residual?.toFixed(2) || 'N/A';

                        return [
                            `Nivel de riesgo Ponderado: ${value} (${riskLevels[value - 1] || 'N/A'})`,
                            `Factor Cliente Accionista/Socio: ${valorOriginal}`,
                        ];
                    }
                }
            }
        },
        scales: {
            x: {
                title: { display: true, text: 'Nivel de Factor Cliente Accionista/Socio' },
                min: 0,
                max: 5,
                ticks: { stepSize: 1 }
            },
            y: {
                ticks: {
                    autoSkip: false,
                    font: { size: 12 },
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
                <h1>Análisis de Factor Cliente Accionista/Socio</h1>
                <p>Visualización del Factor Cliente Accionista/Socio</p>
            </header>

            <div className={styles.controles}>
                <input
                    type="text"
                    placeholder="Buscar por nombre, apellido, documento, teléfono o correo..."
                    value={busqueda}
                    onChange={(e) => {
                        setBusqueda(e.target.value);
                        setPaginaActual(0); // Resetear a primera página al buscar
                    }}
                    className={styles.buscador}
                />
                {busqueda && (
                    <span className={styles.contadorBusqueda}>
                        {accionistasFiltradosBusqueda.length} de {accionistasFiltrados.length} accionistas/socios encontrados
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
                        <h3>Leyenda del Factor Cliente Accionista/Socio:</h3>
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

                    {/* Controles de paginación manual (similar a clientes externos) */}
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
                        <p>Total de accionistas/socios: <strong>{accionistasFiltrados.length}</strong></p>
                        {busqueda && (
                            <p>Accionistas/socios encontrados: <strong>{accionistasFiltradosBusqueda.length}</strong></p>
                        )}
                        <p>Mostrando: <strong>{accionistasPaginados.length}</strong> accionistas/socios</p>
                    </div>
                </div>
            ) : (
                <div className={styles.sinDatos}>
                    {busqueda
                        ? 'No se encontraron accionistas/socios que coincidan con la búsqueda'
                        : 'No hay datos suficientes para generar el Factor Cliente Accionista/Socio'}
                </div>
            )}
        </div>
    );
};

export default GraficosAccionistasSocios;