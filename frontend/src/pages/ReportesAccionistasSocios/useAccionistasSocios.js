import { useState, useEffect, useMemo, useCallback } from 'react';
import { databaseService } from '../../services/database';
import { COLUMNAS_REPORTE, COLUMNAS_PROBABILIDAD, COLUMNAS_IMPACTO } from './constantes';

export const useAccionistasSocios = () => {
    const [state, setState] = useState({
        accionistasSocios: [],
        loading: true,
        error: '',
        filtro: '',
        validando: false,
        exporting: false
    });

    // Función para establecer estado de exportación
    const setExporting = (exporting) => {
        setState(prev => ({ ...prev, exporting }));
    };

    // Función para limpiar errores
    const limpiarError = useCallback(() => {
        setState(prev => ({ ...prev, error: '' }));
    }, []);

    const [accionistasConRiesgo, setAccionistasConRiesgo] = useState([]);
    const [modalMitigacion, setModalMitigacion] = useState({
        isOpen: false,
        accionistaId: null,
        mitigacionExistente: '',
        mitigacionNumericoExistente: 0,
        mitigacionAdicionalExistente: ''
    });

    // Declarar calcularRiesgos primero para evitar el error de referencia
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

            // Calcular Riesgo Inherente (promedio de probabilidad e impacto)
            const riesgoInherente = (probabilidad + impacto) / 2;

            // Calcular Riesgo Residual considerando la mitigación
            let riesgoResidual = riesgoInherente;
            if (accionista.mitigacion_numerico) {
                riesgoResidual = riesgoInherente - (riesgoInherente * (accionista.mitigacion_numerico / 100));
                riesgoResidual = Math.max(1, riesgoResidual); // Mínimo 1
            }

            return {
                ...accionista,
                probabilidad: parseFloat(probabilidad.toFixed(2)),
                impacto: parseFloat(impacto.toFixed(2)),
                riesgo_inherente: parseFloat(riesgoInherente.toFixed(2)),
                riesgo_residual: parseFloat(riesgoResidual.toFixed(2))
            };
        });

        setAccionistasConRiesgo(accionistasActualizados);
    }, []);

    const abrirModalMitigacion = useCallback((accionista) => {
        setModalMitigacion({
            isOpen: true,
            accionistaId: accionista.id,
            mitigacionExistente: accionista.mitigacion || '',
            mitigacionNumericoExistente: accionista.mitigacion_numerico || 0,
            mitigacionAdicionalExistente: accionista.mitigacion_adicional || ''
        });
    }, []);

    const cerrarModalMitigacion = useCallback(() => {
        setModalMitigacion(prev => ({ ...prev, isOpen: false }));
    }, []);

    const actualizarReporte = useCallback(() => {
        calcularRiesgos(state.accionistasSocios);
    }, [calcularRiesgos, state.accionistasSocios]);

    const handleMitigacionGuardada = useCallback(async (accionistaActualizado) => {
        try {
            // Actualización optimista del estado local
            setState(prev => ({
                ...prev,
                accionistasSocios: prev.accionistasSocios.map(acc =>
                    acc.id === accionistaActualizado.id
                        ? { ...acc, ...accionistaActualizado }
                        : acc
                )
            }));

            // Recalcular riesgos para este accionista específico
            setAccionistasConRiesgo(prev => prev.map(acc => {
                if (acc.id === accionistaActualizado.id) {
                    // Recalcular riesgos con la nueva mitigación
                    const valoresProbabilidad = COLUMNAS_PROBABILIDAD
                        .map(col => acc[col])
                        .filter(val => val !== null && !isNaN(val));

                    const probabilidad = valoresProbabilidad.length > 0 ?
                        valoresProbabilidad.reduce((sum, val) => sum + val, 0) / valoresProbabilidad.length : 0;

                    const valoresImpacto = COLUMNAS_IMPACTO
                        .map(col => acc[col])
                        .filter(val => val !== null && !isNaN(val));

                    const impacto = valoresImpacto.length > 0 ?
                        valoresImpacto.reduce((sum, val) => sum + val, 0) / valoresImpacto.length : 0;

                    const riesgoInherente = (probabilidad + impacto) / 2;

                    let riesgoResidual = riesgoInherente;
                    if (accionistaActualizado.mitigacion_numerico) {
                        riesgoResidual = riesgoInherente - (riesgoInherente * (accionistaActualizado.mitigacion_numerico / 100));
                        riesgoResidual = Math.max(1, riesgoResidual);
                    }

                    return {
                        ...acc,
                        ...accionistaActualizado,
                        probabilidad: parseFloat(probabilidad.toFixed(2)),
                        impacto: parseFloat(impacto.toFixed(2)),
                        riesgo_inherente: parseFloat(riesgoInherente.toFixed(2)),
                        riesgo_residual: parseFloat(riesgoResidual.toFixed(2))
                    };
                }
                return acc;
            }));

        } catch (error) {
            console.error('Error al actualizar estado después de mitigación:', error);
            // Si falla, recargar desde la base de datos
            actualizarReporte();
        }
    }, [actualizarReporte]);

    const validarRiesgos = useCallback(async () => {
        setState(prev => ({ ...prev, validando: true, error: '' }));

        try {
            // Validar cada accionista/socio - CORREGIDO: usar riesgo_residual en lugar de riesgo_residual_accionista_socio
            const promises = accionistasConRiesgo.map(async (accionista) => {
                const datosActualizacion = {
                    probabilidad: accionista.probabilidad,
                    impacto: accionista.impacto,
                    riesgo_inherente: accionista.riesgo_inherente,
                    riesgo_residual: accionista.riesgo_residual,
                    mitigacion: accionista.mitigacion,
                    mitigacion_numerico: accionista.mitigacion_numerico,
                    mitigacion_adicional: accionista.mitigacion_adicional
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

    const handleFiltroChange = useCallback((filterValue) => {
        setState(prev => ({ ...prev, filtro: filterValue }));
    }, []);

    return {
        state,
        accionistasFiltrados,
        handleFiltroChange,
        actualizarReporte,
        validarRiesgos,
        modalMitigacion,
        abrirModalMitigacion,
        cerrarModalMitigacion,
        handleMitigacionGuardada,
        COLUMNAS_REPORTE,
        setExporting,
        limpiarError
    };
};