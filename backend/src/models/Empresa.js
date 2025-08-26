const db = require('../database/db');

class Empresa {
    static async obtener() {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM "tabla-empresa" ORDER BY id DESC LIMIT 1',
                (err, row) => {
                    if (err) {
                        console.error('Error al obtener datos de la empresa:', err);
                        reject({ success: false, error: err.message });
                    } else {
                        // Si no hay datos, retornar objeto vacío
                        const datos = row || {
                            nombre: '',
                            nit: '',
                            direccion: '',
                            telefono: ''
                        };
                        resolve({ success: true, data: datos });
                    }
                });
        });
    }

    static async guardar(datosEmpresa) {
        return new Promise((resolve, reject) => {
            // Primero verificar si ya existe un registro
            db.get('SELECT id FROM "tabla-empresa"', (err, row) => {
                if (err) {
                    reject({ success: false, error: err.message });
                    return;
                }

                if (row) {
                    // Actualizar registro existente
                    db.run(`UPDATE "tabla-empresa" 
                           SET nombre = ?, nit = ?, direccion = ?, telefono = ?, 
                               fecha_actualizacion = CURRENT_TIMESTAMP 
                           WHERE id = ?`,
                        [datosEmpresa.nombre, datosEmpresa.nit, datosEmpresa.direccion,
                        datosEmpresa.telefono, row.id],
                        function (err) {
                            if (err) {
                                reject({ success: false, error: err.message });
                            } else {
                                resolve({
                                    success: true,
                                    changes: this.changes,
                                    message: 'Datos actualizados correctamente'
                                });
                            }
                        }
                    );
                } else {
                    // Crear nuevo registro
                    db.run(`INSERT INTO "tabla-empresa" (nombre, nit, direccion, telefono) 
                           VALUES (?, ?, ?, ?)`,
                        [datosEmpresa.nombre, datosEmpresa.nit, datosEmpresa.direccion,
                        datosEmpresa.telefono],
                        function (err) {
                            if (err) {
                                reject({ success: false, error: err.message });
                            } else {
                                resolve({
                                    success: true,
                                    id: this.lastID,
                                    message: 'Datos guardados correctamente'
                                });
                            }
                        }
                    );
                }
            });
        });
    }
}

module.exports = Empresa;