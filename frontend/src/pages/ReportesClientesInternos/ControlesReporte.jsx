import React from 'react';
import styles from './reportesClientesInternos.module.css';
import { exportExcelFile, EXCEL_STYLES } from '../../utils/export/index';

export const ControlesReporte = ({ 
    filtro, 
    onFiltroChange, 
    onActualizar,
    onValidarTodos,
    clientes,
    columnas,
    validandoTodos 
}) => {
    const [exportando, setExportando] = React.useState(false);
    
    const handleExportExcel = async () => {
        if (exportando) return;
        
        setExportando(true);
        try {
            // Preparar columnas para Excel
            const excelColumns = columnas.map(col => ({
                id: col.id,
                name: col.nombre,
                ...(col.id.endsWith('_numerico') && { 
                    format: 'number',
                    style: EXCEL_STYLES.NUMBER_FORMAT
                }),
                ...(col.id === 'factorRiesgoClienteInterno' && { 
                    format: 'number',
                    style: EXCEL_STYLES.NUMBER_FORMAT
                })
            }));
            
            // Datos adicionales para el archivo Excel
            const metadata = {
                titulo: 'Reporte de Clientes Internos',
                fechaGeneracion: new Date().toLocaleString(),
                totalRegistros: clientes.length,
                filtroAplicado: filtro || 'Ninguno'
            };
            
            await exportExcelFile(
                clientes,
                excelColumns,
                'reporte_clientes_internos',
                {
                    sheetName: 'Clientes Internos',
                    headerStyle: EXCEL_STYLES.HEADER_BLUE,
                    autoWidth: true,
                    metadata
                }
            );
        } catch (error) {
            console.error('Error al exportar a Excel:', error);
            alert('Ocurrió un error al exportar el reporte');
        } finally {
            setExportando(false);
        }
    };

    return (
        <div className={styles.controles}>
            <div className={styles.buscadorContainer}>
                <input
                    type="text"
                    placeholder="Buscar en clientes internos..."
                    value={filtro}
                    onChange={(e) => onFiltroChange(e)}
                    className={styles.buscador}
                    aria-label="Buscar en reporte"
                />
                <span className={styles.iconoBusqueda}></span>
            </div>
            
            <div className={styles.botonesAccion}>
                <button 
                    onClick={onActualizar}
                    className={styles.botonActualizar}
                    disabled={exportando || validandoTodos}
                >
                    <span className={styles.iconoBoton}></span>
                    Actualizar Reporte
                </button>
                
                <button 
                    onClick={onValidarTodos}
                    className={styles.botonValidarTodos}
                    disabled={exportando || validandoTodos || clientes.length === 0}
                >
                    {validandoTodos ? (
                        <span className={styles.iconoCargando}>⏳</span>
                    ) : (
                        <span className={styles.iconoBoton}></span>
                    )}
                    {validandoTodos ? 'Validando...' : 'Validar Todos'}
                </button>
                
                <button 
                    onClick={handleExportExcel}
                    className={styles.botonExportar}
                    disabled={exportando || validandoTodos || clientes.length === 0}
                >
                    {exportando ? (
                        <span className={styles.iconoCargando}></span>
                    ) : (
                        <span className={styles.iconoBoton}></span>
                    )}
                    {exportando ? 'Exportando...' : 'Exportar a Excel'}
                </button>
            </div>
        </div>
    );
};