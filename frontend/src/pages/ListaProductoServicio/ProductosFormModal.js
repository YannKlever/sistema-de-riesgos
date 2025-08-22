import React, { useState, useEffect } from 'react';
import { databaseService } from '../../services/database';
import { NIVELES_RIESGO, NIVELES_RIESGO_CLIENTE, OPCIONES_IMPACTO } from './constants';
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
        observaciones: '',
        impacto_texto: [],
        impacto: 0
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
                    observaciones: producto.observaciones || '',
                    impacto_texto: producto.impacto_texto ? producto.impacto_texto.split(',') : [],
                    impacto: producto.impacto || 0
                });
            }
        }
    }, [editingId, productos]);

    const handleImpactoChange = (e) => {
        const { value, checked } = e.target;
        let nuevosValores = [...formData.impacto_texto];

        if (checked) {
            nuevosValores.push(value);
        } else {
            nuevosValores = nuevosValores.filter(item => item !== value);
        }

        // Calcula el impacto sumando los pesos de las opciones seleccionadas
        const nuevoImpacto = nuevosValores.reduce((total, valor) => {
            const opcion = OPCIONES_IMPACTO.find(o => o.value === valor);
            return total + (opcion ? opcion.peso : 0);
        }, 0);

        setFormData(prev => ({
            ...prev,
            impacto_texto: nuevosValores,
            impacto: nuevoImpacto
        }));
    };

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

        if (!formData.producto_servicio || !formData.riesgo_producto || !formData.riesgo_cliente || formData.impacto_texto.length === 0) {
            onError('Por favor complete todos los campos requeridos');
            return;
        }

        setLoading(true);

        try {
            const datos = {
                ...formData,
                impacto_texto: formData.impacto_texto.join(','),
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

                        <CampoFormulario label="Tipo de cliente recurrente" required>
                            <CampoRiesgo
                                name="riesgo_cliente"
                                value={formData.riesgo_cliente}
                                onChange={handleChange}
                                opciones={NIVELES_RIESGO_CLIENTE}
                            />
                        </CampoFormulario>
                        <CampoFormulario label="Impacto" required>
                            <div className={styles.checklistContainer}>
                                {OPCIONES_IMPACTO.map(opcion => (
                                    <label key={opcion.value} className={styles.checklistLabel}>
                                        <input
                                            type="checkbox"
                                            value={opcion.value}
                                            checked={formData.impacto_texto.includes(opcion.value)}
                                            onChange={handleImpactoChange}
                                            className={styles.checklistInput}
                                        />
                                        {opcion.label}
                                    </label>
                                ))}
                            </div>
                            <input
                                type="hidden"
                                name="impacto"
                                value={formData.impacto}
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