import React from 'react';
import styles from './reportesCanalesDistribucion.module.css';

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

    return (
        <div className={styles.tablaContenedor}>
            <table className={styles.tablaReporte}>
                <thead>
                    <tr>
                        {columnas.map(columna => (
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
                                            columna.id.includes('factorRiesgo') ||
                                            columna.id.includes('promedio_riesgo')
                                                ? styles.celdaNumerica : ''
                                        }
                                        title={item[columna.id] ?? '-'}
                                    >
                                        {formatearValor(item[columna.id])}
                                        {columna.id === 'promedio_riesgo_canal_distribucion' && 
                                         item.promedio_riesgo_canal_distribucion === item.factorRiesgoCanal && (
                                            <span className={styles.validadoIcono}> ✓</span>
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={columnas.length} className={styles.sinResultados}>
                                No hay datos para mostrar
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};