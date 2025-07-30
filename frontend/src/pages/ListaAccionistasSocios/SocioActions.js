import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './listaAccionistasSocios.module.css';

const SociosActions = ({ clientId, onDelete }) => {
    const navigate = useNavigate();

    const handleEdit = () => {
        navigate(`/parametros/accionistas-directorio/${clientId}`);
    };

    return (
        <div className={styles.acciones}>
            <button
                onClick={handleEdit}
                className={styles.botonEditar}
            >
                Editar
            </button>
            <button
                onClick={() => onDelete(clientId)}
                className={styles.botonEliminar}
            >
                Eliminar
            </button>
        </div>
    );
};

export default SociosActions;