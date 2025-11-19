const db = require('../database/db');

class Sucursal {
    static crear(sucursal) {
        const camposCompletos = {
            fecha_registro: new Date().toISOString(),
            oficina: sucursal.oficina || null,
            ubicacion: sucursal.ubicacion || null,
            departamento: sucursal.departamento || null,
            riesgo_departamento: sucursal.riesgo_departamento || null,
            municipio: sucursal.municipio || null,
            riesgo_municipio: sucursal.riesgo_municipio || null,
            zona: sucursal.zona || null,
            riesgo_zona: sucursal.riesgo_zona || null,
            frontera: sucursal.frontera || null,
            riesgo_frontera: sucursal.riesgo_frontera || null,
            observaciones: sucursal.observaciones || null,
            riesgo_departamento_numerico: sucursal.riesgo_departamento_numerico || null,
            riesgo_municipio_numerico: sucursal.riesgo_municipio_numerico || null,
            riesgo_zona_numerico: sucursal.riesgo_zona_numerico || null,
            riesgo_frontera_numerico: sucursal.riesgo_frontera_numerico || null,
            probabilidad: sucursal.probabilidad || null,
            impacto_texto: sucursal.impacto_texto || null,
            impacto: sucursal.impacto || null,
            promedio_riesgo_zona_geografica: sucursal.promedio_riesgo_zona_geografica || null
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

        const sql = `INSERT INTO "tabla-sucursales" (${campos.join(', ')}) VALUES (${placeholders.join(', ')})`;

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
            const stmt = db.prepare(`SELECT * FROM "tabla-sucursales" ORDER BY fecha_registro DESC`);
            const rows = stmt.all();
            return { success: true, data: rows };
        } catch (err) {
            return { success: false, error: err.message };
        }
    }

    static obtenerPorId(id) {
        try {
            const stmt = db.prepare('SELECT * FROM "tabla-sucursales" WHERE id = ?');
            const row = stmt.get(id);
            
            if (!row) {
                return { success: false, error: 'Sucursal no encontrada' };
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
            const stmt = db.prepare(`UPDATE "tabla-sucursales" SET ${campos} WHERE id = ?`);
            const result = stmt.run([...valores, id]);
            
            return { success: true, changes: result.changes };
        } catch (err) {
            return { success: false, error: err.message };
        }
    }

    static bulkCreate(sucursales) {
        try {
            const insertTransaction = db.transaction((sucursales) => {
                db.prepare("DELETE FROM \"tabla-sucursales\"").run();

                const columnsStmt = db.prepare("PRAGMA table_info(\"tabla-sucursales\")");
                const columns = columnsStmt.all();
                const allColumns = columns.map(col => col.name);

                let processedCount = 0;
                const errors = [];

                for (let i = 0; i < sucursales.length; i++) {
                    try {
                        const sucursal = sucursales[i];
                        const sucursalConFecha = {
                            fecha_registro: new Date().toISOString(),
                            ...sucursal
                        };

                        const camposDisponibles = Object.keys(sucursalConFecha)
                            .filter(key => allColumns.includes(key));

                        const campos = camposDisponibles.map(c => `"${c}"`).join(', ');
                        const placeholders = camposDisponibles.map(() => '?').join(', ');

                        const valores = camposDisponibles.map(key => {
                            const val = sucursalConFecha[key];
                            return val !== null && typeof val === 'object' && !(val instanceof Date)
                                ? JSON.stringify(val)
                                : val;
                        });

                        const sql = `INSERT INTO "tabla-sucursales" (${campos}) VALUES (${placeholders})`;
                        const stmt = db.prepare(sql);
                        stmt.run(valores);
                        
                        processedCount++;
                    } catch (err) {
                        errors.push(`Error en registro ${i + 1}: ${err.message}`);
                    }
                }

                return { processedCount, errors };
            });

            const result = insertTransaction(sucursales);
            
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
            const stmt = db.prepare('DELETE FROM "tabla-sucursales" WHERE id = ?');
            const result = stmt.run(id);
            
            return { success: true, changes: result.changes };
        } catch (err) {
            return { success: false, error: err.message };
        }
    }
}

module.exports = Sucursal;