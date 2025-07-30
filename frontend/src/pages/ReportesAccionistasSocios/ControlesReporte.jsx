import React from 'react';
import styles from './reportesAccionistasSocios.module.css';
import { exportExcelFile } from '../../utils/export/index';

export const ControlesReporte = ({ 
    filtro, 
    onFiltroChange, 
    onActualizar,
    onValidarRiesgo,
    accionistas,
    columnas,
    validando
}) => {
    const handleExportExcel = () => {
        const excelColumns = columnas.map(col => ({
            id: col.id,
            name: col.nombre,
            ...(col.id.endsWith('_numerico') && { format: 'number' })
        }));
        
        exportExcelFile(
            accionistas,
            excelColumns,
            'reporte_accionistas_socios',
            {
                sheetName: 'Accionistas y Socios',
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
                    disabled={validando}
                >
                    Actualizar Reporte
                </button>
                
                <button 
                    onClick={onValidarRiesgo}
                    className={styles.botonValidar}
                    disabled={validando}
                >
                    {validando ? 'Validando...' : 'Validar Riesgo'}
                </button>
                
                <button 
                    onClick={handleExportExcel}
                    className={styles.botonExportar}
                    disabled={validando}
                >
                    Exportar a Excel
                </button>
            </div>
        </div>
    );
};