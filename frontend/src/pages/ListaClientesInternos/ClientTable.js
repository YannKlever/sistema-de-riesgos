import React from 'react';
import styles from './listaClientesInternos.module.css';
import ClientActions from './ClientActions';

const ClientTable = ({
    visibleColumns,
    filteredClients,
    hasClients,
    hasResults,
    formatValue,
    onDelete
}) => {
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
                        filteredClients.map(cliente => (
                            <tr key={cliente.id}>
                                {visibleColumns.map(columna => (
                                    <td
                                        key={`${cliente.id}-${columna.id}`}
                                        title={cliente[columna.id] ?? '-'}
                                    >
                                        {formatValue(cliente[columna.id])}
                                    </td>
                                ))}
                                <td>
                                    <ClientActions
                                        clientId={cliente.id}
                                        onDelete={onDelete}
                                    />
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={visibleColumns.length + 1} className={styles.sinResultados}>
                                {hasClients ? 'No se encontraron resultados' : 'No hay clientes internos registrados'}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ClientTable;