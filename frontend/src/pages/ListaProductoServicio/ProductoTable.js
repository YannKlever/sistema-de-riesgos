import React from 'react';
import ProductoActions from './ProductoActions';
import { NIVELES_RIESGO } from './constants';
import styles from './styles.module.css';

const ProductoTable = ({
    visibleColumns,
    filteredProducts,
    hasProducts,
    hasResults,
    formatValue,
    onEdit,
    onDelete,
    isLoading
}) => {
    const getLabelRiesgo = (valor) => {
        const nivel = NIVELES_RIESGO.find(item => item.value === valor);
        return nivel ? nivel.label : valor;
    };

    return (
        <div className={styles.tablaContenedor}>
            {!hasProducts && (
                <div className={styles.sinDatos}>No hay productos/servicios registrados</div>
            )}
            {hasProducts && !hasResults && (
                <div className={styles.sinResultados}>No se encontraron resultados</div>
            )}
            {hasResults && (
                <table className={styles.tabla}>
                    <thead>
                        <tr>
                            {visibleColumns.map(col => (
                                <th key={col.id}>{col.nombre}</th>
                            ))}
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.map(producto => (
                            <tr key={producto.id}>
                                {visibleColumns.map(col => (
                                    <td key={`${producto.id}-${col.id}`}>
                                        {col.id.includes('riesgo') 
                                            ? getLabelRiesgo(producto[col.id])
                                            : formatValue(producto[col.id])}
                                    </td>
                                ))}
                                <td>
                                    <ProductoActions
                                        productId={producto.id}
                                        onEdit={onEdit}
                                        onDelete={onDelete}
                                        isLoading={isLoading}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ProductoTable;