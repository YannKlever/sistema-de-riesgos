import React from 'react';
import styles from './styles.module.css';
import SucursalActions from './SucursalActions';

const SucursalTable = ({ 
  sucursales, 
  isLoading, 
  onEdit, 
  onDelete,
  getLabelRiesgo 
}) => {
  if (isLoading && sucursales.length === 0) {
    return <p>Cargando sucursales...</p>;
  }

  if (sucursales.length === 0) {
    return <p>No hay sucursales registradas</p>;
  }

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Oficina</th>
            <th>Ubicación</th>
            <th>Departamento</th>
            <th>Riesgo Depto.</th>
            <th>Municipio</th>
            <th>Riesgo Mun.</th>
            <th>Fecha Registro</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {sucursales.map((item) => (
            <tr key={item.id}>
              <td>{item.oficina}</td>
              <td>{item.ubicacion}</td>
              <td>{item.departamento}</td>
              <td>{getLabelRiesgo(item.riesgo_departamento)}</td>
              <td>{item.municipio || '-'}</td>
              <td>{item.municipio ? getLabelRiesgo(item.riesgo_municipio) : '-'}</td>
              <td>{new Date(item.fecha_registro).toLocaleDateString()}</td>
              <td>
                <SucursalActions
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

export default SucursalTable;