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

    // Columnas para calcular la probabilidad (según lo solicitado)
    const columnasProbabilidad = useMemo(() => [
        'nacionalidad_numerico',
        'riesgo_profesion_actividad_numerico',
        'riesgo_zona_numerico',
        'ingresos_mensuales_numerico',
        'volumen_actividad_numerico',
        'frecuencia_actividad_numerico',
        'categoria_pep_numerico',
        'promedio_riesgo_producto_servicio',
        'promedio_riesgo_canal_distribucion',
        'integridad_documental_numerico',
        'exactitud_documental_numerico',
        'vigencia_documental_numerico',
        'relevancia_informacion_numerico',
        'consistencia_informacion_numerico',
        'comportamiento_cliente_numerico'
    ], []);

    const calcularRiesgoClientes = useCallback(async (clientes) => {
        try {
            setState(prev => ({ ...prev, loading: true }));
            
            // Obtener los riesgos de producto/servicio
            const resultadoRiesgos = await databaseService.listarClientesExternosConRiesgoProductoServicio();
            const riesgosProductoServicio = resultadoRiesgos.success ? resultadoRiesgos.data : [];

            const clientesActualizados = clientes.map(cliente => {
                // Encontrar el riesgo correspondiente para este cliente
                const riesgoPS = riesgosProductoServicio.find(r => r.id === cliente.id);
                
                // Calcular Probabilidad (promedio de las columnas especificadas)
                const valoresProbabilidad = columnasProbabilidad
                    .map(col => {
                        if (col === 'promedio_riesgo_producto_servicio') {
                            return riesgoPS ? riesgoPS.promedio_riesgo_producto_servicio : 0;
                        }
                        return cliente[col] || 0;
                    })
                    .filter(val => val !== null && !isNaN(val));
                    
                const probabilidad = valoresProbabilidad.length > 0 ? 
                    valoresProbabilidad.reduce((sum, val) => sum + val, 0) / valoresProbabilidad.length : 
                    0;
                
                // Impacto es directamente el valor de ramo_seguro_numerico
                const impacto = cliente.ramo_seguro_numerico || 0;
                
                // Factor de riesgo es el promedio de probabilidad e impacto
                const factorRiesgo = (probabilidad + impacto) / 2;
                
                return {
                    ...cliente,
                    probabilidad: parseFloat(probabilidad.toFixed(2)),
                    impacto: parseFloat(impacto.toFixed(2)),
                    factorRiesgoClienteExterno: parseFloat(factorRiesgo.toFixed(2)),
                    promedio_riesgo_producto_servicio: riesgoPS 
                        ? parseFloat(riesgoPS.promedio_riesgo_producto_servicio.toFixed(2)) 
                        : 0
                };
            });
            
            setClientesConRiesgo(clientesActualizados);
            setState(prev => ({ ...prev, loading: false }));
        } catch (error) {
            console.error('Error al calcular riesgos:', error);
            setState(prev => ({ ...prev, error: 'Error al calcular riesgos', loading: false }));
        }
    }, [columnasProbabilidad]);

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
        
        // Validar solo los campos requeridos
        const actualizaciones = clientesFiltrados.map(cliente => 
            databaseService.actualizarClienteExterno(
                cliente.id, 
                { 
                    probabilidad_cliente_externo: cliente.probabilidad,
                    impacto_cliente_externo: cliente.impacto,
                    promedio_riesgo_cliente_externo: cliente.factorRiesgoClienteExterno
                    
                }
            )
        );

        const resultados = await Promise.all(actualizaciones);
        
        const todosExitosos = resultados.every(r => r.success);
        
        if (todosExitosos) {
            // Actualizar el estado con los nuevos valores
            setClientesConRiesgo(prev => 
                prev.map(c => {
                    const clienteActualizado = clientesFiltrados.find(f => f.id === c.id);
                    return clienteActualizado ? {
                        ...c,
                        probabilidad_cliente_externo: clienteActualizado.probabilidad,
                        impacto_cliente_externo: clienteActualizado.impacto,
                        promedio_riesgo_cliente_externo: clienteActualizado.factorRiesgoClienteExterno
                       
                    } : c;
                })
            );
            
            setState(prev => ({
                ...prev,
                loading: false,
                error: ''
            }));
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
        COLUMNAS_REPORTE: [
            ...COLUMNAS_REPORTE, 
            { id: 'probabilidad', nombre: 'Probabilidad' },
            { id: 'impacto', nombre: 'Impacto' },
            { id: 'factorRiesgoClienteExterno', nombre: 'Factor Riesgo Cliente Externo' },
           
        ]
    };
};