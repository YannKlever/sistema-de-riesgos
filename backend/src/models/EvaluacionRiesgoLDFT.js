const db = require('../database/db');

class EvaluacionRiesgoLDFT {
    static async crear(evaluacion) {
        const camposCompletos = {
            fecha_evaluacion: new Date().toISOString(),
            usuario: evaluacion.usuario || 'Sistema',
            detalles: evaluacion.detalles || '',
            
            // Sección 1: Administración del Riesgo de LD/FT
            p1_1: evaluacion.p1_1 || null,
            p1_1_numerico: evaluacion.p1_1_numerico || null,
            p1_2: evaluacion.p1_2 || null,
            p1_2_numerico: evaluacion.p1_2_numerico || null,
            
            // Sección 2: Involucramiento de la Administración
            p2_1: evaluacion.p2_1 || null,
            p2_1_numerico: evaluacion.p2_1_numerico || null,
            p2_2: evaluacion.p2_2 || null,
            p2_2_numerico: evaluacion.p2_2_numerico || null,
            p2_3: evaluacion.p2_3 || null,
            p2_3_numerico: evaluacion.p2_3_numerico || null,
            
            // Sección 3: Política "Conozca a su Cliente"
            p3_1: evaluacion.p3_1 || null,
            p3_1_numerico: evaluacion.p3_1_numerico || null,
            p3_2: evaluacion.p3_2 || null,
            p3_2_numerico: evaluacion.p3_2_numerico || null,
            p3_3: evaluacion.p3_3 || null,
            p3_3_numerico: evaluacion.p3_3_numerico || null,
            
            // Sección 4: Monitoreo de Transacciones
            p4_1: evaluacion.p4_1 || null,
            p4_1_numerico: evaluacion.p4_1_numerico || null,
            p4_2: evaluacion.p4_2 || null,
            p4_2_numerico: evaluacion.p4_2_numerico || null,
            p4_3: evaluacion.p4_3 || null,
            p4_3_numerico: evaluacion.p4_3_numerico || null,
            
            // Sección 5: Gestión del Oficial de Cumplimiento
            p5_1: evaluacion.p5_1 || null,
            p5_1_numerico: evaluacion.p5_1_numerico || null,
            p5_2: evaluacion.p5_2 || null,
            p5_2_numerico: evaluacion.p5_2_numerico || null,
            p5_3: evaluacion.p5_3 || null,
            p5_3_numerico: evaluacion.p5_3_numerico || null,
            
            // Sección 6: Programas de Capacitación
            p6_1: evaluacion.p6_1 || null,
            p6_1_numerico: evaluacion.p6_1_numerico || null,
            p6_2: evaluacion.p6_2 || null,
            p6_2_numerico: evaluacion.p6_2_numerico || null,
            p6_3: evaluacion.p6_3 || null,
            p6_3_numerico: evaluacion.p6_3_numerico || null,
            
            // Sección 7: Programas de Auditoría
            p7_1: evaluacion.p7_1 || null,
            p7_1_numerico: evaluacion.p7_1_numerico || null,
            p7_2: evaluacion.p7_2 || null,
            p7_2_numerico: evaluacion.p7_2_numerico || null,
            
            // Sección 8: Vulnerabilidades en el Proceso de Debida Diligencia
            p8_1: evaluacion.p8_1 || null,
            p8_1_numerico: evaluacion.p8_1_numerico || null,
            p8_2: evaluacion.p8_2 || null,
            p8_2_numerico: evaluacion.p8_2_numerico || null,
            p8_3: evaluacion.p8_3 || null,
            p8_3_numerico: evaluacion.p8_3_numerico || null,
            
            // Sección 9: Vulnerabilidades en los Controles Internos
            p9_1: evaluacion.p9_1 || null,
            p9_1_numerico: evaluacion.p9_1_numerico || null,
            p9_2: evaluacion.p9_2 || null,
            p9_2_numerico: evaluacion.p9_2_numerico || null,
            p9_3: evaluacion.p9_3 || null,
            p9_3_numerico: evaluacion.p9_3_numerico || null,


            promedio_riesgo: evaluacion.promedio_riesgo || null, 
            impacto: evaluacion.impacto || null,
            probabilidad: evaluacion.probabilidad || null,  

            
            
           
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

        const sql = `INSERT INTO "evaluaciones_riesgo_ld_ft" (${campos.join(', ')}) VALUES (${placeholders.join(', ')})`;

        return new Promise((resolve, reject) => {
            db.run(sql, valores, function (err) {
                if (err) {
                    console.error('Error al crear evaluación de riesgo LD/FT:', err);
                    console.error('Consulta SQL:', sql);
                    console.error('Valores:', valores);
                    reject({ success: false, error: err.message });
                } else {
                    // Debug similar al ejemplo original
                    console.log('Resultado de inserción:', {
                        lastID: this.lastID,
                        changes: this.changes,
                        tipoLastID: typeof this.lastID
                    });

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
                `SELECT * FROM "evaluaciones_riesgo_ld_ft" ORDER BY fecha_evaluacion DESC`,
                [],
                (err, rows) => {
                    if (err) {
                        console.error('Error en consulta SQL:', err);
                        reject({ success: false, error: err.message });
                    } else {
                        console.log('Evaluaciones encontradas:', rows.length); // Debug
                        resolve({ success: true, data: rows });
                    }
                }
            );
        });
    }

    static async obtenerPorId(id) {
        return new Promise((resolve, reject) => {
            db.get(
                'SELECT * FROM "evaluaciones_riesgo_ld_ft" WHERE id = ?',
                [id],
                (err, row) => {
                    if (err) {
                        console.error('Error al obtener evaluación:', err);
                        reject({ success: false, error: err.message });
                    } else if (!row) {
                        reject({ success: false, error: 'Evaluación no encontrada' });
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
                `UPDATE "evaluaciones_riesgo_ld_ft" SET ${campos} WHERE id = ?`,
                [...valores, id],
                function (err) {
                    if (err) {
                        console.error('Error al actualizar evaluación:', err);
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
                'DELETE FROM "evaluaciones_riesgo_ld_ft" WHERE id = ?',
                [id],
                function (err) {
                    if (err) {
                        console.error('Error al eliminar evaluación:', err);
                        reject({ success: false, error: err.message });
                    } else {
                        resolve({ success: true, changes: this.changes });
                    }
                }
            );
        });
    }
}

module.exports = EvaluacionRiesgoLDFT;