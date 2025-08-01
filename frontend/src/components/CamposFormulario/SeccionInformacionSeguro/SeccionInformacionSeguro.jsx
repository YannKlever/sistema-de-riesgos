import InRamoSeguro from '../InRamoSeguro/InRamoSeguro';
import InTipoDocumento from '../InTipoDocumento/InTipoDocumento';
import InVigenciaSeguro from '../InVigenciaSeguro/InVigenciaSeguro';
import InTexto from '../InTexto/InTexto';
import InPrima from '../InPrima/InPrima';
import styles from './styles.module.css';

const SeccionInformacionSeguro = () => {
    return (
        <div className={styles.seccionContainer}>
            <h5 className={styles.seccionTitulo}>
                <span className={styles.seccionIcono}>🛡️</span>
                Información del Seguro
            </h5>
            <div className={styles.seccionCampos}>
                <div className={styles.campoWrapper}>
                    <InRamoSeguro
                        label="Ramo de seguro"
                        name="ramo_seguro"
                        required
                    />
                </div>
                <div className={styles.campoWrapper}>
                    <InTipoDocumento
                        label="Tipo de documento"
                        name="tipo_documento"
                        required
                    />
                </div>
                <div className={styles.campoWrapper}>
                    <InVigenciaSeguro />
                </div>
                <div className={styles.campoWrapper}>
                    <InTexto
                        label="Nº de Póliza"
                        name="nro_poliza"
                        maxLength={20}
                        required
                    />
                </div>
                <div className={styles.campoWrapper}>
                    <InPrima
                        label="Valor de la prima en Dólares"
                        name="valor_prima_dolares"
                        required
                    />
                </div>
            </div>
        </div>
    );
};

export default SeccionInformacionSeguro;