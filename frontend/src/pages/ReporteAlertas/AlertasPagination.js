import React from 'react';
import PropTypes from 'prop-types';
import styles from './reporteAlertas.module.css';

export const AlertasPagination = ({ table }) => {
    return (
        <div className={styles.pagination}>
            <button 
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
                className={styles.paginationButton}
                aria-label="Primera página"
            >
                {'<<'}
            </button>
            <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className={styles.paginationButton}
                aria-label="Página anterior"
            >
                {'<'}
            </button>
            <span className={styles.pageInfo}>
                Página{' '}
                <strong>
                    {table.getState().pagination.pageIndex + 1} de{' '}
                    {table.getPageCount()}
                </strong>
            </span>
            <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className={styles.paginationButton}
                aria-label="Página siguiente"
            >
                {'>'}
            </button>
            <button
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
                className={styles.paginationButton}
                aria-label="Última página"
            >
                {'>>'}
            </button>
        </div>
    );
};

AlertasPagination.propTypes = {
    table: PropTypes.object.isRequired
};