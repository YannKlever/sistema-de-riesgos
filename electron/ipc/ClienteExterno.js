const db = require('../database/db');

class ClienteExterno {
    static async crear(cliente) {
        const camposCompletos = {
            fecha_registro: new Date().toISOString(),
            oficina: cliente.oficina || null,
            ejecutivo: cliente.ejecutivo || null,
            tipo_sociedad: cliente.tipo_sociedad || null,
            nombres_propietario: cliente.nombres_propietario || null,
            apellidos_propietario: cliente.apellidos_propietario || null,
            tipo_documento_propietario: cliente.tipo_documento_propietario || null,
            nro_documento_propietario: cliente.nro_documento_propietario || null,
            extension_propietario: cliente.extension_propietario || null,
            otra_extension_propietario: cliente.otra_extension_propietario || null,
            fecha_nacimiento: cliente.fecha_nacimiento || null,
            lugar_nacimiento: cliente.lugar_nacimiento || null,
            nacionalidad: cliente.nacionalidad || null,
            pais_residencia: cliente.pais_residencia || null,
            estado_civil: cliente.estado_civil || null,
            telefono: cliente.telefono || null,
            celular: cliente.celular || null,
            profesion: cliente.profesion || null,
            razon_social: cliente.razon_social || null,
            nit: cliente.nit || null,
            matricula_comercio: cliente.matricula_comercio || null,
            actividad: cliente.actividad || null,
            riesgo_profesion_actividad: cliente.riesgo_profesion_actividad || null,
            lugar_trabajo: cliente.lugar_trabajo || null,
            cargo: cliente.cargo || null,
            gestion_ingreso: cliente.gestion_ingreso || null,
            riesgo_zona: cliente.riesgo_zona || null,
            ingresos_mensuales: cliente.ingresos_mensuales || null,
            volumen_actividad: cliente.volumen_actividad || null,
            frecuencia_actividad: cliente.frecuencia_actividad || null,
            categoria_pep: cliente.categoria_pep || null,
            domicilio_persona_sucursal: cliente.domicilio_persona_sucursal || null,
            domicilio_comercial_legal: cliente.domicilio_comercial_legal || null,
            correo: cliente.correo || null,
            nombres_conyugue: cliente.nombres_conyugue || null,
            apellidos_conyugue: cliente.apellidos_conyugue || null,
            actividad_conyugue: cliente.actividad_conyugue || null,
            ocupacion_conyugue: cliente.ocupacion_conyugue || null,
            nombres_representante: cliente.nombres_representante || null,
            apellidos_representante: cliente.apellidos_representante || null,
            tipo_documento_representante: cliente.tipo_documento_representante || null,
            nro_documento_representante: cliente.nro_documento_representante || null,
            extension_representante: cliente.extension_representante || null,
            otra_extension_representante: cliente.otra_extension_representante || null,
            ramo_seguro: cliente.ramo_seguro || null,
            tipo_documento: cliente.tipo_documento || null,
            fecha_inicio: cliente.fecha_inicio || null,
            fecha_fin: cliente.fecha_fin || null,
            nro_poliza: cliente.nro_poliza || null,
            valor_prima_dolares: cliente.valor_prima_dolares || null,
            frecuencia_contacto_fisico: cliente.frecuencia_contacto_fisico || null,
            frecuencia_contacto_digital: cliente.frecuencia_contacto_digital || null,
            medio_comunicacion: cliente.medio_comunicacion || null,
            medio_pago: cliente.medio_pago || null,
            integridad_documental: cliente.integridad_documental || null,
            exactitud_documental: cliente.exactitud_documental || null,
            vigencia_documental: cliente.vigencia_documental || null,
            relevancia_informacion: cliente.relevancia_informacion || null,
            consistencia_informacion: cliente.consistencia_informacion || null,
            comportamiento_cliente: cliente.comportamiento_cliente || null,
            observaciones: cliente.observaciones || null,
            //promedio de riesgo 
            promedio_riesgo_canal_distribucion: cliente.promedio_riesgo_canal_distribucion || null,
            promedio_riesgo_cliente_externo: cliente.promedio_riesgo_cliente_externo || null,
            impacto: cliente.impacto || null,
            probabilidad: cliente.probabilidad || null,
            //para vincular cliente interno
            cliente_interno_id: cliente.cliente_interno_id || null,
            nacionalidad_numerico: cliente.nacionalidad_numerico || null,
            riesgo_profesion_actividad_numerico: cliente.riesgo_profesion_actividad_numerico || null,
            riesgo_zona_numerico: cliente.riesgo_zona_numerico || null,
            ingresos_mensuales_numerico: cliente.ingresos_mensuales_numerico || null,
            volumen_actividad_numerico: cliente.volumen_actividad_numerico || null,
            frecuencia_actividad_numerico: cliente.frecuencia_actividad_numerico || null,
            categoria_pep_numerico: cliente.categoria_pep_numerico || null,
            ramo_seguro_numerico: cliente.ramo_seguro_numerico || null,
            tipo_documento_numerico: cliente.tipo_documento_numerico || null,
            valor_prima_dolares_numerico: cliente.valor_prima_dolares_numerico || null,
            frecuencia_contacto_fisico_numerico: cliente.frecuencia_contacto_fisico_numerico || null,
            frecuencia_contacto_digital_numerico: cliente.frecuencia_contacto_digital_numerico || null,
            medio_comunicacion_numerico: cliente.medio_comunicacion_numerico || null,
            medio_pago_numerico: cliente.medio_pago_numerico || null,
            integridad_documental_numerico: cliente.integridad_documental_numerico || null,
            exactitud_documental_numerico: cliente.exactitud_documental_numerico || null,
            vigencia_documental_numerico: cliente.vigencia_documental_numerico || null,
            relevancia_informacion_numerico: cliente.relevancia_informacion_numerico || null,
            consistencia_informacion_numerico: cliente.consistencia_informacion_numerico || null,
            comportamiento_cliente_numerico: cliente.comportamiento_cliente_numerico || null
        };
        const { campos, placeholders, valores } = Object.entries(camposCompletos).reduce(
            (acc, [campo, valor]) => {
                acc.campos.push(`"${campo}"`);
                acc.placeholders.push('?');
                // Solo convertir a JSON si es un objeto y no es null/undefined
                acc.valores.push(valor !== null && typeof valor === 'object' && !(valor instanceof Date) ?
                    JSON.stringify(valor) : valor);
                return acc;
            },
            { campos: [], placeholders: [], valores: [] }
        );
        const sql = `INSERT INTO "tabla-clientes-externos" (${campos.join(', ')}) VALUES (${placeholders.join(', ')})`;
        return new Promise((resolve, reject) => {
            db.run(sql, valores, function (err) {
                if (err) {
                    console.error('Error al crear cliente:', err);
                    console.error('Consulta SQL:', sql);
                    console.error('Valores:', valores);
                    reject({ success: false, error: err.message });
                } else {
                    // Debug crucial para verificar el ID
                    console.log('Resultado de inserción:', {
                        lastID: this.lastID,  // Debe ser un número
                        changes: this.changes,
                        tipoLastID: typeof this.lastID  // Debe ser "number"
                    });

                    // Asegurar que el ID sea un número
                    const insertedId = Number(this.lastID);
                    if (isNaN(insertedId)) {
                        console.warn('Advertencia: lastID no es un número válido:', this.lastID);
                    }
                    resolve({
                        success: true,
                        id: insertedId,
                        changes: this.changes
                    });
                }
            });
        });
    }




    static async listarClientesExternosConRiesgoInterno() {
        return new Promise((resolve, reject) => {
            db.all(
                `SELECT 
                ce.*,
                ci.promedio_riesgo_cliente_interno,
                ci.ejecutivo AS ejecutivo_interno
             FROM "tabla-clientes-externos" ce
             LEFT JOIN "tabla-clientes-internos" ci ON ce.ejecutivo = ci.ejecutivo
             ORDER BY ce.fecha_registro DESC`,
                [],
                (err, rows) => {
                    if (err) {
                        console.error('Error al listar clientes externos con riesgo interno:', err);
                        reject({ success: false, error: err.message });
                    } else {
                        // Procesar los resultados para asegurar valores numéricos
                        const processedRows = rows.map(row => ({
                            ...row,
                            promedio_riesgo_cliente_interno: row.promedio_riesgo_cliente_interno
                                ? parseFloat(row.promedio_riesgo_cliente_interno)
                                : 0
                        }));
                        resolve({ success: true, data: processedRows });
                    }
                }
            );
        });
    }

    static async vincularClienteInterno(idClienteExterno, idClienteInterno) {
        return new Promise((resolve, reject) => {
            db.run(
                `UPDATE "tabla-clientes-externos" 
             SET cliente_interno_id = ? 
             WHERE id = ?`,
                [idClienteInterno, idClienteExterno],
                function (err) {
                    if (err) reject(err);
                    else resolve({ success: true, changes: this.changes });
                }
            );
        });
    }

    static async actualizar(id, data) {
        const campos = Object.keys(data)
            .filter(key => key !== 'id')
            .map(key => `"${key}" = ?`)
            .join(', ');

        const valores = Object.values(data);

        return new Promise((resolve, reject) => {
            db.run(
                `UPDATE "tabla-clientes-externos" SET ${campos} WHERE id = ?`,
                [...valores, id],
                function (err) {
                    if (err) {
                        reject({ success: false, error: err.message });
                    } else {
                        resolve({ success: true, changes: this.changes });
                    }
                }
            );
        });
    }







    static async listar() {
        return new Promise((resolve, reject) => {
            db.all(
                `SELECT * FROM "tabla-clientes-externos" ORDER BY fecha_registro DESC`,
                [],
                (err, rows) => {
                    if (err) {
                        console.error('Error en consulta SQL:', err);
                        reject({ success: false, error: err.message });
                    } else {
                        console.log('Clientes encontrados:', rows.length); // Debug
                        resolve({ success: true, data: rows });
                    }
                }
            );
        });
    }
    static async eliminar(id) {
        return new Promise((resolve, reject) => {
            db.run(
                'DELETE FROM "tabla-clientes-externos" WHERE id = ?',
                [id],
                function (err) {
                    if (err) {
                        console.error('Error al eliminar cliente:', err);
                        reject({ success: false, error: err.message });
                    } else {
                        resolve({ success: true, changes: this.changes });
                    }
                }
            );
        });
    }

    static async obtenerRiesgoPorId(id) {
        return new Promise((resolve, reject) => {
            db.get(
                `SELECT 
                    (COALESCE(nacionalidad_numerico, 0) + 
                    (COALESCE(riesgo_profesion_actividad_numerico, 0) + 
                    (COALESCE(riesgo_zona_numerico, 0) + 
                    (COALESCE(categoria_pep_numerico, 0) +
                    (COALESCE(ingresos_mensuales_numerico, 0) +
                    (COALESCE(volumen_actividad_numerico, 0) +
                    (COALESCE(frecuencia_actividad_numerico, 0) +
                    (COALESCE(integridad_documental_numerico, 0) +
                    (COALESCE(exactitud_documental_numerico, 0) +
                    (COALESCE(vigencia_documental_numerico, 0) +
                    (COALESCE(relevancia_informacion_numerico, 0) +
                    (COALESCE(consistencia_informacion_numerico, 0) +
                    (COALESCE(comportamiento_cliente_numerico, 0)) / 12 AS riesgo_promedio
                 FROM "tabla-clientes-internos" 
                 WHERE id = ?`,
                [id],
                (err, row) => {
                    if (err) reject(err);
                    else resolve(row ? row.riesgo_promedio : null);
                }
            );
        });
    }
    static async bulkCreate(clientes) {
        return new Promise((resolve, reject) => {
            db.serialize(() => {
                db.run("BEGIN TRANSACTION", (beginErr) => {
                    if (beginErr) return reject({
                        success: false,
                        error: `Error al iniciar transacción: ${beginErr.message}`
                    });

                    // 1. Limpiar tabla existente
                    db.run("DELETE FROM \"tabla-clientes-externos\"", (deleteErr) => {
                        if (deleteErr) {
                            return db.run("ROLLBACK", () => {
                                reject({
                                    success: false,
                                    error: `Error al limpiar tabla: ${deleteErr.message}`
                                });
                            });
                        }

                        // 2. Obtener todas las columnas posibles de la tabla
                        db.all("PRAGMA table_info(\"tabla-clientes-externos\")", (pragmaErr, columns) => {
                            if (pragmaErr) {
                                return db.run("ROLLBACK", () => {
                                    reject({
                                        success: false,
                                        error: `Error al obtener estructura de tabla: ${pragmaErr.message}`
                                    });
                                });
                            }

                            const allColumns = columns.map(col => col.name);

                            // 3. Procesar en lotes
                            const batchSize = 50;
                            let processedCount = 0;
                            const errors = [];

                            const processBatch = (startIdx) => {
                                if (startIdx >= clientes.length) {
                                    db.run("COMMIT", (commitErr) => {
                                        if (commitErr) {
                                            reject({
                                                success: false,
                                                error: `Error al confirmar transacción: ${commitErr.message}`,
                                                processed: processedCount
                                            });
                                        } else {
                                            resolve({
                                                success: true,
                                                count: processedCount,
                                                errors: errors.length > 0 ? errors : null
                                            });
                                        }
                                    });
                                    return;
                                }

                                const endIdx = Math.min(startIdx + batchSize, clientes.length);
                                let batchProcessed = 0;

                                const insertNext = (idx) => {
                                    if (idx >= endIdx) return processBatch(endIdx);

                                    const cliente = clientes[idx];
                                    const clienteConFecha = {
                                        fecha_registro: new Date().toISOString(),
                                        ...cliente
                                    };

                                    // Filtrar solo columnas que existen en la tabla
                                    const camposDisponibles = Object.keys(clienteConFecha)
                                        .filter(key => allColumns.includes(key));

                                    const campos = camposDisponibles.map(c => `"${c}"`).join(', ');
                                    const placeholders = camposDisponibles.map(() => '?').join(', ');

                                    const valores = camposDisponibles.map(key => {
                                        const val = clienteConFecha[key];
                                        return val !== null && typeof val === 'object' && !(val instanceof Date)
                                            ? JSON.stringify(val)
                                            : val;
                                    });

                                    const sql = `INSERT INTO "tabla-clientes-externos" (${campos}) VALUES (${placeholders})`;

                                    db.run(sql, valores, function (err) {
                                        if (err) {
                                            errors.push(`Error en registro ${idx + 1}: ${err.message}`);
                                            console.error(`Error insertando registro ${idx + 1}:`, {
                                                error: err,
                                                sql: sql,
                                                valores: valores,
                                                cliente: clienteConFecha
                                            });
                                        } else {
                                            processedCount++;
                                            batchProcessed++;
                                        }
                                        insertNext(idx + 1);
                                    });
                                };

                                insertNext(startIdx);
                            };

                            processBatch(0);
                        });
                    });
                });
            });
        });
    }
}
module.exports = ClienteExterno;