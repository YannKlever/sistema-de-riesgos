import * as XLSX from 'xlsx';

export const parseExcelFile = async (file) => {
  try {
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    
    // Opciones mejoradas para el parseo
    return XLSX.utils.sheet_to_json(firstSheet, {
      raw: false, // Para mejor manejo de fechas
      dateNF: 'yyyy-mm-dd',
      defval: null,
      blankrows: false,
      skipHidden: true,
      cellDates: true // Mejor soporte para fechas
    });
  } catch (error) {
    console.error('Error al procesar archivo Excel:', error);
    throw new Error('Error al procesar el archivo: ' + error.message);
  }
};

export const validateImportData = (data, schema) => {
    if (!data || !Array.isArray(data)) {
        throw new Error('Datos de importación no válidos');
    }

    const errors = [];
    const validData = [];
    const idsUnicos = new Set();
    
    // Obtener todos los campos posibles del schema
    const allPossibleFields = new Set([
        ...Object.keys(schema.fieldMappings),
        ...schema.requiredFields
    ]);

    data.forEach((item, index) => {
        const itemErrors = [];
        const mappedItem = {};
        
        // 1. Verificar campos requeridos
        schema.requiredFields.forEach(requiredField => {
            const excelField = Object.entries(schema.fieldMappings)
                .find(([excelF, dbF]) => dbF === requiredField)?.[0] || requiredField;
                
            if (item[excelField] === undefined || item[excelField] === null || item[excelField] === '') {
                itemErrors.push(`Campo requerido faltante o vacío: "${excelField}"`);
            }
        });

        // 2. Verificar campos adicionales no esperados
        const camposAdicionales = Object.keys(item).filter(
            key => !allPossibleFields.has(key) && !Object.values(schema.fieldMappings).includes(key)
        );
        
        if (camposAdicionales.length > 0) {
            itemErrors.push(`Campos adicionales no esperados: ${camposAdicionales.join(', ')}`);
        }

        // 3. Mapear campos y transformar datos
        Object.entries(schema.fieldMappings).forEach(([excelField, dbField]) => {
            try {
                if (item[excelField] !== undefined && item[excelField] !== null && item[excelField] !== '') {
                    let value = item[excelField];
                    
                    // Manejo de fechas
                    if (dbField.includes('fecha') || excelField.toLowerCase().includes('fecha')) {
                        value = transformarFecha(value);
                    }
                    
                    // Conversión de números para campos ponderados
                    if (dbField.endsWith('_numerico') || dbField.includes('valor') || dbField.includes('prima')) {
                        value = transformarNumero(value);
                    }
                    
                    // Manejo de campos booleanos
                    if (typeof value === 'boolean') {
                        value = value ? 1 : 0;
                    }
                    
                    mappedItem[dbField] = value;
                }
            } catch (error) {
                itemErrors.push(`Error en campo "${excelField}": ${error.message}`);
            }
        });

        // 4. Validar ID único si existe
        if (mappedItem.id !== undefined) {
            if (idsUnicos.has(mappedItem.id)) {
                itemErrors.push(`ID duplicado: ${mappedItem.id}`);
            } else {
                idsUnicos.add(mappedItem.id);
            }
        }

        if (itemErrors.length > 0) {
            errors.push({
                row: index + 2, // +2 porque Excel empieza en 1 y la primera fila es cabecera
                errors: itemErrors,
                originalData: item,
                mappedData: mappedItem
            });
        } else {
            validData.push(mappedItem);
        }
    });

    // Mostrar resumen de validación
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

// Funciones auxiliares
function transformarFecha(value) {
    if (value === null || value === undefined || value === '') {
        return null;
    }

    // Si ya es un objeto Date (proveniente de Excel)
    if (value instanceof Date) {
        return value.toISOString();
    }

    // Si es un string con formato reconocible
    if (typeof value === 'string') {
        // Eliminar espacios en blanco al inicio/final
        value = value.trim();
        
        // Intenta diferentes formatos de fecha
        const formatos = [
            // DD-MM-YYYY o DD/MM/YYYY
            { regex: /^(\d{2})[\/-](\d{2})[\/-](\d{4})$/, handler: (match) => 
                new Date(`${match[3]}-${match[2]}-${match[1]}`) 
            },
            // YYYY-MM-DD
            { regex: /^(\d{4})-(\d{2})-(\d{2})$/, handler: (match) => 
                new Date(`${match[1]}-${match[2]}-${match[3]}`) 
            },
            // Timestamp de Excel (número de días desde 1900)
            { regex: /^\d+$/, handler: (match) => {
                const excelEpoch = new Date(1899, 11, 30);
                const days = parseInt(match[0]);
                return new Date(excelEpoch.getTime() + days * 24 * 60 * 60 * 1000);
            }}
        ];

        for (const formato of formatos) {
            const match = value.match(formato.regex);
            if (match) {
                try {
                    const dateObj = formato.handler(match);
                    if (!isNaN(dateObj.getTime())) {
                        return dateObj.toISOString();
                    }
                } catch (e) {
                    continue;
                }
            }
        }
    }

    // Si no se pudo parsear, devolver el valor original para manejo posterior
    return value;
}

function transformarNumero(value) {
    if (typeof value === 'number') {
        return value;
    }
    
    if (typeof value === 'string') {
        // Limpia el string y convierte a número
        const cleaned = value.replace(/[^\d.,-]/g, '')
            .replace(',', '.') // Decimales con coma
            .replace(/\.(?=.*\.)/g, ''); // Elimina separadores de miles
        
        const numValue = parseFloat(cleaned);
        if (!isNaN(numValue)) {
            return numValue;
        }
    }
    
    throw new Error(`Valor numérico inválido: ${value}`);
}

// Funciones adicionales útiles
export const generateTemplate = (schema) => {
    const headers = Object.entries(schema.fieldMappings).map(([excelField]) => excelField);
    const requiredFields = schema.requiredFields.map(field => 
        Object.entries(schema.fieldMappings).find(([_, dbField]) => dbField === field)?.[0] || field
    );
    
    return {
        headers,
        requiredFields,
        sampleData: headers.reduce((acc, header) => {
            acc[header] = requiredFields.includes(header) ? '[REQUERIDO]' : '';
            return acc;
        }, {})
    };
};

export const validateHeaders = (data, schema) => {
    if (data.length === 0) return { valid: false, missingHeaders: [] };
    
    const expectedHeaders = Object.keys(schema.fieldMappings);
    const actualHeaders = Object.keys(data[0]);
    
    const missingHeaders = expectedHeaders.filter(header => !actualHeaders.includes(header));
    
    return {
        valid: missingHeaders.length === 0,
        missingHeaders,
        extraHeaders: actualHeaders.filter(header => !expectedHeaders.includes(header))
    };
};