import React from 'react';
import styles from './styles.module.css';
import ProductoServicioActions from './ProductoServicioActions';

const ProductoServicioTable = ({ 
  productos, 
  isLoading, 
  onEdit, 
  onDelete,
  getLabelRiesgo 
}) => {
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
            <th>Producto/Servicio</th>
            <th>Oficina</th> {}
            <th>Riesgo Producto/Servicio</th>
            <th>Riesgo Tipo Cliente</th>
            <th>Fecha Registro</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((item) => (
            <tr key={item.id}>
              <td>{item.producto_servicio}</td>
              <td>{item.oficina}</td> {}
              <td>{getLabelRiesgo(item.riesgo_producto)}</td>
              <td>{getLabelRiesgo(item.riesgo_cliente)}</td>
              <td>{new Date(item.fecha_registro).toLocaleDateString()}</td>
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