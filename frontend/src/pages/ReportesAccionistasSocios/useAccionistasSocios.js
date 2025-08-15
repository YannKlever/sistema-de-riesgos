import { useState, useEffect, useMemo, useCallback } from 'react';
import { databaseService } from '../../services/database';
import { COLUMNAS_REPORTE, COLUMNAS_PROBABILIDAD, COLUMNAS_IMPACTO } from './constantes';

export const useAccionistasSocios = () => {
    const [state, setState] = useState({
        accionistasSocios: [],
        loading: true,
        error: '',
        filtro: '',
        validando: false
    });

    const [accionistasConRiesgo, setAccionistasConRiesgo] = useState([]);

    const calcularRiesgos = useCallback((accionistas) => {
        const accionistasActualizados = accionistas.map(accionista => {
            // Calcular Probabilidad
            const valoresProbabilidad = COLUMNAS_PROBABILIDAD
                .map(col => accionista[col])
                .filter(val => val !== null && !isNaN(val));
            
            const probabilidad = valoresProbabilidad.length > 0 ? 
                valoresProbabilidad.reduce((sum, val) => sum + val, 0) / valoresProbabilidad.length : 
                0;

            // Calcular Impacto
            const valoresImpacto = COLUMNAS_IMPACTO
                .map(col => accionista[col])
                .filter(val => val !== null && !isNaN(val));
            
            const impacto = valoresImpacto.length > 0 ? 
                valoresImpacto.reduce((sum, val) => sum + val, 0) / valoresImpacto.length : 
                0;

            // Calcular Factor Riesgo (promedio de probabilidad e impacto)
            const factorRiesgo = (probabilidad + impacto) / 2;

            return {
                ...accionista,
                probabilidad: parseFloat(probabilidad.toFixed(2)),
                impacto: parseFloat(impacto.toFixed(2)),
                factorRiesgoAccionistaSocio: parseFloat(factorRiesgo.toFixed(2))
            };
        });
        
        setAccionistasConRiesgo(accionistasActualizados);
    }, []);

    const validarRiesgos = useCallback(async () => {
        setState(prev => ({ ...prev, validando: true, error: '' }));
        
        try {
            // Validar cada accionista/socio
            const promises = accionistasConRiesgo.map(async (accionista) => {
                const datosActualizacion = {
                    probabilidad: accionista.probabilidad,
                    impacto: accionista.impacto,
                    promedio_riesgo_accionista_socio: accionista.factorRiesgoAccionistaSocio
                };
                
                return databaseService.actualizarAccionistaSocio(accionista.id, datosActualizacion);
            });
            
            await Promise.all(promises);
            
            // Recargar los datos después de la validación
            const resultado = await databaseService.listarAccionistasSocios();
            if (resultado.success) {
                setState(prev => ({
                    ...prev,
                    accionistasSocios: resultado.data,
                    validando: false
                }));
                calcularRiesgos(resultado.data);
            } else {
                setState(prev => ({
                    ...prev,
                    error: resultado.error || 'Error al actualizar riesgos',
                    validando: false
                }));
            }
        } catch (err) {
            setState(prev => ({
                ...prev,
                error: 'Error al validar riesgos: ' + err.message,
                validando: false
            }));
            console.error('Error al validar riesgos:', err);
        }
    }, [accionistasConRiesgo, calcularRiesgos]);

    useEffect(() => {
        let isMounted = true;

        const cargarAccionistas = async () => {
            try {
                setState(prev => ({ ...prev, loading: true, error: '' }));
                const resultado = await databaseService.listarAccionistasSocios();

                if (isMounted) {
                    if (resultado.success) {
                        setState(prev => ({
                            ...prev,
                            accionistasSocios: resultado.data,
                            loading: false
                        }));
                        calcularRiesgos(resultado.data);
                    } else {
                        setState(prev => ({
                            ...prev,
                            error: resultado.error || 'Error al cargar accionistas/socios',
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
                    console.error('Error al cargar accionistas/socios:', err);
                }
            }
        };

        cargarAccionistas();

        return () => {
            isMounted = false;
        };
    }, [calcularRiesgos]);

    const filtrarAccionistas = useCallback((accionista) => {
        if (!state.filtro) return true;
        const texto = state.filtro.toLowerCase();
        return COLUMNAS_REPORTE.some(col =>
            accionista[col.id] &&
            String(accionista[col.id]).toLowerCase().includes(texto)
        );
    }, [state.filtro]);

    const accionistasFiltrados = useMemo(() => {
        return accionistasConRiesgo.filter(filtrarAccionistas);
    }, [accionistasConRiesgo, filtrarAccionistas]);

    const handleFiltroChange = useCallback((e) => {
        setState(prev => ({ ...prev, filtro: e.target.value }));
    }, []);

    const actualizarReporte = useCallback(() => {
        calcularRiesgos(state.accionistasSocios);
    }, [calcularRiesgos, state.accionistasSocios]);

    return {
        state,
        accionistasFiltrados,
        handleFiltroChange,
        actualizarReporte,
        validarRiesgos,
        COLUMNAS_REPORTE
    };
};