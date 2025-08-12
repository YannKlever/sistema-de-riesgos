import { useState, useEffect, useCallback } from 'react';
import { databaseService } from '../../services/database';

export const useAlertasData = () => {
    const [state, setState] = useState({
        data: [],
        loading: true,
        error: ''
    });

    const cargarClientesConAlertas = useCallback(async () => {
        try {
            setState(prev => ({ ...prev, loading: true, error: '' }));
            
            const resultado = await databaseService.listarClientesConAlertas();

            if (resultado.success) {
                setState({
                    data: resultado.data,
                    loading: false,
                    error: ''
                });
            } else {
                setState({
                    data: [],
                    loading: false,
                    error: resultado.error || 'Error al cargar clientes con alertas'
                });
            }
        } catch (err) {
            console.error('Error al cargar clientes con alertas:', err);
            setState({
                data: [],
                loading: false,
                error: 'Error de conexión con la base de datos'
            });
        }
    }, []);

    useEffect(() => {
        cargarClientesConAlertas();
    }, [cargarClientesConAlertas]);

    return {
        data: state.data,
        loading: state.loading,
        error: state.error,
        refresh: cargarClientesConAlertas
    };
};