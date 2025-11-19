// backend/src/models/Empresa.js - VERSIÓN CON CACHE
const db = require('../database/db');

// CACHE GLOBAL para evitar consultas repetidas
let empresaCache = {
    data: null,
    timestamp: null,
    timeout: 30000 // 30 segundos de cache
};

class Empresa {
    static obtener() {
        try {
            //  VERIFICAR CACHE primero
            const now = Date.now();
            if (empresaCache.data && empresaCache.timestamp && 
                (now - empresaCache.timestamp) < empresaCache.timeout) {
                return { 
                    success: true, 
                    data: empresaCache.data,
                    fromCache: true 
                };
            }

            const stmt = db.prepare('SELECT * FROM "tabla-empresa" ORDER BY id DESC LIMIT 1');
            const row = stmt.get();

            // Si no hay datos, retornar objeto vacío
            const datos = row || {
                nombre: '',
                nit: '',
                direccion: '',
                telefono: ''
            };

            //  GUARDAR EN CACHE
            empresaCache.data = datos;
            empresaCache.timestamp = now;

            return { 
                success: true, 
                data: datos,
                fromCache: false 
            };
        } catch (err) {
            return { success: false, error: err.message };
        }
    }

    static guardar(datosEmpresa) {
        try {
            // Primero verificar si ya existe un registro
            const checkStmt = db.prepare('SELECT id FROM "tabla-empresa"');
            const row = checkStmt.get();

            let result;

            if (row) {
                // Actualizar registro existente
                const updateStmt = db.prepare(`UPDATE "tabla-empresa" 
                       SET nombre = ?, nit = ?, direccion = ?, telefono = ?, 
                           fecha_actualizacion = CURRENT_TIMESTAMP 
                       WHERE id = ?`);

                result = updateStmt.run([
                    datosEmpresa.nombre,
                    datosEmpresa.nit,
                    datosEmpresa.direccion,
                    datosEmpresa.telefono,
                    row.id
                ]);
            } else {
                // Crear nuevo registro
                const insertStmt = db.prepare(`INSERT INTO "tabla-empresa" (nombre, nit, direccion, telefono) 
                       VALUES (?, ?, ?, ?)`);

                result = insertStmt.run([
                    datosEmpresa.nombre,
                    datosEmpresa.nit,
                    datosEmpresa.direccion,
                    datosEmpresa.telefono
                ]);
            }

            // LIMPIAR CACHE después de guardar
            empresaCache.data = null;
            empresaCache.timestamp = null;

            return {
                success: true,
                changes: result.changes,
                id: Number(result.lastInsertRowid) || row?.id,
                message: row ? 'Datos actualizados correctamente' : 'Datos guardados correctamente'
            };
        } catch (err) {
            return { success: false, error: err.message };
        }
    }

    //  MÉTODO PARA LIMPIAR CACHE MANUALMENTE
    static limpiarCache() {
        empresaCache.data = null;
        empresaCache.timestamp = null;
    }
}

module.exports = Empresa;