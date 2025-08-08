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
        ...Object.fromEntries(
            Object.entries(NIVELES_RIESGO[0]).map(([key]) => 
                [`riesgo_${key}`, '']
            )
        )
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
                    ...Object.fromEntries(
                        Object.entries(sucursal).filter(([key]) => 
                            key.startsWith('riesgo_') && !key.endsWith('_numerico')
                        )
                    )
                });
            }
        }
    }, [editingId, sucursales]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
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
                ...Object.fromEntries(
                    NIVELES_RIESGO.map(nivel => [
                        `riesgo_${nivel.value}_numerico`,
                        formData[`riesgo_${nivel.value}`] === nivel.value ? nivel.valorNumerico : null
                    ])
                ),
                fecha_registro: editingId 
                    ? sucursales.find(s => s.id === editingId).fecha_registro
                    : new Date().toISOString()
            };

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