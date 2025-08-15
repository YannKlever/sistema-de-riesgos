import React, { useState, useEffect } from 'react';
import { databaseService } from '../../services/database';

import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table';
import styles from './FactorRiesgoCliente.module.css';

const TablaFactorRiesgoCliente = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Obtener los datos de los tres tipos de riesgo
  const fetchRiesgos = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Obtener datos de los tres reportes
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

        setData([
          {
            tipo: 'Cliente Externo',
            promedio: externos.data.promedio.toFixed(2),
            color: getColorByRisk(externos.data.promedio)
          },
          {
            tipo: 'Cliente Interno',
            promedio: internos.data.promedio.toFixed(2),
            color: getColorByRisk(internos.data.promedio)
          },
          {
            tipo: 'Accionistas/Socios',
            promedio: accionistas.data.promedio.toFixed(2),
            color: getColorByRisk(accionistas.data.promedio)
          },
          {
            tipo: 'Factor Riesgo Cliente',
            promedio: factorRiesgoCliente.toFixed(2),
            color: getColorByRisk(factorRiesgoCliente),
            isTotal: true
          }
        ]);
      } else {
        throw new Error('Error al obtener los datos de riesgo');
      }
    } catch (err) {
      setError(err.message || 'Error al cargar los datos');
      console.error('Error fetching risk data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Función para determinar el color según el nivel de riesgo
  const getColorByRisk = (value) => {
    if (value >= 4) return '#FF0000'; // Rojo para riesgo alto
    if (value >= 3) return '#FFA500'; // Naranja
    if (value >= 2) return '#FFFF00'; // Amarillo
    return '#008000'; // Verde para riesgo bajo
  };

  useEffect(() => {
    fetchRiesgos();
  }, []);

  // Configuración de la tabla
  const columns = [
    {
      accessorKey: 'tipo',
      header: 'Tipo de Riesgo',
      cell: info => (
        <span className={info.row.original.isTotal ? styles.totalLabel : ''}>
          {info.getValue()}
        </span>
      )
    },
    {
      accessorKey: 'promedio',
      header: 'Promedio',
      cell: info => (
        <span 
          style={{ backgroundColor: info.row.original.color }}
          className={styles.riskValue}
        >
          {info.getValue()}
        </span>
      )
    }
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (loading) return <div className={styles.loading}>Cargando datos de riesgo...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;

  return (
    <div className={styles.container}>
      <h2>Factor Riesgo Cliente</h2>
      <p>Promedio de los riesgos de clientes internos, externos y accionistas/socios</p>
      
      <table className={styles.table}>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id} className={styles.header}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id} className={row.original.isTotal ? styles.totalRow : ''}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} className={styles.cell}>
                  {flexRender(
                    cell.column.columnDef.cell,
                    cell.getContext()
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TablaFactorRiesgoCliente;