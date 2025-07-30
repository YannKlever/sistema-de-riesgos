import styles from './styles.module.css';
import InPersona from '../InPersona/InPersona';

const InPersonaCargo = ({ title, prefix = '', showCargo = true }) => {
    return (
        <div className={styles.personaCargoContainer}>
            <InPersona title={title} prefix={prefix} />

            {showCargo && (
                <div className={styles.cargoField}>
                    <label className={styles.cargoLabel}>
                        Cargo <span className={styles.requiredAsterisk}>*</span>
                    </label>
                    <input
                        type="text"
                        name="cargo"
                        placeholder='Ej. Gerente Financiero'
                        maxLength={50}
                        required
                        className={styles.cargoInput}
                    />
                </div>
            )}
        </div>
    );
};

export default InPersonaCargo;