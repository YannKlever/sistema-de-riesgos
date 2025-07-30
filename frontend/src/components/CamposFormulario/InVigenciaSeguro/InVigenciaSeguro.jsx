import InFecha from '../InFecha/InFecha';
import styles from './styles.module.css';

const InVigenciaSeguro = () => {
    return (
        <div className={styles.vigenciaContainer}>
            <div className={styles.vigenciaRow}>
                <div className={styles.vigenciaField}>
                    <InFecha
                        label="Fecha de inicio de vigencia"
                        name="fecha_inicio"
                        required
                    />
                </div>
                <div className={styles.vigenciaField}>
                    <InFecha
                        label="Fecha de finalización de vigencia"
                        name="fecha_fin"
                        required
                    />
                </div>
            </div>
        </div>
    );
};

export default InVigenciaSeguro;