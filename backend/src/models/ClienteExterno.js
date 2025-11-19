const db = require('../database/db');

class ClienteExterno {
    static crear(cliente) {
        const camposCompletos = {
            fecha_registro: new Date().toISOString(),
            oficina: cliente.oficina || null,
            ejecutivo: cliente.ejecutivo || null,
            cliente_interno_id: cliente.cliente_interno_id || null,
            tipo_sociedad: cliente.tipo_sociedad || null,
            nombres_propietario: cliente.nombres_propietario || null,
            apellidos_propietario: cliente.apellidos_propietario || null,
            tipo_documento_propietario: cliente.tipo_documento_propietario || null,
            nro_documento_propietario: cliente.nro_documento_propietario || null,
            extension_propietario: cliente.extension_propietario || null,
            otra_extension_propietario: cliente.otra_extension_propietario || null,
            fecha_nacimiento: cliente.fecha_nacimiento || null,
            lugar_nacimiento: cliente.lugar_nacimiento || null,
            nacionalidad: cliente.nacionalidad || null,
            pais_residencia: cliente.pais_residencia || null,
            estado_civil: cliente.estado_civil || null,
            telefono: cliente.telefono || null,
            celular: cliente.celular || null,
            profesion: cliente.profesion || null,
            razon_social: cliente.razon_social || null,
            nit: cliente.nit || null,
            matricula_comercio: cliente.matricula_comercio || null,
            actividad: cliente.actividad || null,
            riesgo_profesion_actividad: cliente.riesgo_profesion_actividad || null,
            lugar_trabajo: cliente.lugar_trabajo || null,
            cargo: cliente.cargo || null,
            gestion_ingreso: cliente.gestion_ingreso || null,
            riesgo_zona: cliente.riesgo_zona || null,
            ingresos_mensuales: cliente.ingresos_mensuales || null,
            volumen_actividad: cliente.volumen_actividad || null,
            frecuencia_actividad: cliente.frecuencia_actividad || null,
            categoria_pep: cliente.categoria_pep || null,
            domicilio_persona_sucursal: cliente.domicilio_persona_sucursal || null,
            domicilio_comercial_legal: cliente.domicilio_comercial_legal || null,
            correo: cliente.correo || null,
            nombres_conyugue: cliente.nombres_conyugue || null,
            apellidos_conyugue: cliente.apellidos_conyugue || null,
            actividad_conyugue: cliente.actividad_conyugue || null,
            ocupacion_conyugue: cliente.ocupacion_conyugue || null,
            nombres_representante: cliente.nombres_representante || null,
            apellidos_representante: cliente.apellidos_representante || null,
            tipo_documento_representante: cliente.tipo_documento_representante || null,
            nro_documento_representante: cliente.nro_documento_representante || null,
            extension_representante: cliente.extension_representante || null,
            otra_extension_representante: cliente.otra_extension_representante || null,
            compania: cliente.compania || null,
            ramo_seguro: cliente.ramo_seguro || null,
            zona_uso_seguro: cliente.zona_uso_seguro || null,
            riesgo_zona_uso_seguro: cliente.riesgo_zona_uso_seguro || null,
            tipo_documento: cliente.tipo_documento || null,
            fecha_inicio: cliente.fecha_inicio || null,
            fecha_fin: cliente.fecha_fin || null,
            nro_poliza: cliente.nro_poliza || null,
            valor_prima_dolares: cliente.valor_prima_dolares || null,
            frecuencia_contacto_fisico: cliente.frecuencia_contacto_fisico || null,
            frecuencia_contacto_digital: cliente.frecuencia_contacto_digital || null,
            medio_comunicacion: cliente.medio_comunicacion || null,
            integridad_documental: cliente.integridad_documental || null,
            exactitud_documental: cliente.exactitud_documental || null,
            vigencia_documental: cliente.vigencia_documental || null,
            relevancia_informacion: cliente.relevancia_informacion || null,
            consistencia_informacion: cliente.consistencia_informacion || null,
            comportamiento_cliente: cliente.comportamiento_cliente || null,
            observaciones: cliente.observaciones || null,
            autorizado_por_alta_gerencia: cliente.autorizado_por_alta_gerencia || null,
            alertas_vinculacion: cliente.alertas_vinculacion || null,
            alertas_emision_renovacion: cliente.alertas_emision_renovacion || null,
            alertas_rescision: cliente.alertas_rescision || null,
            alertas_activos_virtuales: cliente.alertas_activos_virtuales || null,
            nacionalidad_numerico: cliente.nacionalidad_numerico || null,
            riesgo_profesion_actividad_numerico: cliente.riesgo_profesion_actividad_numerico || null,
            riesgo_zona_numerico: cliente.riesgo_zona_numerico || null,
            ingresos_mensuales_numerico: cliente.ingresos_mensuales_numerico || null,
            volumen_actividad_numerico: cliente.volumen_actividad_numerico || null,
            frecuencia_actividad_numerico: cliente.frecuencia_actividad_numerico || null,
            categoria_pep_numerico: cliente.categoria_pep_numerico || null,
            riesgo_zona_uso_seguro_numerico: cliente.riesgo_zona_uso_seguro_numerico || null,
            frecuencia_contacto_fisico_numerico: cliente.frecuencia_contacto_fisico_numerico || null,
            frecuencia_contacto_digital_numerico: cliente.frecuencia_contacto_digital_numerico || null,
            medio_comunicacion_numerico: cliente.medio_comunicacion_numerico || null,
            integridad_documental_numerico: cliente.integridad_documental_numerico || null,
            exactitud_documental_numerico: cliente.exactitud_documental_numerico || null,
            vigencia_documental_numerico: cliente.vigencia_documental_numerico || null,
            relevancia_informacion_numerico: cliente.relevancia_informacion_numerico || null,
            consistencia_informacion_numerico: cliente.consistencia_informacion_numerico || null,
            comportamiento_cliente_numerico: cliente.comportamiento_cliente_numerico || null,
            probabilidad_canal_distribucion: cliente.probabilidad_canal_distribucion || null,
            impacto_canal_distribucion: cliente.impacto_canal_distribucion || null,
            promedio_riesgo_canal_distribucion: cliente.promedio_riesgo_canal_distribucion || null,
            probabilidad_cliente_externo: cliente.probabilidad_cliente_externo || null,
            impacto_cliente_externo: cliente.impacto_cliente_externo || null,
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

        const sql = `INSERT INTO "tabla-clientes-externos" (${campos.join(', ')}) VALUES (${placeholders.join(', ')})`;

        try {
            const stmt = db.prepare(sql);
            const result = stmt.run(valores);

            const insertedId = Number(result.lastInsertRowid);
            if (isNaN(insertedId)) {
            }

            return {
                success: true,
                id: insertedId,
                changes: result.changes
            };
        } catch (err) {
            return { success: false, error: err.message };
        }
    }

    static listarClientesExternosConRiesgoInterno() {
        try {
            const stmt = db.prepare(`SELECT 
                ce.*,
                ci.riesgo_residual,
                ci.nombres_cliente_interno || ' ' || ci.apellidos_cliente_interno AS ejecutivo_interno
             FROM "tabla-clientes-externos" ce
             LEFT JOIN "tabla-clientes-internos" ci 
                ON ce.ejecutivo = (ci.nombres_cliente_interno || ' ' || ci.apellidos_cliente_interno)
             ORDER BY ce.fecha_registro DESC`);

            const rows = stmt.all();
            const processedRows = rows.map(row => ({
                ...row,
                riesgo_residual: row.riesgo_residual
                    ? parseFloat(row.riesgo_residual)
                    : 0,
                ejecutivo_interno: row.ejecutivo_interno || 'admin'
            }));

            return { success: true, data: processedRows };
        } catch (err) {
            return { success: false, error: err.message };
        }
    }

    // Método para vincular el riesgo producto servicio
    static listarClientesExternosConRiesgoProductoServicio() {
        try {
            const stmt = db.prepare(`SELECT 
                ce.*,
                ps.promedio_riesgo_producto_servicio
             FROM "tabla-clientes-externos" ce
             LEFT JOIN "tabla-productos-servicios" ps 
                ON ce.ramo_seguro = ps.producto_servicio
             ORDER BY ce.fecha_registro DESC`);

            const rows = stmt.all();
            const processedRows = rows.map(row => ({
                ...row,
                promedio_riesgo_producto_servicio: row.promedio_riesgo_producto_servicio
                    ? parseFloat(row.promedio_riesgo_producto_servicio)
                    : 0
            }));

            return { success: true, data: processedRows };
        } catch (err) {
            return { success: false, error: err.message };
        }
    }

    static vincularClienteInterno(idClienteExterno, idClienteInterno) {
        try {
            const stmt = db.prepare(`UPDATE "tabla-clientes-externos" 
             SET cliente_interno_id = ? 
             WHERE id = ?`);

            const result = stmt.run([idClienteInterno, idClienteExterno]);
            return { success: true, changes: result.changes };
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
            const stmt = db.prepare(`UPDATE "tabla-clientes-externos" SET ${campos} WHERE id = ?`);
            const result = stmt.run([...valores, id]);

            return { success: true, changes: result.changes };
        } catch (err) {
            return { success: false, error: err.message };
        }
    }

    static listar() {
        try {
            const stmt = db.prepare(`SELECT * FROM "tabla-clientes-externos" ORDER BY fecha_registro DESC`);
            const rows = stmt.all();

            return { success: true, data: rows };
        } catch (err) {
            return { success: false, error: err.message };
        }
    }

    static eliminar(id) {
        try {
            const stmt = db.prepare('DELETE FROM "tabla-clientes-externos" WHERE id = ?');
            const result = stmt.run(id);

            return { success: true, changes: result.changes };
        } catch (err) {
            return { success: false, error: err.message };
        }
    }

    static bulkCreate(clientes) {
        try {
            // Usar transacción para mejor performance
            const insertTransaction = db.transaction((clientes) => {
                // 1. Limpiar tabla existente
                db.prepare("DELETE FROM \"tabla-clientes-externos\"").run();

                // 2. Obtener todas las columnas posibles de la tabla
                const columnsStmt = db.prepare("PRAGMA table_info(\"tabla-clientes-externos\")");
                const columns = columnsStmt.all();
                const allColumns = columns.map(col => col.name);

                let processedCount = 0;
                const errors = [];

                // 3. Insertar cada cliente
                for (let i = 0; i < clientes.length; i++) {
                    try {
                        const cliente = clientes[i];
                        const clienteConFecha = {
                            fecha_registro: new Date().toISOString(),
                            ...cliente
                        };

                        // Filtrar solo columnas que existen en la tabla
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

                        const sql = `INSERT INTO "tabla-clientes-externos" (${campos}) VALUES (${placeholders})`;
                        const stmt = db.prepare(sql);
                        stmt.run(valores);

                        processedCount++;
                    } catch (err) {
                        errors.push(`Error en registro ${i + 1}: ${err.message}`);
                    }
                }

                return { processedCount, errors };
            });

            const result = insertTransaction(clientes);

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

    static listarClientesConAlertas() {
        try {
            const stmt = db.prepare(`SELECT * FROM "tabla-clientes-externos" 
             WHERE alertas_vinculacion IS NOT NULL 
                OR alertas_emision_renovacion IS NOT NULL
                OR alertas_rescision IS NOT NULL
                OR alertas_activos_virtuales IS NOT NULL
             ORDER BY fecha_registro DESC`);

            const rows = stmt.all();
            return { success: true, data: rows };
        } catch (err) {
            return { success: false, error: err.message };
        }
    }
}

module.exports = ClienteExterno;