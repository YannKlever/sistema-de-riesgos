import React from 'react';
import styles from './reportesClientesExternos.module.css';

const formatearValor = (valor) => {
    if (valor == null) return '-';
    if (typeof valor === 'number') return valor.toLocaleString();
    if (typeof valor === 'string' && valor.length > 20) {
        return `${valor.substring(0, 17)}...`;
    }
    return valor;
};

export const TablaReporte = ({ columnas, clientes, loading }) => {
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
                    {clientes.length > 0 ? (
                        clientes.map(cliente => (
                            <tr key={cliente.id}>
                                {columnas.map(columna => (
                                    <td
                                        key={`${cliente.id}-${columna.id}`}
                                        className={
                                            columna.id.endsWith('_numerico') ||
                                                columna.id === 'factorRiesgoClienteExterno' ?
                                                styles.celdaNumerica : ''
                                        }
                                        title={cliente[columna.id] ?? '-'}
                                    >
                                        {formatearValor(cliente[columna.id])}
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={columnas.length} className={styles.sinResultados}>
                                No hay clientes para mostrar
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};