import React, { useMemo } from 'react';
import { useAccionistasSocios } from '../ReportesAccionistasSocios/useAccionistasSocios';
import { useClientesInternos } from '../ReportesClientesInternos/useClientesInternos';
import { useClientesExternos } from '../ReportesClientesExternos/useClientesExternos';
import { useProductosServicios } from '../ReportesProductoServicio/useProductosServicios';
import { useSucursales } from '../ReporteSucursales/useSucursales';
import { useCanalesDistribucion } from '../ReportesCanalDistribucion/useCanalesDistribucion';
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
import styles from './GraficoRiesgoTotal.module.css';

// Registrar componentes de Chart.js
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

const RiesgoTotal = () => {
  // Obtener datos de todos los hooks de riesgo
  const { accionistasFiltrados } = useAccionistasSocios();
  const { clientesFiltrados: clientesInternosFiltrados } = useClientesInternos();
  const { clientesFiltrados: clientesExternosFiltrados } = useClientesExternos();
  const { productosFiltrados } = useProductosServicios();
  const { sucursalesFiltradas } = useSucursales();
  const { canalesFiltrados } = useCanalesDistribucion();
  const { evaluacionesFiltradas: evaluacionesLDFT } = useReportesLDFT();

  // Calcular promedios de riesgo para cada factor
  const promedioAccionistas = useMemo(() => {
    if (!accionistasFiltrados || accionistasFiltrados.length === 0) return 0;
    const total = accionistasFiltrados.reduce(
      (sum, item) => sum + (item.riesgo_residual || 0), 0);
    return parseFloat((total / accionistasFiltrados.length).toFixed(2));
  }, [accionistasFiltrados]);

  const promedioClientesInternos = useMemo(() => {
    if (!clientesInternosFiltrados || clientesInternosFiltrados.length === 0) return 0;
    const total = clientesInternosFiltrados.reduce(
      (sum, item) => sum + (item.riesgo_residual || 0), 0);
    return parseFloat((total / clientesInternosFiltrados.length).toFixed(2));
  }, [clientesInternosFiltrados]);

  const promedioClientesExternos = useMemo(() => {
    if (!clientesExternosFiltrados || clientesExternosFiltrados.length === 0) return 0;
    const total = clientesExternosFiltrados.reduce(
      (sum, item) => sum + (item.riesgo_residual || 0), 0);
    return parseFloat((total / clientesExternosFiltrados.length).toFixed(2));
  }, [clientesExternosFiltrados]);

  const promedioProductos = useMemo(() => {
    if (!productosFiltrados || productosFiltrados.length === 0) return 0;
    const total = productosFiltrados.reduce(
      (sum, item) => sum + (item.riesgoFactorProductosServicios || 0), 0);
    return parseFloat((total / productosFiltrados.length).toFixed(2));
  }, [productosFiltrados]);

  const promedioZonas = useMemo(() => {
    if (!sucursalesFiltradas || sucursalesFiltradas.length === 0) return 0;
    const total = sucursalesFiltradas.reduce(
      (sum, item) => sum + (item.factorRiesgoZonaGeografica || 0), 0);
    return parseFloat((total / sucursalesFiltradas.length).toFixed(2));
  }, [sucursalesFiltradas]);

  const promedioCanales = useMemo(() => {
    if (!canalesFiltrados || canalesFiltrados.length === 0) return 0;
    const total = canalesFiltrados.reduce(
      (sum, item) => sum + (item.factor_riesgo_canal_distribucion || 0), 0);
    return parseFloat((total / canalesFiltrados.length).toFixed(2));
  }, [canalesFiltrados]);

  const promedioLDFT = useMemo(() => {
    if (!evaluacionesLDFT || evaluacionesLDFT.length === 0) return 0;
    const total = evaluacionesLDFT.reduce(
      (sum, item) => sum + (item.promedio_frontend || 0), 0);
    return parseFloat((total / evaluacionesLDFT.length).toFixed(2));
  }, [evaluacionesLDFT]);

  // Calcular Factor Riesgo Cliente (promedio de los tres tipos de clientes)
  const factorRiesgoCliente = useMemo(() => {
    return parseFloat((
      (promedioAccionistas + promedioClientesInternos + promedioClientesExternos) / 3
    ).toFixed(2));
  }, [promedioAccionistas, promedioClientesInternos, promedioClientesExternos]);

  // Calcular riesgo total consolidado (promedio de todos los factores)
  const riesgoTotal = useMemo(() => {
    const sumaRiesgos = (
      factorRiesgoCliente +
      promedioProductos +
      promedioZonas +
      promedioCanales +
      promedioLDFT
    );
    return parseFloat((sumaRiesgos / 5).toFixed(2));
  }, [
    factorRiesgoCliente,
    promedioProductos,
    promedioZonas,
    promedioCanales,
    promedioLDFT
  ]);

  // Función para redondear el riesgo a entero (1-5)
  const redondearRiesgo = (valor) => {
    if (valor == null) return 0;
    return Math.min(5, Math.max(1, Math.round(valor)));
  };

  // Configuración del gráfico
  const chartData = useMemo(() => {
    const labels = [
      'Factor Riesgo Cliente',
      'Factor Producto/Servicio',
      'Factor Zona Geográfica',
      'Factor Canal de Distribución',
      'Factor Control LGI/FT-FPADM',
      'Riesgo Total'
    ];

    const valores = [
      factorRiesgoCliente,
      promedioProductos,
      promedioZonas,
      promedioCanales,
      promedioLDFT,
      riesgoTotal
    ];

    const valoresRedondeados = valores.map(redondearRiesgo);

    return {
      labels,
      datasets: [{
        label: 'Nivel de Riesgo',
        data: valores,
        backgroundColor: valoresRedondeados.map(value => {
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
      }]
    };
  }, [
    factorRiesgoCliente,
    promedioProductos,
    promedioZonas,
    promedioCanales,
    promedioLDFT,
    riesgoTotal
  ]);

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
        text: 'Riesgo Total Consolidado',
        font: {
          size: 16
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw;
            const riskLevels = ['Mínimo', 'Bajo', 'Moderado', 'Alto', 'Crítico'];
            const nivel = redondearRiesgo(value);
            return `Nivel de riesgo: ${value.toFixed(2)} (${riskLevels[nivel - 1] || 'N/A'})`;
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
            size: 14
          }
        }
      }
    }
  };

  return (
    <div className={styles.contenedor}>
      <header className={styles.header}>
        <h1>Riesgo Total Consolidado</h1>
        <p>Evaluación integral del riesgo basada en todos los factores de riesgo</p>
      </header>

      <div className={styles.chartContainer}>
        <div className={styles.chartWrapper} style={{ height: '400px' }}>
          <Chart
            type='bar'
            data={chartData}
            options={options}
          />
        </div>

        <div className={styles.resumen}>
          <div className={styles.resumenItem}>
            <span>Factor Riesgo Cliente:</span>
            <strong>{factorRiesgoCliente.toFixed(2)}</strong>
            <span className={styles.detalle}>
              (Accionistas: {promedioAccionistas.toFixed(2)}, 
              Internos: {promedioClientesInternos.toFixed(2)}, 
              Externos: {promedioClientesExternos.toFixed(2)})
            </span>
          </div>
          <div className={styles.resumenItem}>
            <span>Factor Producto/Servicio:</span>
            <strong>{promedioProductos.toFixed(2)}</strong>
            <span className={styles.detalle}>({productosFiltrados?.length || 0} productos)</span>
          </div>
          <div className={styles.resumenItem}>
            <span>Factor Zona Geográfica:</span>
            <strong>{promedioZonas.toFixed(2)}</strong>
            <span className={styles.detalle}>({sucursalesFiltradas?.length || 0} sucursales)</span>
          </div>
          <div className={styles.resumenItem}>
            <span>Factor Canal de Distribución:</span>
            <strong>{promedioCanales.toFixed(2)}</strong>
            <span className={styles.detalle}>({canalesFiltrados?.length || 0} canales)</span>
          </div>
          <div className={styles.resumenItem}>
            <span>Factor Control LGI/FT-FPADM:</span>
            <strong>{promedioLDFT.toFixed(2)}</strong>
            <span className={styles.detalle}>({evaluacionesLDFT?.length || 0} evaluaciones)</span>
          </div>
          <div className={styles.resumenItemTotal}>
            <span>Riesgo Total Consolidado:</span>
            <strong>{riesgoTotal.toFixed(2)}</strong>
          </div>
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
                      '#228B22', // Nivel 1 - Verde
                      '#9ACD32', // Nivel 2 - Verde claro
                      '#FFD700', // Nivel 3 - Amarillo
                      '#FF8C00', // Nivel 4 - Naranja
                      '#FF0000'  // Nivel 5 - Rojo
                    ][nivel - 1]
                  }}
                />
                <span>Nivel {nivel} - {[
                  'Mínimo',
                  'Bajo',
                  'Moderado',
                  'Alto',
                  'Crítico'
                ][nivel - 1]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.infoAdicional}>
          <h4>Metodología de Cálculo:</h4>
          <ul>
            <li><strong>Factor Riesgo Cliente:</strong> Promedio de los riesgos residuales de accionistas/socios, clientes internos y clientes externos</li>
            <li><strong>Riesgo Total:</strong> Promedio de los 5 factores de riesgo principales</li>
            <li>Los valores se presentan en una escala de 1 a 5, donde 1 es riesgo mínimo y 5 es riesgo crítico</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RiesgoTotal;