import { useState, useEffect, useMemo, useCallback } from 'react';
import { databaseService } from '../../services/database';
import {
    COLUMNAS_REPORTE_SUCURSALES,
    COLUMNAS_NUMERICAS_SUCURSALES,
    COLUMNAS_RIESGO_NUMERICO
} from './constantesSucursales';

export const useSucursales = () => {
    const [state, setState] = useState({
        sucursales: [],
        loading: true,
        error: '',
        filtro: '',
        validandoTodos: false
    });

    const [sucursalesConRiesgo, setSucursalesConRiesgo] = useState([]);

    const calcularRiesgosSucursales = useCallback((sucursales) => {
        const sucursalesActualizadas = sucursales.map(sucursal => {
            // Calcular probabilidad (promedio de los valores numéricos de riesgo)
            const valoresRiesgo = COLUMNAS_RIESGO_NUMERICO
                .map(col => sucursal[col])
                .filter(val => val !== null && !isNaN(val));

            const probabilidad = valoresRiesgo.length > 0 ?
                valoresRiesgo.reduce((sum, val) => sum + val, 0) / valoresRiesgo.length :
                0;

            // Usar el valor real de impacto de la base de datos, con fallback a 5 si no existe
            const impacto = sucursal.impacto !== null && sucursal.impacto !== undefined
                ? sucursal.impacto
                : 5;

            // Factor de riesgo es el promedio de probabilidad e impacto
            const factorRiesgo = (probabilidad + impacto) / 2;

            return {
                ...sucursal,
                probabilidad: parseFloat(probabilidad.toFixed(2)),
                impacto: impacto,
                factorRiesgoZonaGeografica: parseFloat(factorRiesgo.toFixed(2))
            };
        });

        setSucursalesConRiesgo(sucursalesActualizadas);
    }, []);

    const validarTodosLosRiesgos = useCallback(async () => {
        try {
            setState(prev => ({ ...prev, validandoTodos: true, error: '' }));

            const sucursalesAValidar = sucursalesConRiesgo.filter(
                s => s.factorRiesgoZonaGeografica !== null &&
                    s.factorRiesgoZonaGeografica !== undefined
            );

            if (sucursalesAValidar.length === 0) {
                return { success: true, message: 'No hay riesgos calculados para validar' };
            }

            let successCount = 0;
            let errorCount = 0;
            const errors = [];

            for (const sucursal of sucursalesAValidar) {
                try {
                    const resultado = await databaseService.actualizarSucursal(sucursal.id, {
                        probabilidad: sucursal.probabilidad,
                        impacto: sucursal.impacto,
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
                    probabilidad: sucursalValidada.probabilidad,
                    impacto: sucursalValidada.impacto,
                    promedio_riesgo_zona_geografica: sucursalValidada.factorRiesgoZonaGeografica
                } : s;
            });

            setState(prev => ({ ...prev, sucursales: nuevasSucursales }));
            calcularRiesgosSucursales(nuevasSucursales);

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
                        calcularRiesgosSucursales(resultado.data);
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
    }, [calcularRiesgosSucursales]);

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

    const handleFiltroChange = useCallback((input) => {
        // Manejar tanto eventos como valores directos
        const filterValue = typeof input === 'object' && input.target
            ? input.target.value
            : input;

        setState(prev => ({ ...prev, filtro: filterValue }));
    }, []);

    const actualizarReporte = useCallback(() => {
        calcularRiesgosSucursales(state.sucursales);
    }, [calcularRiesgosSucursales, state.sucursales]);

    return {
        state,
        sucursalesFiltradas,
        handleFiltroChange,
        actualizarReporte,
        validarTodosLosRiesgos,
        COLUMNAS_REPORTE: COLUMNAS_REPORTE_SUCURSALES
    };
};