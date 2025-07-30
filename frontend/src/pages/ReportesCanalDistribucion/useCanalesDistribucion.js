import { useState, useEffect, useMemo, useCallback } from 'react';
import { databaseService } from '../../services/database';
import { COLUMNAS_REPORTE_CANALES, COLUMNAS_NUMERICAS_CANALES } from './constantes';

export const useCanalesDistribucion = () => {
    const [state, setState] = useState({
        canales: [],
        loading: true,
        error: '',
        filtro: ''
    });

    const [canalesConRiesgo, setCanalesConRiesgo] = useState([]);

    const calcularRiesgoCanales = useCallback((canales) => {
        const canalesActualizados = canales.map(canal => {
            // Asegurar que todos los campos numéricos sean números válidos
            const camposNumericos = COLUMNAS_NUMERICAS_CANALES
                .map(col => {
                    const valor = canal[col.id];
                    return valor !== null && !isNaN(valor) ? parseFloat(valor) : 0;
                })
                .filter(val => !isNaN(val));
                
            const promedio = camposNumericos.length > 0 ? 
                camposNumericos.reduce((sum, val) => sum + val, 0) / camposNumericos.length : 
                0;
            
            // Asegurar que el riesgo interno es numérico
            const riesgoInterno = parseFloat(canal.promedio_riesgo_cliente_interno) || 0;
            
            return {
                ...canal,
                factorRiesgoCanal: parseFloat(promedio.toFixed(2)),
                promedio_riesgo_cliente_interno: riesgoInterno,
                riesgoTotal: parseFloat((promedio + riesgoInterno) / 2).toFixed(2)
            };
        });
        
        setCanalesConRiesgo(canalesActualizados);
    }, []);

    const validarTodo = useCallback(async () => {
        try {
            setState(prev => ({ ...prev, loading: true, error: '' }));
            
            // Filtrar solo los que necesitan validación
            const canalesAValidar = canalesConRiesgo.filter(canal => {
                const riesgoCalculado = canal.factorRiesgoCanal;
                const riesgoValidado = canal.promedio_riesgo_canal_distribucion;
                
                return riesgoValidado === null || 
                       riesgoValidado === undefined || 
                       Math.abs(riesgoValidado - riesgoCalculado) > 0.01;
            });

            if (canalesAValidar.length === 0) {
                setState(prev => ({ ...prev, loading: false }));
                return { success: true, message: 'No hay registros para validar' };
            }

            // Preparar las actualizaciones con verificación de datos
            const actualizaciones = canalesAValidar.map(canal => {
                return {
                    id: canal.id,
                    data: {
                        promedio_riesgo_canal_distribucion: canal.factorRiesgoCanal,
                        promedio_riesgo_cliente_interno: parseFloat(canal.promedio_riesgo_cliente_interno) || 0
                    }
                };
            });

            // Ejecutar actualizaciones con manejo de errores individual
            const resultados = await Promise.all(
                actualizaciones.map(act => 
                    databaseService.actualizarClienteExterno(act.id, act.data)
                        .catch(err => {
                            console.error(`Error al actualizar cliente ${act.id}:`, err);
                            return { success: false, error: err.message };
                        })
                )
            );

            // Verificar resultados
            const exitosas = resultados.filter(r => r.success);
            const fallidas = resultados.filter(r => !r.success);
            
            if (fallidas.length > 0) {
                console.error('Registros fallidos:', fallidas);
            }

            // Actualizar el estado solo con los exitosos
            const nuevosCanales = state.canales.map(canal => {
                const actualizado = canalesAValidar.find(c => c.id === canal.id);
                if (actualizado) {
                    return {
                        ...canal,
                        promedio_riesgo_canal_distribucion: actualizado.factorRiesgoCanal,
                        promedio_riesgo_cliente_interno: actualizado.promedio_riesgo_cliente_interno
                    };
                }
                return canal;
            });
            
            setState(prev => ({ ...prev, canales: nuevosCanales }));
            calcularRiesgoCanales(nuevosCanales);
            
            return { 
                success: exitosas.length > 0,
                message: `Se validaron ${exitosas.length} de ${actualizaciones.length} registros`,
                details: fallidas.length > 0 ? 
                    `Fallaron ${fallidas.length} registros` : undefined
            };
        } catch (err) {
            setState(prev => ({ ...prev, error: err.message }));
            console.error('Error al validar todo:', err);
            return { success: false, error: err.message };
        } finally {
            setState(prev => ({ ...prev, loading: false }));
        }
    }, [state.canales, canalesConRiesgo, calcularRiesgoCanales]);

    const validarTodosLosRiesgos = useCallback(async () => {
        try {
            setState(prev => ({ ...prev, loading: true, error: '' }));
            
            // Filtrar canales que necesitan actualización de riesgo
            const canalesAValidar = canalesConRiesgo.filter(canal => {
                const riesgoCalculado = canal.factorRiesgoCanal;
                const riesgoValidado = canal.promedio_riesgo_canal_distribucion;
                
                return riesgoValidado === null || 
                       riesgoValidado === undefined || 
                       Math.abs(riesgoValidado - riesgoCalculado) > 0.01;
            });

            if (canalesAValidar.length === 0) {
                setState(prev => ({ ...prev, loading: false }));
                return { success: true, message: 'Todos los riesgos ya están validados' };
            }

            // Preparar solo la actualización del riesgo
            const actualizaciones = canalesAValidar.map(canal => ({
                id: canal.id,
                data: { promedio_riesgo_canal_distribucion: canal.factorRiesgoCanal }
            }));

            // Ejecutar actualizaciones
            const resultados = await Promise.all(
                actualizaciones.map(act => 
                    databaseService.actualizarClienteExterno(act.id, act.data)
                        .catch(err => {
                            console.error(`Error al actualizar cliente ${act.id}:`, err);
                            return { success: false, error: err.message };
                        })
                )
            );

            // Procesar resultados
            const exitosas = resultados.filter(r => r && r.success);
            const fallidas = resultados.filter(r => !r || !r.success);
            
            if (fallidas.length > 0) {
                console.error('Registros fallidos:', fallidas);
            }

            // Actualizar estado local
            const nuevosCanales = state.canales.map(canal => {
                const canalActualizado = canalesAValidar.find(c => c.id === canal.id);
                if (canalActualizado) {
                    return {
                        ...canal,
                        promedio_riesgo_canal_distribucion: canalActualizado.factorRiesgoCanal
                    };
                }
                return canal;
            });
            
            setState(prev => ({ ...prev, canales: nuevosCanales }));
            calcularRiesgoCanales(nuevosCanales);
            
            return { 
                success: exitosas.length > 0,
                message: `Se validaron los riesgos de ${exitosas.length} de ${actualizaciones.length} clientes`,
                details: fallidas.length > 0 ? 
                    `Fallaron ${fallidas.length} registros` : undefined
            };
        } catch (err) {
            setState(prev => ({ ...prev, error: err.message }));
            console.error('Error al validar riesgos:', err);
            return { success: false, error: err.message };
        } finally {
            setState(prev => ({ ...prev, loading: false }));
        }
    }, [state.canales, canalesConRiesgo, calcularRiesgoCanales]);

    useEffect(() => {
        let isMounted = true;

        const cargarCanales = async () => {
            try {
                setState(prev => ({ ...prev, loading: true, error: '' }));
                const resultado = await databaseService.listarClientesExternosConRiesgoInterno();

                if (isMounted) {
                    if (resultado.success) {
                        setState(prev => ({
                            ...prev,
                            canales: resultado.data,
                            loading: false
                        }));
                        calcularRiesgoCanales(resultado.data);
                    } else {
                        setState(prev => ({
                            ...prev,
                            error: resultado.error || 'Error al cargar canales',
                            loading: false
                        }));
                    }
                }
            } catch (err) {
                if (isMounted) {
                    setState(prev => ({
                        ...prev,
                        error: 'Error de conexión con la base de datos',
                        loading: false
                    }));
                    console.error('Error al cargar canales:', err);
                }
            }
        };

        cargarCanales();

        return () => {
            isMounted = false;
        };
    }, [calcularRiesgoCanales]);

    const filtrarCanales = useCallback((canal) => {
        if (!state.filtro) return true;
        const texto = state.filtro.toLowerCase();
        return COLUMNAS_REPORTE_CANALES.some(col =>
            canal[col.id] &&
            String(canal[col.id]).toLowerCase().includes(texto)
        );
    }, [state.filtro]);

    const canalesFiltrados = useMemo(() => {
        return canalesConRiesgo.filter(filtrarCanales);
    }, [canalesConRiesgo, filtrarCanales]);

    const handleFiltroChange = useCallback((e) => {
        setState(prev => ({ ...prev, filtro: e.target.value }));
    }, []);

    const actualizarReporte = useCallback(() => {
        calcularRiesgoCanales(state.canales);
    }, [calcularRiesgoCanales, state.canales]);

    return {
        state,
        canalesFiltrados,
        handleFiltroChange,
        actualizarReporte,
        validarTodo,
        validarTodosLosRiesgos,
        COLUMNAS_REPORTE: [...COLUMNAS_REPORTE_CANALES, 
            { id: 'factorRiesgoCanal', nombre: 'Factor de riesgo Canales' },
            { id: 'promedio_riesgo_canal_distribucion', nombre: 'Promedio Riesgo Validado' },
            { id: 'riesgoTotal', nombre: 'Riesgo Total' }
        ]
    };
};