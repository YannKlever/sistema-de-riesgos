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
import { useReactTable, getCoreRowModel, getFilteredRowModel, getPaginationRowModel } from '@tanstack/react-table';
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

    // Configuración de la tabla para paginación
    const table = useReactTable({
        data: canalesFiltrados,
        columns: [],
        state: {
            globalFilter: busqueda
        },
        onGlobalFilterChange: setBusqueda,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        globalFilterFn: (row, columnId, filterValue) => {
            const cliente = row.original;
            if (!filterValue) return true;
            
            const termino = filterValue.toLowerCase();
            return `${cliente.nombres_propietario || ''} ${cliente.apellidos_propietario || ''} ${cliente.nro_documento_propietario || ''} ${cliente.razon_social || ''} ${cliente.nit || ''}`
                .toLowerCase()
                .includes(termino);
        },
        initialState: {
            pagination: {
                pageSize: 10
            }
        }
    });

    // Obtener los clientes paginados y filtrados
    const clientesPaginados = table.getRowModel().rows.map(row => row.original);

    const redondearRiesgo = (valor) => {
        if (valor == null) return 0;
        return Math.round(valor);
    };

    // Preparar datos para el gráfico usando solo los clientes paginados
    const prepararDatosGrafico = () => {
        if (!clientesPaginados.length) return { labels: [], datasets: [] };

        // Ordenar por riesgo (mayor a menor)
        const clientesOrdenados = [...clientesPaginados]
            .sort((a, b) => (b.promedio_riesgo_cliente_externo || 0) - (a.promedio_riesgo_cliente_externo || 0));

        // Preparar etiquetas con los 3 campos más importantes: nombre/razón social, documento/NIT y riesgo
        const labels = clientesOrdenados.map(cliente => {
            const nombre = cliente.razon_social 
                ? cliente.razon_social 
                : `${cliente.nombres_propietario || ''} ${cliente.apellidos_propietario || ''}`;
            
            const identificador = cliente.nit || cliente.nro_documento_propietario || 'N/A';
            const riesgo = cliente.promedio_riesgo_cliente_externo?.toFixed(2) || 'N/A';

            return `${nombre} (${identificador}) - Riesgo: ${riesgo}`;
        });

        // Obtener valores de riesgo con redondeo matemático
        const valoresRiesgo = clientesOrdenados.map(cliente => {
            const valor = cliente.promedio_riesgo_cliente_externo;
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
            clientes: clientesOrdenados
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
                text: 'Canales de Distribución por Nivel de Riesgo',
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
                        const valorOriginal = cliente.promedio_riesgo_cliente_externo?.toFixed(2) || 'N/A';

                        return `Nivel de riesgo: ${value} (${riskLevels[value - 1] || 'N/A'})`;
                    },
                    afterLabel: (context) => {
                        const cliente = clientes[context.dataIndex];
                        const info = [];
                        
                        if (cliente.razon_social) {
                            info.push(`Razón Social: ${cliente.razon_social}`);
                            info.push(`NIT: ${cliente.nit || 'N/A'}`);
                        } else {
                            info.push(`Nombre: ${cliente.nombres_propietario || ''} ${cliente.apellidos_propietario || ''}`);
                            info.push(`Documento: ${cliente.nro_documento_propietario || 'N/A'}`);
                        }
                        
                        info.push(`Riesgo: ${cliente.promedio_riesgo_cliente_externo?.toFixed(2) || 'N/A'}`);
                        
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
                <h1>Canales de Distribución por Nivel de Riesgo</h1>
                <p>Visualización de todos los Canales de Distribución ordenados por nivel de riesgo</p>
            </header>

            <div className={styles.controles}>
                <input
                    type="text"
                    placeholder="Buscar por nombre, razón social, documento o NIT..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className={styles.buscador}
                />
            </div>

            {state?.loading ? (
                <div className={styles.cargando}>Cargando datos...</div>
            ) : datasets?.length > 0 ? (
                <div className={styles.chartContainer}>
                    <div className={styles.chartWrapper} style={{ height: `${Math.max(500, labels.length * 40)}px` }}>
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

                    {/* Controles de paginación */}
                    <div className={styles.paginacion}>
                        <button
                            onClick={() => table.setPageIndex(0)}
                            disabled={!table.getCanPreviousPage()}
                        >
                            {'<<'}
                        </button>
                        <button
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            {'<'}
                        </button>
                        <button
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            {'>'}
                        </button>
                        <button
                            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                            disabled={!table.getCanNextPage()}
                        >
                            {'>>'}
                        </button>

                        <span>
                            Página{' '}
                            <strong>
                                {table.getState().pagination.pageIndex + 1} de{' '}
                                {table.getPageCount()}
                            </strong>
                        </span>

                        <select
                            value={table.getState().pagination.pageSize}
                            onChange={e => {
                                table.setPageSize(Number(e.target.value))
                            }}
                        >
                            {[5, 10, 20, 30, 50].map(pageSize => (
                                <option key={pageSize} value={pageSize}>
                                    Mostrar {pageSize}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.resumen}>
                        <p>Total de canales: <strong>{canalesFiltrados.length}</strong> (mostrando {clientesPaginados.length})</p>
                    </div>
                </div>
            ) : (
                <div className={styles.sinDatos}>
                    {busqueda
                        ? 'No se encontraron clientes que coincidan con la búsqueda'
                        : 'No hay datos suficientes para generar el análisis de riesgo'}
                </div>
            )}
        </div>
    );
};

export default GraficosCanalesDistribucion;