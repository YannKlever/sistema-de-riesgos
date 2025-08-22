import React, { useState, useEffect } from 'react';
import { databaseService } from '../../services/database';
import { OPCIONES_MITIGACION } from './constantes';
import styles from './modalMitigacion.module.css';

export const ModalMitigacion = ({
    isOpen,
    onClose,
    clienteId,
    mitigacionExistente = '',
    mitigacionNumericoExistente = 0,
    mitigacionAdicionalExistente = '',
    onMitigacionGuardada
}) => {
    const [opcionesSeleccionadas, setOpcionesSeleccionadas] = useState([]);
    const [informacionAdicional, setInformacionAdicional] = useState('');
    const [guardando, setGuardando] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            if (mitigacionExistente) {
                setOpcionesSeleccionadas(mitigacionExistente.split('|').filter(Boolean));
            } else {
                setOpcionesSeleccionadas([]);
            }
            setInformacionAdicional(mitigacionAdicionalExistente || '');
            setError('');
        }
    }, [isOpen, mitigacionExistente, mitigacionAdicionalExistente]);

    const calcularPorcentaje = () => {
        const porcentajePorOpcion = 100 / OPCIONES_MITIGACION.length;
        return (opcionesSeleccionadas.length * porcentajePorOpcion).toFixed(2);
    };

    const handleCheckboxChange = (opcion) => {
        setOpcionesSeleccionadas(prev => {
            if (prev.includes(opcion)) {
                return prev.filter(item => item !== opcion);
            } else {
                return [...prev, opcion];
            }
        });
    };

    const handleGuardar = async () => {
        try {
            setGuardando(true);
            setError('');

            const porcentajeMitigacion = parseFloat(calcularPorcentaje());
            const textoMitigacion = opcionesSeleccionadas.join('|');

            const datosActualizacion = {
                mitigacion: textoMitigacion,
                mitigacion_numerico: porcentajeMitigacion,
                mitigacion_adicional: informacionAdicional
            };

            const resultado = await databaseService.actualizarClienteInterno(clienteId, datosActualizacion);

            if (resultado.success) {
                // Pasar los datos actualizados al callback
                const clienteActualizado = {
                    id: clienteId,
                    ...datosActualizacion
                };

                if (onMitigacionGuardada) {
                    onMitigacionGuardada(clienteActualizado);
                }
                onClose();
            } else {
                throw new Error(resultado.error || 'Error al guardar mitigación');
            }
        } catch (error) {
            console.error('Error al guardar mitigación:', error);
            setError(`Error al guardar: ${error.message}`);
        } finally {
            setGuardando(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                    <h2>Seleccionar Medidas de Mitigación</h2>
                    <button className={styles.closeButton} onClick={onClose}>×</button>
                </div>

                <div className={styles.modalBody}>
                    {error && (
                        <div className={styles.error}>
                            {error}
                            <button
                                onClick={() => setError('')}
                                className={styles.botonCerrarError}
                            >
                                ×
                            </button>
                        </div>
                    )}

                    <div className={styles.checklistContainer}>
                        <h3>Seleccione las medidas de mitigación aplicables:</h3>
                        {OPCIONES_MITIGACION.map(opcion => (
                            <label key={opcion.id} className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    checked={opcionesSeleccionadas.includes(opcion.texto)}
                                    onChange={() => handleCheckboxChange(opcion.texto)}
                                    className={styles.checkboxInput}
                                    disabled={guardando}
                                />
                                {opcion.texto}
                            </label>
                        ))}
                    </div>

                    <div className={styles.porcentajeContainer}>
                        <h4>Porcentaje de Mitigación: {calcularPorcentaje()}%</h4>
                    </div>

                    <div className={styles.adicionalContainer}>
                        <h3>Información Adicional:</h3>
                        <textarea
                            value={informacionAdicional}
                            onChange={(e) => setInformacionAdicional(e.target.value)}
                            placeholder="Ingrese información adicional sobre las medidas de mitigación..."
                            className={styles.textareaAdicional}
                            rows={4}
                            disabled={guardando}
                        />
                    </div>
                </div>

                <div className={styles.modalFooter}>
                    <button
                        onClick={onClose}
                        className={styles.botonCancelar}
                        disabled={guardando}
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleGuardar}
                        className={styles.botonGuardar}
                        disabled={guardando}
                    >
                        {guardando ? 'Guardando...' : 'Guardar Mitigación'}
                    </button>
                </div>
            </div>
        </div>
    );
};