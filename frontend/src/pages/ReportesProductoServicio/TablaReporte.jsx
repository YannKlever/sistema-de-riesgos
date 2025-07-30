import React from 'react';
import styles from './reportesProductosServicios.module.css';

const formatearValor = (valor) => {
    if (valor == null) return '-';
    if (typeof valor === 'number') return valor.toFixed(2);
    if (typeof valor === 'string' && valor.length > 20) {
        return `${valor.substring(0, 17)}...`;
    }
    return valor;
};

export const TablaReporte = ({ 
    columnas, 
    datos, 
    loading
}) => {
    if (loading) {
        return <div className={styles.cargando}>Cargando reporte...</div>;
    }

    const columnasAdicionales = [
        { id: 'riesgoFactorProductosServicios', nombre: 'Riesgo Total Calculado' },
        { id: 'promedio_riesgo_producto_servicio', nombre: 'Riesgo Validado' }
    ];

    return (
        <div className={styles.tablaContenedor}>
            <table className={styles.tablaReporte}>
                <thead>
                    <tr>
                        {columnas.map(columna => (
                            <th key={columna.id}>{columna.nombre}</th>
                        ))}
                        {columnasAdicionales.map(columna => (
                            <th key={columna.id}>{columna.nombre}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {datos.length > 0 ? (
                        datos.map(item => (
                            <tr key={item.id}>
                                {columnas.map(columna => (
                                    <td
                                        key={`${item.id}-${columna.id}`}
                                        className={
                                            columna.id.endsWith('_numerico') || 
                                            columna.id.includes('riesgoFactor') ? 
                                            styles.celdaNumerica : ''
                                        }
                                        title={item[columna.id] ?? '-'}
                                    >
                                        {formatearValor(item[columna.id])}
                                    </td>
                                ))}
                                
                                <td className={styles.celdaNumerica}>
                                    {formatearValor(item.riesgoFactorProductosServicios)}
                                </td>
                                
                                <td className={styles.celdaNumerica}>
                                    {formatearValor(item.promedio_riesgo_producto_servicio)}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={columnas.length + columnasAdicionales.length} 
                                className={styles.sinResultados}>
                                No hay productos/servicios para mostrar
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};