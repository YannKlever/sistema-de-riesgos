import React from 'react';
import styles from './reportesZonaGeografica.module.css';
import { exportExcelFile } from '../../utils/export/index';

export const ControlesReporte = ({ 
    filtro, 
    onFiltroChange, 
    onActualizar,
    onValidarTodos,
    datos,
    columnas,
    nombreReporte = 'reporte',
    nombreHoja = 'Datos',
    validandoTodos = false
}) => {
    const handleExportExcel = () => {
        const excelColumns = columnas.map(col => ({
            id: col.id,
            name: col.nombre,
            ...(col.id.endsWith('_numerico') && { format: 'number' })
        }));
        
        exportExcelFile(
            datos,
            excelColumns,
            nombreReporte,
            {
                sheetName: nombreHoja,
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
                    onClick={onActualizar}
                    className={styles.botonActualizar}
                >
                    Actualizar Reporte
                </button>
                
                <button 
                    onClick={onValidarTodos}
                    className={styles.botonValidarTodos}
                    disabled={validandoTodos || datos.length === 0}
                >
                    {validandoTodos ? 'Validando...' : 'Validar Todos'}
                </button>
                
                <button 
                    onClick={handleExportExcel}
                    className={styles.botonExportar}
                >
                    Exportar a Excel
                </button>
            </div>
        </div>
    );
};