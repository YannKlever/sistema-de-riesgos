import React from 'react';
import styles from './reportesClientesInternos.module.css';

const formatearValor = (valor) => {
    if (valor == null) return '-';
    if (typeof valor === 'number') {
        if (Number.isInteger(valor)) {
            return valor.toLocaleString();
        }
        return valor.toFixed(2);
    }
    if (typeof valor === 'string' && valor.length > 20) {
        return `${valor.substring(0, 17)}...`;
    }
    return valor;
};

const obtenerColorRiesgo = (valor) => {
    if (valor == null) return '';
    if (valor >= 7) return styles.altoRiesgo;
    if (valor >= 4) return styles.medioRiesgo;
    return styles.bajoRiesgo;
};

export const TablaReporte = ({ columnas, clientes, loading }) => {
    if (loading) {
        return (
            <div className={styles.cargando}>
                <div className={styles.spinner}></div>
                <p>Cargando reporte de clientes internos...</p>
            </div>
        );
    }

    return (
        <div className={styles.tablaContenedor}>
            <table className={styles.tablaReporte}>
                <thead>
                    <tr>
                        {columnas.map(columna => (
                            <th 
                                key={columna.id}
                                className={columna.id.endsWith('_numerico') ? styles.columnaNumerica : ''}
                            >
                                {columna.nombre}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {clientes.length > 0 ? (
                        clientes.map(cliente => (
                            <tr key={cliente.id}>
                                {columnas.map(columna => {
                                    const esNumerico = columna.id.endsWith('_numerico') || 
                                                      columna.id === 'factorRiesgoClienteInterno' ||
                                                      columna.id === 'promedio_riesgo_cliente_interno';
                                    const valor = cliente[columna.id];
                                    
                                    return (
                                        <td
                                            key={`${cliente.id}-${columna.id}`}
                                            className={`
                                                ${esNumerico ? styles.celdaNumerica : ''}
                                                ${esNumerico ? obtenerColorRiesgo(valor) : ''}
                                            `}
                                            title={valor != null ? String(valor) : '-'}
                                        >
                                            {formatearValor(valor)}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={columnas.length} className={styles.sinResultados}>
                                <div className={styles.sinResultadosContenido}>
                                    <span className={styles.icono}>📭</span>
                                    <p>No se encontraron clientes internos</p>
                                    <small>Intenta ajustar los filtros de búsqueda</small>
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};