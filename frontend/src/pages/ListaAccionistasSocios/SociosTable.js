import React from 'react';
import styles from './listaAccionistasSocios.module.css';
import SociosActions from './SocioActions';

const SociosTable = ({
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
                                    <SociosActions
                                        clientId={cliente.id}
                                        onDelete={onDelete}
                                    />
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={visibleColumns.length + 1} className={styles.sinResultados}>
                                {hasClients ? 'No se encontraron resultados' : 'No hay accionistas/socios registrados'}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default SociosTable;