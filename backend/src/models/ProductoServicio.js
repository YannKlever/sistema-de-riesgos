const db = require('../database/db');

class ProductoServicio {
    static async crear(producto) {
        const camposCompletos = {
            producto_servicio: producto.producto_servicio || null,
            riesgo_producto: producto.riesgo_producto || null,
            riesgo_cliente: producto.riesgo_cliente || null,
            oficina:producto.oficina || null,
            observaciones: producto.observaciones || null,
            
            // Solo estos dos campos numéricos adicionales
            riesgo_producto_numerico: producto.riesgo_producto_numerico || null,
            riesgo_cliente_numerico: producto.riesgo_cliente_numerico || null,
            //promedio de riesgo 


            promedio_riesgo_producto_servicio: producto.promedio_riesgo_producto_servicio || null, 
            impacto: producto.impacto || null,
            probabilidad: producto.probabilidad || null,

            
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

        return new Promise((resolve, reject) => {
            db.run(sql, valores, function (err) {
                if (err) {
                    console.error('Error al crear producto/servicio:', err);
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



// Método para obtener riesgo zona geográfica desde sucursales
static async obtenerRiesgoZonaPorOficina(oficina) {
    return new Promise((resolve, reject) => {
        db.get(
            'SELECT promedio_riesgo_zona_geografica FROM "tabla-sucursales" WHERE oficina = ?',
            [oficina],
            (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row ? row.promedio_riesgo_zona_geografica : 0);
                }
            }
        );
    });
}

// Método para obtener riesgo canal distribución desde clientes externos
static async obtenerRiesgoCanalPorOficina(oficina) {
    return new Promise((resolve, reject) => {
        db.get(
            'SELECT promedio_riesgo_canal_distribucion FROM "tabla-clientes-externos" WHERE oficina = ?',
            [oficina],
            (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row ? row.promedio_riesgo_canal_distribucion : 0);
                }
            }
        );
    });
}

// Método listar actualizado
static async listar() {
    return new Promise(async (resolve, reject) => {
        try {
            // Primero obtenemos los productos/servicios
            db.all(
                'SELECT * FROM "tabla-productos-servicios" ORDER BY fecha_registro DESC',
                [],
                async (err, productos) => {
                    if (err) {
                        reject({ success: false, error: err.message });
                        return;
                    }

                    // Para cada producto, obtenemos los riesgos adicionales
                    const productosCompletos = await Promise.all(
                        productos.map(async (producto) => {
                            try {
                                const [riesgoZona, riesgoCanal] = await Promise.all([
                                    this.obtenerRiesgoZonaPorOficina(producto.oficina),
                                    this.obtenerRiesgoCanalPorOficina(producto.oficina)
                                ]);

                                return {
                                    ...producto,
                                    riesgo_zona_geografica: riesgoZona,
                                    riesgo_canal_distribucion: riesgoCanal
                                };
                            } catch (error) {
                                console.error(`Error obteniendo riesgos para oficina ${producto.oficina}:`, error);
                                return {
                                    ...producto,
                                    riesgo_zona_geografica: 0,
                                    riesgo_canal_distribucion: 0
                                };
                            }
                        })
                    );

                    resolve({ success: true, data: productosCompletos });
                }
            );
        } catch (error) {
            reject({ success: false, error: error.message });
        }
    });
}
    static async obtenerPorId(id) {
        return new Promise((resolve, reject) => {
            db.get(
                'SELECT * FROM "tabla-productos-servicios" WHERE id = ?',
                [id],
                (err, row) => {
                    if (err) {
                        reject({ success: false, error: err.message });
                    } else if (!row) {
                        reject({ success: false, error: 'Producto/servicio no encontrado' });
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
                `UPDATE "tabla-productos-servicios" SET ${campos} WHERE id = ?`,
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

    static async eliminar(id) {
        return new Promise((resolve, reject) => {
            db.run(
                'DELETE FROM "tabla-productos-servicios" WHERE id = ?',
                [id],
                function (err) {
                    if (err) {
                        console.error('Error al eliminar producto/servicio:', err);
                        reject({ success: false, error: err.message });
                    } else {
                        resolve({ success: true, changes: this.changes });
                    }
                }
            );
        });
    }
}

module.exports = ProductoServicio;