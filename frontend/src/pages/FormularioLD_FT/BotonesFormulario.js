import styles from './FormularioLD_FT.module.css';

const BotonesFormulario = ({ 
  isSubmitting, 
  onBack, 
  onReset,
  onSubmit 
}) => {
  return (
    <div className={styles.buttons}>
      <button 
        type="button" 
        className={styles.secondaryButton}
        onClick={onBack}
        disabled={isSubmitting}
      >
        Volver
      </button>
      <button 
        type="reset" 
        className={styles.secondaryButton}
        disabled={isSubmitting}
        onClick={onReset}
      >
        Limpiar
      </button>
      <button 
        type="submit" 
        className={styles.primaryButton}
        disabled={isSubmitting}
        onClick={onSubmit}
      >
        {isSubmitting ? (
          <span className={styles.spinner}>
            <span className={styles.spinnerInner}></span>
            Enviando...
          </span>
        ) : (
          'Enviar Evaluación'
        )}
      </button>
    </div>
  );
};

export default BotonesFormulario;