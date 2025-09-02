import { useState, useEffect, useMemo, useCallback } from 'react';
import { databaseService } from '../../services/database';
import { COLUMNAS_REPORTE_PRODUCTOS } from './constantes';

// Columnas numéricas para el cálculo de probabilidad
const COLUMNAS_NUMERICAS_PROBABILIDAD = [
    'riesgo_producto_numerico',
    'riesgo_cliente_numerico',
    'riesgoFactorZonaGeografica'
];

export const useProductosServicios = () => {
    const [state, setState] = useState({
        productosServicios: [],
        loading: true,
        error: '',
        filtro: '',
        exporting: false
    });

    const [productosConRiesgo, setProductosConRiesgo] = useState([]);
    
    const setExporting = (exporting) => {
        setState(prev => ({ ...prev, exporting }));
    };

const calcularRiesgoProductos = useCallback(async (productos) => {
    const productosConRiesgos = await Promise.all(
        productos.map(async (producto) => {
            try {
                // 1. Obtener riesgo de zona geográfica
                const riesgoZona = await databaseService.obtenerRiesgoZonaGeografica(producto.oficina);
                
                // 2. Calcular probabilidad (promedio de valores numéricos)
                let valoresParaProbabilidad = [];
                
                // Agregar riesgo producto numérico si existe
                if (producto.riesgo_producto_numerico !== null && !isNaN(producto.riesgo_producto_numerico)) {
                    valoresParaProbabilidad.push(Number(producto.riesgo_producto_numerico));
                }
                
                // Agregar riesgo cliente numérico si existe
                if (producto.riesgo_cliente_numerico !== null && !isNaN(producto.riesgo_cliente_numerico)) {
                    valoresParaProbabilidad.push(Number(producto.riesgo_cliente_numerico));
                }
                
                // Agregar riesgo zona geográfica si existe
                if (riesgoZona.success && !isNaN(riesgoZona.data)) {
                    valoresParaProbabilidad.push(Number(riesgoZona.data));
                }
                
                // Calcular probabilidad solo si hay valores
                const probabilidad = valoresParaProbabilidad.length > 0 
                    ? valoresParaProbabilidad.reduce((sum, val) => sum + val, 0) / valoresParaProbabilidad.length
                    : 0;
                
                // 3. Usar el valor real de impacto de la base de datos, con fallback a 4 si no existe
                const impacto = producto.impacto !== null && producto.impacto !== undefined 
                    ? producto.impacto 
                    : 4;
                
                // 4. Calcular factor de riesgo (promedio de probabilidad e impacto)
                const factorRiesgo = (probabilidad + impacto) / 2;
                
                // Debug: Mostrar cálculo
                console.log('Cálculo para', producto.id, {
                    valores: valoresParaProbabilidad,
                    probabilidad,
                    impacto,
                    factorRiesgo
                });
                
                return {
                    ...producto,
                    probabilidad: parseFloat(probabilidad.toFixed(2)),
                    impacto: impacto,
                    riesgoFactorProductosServicios: parseFloat(factorRiesgo.toFixed(2)),
                    riesgoFactorZonaGeografica: riesgoZona.success ? parseFloat(riesgoZona.data.toFixed(2)) : 0
                };
            } catch (error) {
                console.error('Error calculando riesgo:', producto.id, error);
                return {
                    ...producto,
                    probabilidad: 0,
                    impacto: producto.impacto !== null && producto.impacto !== undefined 
                        ? producto.impacto 
                        : 4,
                    riesgoFactorProductosServicios: 2, // (0+4)/2 = 2
                    riesgoFactorZonaGeografica: 0
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
            String(producto.probabilidad).toLowerCase().includes(texto) ||
            String(producto.impacto).toLowerCase().includes(texto) ||
            String(producto.riesgoFactorProductosServicios).toLowerCase().includes(texto);
    }, [state.filtro]);

    const productosFiltrados = useMemo(() => {
        return productosConRiesgo.filter(filtrarProductos);
    }, [productosConRiesgo, filtrarProductos]);

    const handleFiltroChange = useCallback((filtro) => {
        setState(prev => ({ ...prev, filtro }));
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
                        probabilidad: item.probabilidad,
                        impacto: item.impacto,
                        promedio_riesgo_producto_servicio: item.riesgoFactorProductosServicios,
                        riesgo_producto_numerico: item.riesgo_producto_numerico,
                        riesgo_cliente_numerico: item.riesgo_cliente_numerico
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
                            probabilidad: productoValidado.probabilidad,
                            impacto: productoValidado.impacto,
                            promedio_riesgo_producto_servicio: productoValidado.riesgoFactorProductosServicios 
                        } : item;
                    }),
                    loading: false
                }));
                
                // Recargar los datos para asegurar consistencia
                await cargarProductos();
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
    }, [productosConRiesgo, cargarProductos]);

    return {
        state,
        productosFiltrados,
        setExporting,
        handleFiltroChange,
        actualizarReporte,
        validarTodosLosRiesgos,
        COLUMNAS_REPORTE: COLUMNAS_REPORTE_PRODUCTOS
    };
};