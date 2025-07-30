import * as XLSX from 'xlsx';

/**
 * Exporta datos a un archivo Excel con configuración flexible
 * @param {Array} data - Datos a exportar
 * @param {Array} columns - Configuración de columnas [{id, name, format?}]
 * @param {string} fileName - Nombre del archivo (sin extensión)
 * @param {Object} options - Opciones adicionales
 * @returns {Object} Resultado de la operación
 */
export const exportToExcel = (data, columns, fileName, options = {}) => {
    try {
        if (!data || !columns || !fileName) {
            throw new Error('Parámetros incompletos para exportación');
        }
        const defaultOptions = {
            sheetName: 'Datos',
            headerStyle: {
                font: { bold: true, color: { rgb: 'FFFFFF' } },
                fill: { fgColor: { rgb: '4472C4' } },
                alignment: { horizontal: 'center' }
            },
            dateFormat: 'yyyy-mm-dd',
            autoWidth: true
        };

        const config = { ...defaultOptions, ...options };

        const excelData = data.map(item => {
            const row = {};
            columns.forEach(col => {
                row[col.name] = formatCellValue(item[col.id], col.format);
            });
            return row;
        });

        const worksheet = XLSX.utils.json_to_sheet(excelData);

        if (config.headerStyle) {
            const headerRange = XLSX.utils.decode_range(worksheet['!ref']);
            for (let C = headerRange.s.c; C <= headerRange.s.c + columns.length - 1; ++C) {
                const cellAddress = XLSX.utils.encode_cell({ r: headerRange.s.r, c: C });
                if (!worksheet[cellAddress]) continue;
                worksheet[cellAddress].s = config.headerStyle;
            }
        }

        if (config.autoWidth) {
            worksheet['!cols'] = columns.map(col => ({
                width: col.width || (col.name.length + 5)
            }));
        }

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, config.sheetName);

        XLSX.writeFile(workbook, `${fileName}.xlsx`, {
            bookType: 'xlsx',
            type: 'file'
        });

        return { success: true, fileName: `${fileName}.xlsx` };
    } catch (error) {
        console.error('Error en exportToExcel:', error);
        return {
            success: false,
            error: error.message,
            details: error
        };
    }
};

const formatCellValue = (value, format) => {
    if (value === null || value === undefined) return '';

    switch (format) {
        case 'date':
            return new Date(value).toISOString().split('T')[0];
        case 'currency':
            return parseFloat(value).toFixed(2);
        case 'number':
            return parseFloat(value);
        case 'boolean':
            return value ? 'Sí' : 'No';
        default:
            return value;
    }
};

/**
 * Exporta múltiples hojas a un mismo archivo Excel
 * @param {Array} sheets - Array de {data, columns, sheetName}
 * @param {string} fileName - Nombre del archivo
 * @returns {Object} Resultado de la operación
 */
export const exportMultipleSheets = (sheets, fileName) => {
    try {
        const workbook = XLSX.utils.book_new();

        sheets.forEach(({ data, columns, sheetName }) => {
            const excelData = data.map(item => {
                const row = {};
                columns.forEach(col => {
                    row[col.name] = item[col.id] ?? '';
                });
                return row;
            });

            const worksheet = XLSX.utils.json_to_sheet(excelData);
            XLSX.utils.book_append_sheet(workbook, worksheet, sheetName || 'Datos');
        });

        XLSX.writeFile(workbook, `${fileName}.xlsx`);
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
};