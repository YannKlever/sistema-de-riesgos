import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './listaClientesInternos.module.css';

const ClientActions = ({ clientId, onDelete }) => {
    const navigate = useNavigate();

    const handleEdit = () => {
        console.log('Editando cliente con ID:', clientId); // Debug
        navigate(`/parametros/clientes-internos/${clientId}`);
    };

    return (
        <div className={styles.acciones}>
            <button
                onClick={handleEdit}
                className={styles.botonEditar}
                title="Editar cliente"
            >
                Editar
            </button>
            <button
                onClick={() => onDelete(clientId)}
                className={styles.botonEliminar}
                title="Eliminar cliente"
            >
                Eliminar
            </button>
        </div>
    );
};

export default ClientActions;