import React from 'react';
import styles from './styles.module.css';
import SucursalActions from './SucursalActions';

const SucursalTable = ({ 
    sucursales, 
    isLoading, 
    onEdit, 
    onDelete,
    getLabelRiesgo,
    visibleColumns,
    hasSucursales,
    hasResults,
    formatValue
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

    if (isLoading && !hasSucursales) {
        return <div className={styles.cargando}>Cargando sucursales...</div>;
    }

    return (
        <div className={styles.tablaContenedor}>
            <table className={styles.tabla}>
                <thead>
                    <tr>
                        {visibleColumns.map(columna => (
                            <th key={columna.id}>{columna.nombre}</th>
                        ))}
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {hasResults ? (
                        sucursales.map((item) => (
                            <tr key={item.id}>
                                {visibleColumns.map(columna => {
                                    if (columna.id === 'fecha_registro') {
                                        return <td key={columna.id}>{formatDate(item[columna.id])}</td>;
                                    } else if (columna.id.includes('riesgo_') && !columna.id.endsWith('_numerico')) {
                                        return <td key={columna.id}>{getLabelRiesgo(item[columna.id]) || '-'}</td>;
                                    } else if (columna.id === 'observaciones') {
                                        return <td key={columna.id} className={styles.observacionesCell}>
                                            {formatValue(item[columna.id])}
                                        </td>;
                                    } else if (columna.id === 'promedio_riesgo_zona_geografica') {
                                        return <td key={columna.id}>{item[columna.id] || '0.00'}</td>;
                                    } else {
                                        return <td key={columna.id} title={item[columna.id] ?? '-'}>
                                            {formatValue(item[columna.id])}
                                        </td>;
                                    }
                                })}
                                <td>
                                    <SucursalActions
                                        id={item.id}
                                        onEdit={() => onEdit(item)}
                                        onDelete={onDelete}
                                        isLoading={isLoading}
                                    />
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={visibleColumns.length + 1} className={styles.sinResultados}>
                                {hasSucursales ? 'No se encontraron resultados' : 'No hay sucursales registradas'}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default SucursalTable;