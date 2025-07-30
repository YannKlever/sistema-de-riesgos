import React, { useState, useEffect } from 'react';
import { databaseService } from '../../services/database';
import styles from './styles.module.css';
import ProductoServicioTable from './ProductoServicioTable';

// Definición de niveles de riesgo con sus valores numéricos
const nivelesRiesgo = [
    { value: 'bajo', label: 'Bajo', valorNumerico: 1 },
    { value: 'medio_bajo', label: 'Medio Bajo', valorNumerico: 2 },
    { value: 'medio', label: 'Medio', valorNumerico: 3 },
    { value: 'medio_alto', label: 'Medio Alto', valorNumerico: 4 },
    { value: 'alto', label: 'Alto', valorNumerico: 5 }
];

const ListaProductoServicio = ({ onBack }) => {
    const [productos, setProductos] = useState([]);
    const [oficinas, setOficinas] = useState([]); // Estado para almacenar las oficinas
    const [formData, setFormData] = useState({
        producto_servicio: '',
        riesgo_producto: '',
        riesgo_cliente: '',
        oficina: '', // Nuevo campo
        observaciones: '',
        riesgo_producto_numerico: null,
        riesgo_cliente_numerico: null
    });
    const [editingId, setEditingId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        cargarProductos();
        cargarOficinas();
    }, []);

    const cargarOficinas = async () => {
        try {
            const { success, data } = await databaseService.listarSucursales();
            if (success) {
                // Extraer solo las oficinas únicas
                const oficinasUnicas = [...new Set(data.map(sucursal => sucursal.oficina))];
                setOficinas(oficinasUnicas);
            }
        } catch (error) {
            console.error('Error al cargar oficinas:', error);
        }
    };

    const cargarProductos = async () => {
        setIsLoading(true);
        setError('');
        try {
            const { success, data, error } = await databaseService.listarProductosServicios();
            if (success) {
                setProductos(data);
            } else {
                setError(error || 'Error al cargar productos/servicios');
            }
        } catch (error) {
            setError('Error al cargar productos/servicios: ' + error.message);
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // Actualizamos tanto el valor textual como el numérico cuando cambia un select de riesgo
        if (name === 'riesgo_producto' || name === 'riesgo_cliente') {
            const nivelSeleccionado = nivelesRiesgo.find(nivel => nivel.value === value);
            const nombreNumerico = `${name}_numerico`;
            
            setFormData(prev => ({
                ...prev,
                [name]: value,
                [nombreNumerico]: nivelSeleccionado ? nivelSeleccionado.valorNumerico : null
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validación de campos requeridos
        if (!formData.producto_servicio || !formData.riesgo_producto || !formData.riesgo_cliente) {
            setError('Por favor complete todos los campos requeridos');
            return;
        }

        setIsLoading(true);
        setError('');
        
        try {
            let resultado;
            if (editingId !== null) {
                resultado = await databaseService.actualizarProductoServicio(editingId, formData);
                if (resultado.success) {
                    setProductos(productos.map(item => 
                        item.id === editingId ? { ...formData, id: editingId } : item
                    ));
                    setEditingId(null);
                } else {
                    throw new Error(resultado.error);
                }
            } else {
                resultado = await databaseService.crearProductoServicio(formData);
                if (resultado.success) {
                    const nuevoProducto = { ...formData, id: resultado.id };
                    setProductos([nuevoProducto, ...productos]);
                } else {
                    throw new Error(resultado.error);
                }
            }
            
            // Resetear formulario sin valores predeterminados
            setFormData({
                producto_servicio: '',
                riesgo_producto: '',
                riesgo_cliente: '',
                oficina: '', // Nuevo campo
                observaciones: '',
                riesgo_producto_numerico: null,
                riesgo_cliente_numerico: null
            });
        } catch (error) {
            setError(error.message || 'Error al guardar producto/servicio');
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (producto) => {
        setFormData({
            producto_servicio: producto.producto_servicio,
            riesgo_producto: producto.riesgo_producto,
            riesgo_cliente: producto.riesgo_cliente,
            oficina: producto.oficina || '', // Nuevo campo
            observaciones: producto.observaciones || '',
            riesgo_producto_numerico: producto.riesgo_producto_numerico || 
                nivelesRiesgo.find(n => n.value === producto.riesgo_producto)?.valorNumerico || null,
            riesgo_cliente_numerico: producto.riesgo_cliente_numerico || 
                nivelesRiesgo.find(n => n.value === producto.riesgo_cliente)?.valorNumerico || null
        });
        setEditingId(producto.id);
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este producto/servicio?')) {
            setIsLoading(true);
            setError('');
            try {
                const resultado = await databaseService.eliminarProductoServicio(id);
                if (resultado.success) {
                    setProductos(productos.filter(item => item.id !== id));
                } else {
                    throw new Error(resultado.error);
                }
            } catch (error) {
                setError(error.message || 'Error al eliminar producto/servicio');
                console.error('Error:', error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const getLabelRiesgo = (valor) => {
        const nivel = nivelesRiesgo.find(item => item.value === valor);
        return nivel ? nivel.label : valor;
    };

    return (
        <div className={styles.container}>
            
            <h2>Lista de Producto/Servicio</h2>
            
            {error && <div className={styles.error}>{error}</div>}
            
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                    <label>Producto/Servicio:</label>
                    <input
                        type="text"
                        name="producto_servicio"
                        value={formData.producto_servicio}
                        onChange={handleChange}
                        placeholder="Ingrese el producto o servicio"
                        required
                    />
                </div>
                
                <div className={styles.formGroup}>
                    <label>Oficina:</label>
                    <select
                        name="oficina"
                        value={formData.oficina}
                        onChange={handleChange}
                    >
                        <option value="">Seleccione una oficina</option>
                        {oficinas.map((oficina, index) => (
                            <option key={`oficina-${index}`} value={oficina}>
                                {oficina}
                            </option>
                        ))}
                    </select>
                </div>
                
                <div className={styles.formGroup}>
                    <label>Riesgo de producto/servicio:</label>
                    <select
                        name="riesgo_producto"
                        value={formData.riesgo_producto}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Seleccione un nivel de riesgo</option>
                        {nivelesRiesgo.map((nivel) => (
                            <option key={`producto-${nivel.value}`} value={nivel.value}>
                                {nivel.label}
                            </option>
                        ))}
                    </select>
                    {/* Campo oculto para el valor numérico */}
                    <input 
                        type="hidden" 
                        name="riesgo_producto_numerico" 
                        value={formData.riesgo_producto_numerico || ''} 
                    />
                </div>
                
                <div className={styles.formGroup}>
                    <label>Riesgo del tipo de cliente:</label>
                    <select
                        name="riesgo_cliente"
                        value={formData.riesgo_cliente}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Seleccione un nivel de riesgo</option>
                        {nivelesRiesgo.map((nivel) => (
                            <option key={`cliente-${nivel.value}`} value={nivel.value}>
                                {nivel.label}
                            </option>
                        ))}
                    </select>
                    {/* Campo oculto para el valor numérico */}
                    <input 
                        type="hidden" 
                        name="riesgo_cliente_numerico" 
                        value={formData.riesgo_cliente_numerico || ''} 
                    />
                </div>
                
                <div className={styles.formGroup}>
                    <label>Observaciones:</label>
                    <textarea
                        name="observaciones"
                        value={formData.observaciones}
                        onChange={handleChange}
                        placeholder="Ingrese observaciones adicionales (opcional)"
                    />
                </div>
                
                <button 
                    type="submit" 
                    className={styles.saveButton}
                    disabled={isLoading}
                >
                    {isLoading ? 'Guardando...' : (editingId !== null ? 'Actualizar' : 'Guardar')}
                </button>
            </form>

            <ProductoServicioTable
                productos={productos}
                isLoading={isLoading}
                onEdit={handleEdit}
                onDelete={handleDelete}
                getLabelRiesgo={getLabelRiesgo}
            />
        </div>
    );
};

export default ListaProductoServicio;