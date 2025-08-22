import React, { useMemo } from 'react';
import { useAccionistasSocios } from '../ReportesAccionistasSocios/useAccionistasSocios';
import { useClientesInternos } from '../ReportesClientesInternos/useClientesInternos';
import { useClientesExternos } from '../ReportesClientesExternos/useClientesExternos';
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
import styles from './FactorRiesgoCliente.module.css';

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

const FactorRiesgoCliente = () => {
  // Usar los hooks existentes
  const { accionistasFiltrados } = useAccionistasSocios();
  const { clientesFiltrados: clientesInternosFiltrados } = useClientesInternos();
  const { clientesFiltrados: clientesExternosFiltrados } = useClientesExternos();

  // Función para calcular el promedio de riesgo_residual
  const calcularPromedioRiesgoResidual = (data) => {
    if (data.length === 0) return 0;
    const total = data.reduce((sum, item) => sum + (item.riesgo_residual || 0), 0);
    return parseFloat((total / data.length).toFixed(2));
  };

  // Calcular promedios para cada tipo usando riesgo_residual
  const promedioAccionistas = calcularPromedioRiesgoResidual(accionistasFiltrados);
  const promedioClientesInternos = calcularPromedioRiesgoResidual(clientesInternosFiltrados);
  const promedioClientesExternos = calcularPromedioRiesgoResidual(clientesExternosFiltrados);

  // Calcular el factor riesgo cliente (promedio de los tres)
  const factorRiesgoCliente = parseFloat((
    (promedioAccionistas + promedioClientesInternos + promedioClientesExternos) / 3
  ).toFixed(2));

  // Función para redondear el riesgo a entero (1-5)
  const redondearRiesgo = (valor) => {
    if (valor == null) return 0;
    return Math.min(5, Math.max(1, Math.round(valor)));
  };

  // Preparar datos para el gráfico
  const chartData = useMemo(() => {
    const labels = [
      'Accionistas/Socios',
      'Clientes Internos',
      'Clientes Externos',
      'Factor Riesgo Cliente'
    ];

    const valores = [
      promedioAccionistas,
      promedioClientesInternos,
      promedioClientesExternos,
      factorRiesgoCliente
    ];

    const valoresRedondeados = valores.map(redondearRiesgo);

    return {
      labels,
      datasets: [{
        label: 'Nivel de Riesgo Residual',
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
  }, [promedioAccionistas, promedioClientesInternos, promedioClientesExternos, factorRiesgoCliente]);

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
        text: 'Comparativa de Riesgos Residuales de Clientes',
        font: {
          size: 16
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw;
            const riskLevels = ['Minimo', 'Bajo', 'Moderado', 'Alto', 'Critico'];
            const nivel = redondearRiesgo(value);

            return `Riesgo Residual: ${value.toFixed(2)} (${riskLevels[nivel - 1] || 'N/A'})`;
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Nivel de Riesgo Residual'
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
        <h1>Factor Riesgo Cliente - Riesgo Residual</h1>
        <p>Comparativa de riesgos residuales de clientes internos, externos y accionistas/socios</p>
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
            <span>Accionistas/Socios:</span>
            <strong>{promedioAccionistas.toFixed(2)}</strong>
            <span className={styles.detalle}>({accionistasFiltrados.length} registros)</span>
          </div>
          <div className={styles.resumenItem}>
            <span>Clientes Internos:</span>
            <strong>{promedioClientesInternos.toFixed(2)}</strong>
            <span className={styles.detalle}>({clientesInternosFiltrados.length} registros)</span>
          </div>
          <div className={styles.resumenItem}>
            <span>Clientes Externos:</span>
            <strong>{promedioClientesExternos.toFixed(2)}</strong>
            <span className={styles.detalle}>({clientesExternosFiltrados.length} registros)</span>
          </div>
          <div className={styles.resumenItem}>
            <span>Factor Riesgo Cliente:</span>
            <strong>{factorRiesgoCliente.toFixed(2)}</strong>
            <span className={styles.detalle}>(Promedio general)</span>
          </div>
        </div>

        <div className={styles.leyenda}>
          <h3>Leyenda de Riesgo Residual:</h3>
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

        <div className={styles.infoAdicional}>
          <p>
            <strong>Nota:</strong> El Factor Riesgo Cliente se calcula como el promedio del riesgo residual
            de accionistas/socios, clientes internos y clientes externos. Cada riesgo residual representa
            la evaluación final del riesgo después de considerar todos los factores relevantes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FactorRiesgoCliente;