import React from 'react';
import styles from './styles.module.css';
import ProductoServicioActions from './ProductoServicioActions';

const ProductoServicioTable = ({ 
  productos, 
  isLoading, 
  onEdit, 
  onDelete,
  getLabelRiesgo,
  visibleColumns
}) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'Fecha no disponible';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Fecha inválida';
      
      return date.toLocaleString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return 'Fecha inválida';
    }
  };

  if (isLoading && productos.length === 0) {
    return <p>Cargando productos...</p>;
  }

  if (productos.length === 0) {
    return <p>No hay productos/servicios registrados</p>;
  }

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            {visibleColumns.map(column => (
              <th key={column.id}>{column.nombre}</th>
            ))}
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((item) => (
            <tr key={item.id}>
              {visibleColumns.map(column => {
                if (column.id === 'fecha_registro') {
                  return <td key={column.id}>{formatDate(item[column.id])}</td>;
                } else if (column.id === 'riesgo_producto' || column.id === 'riesgo_cliente') {
                  return <td key={column.id}>{getLabelRiesgo(item[column.id])}</td>;
                } else if (column.id === 'observaciones') {
                  return <td key={column.id} className={styles.observacionesCell}>
                    {item[column.id] || '-'}
                  </td>;
                } else {
                  return <td key={column.id}>{item[column.id] || '-'}</td>;
                }
              })}
              <td>
                <ProductoServicioActions
                  id={item.id}
                  onEdit={() => onEdit(item)}
                  onDelete={onDelete}
                  isLoading={isLoading}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductoServicioTable;