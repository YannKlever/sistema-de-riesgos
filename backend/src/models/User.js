// backend/src/models/User.js
const db = require('../database/db');
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 12;

class User {
            static async crear(usuario) {
        // Validaciones de entrada
        if (!usuario.nombre || usuario.nombre.length < 2 || usuario.nombre.length > 100) {
            return { success: false, error: 'El nombre debe tener entre 2 y 100 caracteres' };
        }
        
        if (!usuario.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(usuario.email)) {
            return { success: false, error: 'Email inválido' };
        }
        
        if (!usuario.password || usuario.password.length < 8) {
            return { success: false, error: 'La contraseña debe tener al menos 8 caracteres' };
        }
        
        // Verificar si el email ya existe - MANEJO CORREGIDO
        try {
            const existingUser = await this.obtenerPorEmail(usuario.email);
            if (existingUser.success) {
            return { success: false, error: 'El email ya está registrado' };
            }
        } catch (error) {
            // Si hay error (como usuario no encontrado), continuar con la creación
            console.log('Email no existe, puede continuar con creación');
        }
        
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
         
          resolve({ success: false, error: 'Usuario no encontrado' });
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
            // Validar nueva contraseña
            if (data.password.length < 8) {
                return { success: false, error: 'La contraseña debe tener al menos 8 caracteres' };
            }
            
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
        // No se permite eliminar físicamente, marcamos como inactivo
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
            // Añadir pequeño delay para prevenir timing attacks
            await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 100));
            
            const resultado = await this.obtenerPorEmail(email);
            if (!resultado.success) {
                // Respuesta genérica para no revelar si el usuario existe
                return { success: false, error: 'Credenciales inválidas' };
            }
            
            const usuario = resultado.data;
            
            // Verificar si la cuenta está activa
            if (!usuario.activo) {
                return { success: false, error: 'Cuenta desactivada' };
            }
            
            // Verificar contraseña
            const match = await bcrypt.compare(password, usuario.password_hash);
            
            if (match) {
                // Reiniciar intentos fallidos
                await this.actualizar(usuario.id, { 
                    ultimo_login: new Date().toISOString(),
                    intentos_fallidos: 0 
                });
                
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
                // Incrementar intentos fallidos
                const nuevosIntentos = (usuario.intentos_fallidos || 0) + 1;
                await this.actualizar(usuario.id, { 
                    intentos_fallidos: nuevosIntentos 
                });
                
                // Bloquear cuenta después de 8 intentos fallidos
                if (nuevosIntentos >= 8) {
                    await this.actualizar(usuario.id, { activo: 0 });
                    return { success: false, error: 'Cuenta bloqueada por demasiados intentos fallidos' };
                }
                
                return { success: false, error: 'Credenciales inválidas' };
            }
        } catch (error) {
            console.error('Error en verificarCredenciales:', error);
            return { success: false, error: 'Error en el proceso de autenticación' };
        }
    }
    // verificar estado inicial
        static async verificarEstadoInicial() {
            return new Promise((resolve, reject) => {
                db.get('SELECT COUNT(*) as count FROM "tabla-usuarios"', (err, row) => {
                    if (err) {
                        reject({ success: false, error: err.message });
                    } else {
                        resolve({ 
                            success: true, 
                            tieneUsuarios: row.count > 0,
                            totalUsuarios: row.count 
                        });
                    }
                });
            });
        }





    // Método para restablecer contraseña
    static async resetPassword(email, newPassword, resetToken = null) {
        try {
            const resultado = await this.obtenerPorEmail(email);
            if (!resultado.success) {
                // No revelar si el email existe por seguridad
                return { success: true }; // Siempre devolver éxito para no revelar información
            }
            
            const usuario = resultado.data;
            
            // Verificar token de restablecimiento 
            if (resetToken) {
                // Aquí iría la lógica de verificación del token
                
            }
            
            // Validar nueva contraseña
            if (newPassword.length < 8) {
                return { success: false, error: 'La contraseña debe tener al menos 8 caracteres' };
            }
            
            // Hashear nueva contraseña
            const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
            
            await this.actualizar(usuario.id, { 
                password_hash: hashedPassword,
                reset_token: null,
                reset_token_expira: null,
                intentos_fallidos: 0
            });
            
            return { success: true };
        } catch (error) {
            console.error('Error en resetPassword:', error);
            return { success: false, error: error.message };
        }
    }

    // Método para reactivar cuenta
    static async reactivarCuenta(id) {
        try {
            const resultado = await this.actualizar(id, { 
                activo: 1,
                intentos_fallidos: 0 
            });
            
            return resultado;
        } catch (error) {
            console.error('Error reactivando cuenta:', error);
            return { success: false, error: error.message };
        }
    }
}


module.exports = User;