const db = require('../database/db');

class ClienteInterno {
    static async crear(cliente) {
        const camposCompletos = {
            fecha_registro: new Date().toISOString(),
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
            riesgo_zona: cliente.riesgo_zona || null,
            categoria_pep: cliente.categoria_pep || null,
            ingresos_mensuales: cliente.ingresos_mensuales || null,
            volumen_actividad: cliente.volumen_actividad || null,
            frecuencia_actividad: cliente.frecuencia_actividad || null,
            domicilio_persona_sucursal: cliente.domicilio_persona_sucursal || null,
            integridad_documental: cliente.integridad_documental || null,
            exactitud_documental: cliente.exactitud_documental || null,
            vigencia_documental: cliente.vigencia_documental || null,
            relevancia_informacion: cliente.relevancia_informacion || null,
            consistencia_informacion: cliente.consistencia_informacion || null,
            comportamiento_cliente: cliente.comportamiento_cliente || null,
            observaciones: cliente.observaciones || null,
            
            // Campos numéricos adicionales
            nacionalidad_numerico: cliente.nacionalidad_numerico || null,
            riesgo_profesion_actividad_numerico: cliente.riesgo_profesion_actividad_numerico || null,
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



            //promedio de riesgo 


            promedio_riesgo_cliente_interno: cliente.promedio_riesgo_cliente_interno || null, 
            impacto: cliente.impacto || null,
            probabilidad: cliente.probabilidad || null,  
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

        return new Promise((resolve, reject) => {
            db.run(sql, valores, function (err) {
                if (err) {
                    console.error('Error al crear cliente interno:', err);
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
                `SELECT * FROM "tabla-clientes-internos" ORDER BY fecha_registro DESC`,
                [],
                (err, rows) => {
                    if (err) {
                        console.error('Error al listar clientes internos:', err);
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
                'SELECT * FROM "tabla-clientes-internos" WHERE id = ?',
                [id],
                (err, row) => {
                    if (err) {
                        reject({ success: false, error: err.message });
                    } else if (!row) {
                        reject({ success: false, error: 'Cliente interno no encontrado' });
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
                `UPDATE "tabla-clientes-internos" SET ${campos} WHERE id = ?`,
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
                'DELETE FROM "tabla-clientes-internos" WHERE id = ?',
                [id],
                function (err) {
                    if (err) {
                        console.error('Error al eliminar cliente interno:', err);
                        reject({ success: false, error: err.message });
                    } else {
                        resolve({ success: true, changes: this.changes });
                    }
                }
            );
        });
    }
}

module.exports = ClienteInterno;