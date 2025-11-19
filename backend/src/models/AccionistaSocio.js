const db = require('../database/db');

class AccionistaSocio {
    static crear(accionista) {
        const camposCompletos = {
            fecha_registro: accionista.fecha_registro || null,
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
            riesgo_inherente: accionista.riesgo_inherente || null,
            mitigacion: accionista.mitigacion || null,
            mitigacion_numerico: accionista.mitigacion_numerico || null,
            mitigacion_adicional: accionista.mitigacion_adicional || null,
            riesgo_residual: accionista.riesgo_residual || null
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

        try {
            const stmt = db.prepare(sql);
            const result = stmt.run(valores);

            return {
                success: true,
                id: Number(result.lastInsertRowid),
                changes: result.changes
            };
        } catch (err) {
            return { success: false, error: err.message };
        }
    }

    static listar() {
        try {
            const stmt = db.prepare(`SELECT * FROM "tabla-accionistas-socios" ORDER BY fecha_registro DESC`);
            const rows = stmt.all();
            return { success: true, data: rows };
        } catch (err) {
            return { success: false, error: err.message };
        }
    }

    static obtenerPorId(id) {
        try {
            const stmt = db.prepare('SELECT * FROM "tabla-accionistas-socios" WHERE id = ?');
            const row = stmt.get(id);

            if (!row) {
                return { success: false, error: 'Accionista/Socio no encontrado' };
            }

            return { success: true, data: row };
        } catch (err) {
            return { success: false, error: err.message };
        }
    }

    static actualizar(id, data) {
        const campos = Object.keys(data)
            .filter(key => key !== 'id')
            .map(key => `"${key}" = ?`)
            .join(', ');

        const valores = Object.values(data);

        try {
            const stmt = db.prepare(`UPDATE "tabla-accionistas-socios" SET ${campos} WHERE id = ?`);
            const result = stmt.run([...valores, id]);

            return { success: true, changes: result.changes };
        } catch (err) {
            return { success: false, error: err.message };
        }
    }

    static bulkCreate(accionistas) {
        try {
            const insertTransaction = db.transaction((accionistas) => {
                db.prepare("DELETE FROM \"tabla-accionistas-socios\"").run();

                let processedCount = 0;
                const errors = [];

                for (let i = 0; i < accionistas.length; i++) {
                    try {
                        const accionista = accionistas[i];
                        const accionistaConFecha = {
                            fecha_registro: new Date().toISOString(),
                            ...accionista
                        };

                        const campos = Object.keys(accionistaConFecha).map(c => `"${c}"`).join(', ');
                        const placeholders = Object.keys(accionistaConFecha).map(() => '?').join(', ');
                        const valores = Object.values(accionistaConFecha);

                        const sql = `INSERT INTO "tabla-accionistas-socios" (${campos}) VALUES (${placeholders})`;
                        const stmt = db.prepare(sql);
                        stmt.run(valores);

                        processedCount++;
                    } catch (err) {
                        errors.push(`Error en registro ${i + 1}: ${err.message}`);
                    }
                }

                return { processedCount, errors };
            });

            const result = insertTransaction(accionistas);

            return {
                success: true,
                count: result.processedCount,
                errors: result.errors.length > 0 ? result.errors : null
            };

        } catch (err) {
            return {
                success: false,
                error: `Error en transacción: ${err.message}`,
                processed: 0
            };
        }
    }

    static eliminar(id) {
        try {
            const stmt = db.prepare('DELETE FROM "tabla-accionistas-socios" WHERE id = ?');
            const result = stmt.run(id);

            return { success: true, changes: result.changes };
        } catch (err) {
            return { success: false, error: err.message };
        }
    }
}

module.exports = AccionistaSocio;