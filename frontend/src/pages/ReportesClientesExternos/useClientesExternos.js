import { useState, useEffect, useMemo, useCallback } from 'react';
import { databaseService } from '../../services/database';
import { COLUMNAS_REPORTE, COLUMNAS_NUMERICAS } from './constantes';

export const useClientesExternos = () => {
    const [state, setState] = useState({
        clientes: [],
        loading: true,
        error: '',
        filtro: ''
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
                factorRiesgoClienteExterno: parseFloat(promedio.toFixed(2))
            };
        });
        
        setClientesConRiesgo(clientesActualizados);
    }, []);

    useEffect(() => {
        let isMounted = true;

        const cargarClientes = async () => {
            try {
                setState(prev => ({ ...prev, loading: true, error: '' }));
                const resultado = await databaseService.listarClientesExternos();

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
                    console.error('Error al cargar clientes:', err);
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

    const validarTodo = useCallback(async () => {
        try {
            setState(prev => ({ ...prev, loading: true, error: '' }));
            
            // Validar todos los clientes filtrados
            const actualizaciones = clientesFiltrados.map(cliente => 
                databaseService.actualizarClienteExterno(
                    cliente.id, 
                    { promedio_riesgo_cliente_externo: cliente.factorRiesgoClienteExterno }
                )
            );

            const resultados = await Promise.all(actualizaciones);
            
            // Verificar si todas las actualizaciones fueron exitosas
            const todosExitosos = resultados.every(r => r.success);
            
            if (todosExitosos) {
                // Actualizar el estado con los nuevos valores
                setState(prev => ({
                    ...prev,
                    clientes: prev.clientes.map(c => {
                        const clienteActualizado = clientesFiltrados.find(f => f.id === c.id);
                        return clienteActualizado ? {
                            ...c,
                            promedio_riesgo_cliente_externo: clienteActualizado.factorRiesgoClienteExterno
                        } : c;
                    }),
                    loading: false
                }));
                
                setClientesConRiesgo(prev => 
                    prev.map(c => {
                        const clienteActualizado = clientesFiltrados.find(f => f.id === c.id);
                        return clienteActualizado ? {
                            ...c,
                            promedio_riesgo_cliente_externo: clienteActualizado.factorRiesgoClienteExterno
                        } : c;
                    })
                );
            } else {
                throw new Error('Algunos clientes no se pudieron validar');
            }
        } catch (err) {
            setState(prev => ({
                ...prev,
                error: err.message,
                loading: false
            }));
            console.error('Error al validar riesgos:', err);
        }
    }, [clientesFiltrados]);

    return {
        state,
        clientesFiltrados,
        handleFiltroChange,
        actualizarReporte,
        validarTodo,
        COLUMNAS_REPORTE: [...COLUMNAS_REPORTE, 
            { id: 'factorRiesgoClienteExterno', nombre: 'Factor Riesgo Cliente Externo' }
        ]
    };
};