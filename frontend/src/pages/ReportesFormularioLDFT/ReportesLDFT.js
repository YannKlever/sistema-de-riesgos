import React, { useMemo } from 'react';
import { useReportesLDFT } from './useReporteLDFT';
import { ControlesReporte } from './ControlesReporte';
import { TablaReporte } from './TablaReporte';
import styles from './reportesLDFT.module.css';
import { databaseService } from '../../services/database';

export const ReportesLDFT = ({ onNuevaEvaluacion, onEditarEvaluacion }) => {
    const {
        state,
        evaluacionesFiltradas,
        handleFiltroChange,
        actualizarReporte,
        actualizarEvaluacionLocal,
        COLUMNAS_REPORTE
    } = useReportesLDFT();

    const calcularPromedioGeneral = () => {
        if (evaluacionesFiltradas.length === 0) return '0.00';
        const total = evaluacionesFiltradas.reduce((sum, evaluacion) => 
            sum + (evaluacion.promedio_riesgo || evaluacion.promedio_frontend || 0), 0);
        return (total / evaluacionesFiltradas.length).toFixed(2);
    };

    const obtenerFechaMasReciente = () => {
        if (evaluacionesFiltradas.length === 0) return 'N/A';
        const fechas = evaluacionesFiltradas.map(e => new Date(e.fecha_evaluacion));
        const masReciente = new Date(Math.max(...fechas));
        return masReciente.toLocaleDateString();
    };

    const handleValidarTodo = async () => {
        try {
            // Filtrar solo los registros que tienen promedio_frontend pero no tienen promedio_riesgo
            const registrosAValidar = evaluacionesFiltradas.filter(
                e => e.promedio_frontend && !e.promedio_riesgo
            );

            if (registrosAValidar.length === 0) {
                alert('No hay registros pendientes de validación');
                return;
            }

            // Confirmar con el usuario
            if (!window.confirm(`¿Está seguro que desea validar ${registrosAValidar.length} registros?`)) {
                return;
            }

            // Procesar todas las validaciones
            const resultados = await Promise.all(
                registrosAValidar.map(async (item) => {
                    const resultado = await databaseService.actualizarEvaluacionLDFT(item.id, {
                        promedio_riesgo: item.promedio_frontend
                    });
                    return { id: item.id, success: resultado.success };
                })
            );

            // Actualizar el estado local con los resultados
            resultados.forEach(({ id, success }) => {
                if (success) {
                    actualizarEvaluacionLocal(id, {
                        promedio_riesgo: evaluacionesFiltradas.find(e => e.id === id).promedio_frontend
                    });
                }
            });

            alert(`Validación masiva completada: ${resultados.filter(r => r.success).length} de ${registrosAValidar.length} registros actualizados`);
            
        } catch (error) {
            console.error('Error en validación masiva:', error);
            alert('Error al realizar la validación masiva');
        }
    };

    const columnasConPromedio = useMemo(() => {
        return [
            ...COLUMNAS_REPORTE.filter(col => col.id !== 'promedio_riesgo'),
            { 
                id: 'promedio_frontend', 
                nombre: 'Promedio Calculado', 
                format: 'number' 
            },
            { 
                id: 'promedio_riesgo', 
                nombre: 'Promedio Validado', 
                format: 'number' 
            }
        ];
    }, [COLUMNAS_REPORTE]);

    return (
        <div className={styles.contenedor}>
            <header className={styles.header}>
                <h1>Reporte de Evaluaciones LD/FT</h1>
                <p>Histórico de evaluaciones de riesgo</p>
            </header>

            {state.error && <div className={styles.error}>{state.error}</div>}

            <ControlesReporte
                filtro={state.filtro}
                onFiltroChange={handleFiltroChange}
                onActualizar={actualizarReporte}
                datos={evaluacionesFiltradas}
                columnas={columnasConPromedio}
                onNuevaEvaluacion={onNuevaEvaluacion}
                onValidarTodo={handleValidarTodo}
            />

            <TablaReporte
                columnas={columnasConPromedio}
                datos={evaluacionesFiltradas}
                loading={state.loading}
                onEditar={onEditarEvaluacion}
            />

            <div className={styles.resumen}>
                <p>Total en reporte: <strong>{evaluacionesFiltradas.length}</strong></p>
                {evaluacionesFiltradas.length > 0 && (
                    <>
                        <p>Promedio general: <strong>{calcularPromedioGeneral()}</strong></p>
                        <p>Evaluación más reciente: <strong>{obtenerFechaMasReciente()}</strong></p>
                    </>
                )}
            </div>
        </div>
    );
};

export default ReportesLDFT;