import styles from './styles.module.css';

const InFechaActual = ({ label = "Fecha", name = "fecha_registro" }) => {
    const fechaActual = new Date().toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).replace(/\//g, '-');

    return (
        <div className={styles.fechaContainer}>
            <span className={styles.fechaLabel}>{label}</span>
            <span className={styles.fechaValue}>{fechaActual}</span>
            <input 
                type="hidden" 
                name={name} 
                value={fechaActual} 
            />
        </div>
    );
};

export default InFechaActual;