import { useState, useEffect, useMemo, useCallback } from 'react';
import { databaseService } from '../../services/database';
import { COLUMNAS_REPORTE_PRODUCTOS, COLUMNAS_NUMERICAS_PRODUCTOS } from './constantes';

export const useProductosServicios = () => {
    const [state, setState] = useState({
        productosServicios: [],
        loading: true,
        error: '',
        filtro: ''
    });

    const [productosConRiesgo, setProductosConRiesgo] = useState([]);

    const calcularRiesgoProductos = useCallback(async (productos) => {
        const productosConRiesgos = await Promise.all(
            productos.map(async (producto) => {
                try {
                    const [riesgoZona, riesgoCanal] = await Promise.all([
                        databaseService.obtenerRiesgoZonaGeografica(producto.oficina),
                        databaseService.obtenerRiesgoCanalDistribucion(producto.oficina)
                    ]);

                    const camposNumericos = COLUMNAS_NUMERICAS_PRODUCTOS
                        .map(col => producto[col.id])
                        .filter(val => val !== null && !isNaN(val));
                    
                    if (riesgoZona.success) camposNumericos.push(riesgoZona.data);
                    if (riesgoCanal.success) camposNumericos.push(riesgoCanal.data);
                    
                    const promedio = camposNumericos.length > 0 ? 
                        camposNumericos.reduce((sum, val) => sum + val, 0) / camposNumericos.length : 
                        0;
                    
                    return {
                        ...producto,
                        riesgoFactorProductosServicios: parseFloat(promedio.toFixed(2)),
                        riesgoFactorZonaGeografica: riesgoZona.success ? riesgoZona.data : 0,
                        riesgoFactorCanalDistribucion: riesgoCanal.success ? riesgoCanal.data : 0
                    };
                } catch (error) {
                    console.error('Error calculando riesgo:', producto.id, error);
                    return {
                        ...producto,
                        riesgoFactorProductosServicios: 0,
                        riesgoFactorZonaGeografica: 0,
                        riesgoFactorCanalDistribucion: 0
                    };
                }
            })
        );
        setProductosConRiesgo(productosConRiesgos);
    }, []);

    const cargarProductos = useCallback(async () => {
        try {
            setState(prev => ({ ...prev, loading: true, error: '' }));
            const resultado = await databaseService.listarProductosServicios();

            if (resultado.success) {
                setState(prev => ({
                    ...prev,
                    productosServicios: resultado.data,
                    loading: false
                }));
                await calcularRiesgoProductos(resultado.data);
            } else {
                setState(prev => ({
                    ...prev,
                    error: resultado.error || 'Error al cargar productos',
                    loading: false
                }));
            }
        } catch (err) {
            setState(prev => ({
                ...prev,
                error: 'Error de conexión con la base de datos',
                loading: false
            }));
            console.error('Error al cargar productos:', err);
        }
    }, [calcularRiesgoProductos]);

    useEffect(() => {
        cargarProductos();
    }, [cargarProductos]);

    const filtrarProductos = useCallback((producto) => {
        if (!state.filtro) return true;
        const texto = state.filtro.toLowerCase();
        return COLUMNAS_REPORTE_PRODUCTOS.some(col =>
            producto[col.id] &&
            String(producto[col.id]).toLowerCase().includes(texto)
        ) || 
            String(producto.riesgoFactorZonaGeografica).toLowerCase().includes(texto) ||
            String(producto.riesgoFactorCanalDistribucion).toLowerCase().includes(texto);
    }, [state.filtro]);

    const productosFiltrados = useMemo(() => {
        return productosConRiesgo.filter(filtrarProductos);
    }, [productosConRiesgo, filtrarProductos]);

    const handleFiltroChange = useCallback((e) => {
        setState(prev => ({ ...prev, filtro: e.target.value }));
    }, []);

    const actualizarReporte = useCallback(async () => {
        await calcularRiesgoProductos(state.productosServicios);
    }, [calcularRiesgoProductos, state.productosServicios]);

    const validarTodosLosRiesgos = useCallback(async () => {
        try {
            setState(prev => ({ ...prev, loading: true, error: '' }));
            
            const productosAValidar = productosConRiesgo.filter(
                item => item.riesgoFactorProductosServicios !== null && 
                       item.riesgoFactorProductosServicios !== undefined
            );

            if (productosAValidar.length === 0) {
                setState(prev => ({ ...prev, loading: false }));
                return { success: false, error: 'No hay riesgos calculados para validar' };
            }

            const resultados = await Promise.all(
                productosAValidar.map(item => 
                    databaseService.actualizarProductoServicio(item.id, {
                        promedio_riesgo_producto_servicio: item.riesgoFactorProductosServicios
                    })
                )
            );

            const todosExitosos = resultados.every(r => r.success);
            
            if (todosExitosos) {
                setState(prev => ({
                    ...prev,
                    productosServicios: prev.productosServicios.map(item => {
                        const productoValidado = productosAValidar.find(p => p.id === item.id);
                        return productoValidado ? { 
                            ...item, 
                            promedio_riesgo_producto_servicio: productoValidado.riesgoFactorProductosServicios 
                        } : item;
                    }),
                    loading: false
                }));
                
                await calcularRiesgoProductos(state.productosServicios);
                return { success: true };
            } else {
                const errores = resultados.filter(r => !r.success).map(r => r.error);
                setState(prev => ({ 
                    ...prev, 
                    error: 'Algunos productos no se validaron: ' + errores.join(', '),
                    loading: false 
                }));
                return { success: false, error: errores.join(', ') };
            }
        } catch (error) {
            setState(prev => ({ 
                ...prev, 
                error: 'Error validando riesgos: ' + error.message,
                loading: false 
            }));
            return { success: false, error: error.message };
        }
    }, [calcularRiesgoProductos, productosConRiesgo, state.productosServicios]);

    return {
        state,
        productosFiltrados,
        handleFiltroChange,
        actualizarReporte,
        validarTodosLosRiesgos,
        COLUMNAS_REPORTE: COLUMNAS_REPORTE_PRODUCTOS
    };
};