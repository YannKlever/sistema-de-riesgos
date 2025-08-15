import React, { useState, useEffect } from 'react';
import { databaseService } from '../../services/database';
import { Chart } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  Title
} from 'chart.js';
import styles from './FactorRiesgoCliente.module.css';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  Title
);

const GraficoFactorRiesgoCliente = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Obtener los datos para el gráfico
  const fetchChartData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [externos, internos, accionistas] = await Promise.all([
        databaseService.obtenerPromedioRiesgoClientesExternos(),
        databaseService.obtenerPromedioRiesgoClientesInternos(),
        databaseService.obtenerPromedioRiesgoAccionistas()
      ]);

      if (externos.success && internos.success && accionistas.success) {
        const factorRiesgoCliente = (
          externos.data.promedio + 
          internos.data.promedio + 
          accionistas.data.promedio
        ) / 3;

        setData({
          labels: ['Cliente Externo', 'Cliente Interno', 'Accionistas/Socios', 'Factor Riesgo Cliente'],
          datasets: [
            {
              label: 'Nivel de Riesgo',
              data: [
                externos.data.promedio,
                internos.data.promedio,
                accionistas.data.promedio,
                factorRiesgoCliente
              ],
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              borderColor: 'rgba(54, 162, 235, 1)',
              pointBackgroundColor: [
                getColorByRisk(externos.data.promedio),
                getColorByRisk(internos.data.promedio),
                getColorByRisk(accionistas.data.promedio),
                getColorByRisk(factorRiesgoCliente)
              ],
              borderWidth: 1,
              fill: true
            }
          ]
        });
      } else {
        throw new Error('Error al obtener los datos para el gráfico');
      }
    } catch (err) {
      setError(err.message || 'Error al cargar los datos del gráfico');
      console.error('Error fetching chart data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Función para determinar el color según el nivel de riesgo
  const getColorByRisk = (value) => {
    if (value >= 4) return 'rgba(255, 0, 0, 1)'; // Rojo
    if (value >= 3) return 'rgba(255, 165, 0, 1)'; // Naranja
    if (value >= 2) return 'rgba(255, 255, 0, 1)'; // Amarillo
    return 'rgba(0, 128, 0, 1)'; // Verde
  };

  useEffect(() => {
    fetchChartData();
  }, []);

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Comparativa de Riesgos de Clientes',
        font: {
          size: 16
        }
      },
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || '';
            const value = context.raw;
            const riskLevels = ['Minimo', 'Bajo', 'Moderado', 'Alto', 'Critico'];
            const level = Math.min(4, Math.max(0, Math.round(value) - 1));
            
            return `${label}: ${value.toFixed(2)} (${riskLevels[level]})`;
          }
        }
      }
    },
    scales: {
      r: {
        angleLines: {
          display: true
        },
        suggestedMin: 0,
        suggestedMax: 5,
        ticks: {
          stepSize: 1
        }
      }
    }
  };

  if (loading) return <div className={styles.loading}>Cargando gráfico...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;

  return (
    <div className={styles.chartContainer}>
      <h2>Gráfico Comparativo de Riesgos</h2>
      <div className={styles.chartWrapper}>
        {data && <Chart type="radar" data={data} options={options} />}
      </div>
      
      <div className={styles.legend}>
        <h4>Leyenda de Colores:</h4>
        <div className={styles.legendItem}>
          <span className={styles.legendColor} style={{ backgroundColor: 'rgba(0, 128, 0, 1)' }}></span>
          <span>1-2: Riesgo Bajo</span>
        </div>
        <div className={styles.legendItem}>
          <span className={styles.legendColor} style={{ backgroundColor: 'rgba(255, 255, 0, 1)' }}></span>
          <span>2-3: Riesgo Moderado</span>
        </div>
        <div className={styles.legendItem}>
          <span className={styles.legendColor} style={{ backgroundColor: 'rgba(255, 165, 0, 1)' }}></span>
          <span>3-4: Riesgo Alto</span>
        </div>
        <div className={styles.legendItem}>
          <span className={styles.legendColor} style={{ backgroundColor: 'rgba(255, 0, 0, 1)' }}></span>
          <span>4-5: Riesgo Crítico</span>
        </div>
      </div>
    </div>
  );
};

export default GraficoFactorRiesgoCliente;