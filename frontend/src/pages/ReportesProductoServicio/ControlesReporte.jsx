import React from 'react';
import styles from './reportesProductosServicios.module.css';
import { exportExcelFile } from '../../utils/export/index';

export const ControlesReporte = ({ 
    filtro, 
    onFiltroChange, 
    onActualizar,
    onValidarTodos,
    datos,
    columnas 
}) => {
    const handleExportExcel = () => {
        const excelColumns = columnas.map(col => {
            const columnDef = {
                id: col.id,
                name: col.nombre
            };
            
            // Aplicar formato numérico solo a las columnas que lo requieren
            if (col.id.endsWith('_numerico') || col.id.includes('riesgoFactor')) {
                columnDef.format = 'number';
            }
            
            return columnDef;
        });
        
        // Agregar columnas adicionales
        excelColumns.push(
            { id: 'riesgoFactorProductosServicios', name: 'Riesgo Calculado', format: 'number' },
            { id: 'promedio_riesgo_producto_servicio', name: 'Riesgo Validado', format: 'number' }
        );
        
        exportExcelFile(
            datos,
            excelColumns,
            'reporte_productos_servicios',
            {
                sheetName: 'Productos y Servicios',
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
                >
                    Actualizar Reporte
                </button>
                
                <button 
                    onClick={onValidarTodos}
                    className={styles.botonValidar}
                    disabled={datos.length === 0}
                    title="Validar todos los riesgos calculados"
                >
                    Validar
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