const db = require('../database/db');

class ClienteInterno {
    static crear(cliente) {
        const camposCompletos = {
            fecha_registro: cliente.fecha_registro || new Date().toISOString(),
            oficina: cliente.oficina || null,
            ejecutivo: cliente.ejecutivo || null,
            nombres_cliente_interno: cliente.nombres_cliente_interno || null,
            apellidos_cliente_interno: cliente.apellidos_cliente_interno || null,
            tipo_documento_cliente_interno: cliente.tipo_documento_cliente_interno || null,
            nro_documento_cliente_interno: cliente.nro_documento_cliente_interno || null,
            extension_cliente_interno: cliente.extension_cliente_interno || null,
            otra_extension_cliente_interno: cliente.otra_extension_cliente_interno || null,
            fecha_nacimiento: cliente.fecha_nacimiento || null,
            lugar_nacimiento: cliente.lugar_nacimiento || null,
            nacionalidad: cliente.nacionalidad || null,
            estado_civil: cliente.estado_civil || null,
            profesion: cliente.profesion || null,
            riesgo_profesion_actividad: cliente.riesgo_profesion_actividad || null,
            otra_actividad: cliente.otra_actividad || null,
            riesgo_otra_actividad: cliente.riesgo_otra_actividad || null,
            domicilio_persona_sucursal: cliente.domicilio_persona_sucursal || null,
            riesgo_zona: cliente.riesgo_zona || null,
            categoria_pep: cliente.categoria_pep || null,
            ingresos_mensuales: cliente.ingresos_mensuales || null,
            volumen_actividad: cliente.volumen_actividad || null,
            frecuencia_actividad: cliente.frecuencia_actividad || null,
            integridad_documental: cliente.integridad_documental || null,
            exactitud_documental: cliente.exactitud_documental || null,
            vigencia_documental: cliente.vigencia_documental || null,
            relevancia_informacion: cliente.relevancia_informacion || null,
            consistencia_informacion: cliente.consistencia_informacion || null,
            comportamiento_cliente: cliente.comportamiento_cliente || null,
            observaciones: cliente.observaciones || null,
            alertas_cliente_interno: cliente.alertas_cliente_interno || null,
            alertas_activos_virtuales: cliente.alertas_activos_virtuales || null,
            nacionalidad_numerico: cliente.nacionalidad_numerico || null,
            riesgo_profesion_actividad_numerico: cliente.riesgo_profesion_actividad_numerico || null,
            otra_actividad_numerico: cliente.otra_actividad_numerico || null,
            riesgo_zona_numerico: cliente.riesgo_zona_numerico || null,
            categoria_pep_numerico: cliente.categoria_pep_numerico || null,
            ingresos_mensuales_numerico: cliente.ingresos_mensuales_numerico || null,
            volumen_actividad_numerico: cliente.volumen_actividad_numerico || null,
            frecuencia_actividad_numerico: cliente.frecuencia_actividad_numerico || null,
            integridad_documental_numerico: cliente.integridad_documental_numerico || null,
            exactitud_documental_numerico: cliente.exactitud_documental_numerico || null,
            vigencia_documental_numerico: cliente.vigencia_documental_numerico || null,
            relevancia_informacion_numerico: cliente.relevancia_informacion_numerico || null,
            consistencia_informacion_numerico: cliente.consistencia_informacion_numerico || null,
            comportamiento_cliente_numerico: cliente.comportamiento_cliente_numerico || null,
            probabilidad: cliente.probabilidad || null,
            impacto: cliente.impacto || null,
            riesgo_inherente: cliente.riesgo_inherente || null,
            mitigacion: cliente.mitigacion || null,
            mitigacion_numerico: cliente.mitigacion_numerico || null,
            mitigacion_adicional: cliente.mitigacion_adicional || null,
            riesgo_residual: cliente.riesgo_residual || null
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

        const sql = `INSERT INTO "tabla-clientes-internos" (${campos.join(', ')}) VALUES (${placeholders.join(', ')})`;

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
            const stmt = db.prepare(`SELECT * FROM "tabla-clientes-internos" ORDER BY fecha_registro DESC`);
            const rows = stmt.all();
            return { success: true, data: rows };
        } catch (err) {
            return { success: false, error: err.message };
        }
    }

    static bulkCreate(clientesInternos) {
        try {
            const insertTransaction = db.transaction((clientesInternos) => {
                db.prepare("DELETE FROM \"tabla-clientes-internos\"").run();

                const columnsStmt = db.prepare("PRAGMA table_info(\"tabla-clientes-internos\")");
                const columns = columnsStmt.all();
                const allColumns = columns.map(col => col.name);

                let processedCount = 0;
                const errors = [];

                for (let i = 0; i < clientesInternos.length; i++) {
                    try {
                        const cliente = clientesInternos[i];
                        const clienteConFecha = {
                            fecha_registro: new Date().toISOString(),
                            ...cliente
                        };

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

                        const sql = `INSERT INTO "tabla-clientes-internos" (${campos}) VALUES (${placeholders})`;
                        const stmt = db.prepare(sql);
                        stmt.run(valores);

                        processedCount++;
                    } catch (err) {
                        errors.push(`Error en registro ${i + 1}: ${err.message}`);
                    }
                }

                return { processedCount, errors };
            });

            const result = insertTransaction(clientesInternos);

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

    static obtenerPorId(id) {
        try {
            const stmt = db.prepare('SELECT * FROM "tabla-clientes-internos" WHERE id = ?');
            const row = stmt.get(id);

            if (!row) {
                return { success: false, error: 'Cliente interno no encontrado' };
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
            const stmt = db.prepare(`UPDATE "tabla-clientes-internos" SET ${campos} WHERE id = ?`);
            const result = stmt.run([...valores, id]);

            return { success: true, changes: result.changes };
        } catch (err) {
            return { success: false, error: err.message };
        }
    }

    static eliminar(id) {
        try {
            const stmt = db.prepare('DELETE FROM "tabla-clientes-internos" WHERE id = ?');
            const result = stmt.run(id);

            return { success: true, changes: result.changes };
        } catch (err) {
            return { success: false, error: err.message };
        }
    }
}

module.exports = ClienteInterno;