import React from 'react';
import styles from './reportesLDFT.module.css';
import { exportExcelFile } from '../../utils/export/index';

export const ControlesReporte = ({ 
    filtro, 
    onFiltroChange, 
    onActualizar,
    datos,
    columnas,
    onNuevaEvaluacion,
    onValidarTodo
}) => {
    const handleExportExcel = () => {
        const excelColumns = columnas.map(col => ({
            id: col.id,
            name: col.nombre,
           
            ...(col.id.endsWith('_numerico') || col.id === 'promedio_riesgo') && { format: 'number' }
        }));
        
        exportExcelFile(
            datos,
            excelColumns,
            'reporte_ldft',
            {
                sheetName: 'Evaluaciones de Control LGI/FT-FPADM',
                headerStyle: {
                    font: { bold: true, color: { rgb: 'FFFFFF' } },
                    fill: { fgColor: { rgb: '4472C4' } },
                    alignment: { horizontal: 'center' }
                }
            }
        );
    };

    return (
        <div className={styles.controles}>
            <input
                type="text"
                placeholder="Buscar en reporte..."
                value={filtro}
                onChange={(e) => onFiltroChange(e)}
                className={styles.buscador}
            />
            
            <div className={styles.botonesAccion}>
                <button 
                    onClick={onNuevaEvaluacion}
                    className={styles.botonNuevo}
                >
                    Nueva Evaluación
                </button>
                
                <button 
                    onClick={onActualizar}
                    className={styles.botonActualizar}
                >
                    Actualizar Reporte
                </button>
                
                <button 
                    onClick={handleExportExcel}
                    className={styles.botonExportar}
                >
                    Exportar a Excel
                </button>

                <button 
                    onClick={onValidarTodo}
                    className={styles.botonValidarTodo}
                    disabled={datos.length === 0}
                >
                    Validar Todo
                </button>
            </div>
        </div>
    );
};