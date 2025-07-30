import InSelect from '../../components/CamposFormulario/InSelect/InSelect';
import styles from './FormularioLD_FT.module.css'

const PreguntaFormulario = ({ pregunta, value, onChange }) => {
  const handleChange = (selectedValue) => { // Ahora recibe el valor directamente
    const selectedOption = pregunta.opciones.find(opt => opt.value === selectedValue) || {};
    
    onChange(pregunta.id, {
      texto: selectedValue,
      numerico: selectedOption.valor || 0
    });
  };

  return (
    <div className={styles.field}>
      <InSelect
        label={pregunta.texto}
        name={pregunta.id}
        options={pregunta.opciones}
        value={value?.texto || ''}
        onChange={handleChange} // Pasa el valor directamente
        required
      />
      <input 
        type="hidden" 
        name={`${pregunta.id}_numerico`} 
        value={value?.numerico || ''} 
      />
    </div>
  );
};

export default PreguntaFormulario;