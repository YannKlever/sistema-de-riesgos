import React, { useState, useEffect } from 'react';
import { databaseService } from '../../services/database';
import { NIVELES_RIESGO, DEPARTAMENTOS_BOLIVIA } from './constants';
import styles from './listaSucursales.module.css';

const CampoFormulario = ({ label, children, required = false }) => (
    <div className={styles.formGroup}>
        <label>
            {label}
            {required && <span className={styles.required}>*</span>}
        </label>
        {children}
    </div>
);

const CampoRiesgo = ({ name, value, onChange }) => (
    <select
        name={name}
        value={value}
        onChange={onChange}
        className={styles.formInput}
    >
        <option value="">Nivel de riesgo</option>
        {NIVELES_RIESGO.map(nivel => (
            <option key={nivel.value} value={nivel.value}>
                {nivel.label}
            </option>
        ))}
    </select>
);

const SucursalFormModal = ({ editingId, sucursales, onClose, onSuccess, onError }) => {
    const [formData, setFormData] = useState({
        oficina: '',
        ubicacion: '',
        departamento: '',
        municipio: '',
        zona: '',
        frontera: '',
        observaciones: '',
        riesgo_departamento: '',
        riesgo_departamento_numerico: null,
        riesgo_municipio: '',
        riesgo_municipio_numerico: null,
        riesgo_zona: '',
        riesgo_zona_numerico: null,
        riesgo_frontera: '',
        riesgo_frontera_numerico: null
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (editingId !== null) {
            const sucursal = sucursales.find(s => s.id === editingId);
            if (sucursal) {
                setFormData({
                    oficina: sucursal.oficina,
                    ubicacion: sucursal.ubicacion,
                    departamento: sucursal.departamento,
                    municipio: sucursal.municipio || '',
                    zona: sucursal.zona || '',
                    frontera: sucursal.frontera || '',
                    observaciones: sucursal.observaciones || '',
                    riesgo_departamento: sucursal.riesgo_departamento || '',
                    riesgo_departamento_numerico: sucursal.riesgo_departamento_numerico || null,
                    riesgo_municipio: sucursal.riesgo_municipio || '',
                    riesgo_municipio_numerico: sucursal.riesgo_municipio_numerico || null,
                    riesgo_zona: sucursal.riesgo_zona || '',
                    riesgo_zona_numerico: sucursal.riesgo_zona_numerico || null,
                    riesgo_frontera: sucursal.riesgo_frontera || '',
                    riesgo_frontera_numerico: sucursal.riesgo_frontera_numerico || null
                });
            }
        }
    }, [editingId, sucursales]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('riesgo_') && !name.endsWith('_numerico')) {
            const nivelSeleccionado = NIVELES_RIESGO.find(nivel => nivel.value === value);
            setFormData(prev => ({
                ...prev,
                [name]: value,
                [`${name}_numerico`]: nivelSeleccionado ? nivelSeleccionado.valorNumerico : null
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.oficina || !formData.ubicacion || !formData.departamento || !formData.riesgo_departamento) {
            onError('Por favor complete los campos requeridos');
            return;
        }

        setLoading(true);

        try {
            const datos = {
                ...formData,
                fecha_registro: editingId
                    ? sucursales.find(s => s.id === editingId).fecha_registro
                    : new Date().toISOString()
            };

            // Eliminar campos _numerico si son null para que la base de datos use sus valores por defecto
            Object.keys(datos).forEach(key => {
                if (key.endsWith('_numerico') && datos[key] === null) {
                    delete datos[key];
                }
            });

            const resultado = editingId
                ? await databaseService.actualizarSucursal(editingId, datos)
                : await databaseService.crearSucursal(datos);

            if (!resultado.success) throw new Error(resultado.error);
            onSuccess();
        } catch (error) {
            onError(error.message || 'Error al guardar sucursal');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                    <h3>{editingId ? 'Editar Sucursal' : 'Nueva Sucursal'}</h3>
                    <button onClick={onClose} className={styles.modalCloseButton}>
                        &times;
                    </button>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGrid}>
                        <CampoFormulario label="Oficina" required>
                            <input
                                type="text"
                                name="oficina"
                                value={formData.oficina}
                                onChange={handleChange}
                                className={styles.formInput}
                                required
                            />
                        </CampoFormulario>

                        <CampoFormulario label="Dirección" required>
                            <input
                                type="text"
                                name="ubicacion"
                                value={formData.ubicacion}
                                onChange={handleChange}
                                className={styles.formInput}
                                required
                            />
                        </CampoFormulario>

                        <CampoFormulario label="Departamento" required>
                            <select
                                name="departamento"
                                value={formData.departamento}
                                onChange={handleChange}
                                className={styles.formInput}
                                required
                            >
                                <option value="">Seleccione departamento</option>
                                {DEPARTAMENTOS_BOLIVIA.map(depto => (
                                    <option key={depto} value={depto}>{depto}</option>
                                ))}
                            </select>
                        </CampoFormulario>

                        <CampoFormulario label="Riesgo Depto." required>
                            <CampoRiesgo
                                name="riesgo_departamento"
                                value={formData.riesgo_departamento}
                                onChange={handleChange}
                            />
                        </CampoFormulario>

                        <CampoFormulario label="Municipio">
                            <input
                                type="text"
                                name="municipio"
                                value={formData.municipio}
                                onChange={handleChange}
                                className={styles.formInput}
                            />
                        </CampoFormulario>

                        <CampoFormulario label="Riesgo Mun.">
                            <CampoRiesgo
                                name="riesgo_municipio"
                                value={formData.riesgo_municipio}
                                onChange={handleChange}
                            />
                        </CampoFormulario>

                        <CampoFormulario label="Zona">
                            <input
                                type="text"
                                name="zona"
                                value={formData.zona}
                                onChange={handleChange}
                                className={styles.formInput}
                            />
                        </CampoFormulario>

                        <CampoFormulario label="Riesgo Zona">
                            <CampoRiesgo
                                name="riesgo_zona"
                                value={formData.riesgo_zona}
                                onChange={handleChange}
                            />
                        </CampoFormulario>

                        <CampoFormulario label="Frontera">
                            <input
                                type="text"
                                name="frontera"
                                value={formData.frontera}
                                onChange={handleChange}
                                className={styles.formInput}
                            />
                        </CampoFormulario>

                        <CampoFormulario label="Riesgo Frontera">
                            <CampoRiesgo
                                name="riesgo_frontera"
                                value={formData.riesgo_frontera}
                                onChange={handleChange}
                            />
                        </CampoFormulario>

                        <CampoFormulario label="Observaciones" fullWidth>
                            <textarea
                                name="observaciones"
                                value={formData.observaciones}
                                onChange={handleChange}
                                className={styles.formTextarea}
                                rows={3}
                            />
                        </CampoFormulario>
                    </div>

                    <div className={styles.modalFooter}>
                        <button
                            type="button"
                            onClick={onClose}
                            className={`${styles.modalButton} ${styles.cancelButton}`}
                            disabled={loading}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className={`${styles.modalButton} ${styles.saveButton}`}
                            disabled={loading}
                        >
                            {loading ? 'Guardando...' : (editingId ? 'Actualizar' : 'Guardar')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SucursalFormModal;