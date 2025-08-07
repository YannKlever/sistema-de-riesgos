const db = require('../database/db');

class AccionistaSocio {
    static async crear(accionista) {
        const camposCompletos = {
            fecha_registro: accionista.fecha_registro,
            oficina: accionista.oficina || null,
            ejecutivo: accionista.ejecutivo || null,
            nombres_accionistas_socios: accionista.nombres_accionistas_socios || null,
            apellidos_accionistas_socios: accionista.apellidos_accionistas_socios || null,
            tipo_documento_accionistas_socios: accionista.tipo_documento_accionistas_socios || null,
            nro_documento_accionistas_socios: accionista.nro_documento_accionistas_socios || null,
            extension_accionistas_socios: accionista.extension_accionistas_socios || null,
            otra_extension_accionistas_socios: accionista.otra_extension_accionistas_socios || null,
            fecha_nacimiento: accionista.fecha_nacimiento || null,
            lugar_nacimiento: accionista.lugar_nacimiento || null,
            nacionalidad: accionista.nacionalidad || null,
            estado_civil: accionista.estado_civil || null,
            domicilio_persona: accionista.domicilio_persona || null,
            actividad: accionista.actividad || null,
            riesgo_actividad: accionista.riesgo_actividad || null,
            riesgo_zona: accionista.riesgo_zona || null,
            categoria_pep: accionista.categoria_pep || null,
            ingresos_mensuales: accionista.ingresos_mensuales || null,
            volumen_actividad: accionista.volumen_actividad || null,
            frecuencia_actividad: accionista.frecuencia_actividad || null,
            participacion_accionaria: accionista.participacion_accionaria || null,
            integridad_documental: accionista.integridad_documental || null,
            exactitud_documental: accionista.exactitud_documental || null,
            vigencia_documental: accionista.vigencia_documental || null,
            relevancia_informacion: accionista.relevancia_informacion || null,
            consistencia_informacion: accionista.consistencia_informacion || null,
            comportamiento_cliente: accionista.comportamiento_cliente || null,
            observaciones: accionista.observaciones || null,
            nacionalidad_numerico: accionista.nacionalidad_numerico || null,
            riesgo_actividad_numerico: accionista.riesgo_actividad_numerico || null,
            riesgo_zona_numerico: accionista.riesgo_zona_numerico || null,
            ingresos_mensuales_numerico: accionista.ingresos_mensuales_numerico || null,
            volumen_actividad_numerico: accionista.volumen_actividad_numerico || null,
            frecuencia_actividad_numerico: accionista.frecuencia_actividad_numerico || null,
            categoria_pep_numerico: accionista.categoria_pep_numerico || null,
            participacion_accionaria_numerico: accionista.participacion_accionaria_numerico || null,
            integridad_documental_numerico: accionista.integridad_documental_numerico || null,
            exactitud_documental_numerico: accionista.exactitud_documental_numerico || null,
            vigencia_documental_numerico: accionista.vigencia_documental_numerico || null,
            relevancia_informacion_numerico: accionista.relevancia_informacion_numerico || null,
            consistencia_informacion_numerico: accionista.consistencia_informacion_numerico || null,
            comportamiento_cliente_numerico: accionista.comportamiento_cliente_numerico || null,
            probabilidad: accionista.probabilidad || null,
            impacto: accionista.impacto || null,
            promedio_riesgo_accionista_socio: accionista.promedio_riesgo_accionista_socio || null
        };

        const { campos, placeholders, valores } = Object.entries(camposCompletos).reduce(
            (acc, [campo, valor]) => {
                acc.campos.push(`"${campo}"`);
                acc.placeholders.push('?');
                acc.valores.push(valor !== null && typeof valor === 'object' && !(valor instanceof Date) ?
                    JSON.stringify(valor) : valor);
                return acc;
            },
            { campos: [], placeholders: [], valores: [] }
        );

        const sql = `INSERT INTO "tabla-accionistas-socios" (${campos.join(', ')}) VALUES (${placeholders.join(', ')})`;

        return new Promise((resolve, reject) => {
            db.run(sql, valores, function (err) {
                if (err) {
                    console.error('Error al crear accionista/socio:', err);
                    console.error('Consulta SQL:', sql);
                    console.error('Valores:', valores);
                    reject({ success: false, error: err.message });
                } else {
                    resolve({
                        success: true,
                        id: Number(this.lastID),
                        changes: this.changes
                    });
                }
            });
        });
    }

    static async listar() {
        return new Promise((resolve, reject) => {
            db.all(
                `SELECT * FROM "tabla-accionistas-socios" ORDER BY fecha_registro DESC`,
                [],
                (err, rows) => {
                    if (err) {
                        console.error('Error al listar accionistas/socios:', err);
                        reject({ success: false, error: err.message });
                    } else {
                        resolve({ success: true, data: rows });
                    }
                }
            );
        });
    }
    static async obtenerPorId(id) {
        return new Promise((resolve, reject) => {
            db.get(
                'SELECT * FROM "tabla-accionistas-socios" WHERE id = ?',
                [id],
                (err, row) => {
                    if (err) {
                        reject({ success: false, error: err.message });
                    } else if (!row) {
                        reject({ success: false, error: 'Accionista/Socio no encontrado' });
                    } else {
                        resolve({ success: true, data: row });
                    }
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
                `UPDATE "tabla-accionistas-socios" SET ${campos} WHERE id = ?`,
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

    static async bulkCreate(accionistas) {
        return new Promise((resolve, reject) => {
            db.serialize(() => {
                db.run("BEGIN TRANSACTION", (beginErr) => {
                    if (beginErr) return reject({
                        success: false,
                        error: `Error al iniciar transacción: ${beginErr.message}`
                    });

                    // 1. Primero borramos todos los registros existentes
                    db.run("DELETE FROM \"tabla-accionistas-socios\"", (deleteErr) => {
                        if (deleteErr) {
                            return db.run("ROLLBACK", () => {
                                reject({
                                    success: false,
                                    error: `Error al limpiar tabla: ${deleteErr.message}`
                                });
                            });
                        }

                        // 2. Preparamos la consulta de inserción
                        const sampleItem = { fecha_registro: new Date().toISOString(), ...accionistas[0] };
                        const campos = Object.keys(sampleItem).map(c => `"${c}"`).join(', ');
                        const placeholders = Object.keys(sampleItem).map(() => '?').join(', ');
                        const sql = `INSERT INTO "tabla-accionistas-socios" (${campos}) VALUES (${placeholders})`;

                        // 3. Insertamos en lotes para mejor performance
                        const batchSize = 50; // Tamaño del lote
                        let processedCount = 0;
                        const errors = [];

                        const processBatch = (startIdx) => {
                            if (startIdx >= accionistas.length) {
                                // Finalizamos la transacción
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

                            const endIdx = Math.min(startIdx + batchSize, accionistas.length);
                            let batchProcessed = 0;

                            const insertNext = (idx) => {
                                if (idx >= endIdx) {
                                    // Procesar siguiente lote
                                    return processBatch(endIdx);
                                }

                                const accionista = accionistas[idx];
                                const valores = Object.values({
                                    fecha_registro: new Date().toISOString(),
                                    ...accionista
                                });

                                db.run(sql, valores, function (err) {
                                    if (err) {
                                        errors.push(`Error en registro ${idx + 1}: ${err.message}`);
                                        console.error(`Error insertando registro ${idx + 1}:`, err);
                                    } else {
                                        processedCount++;
                                        batchProcessed++;
                                    }

                                    // Continuar con el siguiente registro del lote
                                    insertNext(idx + 1);
                                });
                            };

                            // Iniciar el procesamiento del lote actual
                            insertNext(startIdx);
                        };

                        // Iniciar el procesamiento por lotes
                        processBatch(0);
                    });
                });
            });
        });
    }
    static async eliminar(id) {
        return new Promise((resolve, reject) => {
            db.run(
                'DELETE FROM "tabla-accionistas-socios" WHERE id = ?',
                [id],
                function (err) {
                    if (err) {
                        console.error('Error al eliminar accionista/socio:', err);
                        reject({ success: false, error: err.message });
                    } else {
                        resolve({ success: true, changes: this.changes });
                    }
                }
            );
        });
    }
}


module.exports = AccionistaSocio;