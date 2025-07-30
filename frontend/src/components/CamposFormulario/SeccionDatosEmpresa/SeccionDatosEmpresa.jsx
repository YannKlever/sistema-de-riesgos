import InTexto from '../InTexto/InTexto';
import InNit from '../InNit/InNit';
import styles from './styles.module.css';

const SeccionDatosEmpresa = () => {
    return (
        <div className={styles.seccionContainer}>
            <h5 className={styles.seccionTitulo}>
                <span className={styles.seccionIcono}>🏢</span>
                Datos de la Empresa
            </h5>
            <div className={styles.seccionCampos}>
                <div className={styles.campoWrapper}>
                    <InTexto
                        label="Denominación/Razón social"
                        name="razon_social"
                        placeholder = "Ej: Industria Boliviana de Costura"
                        maxLength={100}
                        required
                    />
                </div>
                <div className={styles.campoWrapper}>
                    <InNit
                        label="Número de Identificación Tributaria - NIT"
                        name="nit"
                        required
                    />
                </div>
                <div className={styles.campoWrapper}>
                    <InTexto
                        label="Número de Matrícula de Comercio (cuando corresponda)"
                        name="matricula_comercio"
                        maxLength={50}
                    />
                </div>
            </div>
        </div>
    );
};

export default SeccionDatosEmpresa;