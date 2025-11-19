const db = require('../database/db');

class ProductoServicio {
    static crear(producto) {
        const camposCompletos = {
            fecha_registro: producto.fecha_registro || new Date().toISOString(),
            producto_servicio: producto.producto_servicio || null,
            riesgo_producto: producto.riesgo_producto || null,
            oficina: producto.oficina || null,
            riesgo_cliente: producto.riesgo_cliente || null,
            observaciones: producto.observaciones || null,
            riesgo_producto_numerico: producto.riesgo_producto_numerico || null,
            riesgo_cliente_numerico: producto.riesgo_cliente_numerico || null,
            probabilidad: producto.probabilidad || null,
            impacto_texto: producto.impacto_texto || null,
            impacto: producto.impacto || null,
            promedio_riesgo_producto_servicio: producto.promedio_riesgo_producto_servicio || null,
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

        const sql = `INSERT INTO "tabla-productos-servicios" (${campos.join(', ')}) VALUES (${placeholders.join(', ')})`;

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

    // Método para obtener riesgo zona geográfica desde sucursales
    static obtenerRiesgoZonaPorOficina(oficina) {
        try {
            const stmt = db.prepare('SELECT promedio_riesgo_zona_geografica FROM "tabla-sucursales" WHERE oficina = ?');
            const row = stmt.get(oficina);
            return row ? row.promedio_riesgo_zona_geografica : 0;
        } catch (err) {
            return 0;
        }
    }

    // Método para obtener riesgo canal distribución desde clientes externos
    static obtenerRiesgoCanalPorOficina(oficina) {
        try {
            const stmt = db.prepare('SELECT promedio_riesgo_canal_distribucion FROM "tabla-clientes-externos" WHERE oficina = ?');
            const row = stmt.get(oficina);
            return row ? row.promedio_riesgo_canal_distribucion : 0;
        } catch (err) {
            return 0;
        }
    }

    // Método listar actualizado
    static listar() {
        try {
            // Primero obtenemos los productos/servicios
            const stmt = db.prepare('SELECT * FROM "tabla-productos-servicios" ORDER BY fecha_registro DESC');
            const productos = stmt.all();

            // Para cada producto, obtenemos los riesgos adicionales
            const productosCompletos = productos.map((producto) => {
                try {
                    const riesgoZona = this.obtenerRiesgoZonaPorOficina(producto.oficina);
                    const riesgoCanal = this.obtenerRiesgoCanalPorOficina(producto.oficina);

                    return {
                        ...producto,
                        riesgo_zona_geografica: riesgoZona,
                        riesgo_canal_distribucion: riesgoCanal
                    };
                } catch (error) {
                    return {
                        ...producto,
                        riesgo_zona_geografica: 0,
                        riesgo_canal_distribucion: 0
                    };
                }
            });

            return { success: true, data: productosCompletos };
        } catch (err) {
            return { success: false, error: err.message };
        }
    }

    static obtenerPorId(id) {
        try {
            const stmt = db.prepare('SELECT * FROM "tabla-productos-servicios" WHERE id = ?');
            const row = stmt.get(id);

            if (!row) {
                return { success: false, error: 'Producto/servicio no encontrado' };
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
            const stmt = db.prepare(`UPDATE "tabla-productos-servicios" SET ${campos} WHERE id = ?`);
            const result = stmt.run([...valores, id]);

            return { success: true, changes: result.changes };
        } catch (err) {
            return { success: false, error: err.message };
        }
    }

    // Para importar
    static bulkCreate(productosServicios) {
        try {
            // Usar transacción para mejor performance
            const insertTransaction = db.transaction((productosServicios) => {
                // 1. Limpiar tabla existente
                db.prepare("DELETE FROM \"tabla-productos-servicios\"").run();

                // 2. Obtener todas las columnas posibles de la tabla
                const columnsStmt = db.prepare("PRAGMA table_info(\"tabla-productos-servicios\")");
                const columns = columnsStmt.all();
                const allColumns = columns.map(col => col.name);

                let processedCount = 0;
                const errors = [];

                // 3. Insertar cada producto/servicio
                for (let i = 0; i < productosServicios.length; i++) {
                    try {
                        const producto = productosServicios[i];
                        const productoConFecha = {
                            fecha_registro: new Date().toISOString(),
                            ...producto
                        };

                        // Filtrar solo columnas que existen en la tabla
                        const camposDisponibles = Object.keys(productoConFecha)
                            .filter(key => allColumns.includes(key));

                        const campos = camposDisponibles.map(c => `"${c}"`).join(', ');
                        const placeholders = camposDisponibles.map(() => '?').join(', ');

                        const valores = camposDisponibles.map(key => {
                            const val = productoConFecha[key];
                            return val !== null && typeof val === 'object' && !(val instanceof Date)
                                ? JSON.stringify(val)
                                : val;
                        });

                        const sql = `INSERT INTO "tabla-productos-servicios" (${campos}) VALUES (${placeholders})`;
                        const stmt = db.prepare(sql);
                        stmt.run(valores);

                        processedCount++;
                    } catch (err) {
                        errors.push(`Error en registro ${i + 1}: ${err.message}`);
                    }
                }

                return { processedCount, errors };
            });

            const result = insertTransaction(productosServicios);

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
            const stmt = db.prepare('DELETE FROM "tabla-productos-servicios" WHERE id = ?');
            const result = stmt.run(id);

            return { success: true, changes: result.changes };
        } catch (err) {
            return { success: false, error: err.message };
        }
    }
}

module.exports = ProductoServicio;