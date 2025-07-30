import { useState, useEffect, useMemo, useCallback } from 'react';
import { databaseService } from '../../services/database';
import { COLUMNAS_REPORTE, COLUMNAS_NUMERICAS } from './constantes';

export const useAccionistasSocios = () => {
    const [state, setState] = useState({
        accionistasSocios: [],
        loading: true,
        error: '',
        filtro: '',
        validando: false
    });

    const [accionistasConRiesgo, setAccionistasConRiesgo] = useState([]);

    const calcularRiesgoAccionistas = useCallback((accionistas) => {
        const accionistasActualizados = accionistas.map(accionista => {
            const camposNumericos = COLUMNAS_NUMERICAS
                .map(col => accionista[col.id])
                .filter(val => val !== null && !isNaN(val));
                
            const promedio = camposNumericos.length > 0 ? 
                camposNumericos.reduce((sum, val) => sum + val, 0) / camposNumericos.length : 
                0;
            
            return {
                ...accionista,
                factorRiesgoAccionistaSocio: parseFloat(promedio.toFixed(2))
            };
        });
        
        setAccionistasConRiesgo(accionistasActualizados);
    }, []);

    const validarRiesgos = useCallback(async () => {
        setState(prev => ({ ...prev, validando: true, error: '' }));
        
        try {
            // Validar cada accionista/socio
            const promises = accionistasConRiesgo.map(async (accionista) => {
                if (accionista.factorRiesgoAccionistaSocio !== undefined) {
                    await databaseService.actualizarAccionistaSocio(
                        accionista.id,
                        { promedio_riesgo_accionista_socio: accionista.factorRiesgoAccionistaSocio }
                    );
                }
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
                calcularRiesgoAccionistas(resultado.data);
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
    }, [accionistasConRiesgo, calcularRiesgoAccionistas]);

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
                        calcularRiesgoAccionistas(resultado.data);
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
    }, [calcularRiesgoAccionistas]);

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
        calcularRiesgoAccionistas(state.accionistasSocios);
    }, [calcularRiesgoAccionistas, state.accionistasSocios]);

    return {
        state,
        accionistasFiltrados,
        handleFiltroChange,
        actualizarReporte,
        validarRiesgos,
        COLUMNAS_REPORTE: [...COLUMNAS_REPORTE, 
            { id: 'factorRiesgoAccionistaSocio', nombre: 'Factor Riesgo Accionista/Socio' }
        ]
    };
};