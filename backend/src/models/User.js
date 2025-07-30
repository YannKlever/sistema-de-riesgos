const db = require('../database/db');
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

class User {
    static async crear(usuario) {
        // Hashear la contraseña antes de guardarla
        const hashedPassword = await bcrypt.hash(usuario.password, SALT_ROUNDS);
        
        const camposCompletos = {
            nombre: usuario.nombre || null,
            email: usuario.email || null,
            rol: usuario.rol || 'user',
            password_hash: hashedPassword,
            activo: 1
        };

        const { campos, placeholders, valores } = Object.entries(camposCompletos).reduce(
            (acc, [campo, valor]) => {
                acc.campos.push(`"${campo}"`);
                acc.placeholders.push('?');
                acc.valores.push(valor);
                return acc;
            },
            { campos: [], placeholders: [], valores: [] }
        );

        const sql = `INSERT INTO "tabla-usuarios" (${campos.join(', ')}) VALUES (${placeholders.join(', ')})`;

        return new Promise((resolve, reject) => {
            db.run(sql, valores, function (err) {
                if (err) {
                    console.error('Error al crear usuario:', err);
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
                `SELECT id, nombre, email, rol, activo, ultimo_login 
                 FROM "tabla-usuarios" 
                 ORDER BY nombre ASC`,
                [],
                (err, rows) => {
                    if (err) {
                        console.error('Error al listar usuarios:', err);
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
                `SELECT id, nombre, email, rol, activo, ultimo_login 
                 FROM "tabla-usuarios" 
                 WHERE id = ?`,
                [id],
                (err, row) => {
                    if (err) {
                        reject({ success: false, error: err.message });
                    } else if (!row) {
                        reject({ success: false, error: 'Usuario no encontrado' });
                    } else {
                        resolve({ success: true, data: row });
                    }
                }
            );
        });
    }

    static async obtenerPorEmail(email) {
        return new Promise((resolve, reject) => {
            db.get(
                `SELECT * FROM "tabla-usuarios" WHERE email = ?`,
                [email],
                (err, row) => {
                    if (err) {
                        reject({ success: false, error: err.message });
                    } else if (!row) {
                        reject({ success: false, error: 'Usuario no encontrado' });
                    } else {
                        resolve({ success: true, data: row });
                    }
                }
            );
        });
    }

    static async actualizar(id, data) {
        // Si se está actualizando la contraseña, hashearla primero
        if (data.password) {
            data.password_hash = await bcrypt.hash(data.password, SALT_ROUNDS);
            delete data.password;
        }

        const campos = Object.keys(data)
            .filter(key => key !== 'id')
            .map(key => `"${key}" = ?`)
            .join(', ');

        const valores = Object.values(data);

        return new Promise((resolve, reject) => {
            db.run(
                `UPDATE "tabla-usuarios" SET ${campos} WHERE id = ?`,
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
        // No permitimos eliminar físicamente, marcamos como inactivo
        return new Promise((resolve, reject) => {
            db.run(
                'UPDATE "tabla-usuarios" SET activo = 0 WHERE id = ?',
                [id],
                function (err) {
                    if (err) {
                        console.error('Error al desactivar usuario:', err);
                        reject({ success: false, error: err.message });
                    } else {
                        resolve({ success: true, changes: this.changes });
                    }
                }
            );
        });
    }

    static async verificarCredenciales(email, password) {
        try {
            const resultado = await this.obtenerPorEmail(email);
            if (!resultado.success) return { success: false, error: 'Credenciales inválidas' };
            
            const usuario = resultado.data;
            const match = await bcrypt.compare(password, usuario.password_hash);
            
            if (match) {
                // Actualizar último login
                await this.actualizar(usuario.id, { ultimo_login: new Date().toISOString() });
                return { 
                    success: true, 
                    data: {
                        id: usuario.id,
                        nombre: usuario.nombre,
                        email: usuario.email,
                        rol: usuario.rol
                    }
                };
            } else {
                return { success: false, error: 'Credenciales inválidas' };
            }
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

module.exports = User;