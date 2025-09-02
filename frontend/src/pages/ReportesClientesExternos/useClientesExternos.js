import { useState, useEffect, useMemo, useCallback } from 'react';
import { databaseService } from '../../services/database';
import {
    COLUMNAS_REPORTE,
    COLUMNAS_PROBABILIDAD,
    COLUMNAS_IMPACTO
} from './constantes';

export const useClientesExternos = () => {
    const [state, setState] = useState({
        clientes: [],
        loading: true,
        error: '',
        filtro: '',
        validando: false,
        exporting: false
    });

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

    const calcularRiesgoClientes = useCallback(async (clientes) => {
        try {
            setState(prev => ({ ...prev, loading: true }));

            const resultadoRiesgos = await databaseService.listarClientesExternosConRiesgoProductoServicio();

            if (!resultadoRiesgos.success) {
                throw new Error(resultadoRiesgos.error || 'Error al obtener riesgos de producto/servicio');
            }

            const clientesConRiesgoPS = resultadoRiesgos.data;

            const clientesActualizados = clientes.map(cliente => {
                const clienteConRiesgo = clientesConRiesgoPS.find(c => c.id === cliente.id);
                const riesgoProductoServicio = clienteConRiesgo
                    ? (clienteConRiesgo.promedio_riesgo_producto_servicio || 0)
                    : 0;

                // Calcular Probabilidad
                const valoresProbabilidad = COLUMNAS_PROBABILIDAD
                    .map(col => {
                        if (col === 'promedio_riesgo_producto_servicio') {
                            return riesgoProductoServicio;
                        }
                        return cliente[col] || 0;
                    })
                    .filter(val => val !== null && !isNaN(val));

                const probabilidad = valoresProbabilidad.length > 0 ?
                    valoresProbabilidad.reduce((sum, val) => sum + val, 0) / valoresProbabilidad.length : 0;

                // Calcular Impacto
                const valoresImpacto = COLUMNAS_IMPACTO
                    .map(col => cliente[col] || 0)
                    .filter(val => val !== null && !isNaN(val));

                const impacto = valoresImpacto.length > 0 ?
                    valoresImpacto.reduce((sum, val) => sum + val, 0) / valoresImpacto.length : 0;

                // Calcular Riesgo Inherente
                const riesgoInherente = (probabilidad + impacto) / 2;

                // Calcular Riesgo Residual
                let riesgoResidual = riesgoInherente;
                if (cliente.mitigacion_numerico) {
                    riesgoResidual = riesgoInherente - (riesgoInherente * (cliente.mitigacion_numerico / 100));
                    riesgoResidual = Math.max(1, riesgoResidual);
                }

                return {
                    ...cliente,
                    probabilidad: parseFloat(probabilidad.toFixed(2)),
                    impacto: parseFloat(impacto.toFixed(2)),
                    riesgo_inherente: parseFloat(riesgoInherente.toFixed(2)),
                    riesgo_residual: parseFloat(riesgoResidual.toFixed(2)),
                    promedio_riesgo_producto_servicio: parseFloat(riesgoProductoServicio.toFixed(2))
                };
            });

            setClientesConRiesgo(clientesActualizados);
            setState(prev => ({ ...prev, loading: false }));
        } catch (error) {
            console.error('Error al calcular riesgos:', error);
            setState(prev => ({
                ...prev,
                error: 'Error al calcular riesgos: ' + error.message,
                loading: false
            }));
        }
    }, []);

    const cargarClientes = useCallback(async () => {
        try {
            setState(prev => ({ ...prev, loading: true, error: '' }));
            const resultado = await databaseService.listarClientesExternos();

            if (resultado.success) {
                setState(prev => ({
                    ...prev,
                    clientes: resultado.data,
                    loading: false
                }));
                calcularRiesgoClientes(resultado.data);
            } else {
                setState(prev => ({
                    ...prev,
                    error: resultado.error || 'Error al cargar clientes',
                    loading: false
                }));
            }
        } catch (err) {
            setState(prev => ({
                ...prev,
                error: 'Error de conexión con la base de datos: ' + err.message,
                loading: false
            }));
            console.error('Error al cargar clientes:', err);
        }
    }, [calcularRiesgoClientes]);

    useEffect(() => {
        cargarClientes();
    }, [cargarClientes]);

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

    const actualizarReporte = useCallback(() => {
        calcularRiesgoClientes(state.clientes);
    }, [calcularRiesgoClientes, state.clientes]);

    const handleMitigacionGuardada = useCallback(async (clienteActualizado) => {
        try {
            // Actualización optimista del estado local
            setState(prev => ({
                ...prev,
                clientes: prev.clientes.map(cli =>
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
            const clientesAValidar = clientesConRiesgo
                .filter(cliente => cliente.riesgo_inherente !== null);

            if (clientesAValidar.length === 0) {
                throw new Error('No hay clientes con riesgo calculado para validar');
            }

            const promesasValidacion = clientesAValidar.map(cliente => {
                const datosActualizacion = {
                    probabilidad_cliente_externo: cliente.probabilidad,
                    impacto_cliente_externo: cliente.impacto,
                    riesgo_inherente: cliente.riesgo_inherente,
                    riesgo_residual: cliente.riesgo_residual,
                    mitigacion: cliente.mitigacion,
                    mitigacion_numerico: cliente.mitigacion_numerico,
                    mitigacion_adicional: cliente.mitigacion_adicional
                };
                return databaseService.actualizarClienteExterno(cliente.id, datosActualizacion);
            });

            await Promise.all(promesasValidacion);

            setState(prev => ({ ...prev, validando: false }));
            return { success: true };
        } catch (error) {
            setState(prev => ({
                ...prev,
                error: error.message,
                validando: false
            }));
            return { success: false, error: error.message };
        }
    }, [clientesConRiesgo]);

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