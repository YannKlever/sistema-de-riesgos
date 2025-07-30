import { useState, useEffect, useMemo, useCallback } from 'react';

import { databaseService } from '../../services/database';
import { COLUMNAS_REPORTE, COLUMNAS_NUMERICAS } from './constantes';

export const useClientesInternos = () => {
    const [state, setState] = useState({
        clientes: [],
        loading: true,
        error: '',
        filtro: '',
        validandoTodos: false
    });

    const [clientesConRiesgo, setClientesConRiesgo] = useState([]);

    const calcularRiesgoClientes = useCallback((clientes) => {
        const clientesActualizados = clientes.map(cliente => {
            const camposNumericos = COLUMNAS_NUMERICAS
                .map(col => cliente[col.id])
                .filter(val => val !== null && !isNaN(val));
                
            const promedio = camposNumericos.length > 0 ? 
                camposNumericos.reduce((sum, val) => sum + val, 0) / camposNumericos.length : 
                0;
            
            return {
                ...cliente,
                factorRiesgoClienteInterno: parseFloat(promedio.toFixed(2))
            };
        });
        
        setClientesConRiesgo(clientesActualizados);
    }, []);

    const validarRiesgo = useCallback(async (idCliente, factorRiesgo) => {
        try {
            setState(prev => ({ ...prev, loading: true, error: '' }));
            
            const resultado = await databaseService.actualizarClienteInterno(idCliente, {
                promedio_riesgo_cliente_interno: factorRiesgo
            });

            if (resultado.success) {
                // Actualizar el estado local
                setState(prev => ({
                    ...prev,
                    clientes: prev.clientes.map(cliente => 
                        cliente.id === idCliente ? 
                        { ...cliente, promedio_riesgo_cliente_interno: factorRiesgo } : 
                        cliente
                    ),
                    loading: false
                }));
                
                // Actualizar clientes con riesgo calculado
                setClientesConRiesgo(prev => 
                    prev.map(cliente => 
                        cliente.id === idCliente ? 
                        { ...cliente, promedio_riesgo_cliente_interno: factorRiesgo } : 
                        cliente
                    )
                );
                
                return { success: true };
            } else {
                throw new Error(resultado.error || 'Error al validar riesgo');
            }
        } catch (error) {
            setState(prev => ({
                ...prev,
                error: error.message,
                loading: false
            }));
            return { success: false, error: error.message };
        }
    }, []);

    const validarTodosLosRiesgos = useCallback(async () => {
        try {
            setState(prev => ({ ...prev, validandoTodos: true, error: '' }));
            
            // Filtrar solo clientes que tienen factorRiesgoClienteInterno calculado
            const clientesAValidar = clientesConRiesgo
                .filter(cliente => cliente.factorRiesgoClienteInterno !== null && 
                                 cliente.factorRiesgoClienteInterno !== undefined);
            
            if (clientesAValidar.length === 0) {
                throw new Error('No hay clientes con riesgo calculado para validar');
            }

            // Crear array de promesas para todas las validaciones
            const promesasValidacion = clientesAValidar.map(cliente => 
                databaseService.actualizarClienteInterno(cliente.id, {
                    promedio_riesgo_cliente_interno: cliente.factorRiesgoClienteInterno
                })
            );

            // Ejecutar todas las validaciones en paralelo
            const resultados = await Promise.all(promesasValidacion);

            // Verificar si todas las validaciones fueron exitosas
            const todasExitosas = resultados.every(r => r.success);
            if (!todasExitosas) {
                const errores = resultados.filter(r => !r.success).map(r => r.error);
                throw new Error(`Algunas validaciones fallaron: ${errores.join(', ')}`);
            }

            // Actualizar el estado local con los nuevos valores validados
            setState(prev => ({
                ...prev,
                clientes: prev.clientes.map(cliente => {
                    const clienteValidado = clientesAValidar.find(c => c.id === cliente.id);
                    return clienteValidado ? {
                        ...cliente,
                        promedio_riesgo_cliente_interno: clienteValidado.factorRiesgoClienteInterno
                    } : cliente;
                }),
                validandoTodos: false
            }));

            // Actualizar clientes con riesgo calculado
            setClientesConRiesgo(prev => 
                prev.map(cliente => {
                    const clienteValidado = clientesAValidar.find(c => c.id === cliente.id);
                    return clienteValidado ? {
                        ...cliente,
                        promedio_riesgo_cliente_interno: clienteValidado.factorRiesgoClienteInterno
                    } : cliente;
                })
            );

            return { success: true };
        } catch (error) {
            setState(prev => ({
                ...prev,
                error: error.message,
                validandoTodos: false
            }));
            return { success: false, error: error.message };
        }
    }, [clientesConRiesgo]);

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
    }, [calcularRiesgoClientes]);

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

    const handleFiltroChange = useCallback((e) => {
        setState(prev => ({ ...prev, filtro: e.target.value }));
    }, []);

    const actualizarReporte = useCallback(() => {
        calcularRiesgoClientes(state.clientes);
    }, [calcularRiesgoClientes, state.clientes]);

    return {
        state,
        clientesFiltrados,
        handleFiltroChange,
        actualizarReporte,
        validarRiesgo,
        validarTodosLosRiesgos,
        COLUMNAS_REPORTE: [...COLUMNAS_REPORTE, 
            { id: 'factorRiesgoClienteInterno', nombre: 'Factor Riesgo' },
            { id: 'promedio_riesgo_cliente_interno', nombre: 'Riesgo Validado' }
        ]
    };
};