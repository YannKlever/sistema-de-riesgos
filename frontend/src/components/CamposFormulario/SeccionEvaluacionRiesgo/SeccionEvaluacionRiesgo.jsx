import { useState, useEffect, useRef } from 'react';
import styles from './styles.module.css';

const initialEvaluacionState = {
    integridad_documental: '',
    exactitud_documental: '',
    vigencia_documental: '',
    relevancia_informacion: '',
    comportamiento_cliente: '',
    consistencia_informacion: '',
    observaciones: ''
};

// Mapeo de opciones de evaluación con valores numéricos
const opcionesEvaluacion = [
    { value: 'cumple plenamente', label: 'Cumple plenamente con lo esperado', valor: 1 },
    { value: 'cumple adecuadamente', label: 'Cumple adecuadamente con lo esperado', valor: 2 },
    { value: 'cumple parcialmente', label: 'Cumple parcialmente con lo esperado', valor: 3 },
    { value: 'deficiencias notorias', label: 'Presenta deficiencias notorias', valor: 4 },
    { value: 'no cumple', label: 'No cumple con lo esperado', valor: 5 }
];

// Mapeo de opciones de comportamiento con valores numéricos
const opcionesComportamiento = [
    { value: 'totalmente cooperativo', label: 'Totalmente cooperativo y transparente', valor: 1 },
    { value: 'cooperativo reservas', label: 'Cooperativo con ciertas reservas', valor: 2 },
    { value: 'desconfianza ocasional', label: 'Mostró desconfianza ocasional', valor: 3 },
    { value: 'evitativo respuestas', label: 'Evitativo en algunas respuestas', valor: 4 },
    { value: 'evasivo confrontacional', label: 'Claramente evasivo o confrontacional', valor: 5 }
];

const SeccionEvaluacionRiesgo = ({ defaultValue = null }) => {
    const [evaluacion, setEvaluacion] = useState(initialEvaluacionState);
    const containerRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const form = container.closest('form');
        if (!form) return;

        const handleReset = () => {
            setEvaluacion(initialEvaluacionState);
        };

        form.addEventListener('reset', handleReset);
        return () => form.removeEventListener('reset', handleReset);
    }, []);

    useEffect(() => {
        if (defaultValue) {
            setEvaluacion({
                ...initialEvaluacionState,
                ...defaultValue
            });
        } else {
            setEvaluacion(initialEvaluacionState);
        }
    }, [defaultValue]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEvaluacion(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Función para obtener el valor numérico de una opción
    const getValorNumerico = (tipo, value) => {
        if (!value) return '';

        if (tipo === 'comportamiento') {
            const opcion = opcionesComportamiento.find(o => o.value === value);
            return opcion ? opcion.valor : '';
        } else {
            const opcion = opcionesEvaluacion.find(o => o.value === value);
            return opcion ? opcion.valor : '';
        }
    };

    return (
        <div ref={containerRef} className={styles.formSection}>
            <h5 className={styles.sectionTitle}>
                <span className={styles.sectionIcon}>📊</span>
                Evaluación de Documentación y Comportamiento
            </h5>

            <div className={styles.formRow}>
                <div className={styles.formCol}>
                    <label>Integridad de la documentación proporcionada</label>
                    <select
                        name="integridad_documental"
                        value={evaluacion.integridad_documental || ''}
                        onChange={handleChange}
                        className={styles.formControl}
                        required
                    >
                        <option value="">Seleccione una opción...</option>
                        {opcionesEvaluacion.map(opcion => (
                            <option key={opcion.value} value={opcion.value}>
                                {opcion.label}
                            </option>
                        ))}
                    </select>
                    <input
                        type="hidden"
                        name="integridad_documental_numerico"
                        value={getValorNumerico('evaluacion', evaluacion.integridad_documental)}
                    />
                </div>

                <div className={styles.formCol}>
                    <label>Exactitud de la información documentada</label>
                    <select
                        name="exactitud_documental"
                        value={evaluacion.exactitud_documental || ''}
                        onChange={handleChange}
                        className={styles.formControl}
                        required
                    >
                        <option value="">Seleccione una opción...</option>
                        {opcionesEvaluacion.map(opcion => (
                            <option key={opcion.value} value={opcion.value}>
                                {opcion.label}
                            </option>
                        ))}
                    </select>
                    <input
                        type="hidden"
                        name="exactitud_documental_numerico"
                        value={getValorNumerico('evaluacion', evaluacion.exactitud_documental)}
                    />
                </div>
            </div>

            <div className={styles.formRow}>
                <div className={styles.formCol}>
                    <label>Vigencia de los documentos proporcionados</label>
                    <select
                        name="vigencia_documental"
                        value={evaluacion.vigencia_documental || ''}
                        onChange={handleChange}
                        className={styles.formControl}
                        required
                    >
                        <option value="">Seleccione una opción...</option>
                        {opcionesEvaluacion.map(opcion => (
                            <option key={opcion.value} value={opcion.value}>
                                {opcion.label}
                            </option>
                        ))}
                    </select>
                    <input
                        type="hidden"
                        name="vigencia_documental_numerico"
                        value={getValorNumerico('evaluacion', evaluacion.vigencia_documental)}
                    />
                </div>

                <div className={styles.formCol}>
                    <label>Relevancia de la información recabada</label>
                    <select
                        name="relevancia_informacion"
                        value={evaluacion.relevancia_informacion || ''}
                        onChange={handleChange}
                        className={styles.formControl}
                        required
                    >
                        <option value="">Seleccione una opción...</option>
                        {opcionesEvaluacion.map(opcion => (
                            <option key={opcion.value} value={opcion.value}>
                                {opcion.label}
                            </option>
                        ))}
                    </select>
                    <input
                        type="hidden"
                        name="relevancia_informacion_numerico"
                        value={getValorNumerico('evaluacion', evaluacion.relevancia_informacion)}
                    />
                </div>
            </div>

            <div className={styles.formRow}>
                <div className={styles.formCol}>
                    <label>Consistencia entre la información proporcionada</label>
                    <select
                        name="consistencia_informacion"
                        value={evaluacion.consistencia_informacion || ''}
                        onChange={handleChange}
                        className={styles.formControl}
                        required
                    >
                        <option value="">Seleccione una opción...</option>
                        {opcionesEvaluacion.map(opcion => (
                            <option key={opcion.value} value={opcion.value}>
                                {opcion.label}
                            </option>
                        ))}
                    </select>
                    <input
                        type="hidden"
                        name="consistencia_informacion_numerico"
                        value={getValorNumerico('evaluacion', evaluacion.consistencia_informacion)}
                    />
                </div>

                <div className={styles.formCol}>
                    <label>Comportamiento del cliente durante el proceso</label>
                    <select
                        name="comportamiento_cliente"
                        value={evaluacion.comportamiento_cliente || ''}
                        onChange={handleChange}
                        className={styles.formControl}
                        required
                    >
                        <option value="">Seleccione una opción...</option>
                        {opcionesComportamiento.map(opcion => (
                            <option key={opcion.value} value={opcion.value}>
                                {opcion.label}
                            </option>
                        ))}
                    </select>
                    <input
                        type="hidden"
                        name="comportamiento_cliente_numerico"
                        value={getValorNumerico('comportamiento', evaluacion.comportamiento_cliente)}
                    />
                </div>
            </div>

            <div className={styles.formRow}>
                <div className={styles.fullWidthField}>
                    <label>Observaciones adicionales</label>
                    <textarea
                        name="observaciones"
                        value={evaluacion.observaciones || ''}
                        onChange={handleChange}
                        className={styles.formControl}
                        rows="3"
                        maxLength="500"
                        placeholder="Describa cualquier observación relevante sobre la documentación o comportamiento del cliente..."
                    />
                </div>
            </div>
        </div>
    );
};

export default SeccionEvaluacionRiesgo;