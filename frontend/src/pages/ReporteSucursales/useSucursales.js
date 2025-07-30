import { useState, useEffect, useMemo, useCallback } from 'react';
import { databaseService } from '../../services/database';
import { COLUMNAS_REPORTE_SUCURSALES, COLUMNAS_NUMERICAS_SUCURSALES } from './constantesSucursales';

export const useSucursales = () => {
    const [state, setState] = useState({
        sucursales: [],
        loading: true,
        error: '',
        filtro: '',
        validandoTodos: false
    });

    const [sucursalesConRiesgo, setSucursalesConRiesgo] = useState([]);

    const calcularRiesgoSucursales = useCallback((sucursales) => {
        const sucursalesActualizadas = sucursales.map(sucursal => {
            const camposNumericos = COLUMNAS_NUMERICAS_SUCURSALES
                .map(col => sucursal[col.id])
                .filter(val => val !== null && !isNaN(val));
                
            const promedio = camposNumericos.length > 0 ? 
                camposNumericos.reduce((sum, val) => sum + val, 0) / camposNumericos.length : 
                0;
            
            return {
                ...sucursal,
                factorRiesgoZonaGeografica: parseFloat(promedio.toFixed(2))
            };
        });
        
        setSucursalesConRiesgo(sucursalesActualizadas);
    }, []);

    const validarTodosLosRiesgos = useCallback(async () => {
        try {
            setState(prev => ({ ...prev, validandoTodos: true, error: '' }));
            
            const sucursalesAValidar = sucursalesConRiesgo.filter(
                s => s.factorRiesgoZonaGeografica && !s.promedio_riesgo_zona_geografica
            );

            if (sucursalesAValidar.length === 0) {
                return { success: true, message: 'No hay registros pendientes de validar' };
            }

            let successCount = 0;
            let errorCount = 0;
            const errors = [];

            for (const sucursal of sucursalesAValidar) {
                try {
                    const resultado = await databaseService.actualizarSucursal(sucursal.id, {
                        promedio_riesgo_zona_geografica: sucursal.factorRiesgoZonaGeografica
                    });

                    if (resultado.success) {
                        successCount++;
                    } else {
                        errorCount++;
                        errors.push(`Error en sucursal ${sucursal.id}: ${resultado.error}`);
                    }
                } catch (err) {
                    errorCount++;
                    errors.push(`Error en sucursal ${sucursal.id}: ${err.message}`);
                }
            }

            // Actualizar el estado con los cambios
            const nuevasSucursales = state.sucursales.map(s => {
                const sucursalValidada = sucursalesAValidar.find(sv => sv.id === s.id);
                return sucursalValidada ? { 
                    ...s, 
                    promedio_riesgo_zona_geografica: sucursalValidada.factorRiesgoZonaGeografica 
                } : s;
            });

            setState(prev => ({ ...prev, sucursales: nuevasSucursales }));
            calcularRiesgoSucursales(nuevasSucursales);

            if (errorCount > 0) {
                const errorMessage = `Se completaron ${successCount} validaciones con éxito. Errores: ${errors.join('; ')}`;
                setState(prev => ({ ...prev, error: errorMessage }));
                return { 
                    success: false, 
                    message: errorMessage,
                    successCount,
                    errorCount
                };
            }

            return { 
                success: true, 
                message: `Todas las ${successCount} validaciones se completaron con éxito`,
                successCount
            };
        } catch (err) {
            setState(prev => ({ ...prev, error: err.message }));
            console.error('Error al validar todos los riesgos:', err);
            return { success: false, error: err.message };
        } finally {
            setState(prev => ({ ...prev, validandoTodos: false }));
        }
    }, [state.sucursales, sucursalesConRiesgo]);

    useEffect(() => {
        let isMounted = true;

        const cargarSucursales = async () => {
            try {
                setState(prev => ({ ...prev, loading: true, error: '' }));
                const resultado = await databaseService.listarSucursales();

                if (isMounted) {
                    if (resultado.success) {
                        setState(prev => ({
                            ...prev,
                            sucursales: resultado.data,
                            loading: false
                        }));
                        calcularRiesgoSucursales(resultado.data);
                    } else {
                        setState(prev => ({
                            ...prev,
                            error: resultado.error || 'Error al cargar sucursales',
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
                    console.error('Error al cargar sucursales:', err);
                }
            }
        };

        cargarSucursales();

        return () => {
            isMounted = false;
        };
    }, [calcularRiesgoSucursales]);

    const filtrarSucursales = useCallback((sucursal) => {
        if (!state.filtro) return true;
        const texto = state.filtro.toLowerCase();
        return COLUMNAS_REPORTE_SUCURSALES.some(col =>
            sucursal[col.id] &&
            String(sucursal[col.id]).toLowerCase().includes(texto)
        );
    }, [state.filtro]);

    const sucursalesFiltradas = useMemo(() => {
        return sucursalesConRiesgo.filter(filtrarSucursales);
    }, [sucursalesConRiesgo, filtrarSucursales]);

    const handleFiltroChange = useCallback((e) => {
        setState(prev => ({ ...prev, filtro: e.target.value }));
    }, []);

    const actualizarReporte = useCallback(() => {
        calcularRiesgoSucursales(state.sucursales);
    }, [calcularRiesgoSucursales, state.sucursales]);

    return {
        state,
        sucursalesFiltradas,
        handleFiltroChange,
        actualizarReporte,
        validarTodosLosRiesgos,
        COLUMNAS_REPORTE: [...COLUMNAS_REPORTE_SUCURSALES, 
            { id: 'factorRiesgoZonaGeografica', nombre: 'Factor de riesgo Zona Geográfica' },
            { id: 'promedio_riesgo_zona_geografica', nombre: 'Promedio Riesgo Validado' }
        ]
    };
};