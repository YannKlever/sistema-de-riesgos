import React from 'react';
import styles from './listaClientesInternos.module.css';

const ColumnSelector = ({
    columns,
    visibleColumns,
    onToggleColumn,
    loading
}) => (
    <div className={styles.selectorColumnas}>
        <h4>Seleccionar columnas visibles:</h4>
        <div className={styles.listaColumnas}>
            {columns.map(columna => (
                <label key={columna.id} className={styles.opcionColumna}>
                    <input
                        type="checkbox"
                        checked={visibleColumns.some(col => col.id === columna.id)}
                        onChange={() => onToggleColumn(columna.id)}
                        disabled={loading}
                    />
                    {columna.nombre}
                </label>
            ))}
        </div>
    </div>
);

export default ColumnSelector;