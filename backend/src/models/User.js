const db = require('../database/db');
const bcrypt = require('bcryptjs');
const SALT_ROUNDS = 12;

class User {
    static crear(usuario) {
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

        // Verificar si el email ya existe
        try {
            const existingUser = this.obtenerPorEmail(usuario.email);
            if (existingUser.success) {
                return { success: false, error: 'El email ya está registrado' };
            }
        } catch (error) {
            // Si hay error (como usuario no encontrado), continuar con la creación
        }

        // Hashear la contraseña antes de guardarla (síncrono con bcryptjs)
        const hashedPassword = bcrypt.hashSync(usuario.password, SALT_ROUNDS);

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
            const stmt = db.prepare(`SELECT id, nombre, email, rol, activo, ultimo_login 
                                   FROM "tabla-usuarios" 
                                   ORDER BY nombre ASC`);
            const rows = stmt.all();
            return { success: true, data: rows };
        } catch (err) {
            return { success: false, error: err.message };
        }
    }

    static obtenerPorId(id) {
        try {
            const stmt = db.prepare(`SELECT id, nombre, email, rol, activo, ultimo_login 
                                   FROM "tabla-usuarios" 
                                   WHERE id = ?`);
            const row = stmt.get(id);

            if (!row) {
                return { success: false, error: 'Usuario no encontrado' };
            }

            return { success: true, data: row };
        } catch (err) {
            return { success: false, error: err.message };
        }
    }

    static obtenerPorEmail(email) {
        try {
            const stmt = db.prepare(`SELECT * FROM "tabla-usuarios" WHERE email = ?`);
            const row = stmt.get(email);

            if (!row) {
                return { success: false, error: 'Usuario no encontrado' };
            }

            return { success: true, data: row };
        } catch (err) {
            return { success: false, error: err.message };
        }
    }

    static actualizar(id, data) {
        // Si se está actualizando la contraseña, hashearla primero
        if (data.password) {
            // Validar nueva contraseña
            if (data.password.length < 8) {
                return { success: false, error: 'La contraseña debe tener al menos 8 caracteres' };
            }

            data.password_hash = bcrypt.hashSync(data.password, SALT_ROUNDS);
            delete data.password;
        }

        const campos = Object.keys(data)
            .filter(key => key !== 'id')
            .map(key => `"${key}" = ?`)
            .join(', ');

        const valores = Object.values(data);

        try {
            const stmt = db.prepare(`UPDATE "tabla-usuarios" SET ${campos} WHERE id = ?`);
            const result = stmt.run([...valores, id]);

            return { success: true, changes: result.changes };
        } catch (err) {
            return { success: false, error: err.message };
        }
    }

    static eliminar(id) {
        // No se permite eliminar físicamente, marcamos como inactivo
        try {
            const stmt = db.prepare('UPDATE "tabla-usuarios" SET activo = 0 WHERE id = ?');
            const result = stmt.run(id);

            return { success: true, changes: result.changes };
        } catch (err) {
            return { success: false, error: err.message };
        }
    }

    static verificarCredenciales(email, password) {
        try {
            // Añadir pequeño delay para prevenir timing attacks
            const delay = 100 + Math.random() * 100;
            const start = Date.now();
            while (Date.now() - start < delay) { /* Espera síncrona */ }

            const resultado = this.obtenerPorEmail(email);
            if (!resultado.success) {
                // Respuesta genérica para no revelar si el usuario existe
                return { success: false, error: 'Credenciales inválidas' };
            }

            const usuario = resultado.data;

            // Verificar si la cuenta está activa
            if (!usuario.activo) {
                return { success: false, error: 'Cuenta desactivada' };
            }

            // Verificar contraseña (síncrono con bcryptjs)
            const match = bcrypt.compareSync(password, usuario.password_hash);

            if (match) {
                // Reiniciar intentos fallidos
                this.actualizar(usuario.id, {
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
                this.actualizar(usuario.id, {
                    intentos_fallidos: nuevosIntentos
                });

                // Bloquear cuenta después de 8 intentos fallidos
                if (nuevosIntentos >= 8) {
                    this.actualizar(usuario.id, { activo: 0 });
                    return { success: false, error: 'Cuenta bloqueada por demasiados intentos fallidos' };
                }

                return { success: false, error: 'Credenciales inválidas' };
            }
        } catch (error) {
            return { success: false, error: 'Error en el proceso de autenticación' };
        }
    }

    static verificarEstadoInicial() {
        try {
            const stmt = db.prepare('SELECT COUNT(*) as count FROM "tabla-usuarios"');
            const row = stmt.get();

            return {
                success: true,
                tieneUsuarios: row.count > 0,
                totalUsuarios: row.count
            };
        } catch (err) {
            return { success: false, error: err.message };
        }
    }

    // Método para restablecer contraseña
    static resetPassword(email, newPassword, resetToken = null) {
        try {
            const resultado = this.obtenerPorEmail(email);
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
            const hashedPassword = bcrypt.hashSync(newPassword, SALT_ROUNDS);

            this.actualizar(usuario.id, {
                password_hash: hashedPassword,
                reset_token: null,
                reset_token_expira: null,
                intentos_fallidos: 0
            });

            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Método para reactivar cuenta
    static reactivarCuenta(id) {
        try {
            const resultado = this.actualizar(id, {
                activo: 1,
                intentos_fallidos: 0
            });

            return resultado;
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

module.exports = User;