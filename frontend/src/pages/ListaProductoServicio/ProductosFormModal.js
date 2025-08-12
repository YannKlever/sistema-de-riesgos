import React, { useState, useEffect } from 'react';
import { databaseService } from '../../services/database';
import { NIVELES_RIESGO, NIVELES_RIESGO_CLIENTE } from './constants';
import styles from './styles.module.css';

const CampoFormulario = ({ label, children, required = false }) => (
    <div className={styles.formGroup}>
        <label>
            {label}
            {required && <span className={styles.required}>*</span>}
        </label>
        {children}
    </div>
);

const CampoRiesgo = ({ name, value, onChange, opciones = NIVELES_RIESGO }) => (
    <select
        name={name}
        value={value}
        onChange={onChange}
        className={styles.formInput}
    >
        <option value="">Seleccione nivel</option>
        {opciones.map(nivel => (
            <option key={nivel.value} value={nivel.value}>
                {nivel.label}
            </option>
        ))}
    </select>
);

const ProductosFormModal = ({ editingId, productos, oficinas, onClose, onSuccess, onError }) => {
    const [formData, setFormData] = useState({
        producto_servicio: '',
        riesgo_producto: '',
        riesgo_producto_numerico: null,
        riesgo_cliente: '',
        riesgo_cliente_numerico: null,
        oficina: '',
        observaciones: ''
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (editingId !== null) {
            const producto = productos.find(p => p.id === editingId);
            if (producto) {
                setFormData({
                    producto_servicio: producto.producto_servicio,
                    riesgo_producto: producto.riesgo_producto,
                    riesgo_producto_numerico: producto.riesgo_producto_numerico ||
                        NIVELES_RIESGO.find(n => n.value === producto.riesgo_producto)?.valorNumerico || null,
                    riesgo_cliente: producto.riesgo_cliente,
                    riesgo_cliente_numerico: producto.riesgo_cliente_numerico ||
                        NIVELES_RIESGO_CLIENTE.find(n => n.value === producto.riesgo_cliente)?.valorNumerico || null,
                    oficina: producto.oficina || '',
                    observaciones: producto.observaciones || ''
                });
            }
        }
    }, [editingId, productos]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'riesgo_producto') {
            const nivelSeleccionado = NIVELES_RIESGO.find(nivel => nivel.value === value);
            setFormData(prev => ({
                ...prev,
                riesgo_producto: value,
                riesgo_producto_numerico: nivelSeleccionado ? nivelSeleccionado.valorNumerico : null
            }));
        } else if (name === 'riesgo_cliente') {
            const nivelSeleccionado = NIVELES_RIESGO_CLIENTE.find(nivel => nivel.value === value);
            setFormData(prev => ({
                ...prev,
                riesgo_cliente: value,
                riesgo_cliente_numerico: nivelSeleccionado ? nivelSeleccionado.valorNumerico : null
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.producto_servicio || !formData.riesgo_producto || !formData.riesgo_cliente) {
            onError('Por favor complete los campos requeridos');
            return;
        }

        setLoading(true);

        try {
            const datos = {
                ...formData,
                fecha_registro: editingId
                    ? productos.find(p => p.id === editingId).fecha_registro
                    : new Date().toISOString()
            };

            const resultado = editingId
                ? await databaseService.actualizarProductoServicio(editingId, datos)
                : await databaseService.crearProductoServicio(datos);

            if (!resultado.success) throw new Error(resultado.error);
            onSuccess();
        } catch (error) {
            onError(error.message || 'Error al guardar producto/servicio');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                    <h3>{editingId ? 'Editar Producto/Servicio' : 'Nuevo Producto/Servicio'}</h3>
                    <button onClick={onClose} className={styles.modalCloseButton}>
                        &times;
                    </button>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGrid}>
                        <CampoFormulario label="Producto/Servicio" required>
                            <input
                                type="text"
                                name="producto_servicio"
                                value={formData.producto_servicio}
                                onChange={handleChange}
                                className={styles.formInput}
                                required
                            />
                        </CampoFormulario>

                        <CampoFormulario label="Oficina">
                            <select
                                name="oficina"
                                value={formData.oficina}
                                onChange={handleChange}
                                className={styles.formInput}
                            >
                                <option value="">Seleccione oficina</option>
                                {oficinas.map((oficina, index) => (
                                    <option key={`oficina-${index}`} value={oficina}>
                                        {oficina}
                                    </option>
                                ))}
                            </select>
                        </CampoFormulario>

                        <CampoFormulario label="Riesgo Producto" required>
                            <CampoRiesgo
                                name="riesgo_producto"
                                value={formData.riesgo_producto}
                                onChange={handleChange}
                            />
                        </CampoFormulario>

                        <CampoFormulario label="Riesgo Cliente" required>
                            <CampoRiesgo
                                name="riesgo_cliente"
                                value={formData.riesgo_cliente}
                                onChange={handleChange}
                                opciones={NIVELES_RIESGO_CLIENTE}
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

export default ProductosFormModal;