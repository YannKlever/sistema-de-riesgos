// ControlesReporte.js
import React from 'react';
import styles from './reportesCanalesDistribucion.module.css';
import { exportExcelFile, EXCEL_STYLES } from '../../utils/export/index';

export const ControlesReporte = ({ 
    filtro, 
    onFiltroChange, 
    onActualizar,
    onValidarTodo,
    onValidarTodosLosRiesgos,  // Nueva prop
    clientes,
    columnas,
    loading 
}) => {
    const handleExportExcel = () => {
        const excelColumns = columnas.map(col => ({
            id: col.id,
            name: col.nombre,
            ...(col.id.endsWith('_numerico') && { format: 'number' }),
            ...(col.id === 'factorRiesgoClienteExterno' && { format: 'number' })
        }));
        
        exportExcelFile(
            clientes,
            excelColumns,
            'reporte_clientes_externos',
            {
                sheetName: 'Clientes Externos',
                headerStyle: EXCEL_STYLES.HEADER_BLUE,
                autoWidth: true
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
                    disabled={loading}
                >
                    Actualizar Reporte
                </button>
                
                
                
                <button 
                    onClick={onValidarTodosLosRiesgos}  // Nuevo botón
                    className={styles.botonValidarRiesgos}
                    disabled={loading}
                >
                    Validar Riesgos
                </button>
                
                <button 
                    onClick={handleExportExcel}
                    className={styles.botonExportar}
                    disabled={loading}
                >
                    Exportar a Excel
                </button>
            </div>
        </div>
    );
};