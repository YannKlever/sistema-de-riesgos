import React from 'react';
import styles from './reportesCanalesDistribucion.module.css';
import { exportExcelFile } from '../../utils/export/index';

export const ControlesReporte = ({ 
    filtro, 
    onFiltroChange, 
    onActualizar,
    onValidarTodos,
    datos,
    columnas,
    loading 
}) => {
    const handleExportExcel = () => {
        const excelColumns = columnas.map(col => {
            const columnDef = {
                id: col.id,
                name: col.nombre
            };
            
            // Aplicar formato numérico a las columnas correspondientes
            if (col.id.endsWith('_numerico') || 
                col.id.includes('factorRiesgo') || 
                col.id.includes('promedio_riesgo') ||
                col.id === 'riesgoTotal') {
                columnDef.format = 'number';
            }
            
            return columnDef;
        });
        
        exportExcelFile(
            datos,
            excelColumns,
            'reporte_canales_distribucion',
            {
                sheetName: 'Canales Distribución',
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
                onChange={(e) => onFiltroChange(e.target.value)}
                className={styles.buscador}
            />
            
            <div className={styles.botonesAccion}>
                <button 
                    onClick={onActualizar}
                    className={styles.botonActualizar}
                    disabled={loading}
                >
                    Actualizar Reporte
                </button>
                
                <button 
                    onClick={onValidarTodos}
                    className={styles.botonValidar}
                    disabled={loading || datos.length === 0}
                    title="Validar todos los riesgos calculados"
                >
                    Validar Riesgos
                </button>
                
                <button 
                    onClick={handleExportExcel}
                    className={styles.botonExportar}
                    disabled={loading || datos.length === 0}
                >
                    Exportar a Excel
                </button>
            </div>
        </div>
    );
};