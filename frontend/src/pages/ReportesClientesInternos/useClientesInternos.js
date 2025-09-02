import { useState, useEffect, useMemo, useCallback } from 'react';
import { databaseService } from '../../services/database';
import { COLUMNAS_REPORTE, COLUMNAS_PROBABILIDAD, COLUMNAS_IMPACTO } from './constantes';

export const useClientesInternos = () => {
    const [state, setState] = useState({
        clientesInternos: [],
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

    const [clientesConRiesgo, setClientesConRiesgo] = useState([]);
    const [modalMitigacion, setModalMitigacion] = useState({
        isOpen: false,
        clienteId: null,
        mitigacionExistente: '',
        mitigacionNumericoExistente: 0,
        mitigacionAdicionalExistente: ''
    });

    // Función para calcular riesgos (igual que en accionistas/socios)
    const calcularRiesgos = useCallback((clientes) => {
        const clientesActualizados = clientes.map(cliente => {
            // Calcular Probabilidad
            const valoresProbabilidad = COLUMNAS_PROBABILIDAD
                .map(col => cliente[col])
                .filter(val => val !== null && !isNaN(val));

            const probabilidad = valoresProbabilidad.length > 0 ?
                valoresProbabilidad.reduce((sum, val) => sum + val, 0) / valoresProbabilidad.length :
                0;

            // Calcular Impacto
            const valoresImpacto = COLUMNAS_IMPACTO
                .map(col => cliente[col])
                .filter(val => val !== null && !isNaN(val));

            const impacto = valoresImpacto.length > 0 ?
                valoresImpacto.reduce((sum, val) => sum + val, 0) / valoresImpacto.length :
                0;

            // Calcular Riesgo Inherente (promedio de probabilidad e impacto)
            const riesgoInherente = (probabilidad + impacto) / 2;

            // Calcular Riesgo Residual considerando la mitigación
            let riesgoResidual = riesgoInherente;
            if (cliente.mitigacion_numerico) {
                riesgoResidual = riesgoInherente - (riesgoInherente * (cliente.mitigacion_numerico / 100));
                riesgoResidual = Math.max(1, riesgoResidual); // Mínimo 1
            }

            return {
                ...cliente,
                probabilidad: parseFloat(probabilidad.toFixed(2)),
                impacto: parseFloat(impacto.toFixed(2)),
                riesgo_inherente: parseFloat(riesgoInherente.toFixed(2)),
                riesgo_residual: parseFloat(riesgoResidual.toFixed(2))
            };
        });

        setClientesConRiesgo(clientesActualizados);
    }, []);

    const abrirModalMitigacion = useCallback((cliente) => {
        setModalMitigacion({
            isOpen: true,
            clienteId: cliente.id,
            mitigacionExistente: cliente.mitigacion || '',
            mitigacionNumericoExistente: cliente.mitigacion_numerico || 0,
            mitigacionAdicionalExistente: cliente.mitigacion_adicional || ''
        });
    }, []);

    const cerrarModalMitigacion = useCallback(() => {
        setModalMitigacion(prev => ({ ...prev, isOpen: false }));
    }, []);

    const actualizarReporte = useCallback(() => {
        calcularRiesgos(state.clientesInternos);
    }, [calcularRiesgos, state.clientesInternos]);

    const handleMitigacionGuardada = useCallback(async (clienteActualizado) => {
        try {
            // Actualización optimista del estado local
            setState(prev => ({
                ...prev,
                clientesInternos: prev.clientesInternos.map(cli =>
                    cli.id === clienteActualizado.id 
                        ? { ...cli, ...clienteActualizado }
                        : cli
                )
            }));
            
            // Recalcular riesgos para este cliente específico
            setClientesConRiesgo(prev => prev.map(cli => {
                if (cli.id === clienteActualizado.id) {
                    // Recalcular riesgos con la nueva mitigación
                    const valoresProbabilidad = COLUMNAS_PROBABILIDAD
                        .map(col => cli[col])
                        .filter(val => val !== null && !isNaN(val));
                    
                    const probabilidad = valoresProbabilidad.length > 0 ? 
                        valoresProbabilidad.reduce((sum, val) => sum + val, 0) / valoresProbabilidad.length : 0;

                    const valoresImpacto = COLUMNAS_IMPACTO
                        .map(col => cli[col])
                        .filter(val => val !== null && !isNaN(val));
                    
                    const impacto = valoresImpacto.length > 0 ? 
                        valoresImpacto.reduce((sum, val) => sum + val, 0) / valoresImpacto.length : 0;

                    const riesgoInherente = (probabilidad + impacto) / 2;
                    
                    let riesgoResidual = riesgoInherente;
                    if (clienteActualizado.mitigacion_numerico) {
                        riesgoResidual = riesgoInherente - (riesgoInherente * (clienteActualizado.mitigacion_numerico / 100));
                        riesgoResidual = Math.max(1, riesgoResidual);
                    }

                    return {
                        ...cli,
                        ...clienteActualizado,
                        probabilidad: parseFloat(probabilidad.toFixed(2)),
                        impacto: parseFloat(impacto.toFixed(2)),
                        riesgo_inherente: parseFloat(riesgoInherente.toFixed(2)),
                        riesgo_residual: parseFloat(riesgoResidual.toFixed(2))
                    };
                }
                return cli;
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
            // Validar cada cliente interno
            const promises = clientesConRiesgo.map(async (cliente) => {
                const datosActualizacion = {
                    probabilidad: cliente.probabilidad,
                    impacto: cliente.impacto,
                    riesgo_inherente: cliente.riesgo_inherente,
                    riesgo_residual: cliente.riesgo_residual,
                    mitigacion: cliente.mitigacion,
                    mitigacion_numerico: cliente.mitigacion_numerico,
                    mitigacion_adicional: cliente.mitigacion_adicional
                };
                
                return databaseService.actualizarClienteInterno(cliente.id, datosActualizacion);
            });
            
            await Promise.all(promises);
            
            // Recargar los datos después de la validación
            const resultado = await databaseService.listarClientesInternos();
            if (resultado.success) {
                setState(prev => ({
                    ...prev,
                    clientesInternos: resultado.data,
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
    }, [clientesConRiesgo, calcularRiesgos]);

    useEffect(() => {
        let isMounted = true;

        const cargarClientes = async () => {
            try {
                setState(prev => ({ ...prev, loading: true, error: '' }));
                const resultado = await databaseService.listarClientesInternos();

                if (isMounted) {
                    if (resultado.success) {
                        setState(prev => ({
                            ...prev,
                            clientesInternos: resultado.data,
                            loading: false
                        }));
                        calcularRiesgos(resultado.data);
                    } else {
                        setState(prev => ({
                            ...prev,
                            error: resultado.error || 'Error al cargar clientes internos',
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
                    console.error('Error al cargar clientes internos:', err);
                }
            }
        };

        cargarClientes();

        return () => {
            isMounted = false;
        };
    }, [calcularRiesgos]);

    const filtrarClientes = useCallback((cliente) => {
        if (!state.filtro) return true;
        const texto = state.filtro.toLowerCase();
        return COLUMNAS_REPORTE.some(col =>
            cliente[col.id] &&
            String(cliente[col.id]).toLowerCase().includes(texto)
        );
    }, [state.filtro]);

    const clientesFiltrados = useMemo(() => {
        return clientesConRiesgo.filter(filtrarClientes);
    }, [clientesConRiesgo, filtrarClientes]);

    const handleFiltroChange = useCallback((filterValue) => {
        setState(prev => ({ ...prev, filtro: filterValue }));
    }, []);

    return {
        state,
        clientesFiltrados,
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