import React from 'react';
import styles from './reportesAccionistasSocios.module.css';

const formatearValor = (valor) => {
    if (valor == null) return '-';
    if (typeof valor === 'number') return valor.toLocaleString();
    if (typeof valor === 'string' && valor.length > 20) {
        return `${valor.substring(0, 17)}...`;
    }
    return valor;
};

export const TablaReporte = ({ columnas, accionistas, loading }) => {
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
                    {accionistas.length > 0 ? (
                        accionistas.map(accionista => (
                            <tr key={accionista.id}>
                                {columnas.map(columna => (
                                    <td
                                        key={`${accionista.id}-${columna.id}`}
                                        className={
                                            columna.id.endsWith('_numerico') || 
                                            columna.id === 'factorRiesgoAccionistaSocio' ?
                                            styles.celdaNumerica : ''
                                        }
                                        title={accionista[columna.id] ?? '-'}
                                    >
                                        {formatearValor(accionista[columna.id])}
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={columnas.length} className={styles.sinResultados}>
                                No hay accionistas/socios para mostrar
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};