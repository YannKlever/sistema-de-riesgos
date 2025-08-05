import { useState, useEffect, useMemo, useCallback } from 'react';
import { databaseService } from '../../services/database';
import { COLUMNAS_REPORTE_CANALES, COLUMNAS_CALCULO_RIESGO } from './constantes';

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
            // Obtener los 5 valores necesarios para el cálculo
            const valoresRiesgo = COLUMNAS_CALCULO_RIESGO.map(col => {
                const valor = canal[col];
                return valor !== null && !isNaN(valor) ? parseFloat(valor) : 0;
            });

            // Calcular promedio (suma / 5)
            const suma = valoresRiesgo.reduce((total, valor) => total + valor, 0);
            const riesgoCanalDistribucion = parseFloat((suma / 5).toFixed(2));

            return {
                ...canal,
                riesgoCanalDistribucion,
                promedio_riesgo_cliente_interno: parseFloat(canal.promedio_riesgo_cliente_interno) || 0
            };
        });
        
        setCanalesConRiesgo(canalesActualizados);
    }, []);

    const cargarCanales = useCallback(async () => {
        try {
            setState(prev => ({ ...prev, loading: true, error: '' }));
            const resultado = await databaseService.listarClientesExternosConRiesgoInterno();

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
        } catch (err) {
            setState(prev => ({
                ...prev,
                error: 'Error de conexión con la base de datos',
                loading: false
            }));
            console.error('Error al cargar canales:', err);
        }
    }, [calcularRiesgoCanales]);

    useEffect(() => {
        cargarCanales();
    }, [cargarCanales]);

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

    const handleFiltroChange = useCallback((valor) => {
        setState(prev => ({ ...prev, filtro: valor }));
    }, []);

    const actualizarReporte = useCallback(() => {
        calcularRiesgoCanales(state.canales);
    }, [calcularRiesgoCanales, state.canales]);

    const validarTodosLosRiesgos = useCallback(async () => {
        try {
            setState(prev => ({ ...prev, loading: true, error: '' }));
            
            const canalesAValidar = canalesConRiesgo.filter(
                item => item.riesgoCanalDistribucion !== null && 
                       item.riesgoCanalDistribucion !== undefined
            );

            if (canalesAValidar.length === 0) {
                setState(prev => ({ ...prev, loading: false }));
                return { success: false, error: 'No hay riesgos calculados para validar' };
            }

            const resultados = await Promise.all(
                canalesAValidar.map(item => 
                    databaseService.actualizarClienteExterno(item.id, {
                        promedio_riesgo_canal_distribucion: item.riesgoCanalDistribucion
                    })
                )
            );

            const todosExitosos = resultados.every(r => r.success);
            
            if (todosExitosos) {
                setState(prev => ({
                    ...prev,
                    canales: prev.canales.map(item => {
                        const canalValidado = canalesAValidar.find(p => p.id === item.id);
                        return canalValidado ? { 
                            ...item, 
                            promedio_riesgo_canal_distribucion: canalValidado.riesgoCanalDistribucion 
                        } : item;
                    }),
                    loading: false
                }));
                
                calcularRiesgoCanales(state.canales);
                return { success: true };
            } else {
                const errores = resultados.filter(r => !r.success).map(r => r.error);
                setState(prev => ({ 
                    ...prev, 
                    error: 'Algunos canales no se validaron: ' + errores.join(', '),
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
    }, [calcularRiesgoCanales, canalesConRiesgo, state.canales]);

    return {
        state,
        canalesFiltrados,
        handleFiltroChange,
        actualizarReporte,
        validarTodosLosRiesgos,
        COLUMNAS_REPORTE: [
            ...COLUMNAS_REPORTE_CANALES,
            { id: 'riesgoCanalDistribucion', nombre: 'Riesgo Canal Distribución' },
            { id: 'promedio_riesgo_canal_distribucion', nombre: 'Riesgo Validado' }
        ]
    };
};