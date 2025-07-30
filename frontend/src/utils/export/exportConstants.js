export const EXCEL_STYLES = {
    HEADER_BLUE: {
        font: { bold: true, color: { rgb: 'FFFFFF' } },
        fill: { fgColor: { rgb: '4472C4' } },
        alignment: { horizontal: 'center' }
    },
    HEADER_GREEN: {
        font: { bold: true, color: { rgb: 'FFFFFF' } },
        fill: { fgColor: { rgb: '70AD47' } }
    },
    CURRENCY: {
        numFmt: '"$"#,##0.00'
    },
    PERCENTAGE: {
        numFmt: '0.00%'
    },
    DATE: {
        numFmt: 'yyyy-mm-dd'
    }
};

export const CELL_FORMATS = {
    DATE: 'date',
    CURRENCY: 'currency',
    NUMBER: 'number',
    BOOLEAN: 'boolean'
};

export const FILE_TYPES = {
    EXCEL: ['xlsx', 'xls', 'csv'],
    CSV: ['csv']
};