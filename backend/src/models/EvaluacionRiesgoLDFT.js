const db = require('../database/db');

class EvaluacionRiesgoLDFT {
    static crear(evaluacion) {
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
                acc.valores.push(valor !== null && typeof valor === 'object' && !(valor instanceof Date) ?
                    JSON.stringify(valor) : valor);
                return acc;
            },
            { campos: [], placeholders: [], valores: [] }
        );

        const sql = `INSERT INTO "evaluaciones_riesgo_ld_ft" (${campos.join(', ')}) VALUES (${placeholders.join(', ')})`;

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
            const stmt = db.prepare(`SELECT * FROM "evaluaciones_riesgo_ld_ft" ORDER BY fecha_evaluacion DESC`);
            const rows = stmt.all();
            return { success: true, data: rows };
        } catch (err) {
            return { success: false, error: err.message };
        }
    }




static obtenerPorId(id) {
    try {
        console.log(`🔍 Buscando evaluación LD/FT con ID: ${id}`);
        
       
        const stmt = db.prepare('SELECT * FROM "evaluaciones_riesgo_ld_ft" WHERE id = ?');
        const result = stmt.get(id);
        
        console.log('📊 Resultado de la consulta:', result);
        
        if (result) {
            return { 
                success: true, 
                data: result 
            };
        } else {
            console.log(`❌ No se encontró evaluación con ID: ${id}`);
            return { 
                success: false, 
                error: 'Evaluación no encontrada' 
            };
        }
    } catch (error) {
        console.error('🚨 Error al obtener evaluación por ID:', error);
        return { 
            success: false, 
            error: error.message 
        };
    }
}

    static actualizar(id, data) {
        const campos = Object.keys(data)
            .filter(key => key !== 'id')
            .map(key => `"${key}" = ?`)
            .join(', ');

        const valores = Object.values(data);

        try {
            const stmt = db.prepare(`UPDATE "evaluaciones_riesgo_ld_ft" SET ${campos} WHERE id = ?`);
            const result = stmt.run([...valores, id]);

            return { success: true, changes: result.changes };
        } catch (err) {
            return { success: false, error: err.message };
        }
    }

    static eliminar(id) {
        try {
            const stmt = db.prepare('DELETE FROM "evaluaciones_riesgo_ld_ft" WHERE id = ?');
            const result = stmt.run(id);

            return { success: true, changes: result.changes };
        } catch (err) {
            return { success: false, error: err.message };
        }
    }

    static calcularPromedioRiesgo(evaluacionId) {
        try {
            const stmt = db.prepare(`
                SELECT 
                    AVG(
                        COALESCE(p1_1_numerico, 0) + COALESCE(p1_2_numerico, 0) +
                        COALESCE(p2_1_numerico, 0) + COALESCE(p2_2_numerico, 0) + COALESCE(p2_3_numerico, 0) +
                        COALESCE(p3_1_numerico, 0) + COALESCE(p3_2_numerico, 0) + COALESCE(p3_3_numerico, 0) +
                        COALESCE(p4_1_numerico, 0) + COALESCE(p4_2_numerico, 0) + COALESCE(p4_3_numerico, 0) +
                        COALESCE(p5_1_numerico, 0) + COALESCE(p5_2_numerico, 0) + COALESCE(p5_3_numerico, 0) +
                        COALESCE(p6_1_numerico, 0) + COALESCE(p6_2_numerico, 0) + COALESCE(p6_3_numerico, 0) +
                        COALESCE(p7_1_numerico, 0) + COALESCE(p7_2_numerico, 0) +
                        COALESCE(p8_1_numerico, 0) + COALESCE(p8_2_numerico, 0) + COALESCE(p8_3_numerico, 0) +
                        COALESCE(p9_1_numerico, 0) + COALESCE(p9_2_numerico, 0) + COALESCE(p9_3_numerico, 0)
                    ) / 25 as promedio_riesgo
                FROM "evaluaciones_riesgo_ld_ft" 
                WHERE id = ?
            `);

            const resultado = stmt.get(evaluacionId);
            return resultado ? resultado.promedio_riesgo : 0;
        } catch (err) {
            return 0;
        }
    }

    static obtenerEstadisticas() {
        try {
            const stmt = db.prepare(`
                SELECT 
                    COUNT(*) as total_evaluaciones,
                    AVG(promedio_riesgo) as promedio_general,
                    MAX(fecha_evaluacion) as ultima_evaluacion,
                    MIN(fecha_evaluacion) as primera_evaluacion
                FROM "evaluaciones_riesgo_ld_ft"
            `);

            const estadisticas = stmt.get();
            return { success: true, data: estadisticas };
        } catch (err) {
            return { success: false, error: err.message };
        }
    }
}

module.exports = EvaluacionRiesgoLDFT;