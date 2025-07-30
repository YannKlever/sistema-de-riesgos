import { useState, useEffect } from 'react';
import styles from './styles.module.css';

const rangosIngresos = [
    { texto: "Menos de $50,000", valor: 1 },
    { texto: "$50,000 - $100,000", valor: 2 },
    { texto: "$100,001 - $500,000", valor: 3 },
    { texto: "$500,001 - $1,000,000", valor: 4 },
    { texto: "Más de $1,000,000", valor: 5 }
];

const InIngresosAnuales = ({ 
    label, 
    name, 
    nameNumerico = `${name}_numerico`,
    required = false, 
    defaultValue = '',
    defaultNumerico = null
}) => {
    const [ingresoSeleccionado, setIngresoSeleccionado] = useState('');

    useEffect(() => {
        if (defaultValue) {
            setIngresoSeleccionado(defaultValue);
        }
    }, [defaultValue]);

    const handleChange = (e) => {
        setIngresoSeleccionado(e.target.value);
    };

    // Obtener el valor numérico correspondiente
    const rangoSeleccionado = rangosIngresos.find(r => r.texto === ingresoSeleccionado);
    const valorNumerico = rangoSeleccionado ? rangoSeleccionado.valor : null;

    return (
        <div className={styles.ingresosGroup}>
            <label className={styles.ingresosLabel}>
                {label} {required && <span className={styles.requiredAsterisk}>*</span>}
            </label>
            <select 
                name={name} 
                required={required} 
                className={styles.ingresosSelect}
                value={ingresoSeleccionado}
                onChange={handleChange}
            >
                <option value="">Seleccione un rango</option>
                {rangosIngresos.map((rango, index) => (
                    <option key={index} value={rango.texto}>{rango.texto}</option>
                ))}
            </select>
            
            <input 
                type="hidden" 
                name={nameNumerico} 
                value={valorNumerico || ''} 
            />
        </div>
    );
};

export default InIngresosAnuales;