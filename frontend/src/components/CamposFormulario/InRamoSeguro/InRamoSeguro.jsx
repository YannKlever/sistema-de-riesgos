import { useState, useEffect } from 'react';
import styles from './styles.module.css';
import { databaseService } from '../../../services/database';

const InRamoSeguro = ({ 
    label, 
    name, 
    required = false,
    defaultValue = ''
}) => {
    const [ramoSeleccionado, setRamoSeleccionado] = useState(defaultValue || '');
    const [ramos, setRamos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Cargar los ramos de seguro desde el backend
    useEffect(() => {
        const cargarRamos = async () => {
            try {
                const resultado = await databaseService.listarProductosServicios();
                if (resultado.success) {
                    // Mapear los datos del backend al formato esperado
                    const ramosCargados = resultado.data.map(item => ({
                        value: item.producto_servicio,
                        label: item.producto_servicio,
                        grupo: item.riesgo_producto || 'Otros Riesgos'
                    }));
                    
                    setRamos(ramosCargados);
                } else {
                    setError(resultado.error || 'Error al cargar los ramos de seguro');
                }
            } catch (err) {
                setError(err.message || 'Error al cargar los ramos de seguro');
            } finally {
                setLoading(false);
            }
        };

        cargarRamos();
    }, []);

    const handleChange = (e) => {
        setRamoSeleccionado(e.target.value);
    };

    // Agrupar los ramos por categoría para el select
    const ramosAgrupados = ramos.reduce((acc, ramo) => {
        if (!acc[ramo.grupo]) {
            acc[ramo.grupo] = [];
        }
        acc[ramo.grupo].push(ramo);
        return acc;
    }, {});

    if (loading) {
        return <div>Cargando ramos de seguro...</div>;
    }

    if (error) {
        return <div className={styles.error}>Error: {error}</div>;
    }

    return (
        <div className={styles.ramoSeguroContainer}>
            <label className={styles.ramoSeguroLabel}>
                {label}
                {required && <span className={styles.requiredAsterisk}>*</span>}
            </label>
            <select 
                name={name} 
                required={required}
                className={styles.ramoSeguroSelect}
                value={ramoSeleccionado}
                onChange={handleChange}
            >
                <option value="">Seleccione un ramo de seguro</option>
                
                {Object.entries(ramosAgrupados).map(([grupo, ramosGrupo]) => (
                    <optgroup key={grupo} label={grupo}>
                        {ramosGrupo.map(ramo => (
                            <option key={ramo.value} value={ramo.value}>
                                {ramo.label}
                            </option>
                        ))}
                    </optgroup>
                ))}
            </select>
        </div>
    );
};

export default InRamoSeguro;