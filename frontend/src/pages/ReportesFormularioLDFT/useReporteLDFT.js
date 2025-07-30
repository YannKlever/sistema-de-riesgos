import { useState, useEffect, useMemo, useCallback } from 'react';
import { databaseService } from '../../services/database';
import { COLUMNAS_REPORTE_LDFT, COLUMNAS_NUMERICAS_LDFT } from './constantesLDFT';

export const useReportesLDFT = () => {
    const [state, setState] = useState({
        evaluaciones: [],
        loading: true,
        error: '',
        filtro: ''
    });

    const [evaluacionesConRiesgo, setEvaluacionesConRiesgo] = useState([]);

    const calcularRiesgoEvaluaciones = useCallback((evaluaciones) => {
        const evaluacionesActualizadas = evaluaciones.map(evaluacion => {
            const camposNumericos = COLUMNAS_NUMERICAS_LDFT
                .map(col => evaluacion[col.id])
                .filter(val => val !== null && !isNaN(val));
            
            const promedio = camposNumericos.length > 0 ? 
                camposNumericos.reduce((sum, val) => sum + val, 0) / camposNumericos.length : 0;
            
            return {
                ...evaluacion,
                promedio_frontend: parseFloat(promedio.toFixed(2))
            };
        });
        
        setEvaluacionesConRiesgo(evaluacionesActualizadas);
    }, []);

    const actualizarEvaluacionLocal = useCallback((id, nuevosValores) => {
        setEvaluacionesConRiesgo(prev => prev.map(item => 
            item.id === id ? { ...item, ...nuevosValores } : item
        ));
    }, []);

    useEffect(() => {
        let isMounted = true;

        const cargarEvaluaciones = async () => {
            try {
                setState(prev => ({ ...prev, loading: true, error: '' }));
                const resultado = await databaseService.listarEvaluacionesLDFT();

                if (isMounted) {
                    if (resultado.success) {
                        setState(prev => ({
                            ...prev,
                            evaluaciones: resultado.data,
                            loading: false
                        }));
                        calcularRiesgoEvaluaciones(resultado.data);
                    } else {
                        setState(prev => ({
                            ...prev,
                            error: resultado.error || 'Error al cargar evaluaciones LD/FT',
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
                    console.error('Error al cargar evaluaciones LD/FT:', err);
                }
            }
        };

        cargarEvaluaciones();

        return () => {
            isMounted = false;
        };
    }, [calcularRiesgoEvaluaciones]);

    const filtrarEvaluaciones = useCallback((evaluacion) => {
        if (!state.filtro) return true;
        const texto = state.filtro.toLowerCase();
        return COLUMNAS_REPORTE_LDFT.some(col =>
            evaluacion[col.id] &&
            String(evaluacion[col.id]).toLowerCase().includes(texto)
        );
    }, [state.filtro]);

    const evaluacionesFiltradas = useMemo(() => {
        return evaluacionesConRiesgo.filter(filtrarEvaluaciones);
    }, [evaluacionesConRiesgo, filtrarEvaluaciones]);

    const handleFiltroChange = useCallback((e) => {
        setState(prev => ({ ...prev, filtro: e.target.value }));
    }, []);

    const actualizarReporte = useCallback(() => {
        calcularRiesgoEvaluaciones(state.evaluaciones);
    }, [calcularRiesgoEvaluaciones, state.evaluaciones]);

    return {
        state,
        evaluacionesFiltradas,
        handleFiltroChange,
        actualizarReporte,
        actualizarEvaluacionLocal,
        COLUMNAS_REPORTE: COLUMNAS_REPORTE_LDFT
    };
};