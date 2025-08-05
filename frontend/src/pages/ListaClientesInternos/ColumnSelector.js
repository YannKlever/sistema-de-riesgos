import React from 'react';
import styles from './listaClientesInternos.module.css';

const ColumnSelector = ({
    columns,
    visibleColumns,
    onToggleColumn,
    loading
}) => {
    // Agrupar columnas por categorías
    const columnGroups = {
        básicas: columns.slice(0, 7),
        personales: columns.slice(7, 17),
        riesgo: columns.slice(17, 23),
        económicas: columns.slice(23, 29),
        documentales: columns.slice(29, 39),
        evaluación: columns.slice(39)
    };

    return (
        <div className={styles.selectorColumnas}>
            <h4>Seleccionar columnas visibles:</h4>
            
            {Object.entries(columnGroups).map(([groupName, groupColumns]) => (
                <div key={groupName} className={styles.grupoColumnas}>
                    <h5>{groupName.charAt(0).toUpperCase() + groupName.slice(1)}</h5>
                    <div className={styles.listaColumnas}>
                        {groupColumns.map(columna => (
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
            ))}
        </div>
    );
};

export default ColumnSelector;