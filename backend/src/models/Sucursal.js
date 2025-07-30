const db = require('../database/db');

class Sucursal {
    static async crear(sucursal) {
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
            
            // Campos numéricos para riesgos
            riesgo_departamento_numerico: sucursal.riesgo_departamento_numerico || null,
            riesgo_municipio_numerico: sucursal.riesgo_municipio_numerico || null,
            riesgo_zona_numerico: sucursal.riesgo_zona_numerico || null,
            riesgo_frontera_numerico: sucursal.riesgo_frontera_numerico || null,

            //promedio de riesgo 


            promedio_riesgo_zona_geografica: sucursal.promedio_riesgo_zona_geografica || null, 
            impacto: sucursal.impacto || null,
            probabilidad: sucursal.probabilidad || null,  
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

        return new Promise((resolve, reject) => {
            db.run(sql, valores, function (err) {
                if (err) {
                    console.error('Error al crear sucursal:', err);
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
                `SELECT * FROM "tabla-sucursales" ORDER BY fecha_registro DESC`,
                [],
                (err, rows) => {
                    if (err) {
                        console.error('Error al listar sucursales:', err);
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
                'SELECT * FROM "tabla-sucursales" WHERE id = ?',
                [id],
                (err, row) => {
                    if (err) {
                        reject({ success: false, error: err.message });
                    } else if (!row) {
                        reject({ success: false, error: 'Sucursal no encontrada' });
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
                `UPDATE "tabla-sucursales" SET ${campos} WHERE id = ?`,
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
                'DELETE FROM "tabla-sucursales" WHERE id = ?',
                [id],
                function (err) {
                    if (err) {
                        console.error('Error al eliminar sucursal:', err);
                        reject({ success: false, error: err.message });
                    } else {
                        resolve({ success: true, changes: this.changes });
                    }
                }
            );
        });
    }
}

module.exports = Sucursal;