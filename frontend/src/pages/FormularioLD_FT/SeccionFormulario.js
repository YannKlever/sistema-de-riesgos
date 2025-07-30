import PreguntaFormulario from './PreguntaFormulario';
import styles from './FormularioLD_FT.module.css';

const SeccionFormulario = ({ seccion, respuestas, handleChange }) => {
  return (
    <div key={`seccion-${seccion.titulo}`} className={styles.section}>
      <h3 className={styles.sectionTitle}>
        <span className={styles.sectionIcon}>📋</span>
        {seccion.titulo}
      </h3>
      
      {seccion.preguntas?.map((pregunta) => (
  pregunta?.opciones?.length > 0 && (
    <PreguntaFormulario
      key={pregunta.id}
      pregunta={pregunta}
      value={respuestas[pregunta.id]}
      onChange={handleChange}
    />
  )
))}
    </div>
  );
};

export default SeccionFormulario;