import React from 'react';
import styles from './listaClientesExternos.module.css';

const ClientActions = ({ clientId, onDelete }) => (
    <button
        onClick={() => onDelete(clientId)}
        className={styles.botonEliminar}
    >
        Eliminar
    </button>
);

export default ClientActions;