import * as XLSX from 'xlsx';

export const parseExcelFile = async (file) => {
  try {
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    return XLSX.utils.sheet_to_json(firstSheet, {
      raw: true,
      dateNF: 'yyyy-mm-dd',
      defval: null
    });
  } catch (error) {
    throw new Error('Error al procesar el archivo: ' + error.message);
  }
};

export const validateImportData = (data, schema) => {
    if (!data || !Array.isArray(data)) {
        throw new Error('Datos de importación no válidos');
    }

    const errors = [];
    const validData = [];
    const idsUnicos = new Set(); // Solo verificamos IDs únicos

    data.forEach((item, index) => {
        const itemErrors = [];
        const mappedItem = {};
        
        // 1. Verificar campos requeridos
        schema.requiredFields.forEach(field => {
            if (!(field in item)) {
                itemErrors.push(`Campo requerido faltante: "${field}" no existe en el archivo`);
            } else if (item[field] === undefined || item[field] === null || item[field] === '') {
                itemErrors.push(`Campo requerido vacío: "${field}"`);
            }
        });

        // 2. Mapear campos y limpiar datos
        Object.entries(schema.fieldMappings).forEach(([excelField, dbField]) => {
            try {
                if (item[excelField] !== undefined && item[excelField] !== null && item[excelField] !== '') {
                    let value = item[excelField];
                    
                    // Manejo mejorado de fechas
                    if (dbField.includes('fecha') || excelField.includes('Fecha')) {
                        try {
                            // Si ya es un objeto Date (proveniente de Excel)
                            if (value instanceof Date) {
                                value = value.toISOString();
                            } 
                            // Si es un string con formato reconocible
                            else if (typeof value === 'string') {
                                // Intenta formato YYYY-MM-DD
                                if (value.match(/^\d{4}-\d{2}-\d{2}$/)) {
                                    value = new Date(value + 'T00:00:00').toISOString();
                                } 
                                // Intenta formato DD/MM/YYYY
                                else if (value.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
                                    const [day, month, year] = value.split('/');
                                    value = new Date(`${year}-${month}-${day}T00:00:00`).toISOString();
                                }
                                // Intenta formato DD-MM-YYYY
                                else if (value.match(/^\d{2}-\d{2}-\d{4}$/)) {
                                    const [day, month, year] = value.split('-');
                                    value = new Date(`${year}-${month}-${day}T00:00:00`).toISOString();
                                }
                                // Intenta formato timestamp de Excel (número de días desde 1900)
                                else if (!isNaN(value) && value > 0) {
                                    const excelEpoch = new Date(1899, 11, 30);
                                    const days = parseInt(value);
                                    value = new Date(excelEpoch.getTime() + days * 24 * 60 * 60 * 1000).toISOString();
                                }
                                // Otros formatos
                                else {
                                    const parsedDate = new Date(value);
                                    if (isNaN(parsedDate.getTime())) {
                                        throw new Error(`Formato de fecha no reconocido: ${value}`);
                                    }
                                    value = parsedDate.toISOString();
                                }
                            }
                        } catch (error) {
                            throw new Error(`Error procesando fecha: ${error.message}`);
                        }
                    }
                    
                    // Conversión de números
                    if (dbField.includes('numerico') || dbField.includes('ponderado') || 
                        dbField.includes('participacion') || dbField.includes('valor')) {
                        if (typeof value === 'string') {
                            value = value.replace(',', '.').replace(/[^0-9.-]/g, '');
                        }
                        const numValue = parseFloat(value);
                        if (isNaN(numValue)) {
                            throw new Error(`Valor numérico inválido`);
                        }
                        value = numValue;
                    }
                    
                    mappedItem[dbField] = value;
                }
            } catch (error) {
                itemErrors.push(`Error en campo "${excelField}": ${error.message}`);
            }
        });

        // 3. Validar solo ID único (si existe en el esquema)
        if (mappedItem.id !== undefined) {
            if (idsUnicos.has(mappedItem.id)) {
                itemErrors.push(`ID duplicado: ${mappedItem.id}`);
            } else {
                idsUnicos.add(mappedItem.id);
            }
        }

        if (itemErrors.length > 0) {
            errors.push({
                row: index + 2,
                errors: itemErrors,
                originalData: item,
                mappedData: mappedItem
            });
        } else {
            validData.push(mappedItem);
        }
    });

    // Mostrar resumen de validación en consola
    console.log('Resumen de validación:', {
        totalRegistros: data.length,
        registrosValidos: validData.length,
        registrosInvalidos: errors.length,
        camposRequeridos: schema.requiredFields,
        erroresPorTipo: errors.reduce((acc, err) => {
            err.errors.forEach(e => {
                const tipoError = e.split(':')[0];
                acc[tipoError] = (acc[tipoError] || 0) + 1;
            });
            return acc;
        }, {})
    });

    return {
        valid: validData,
        invalid: errors,
        total: data.length,
        validCount: validData.length,
        invalidCount: errors.length
    };
};