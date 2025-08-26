// 007_usuarios.js
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 12;

async function up(db) {
    await createTable(db);
    await crearUsuarioPredeterminado(db);
}

async function createTable(db) {
    return new Promise((resolve, reject) => {
        db.run(`CREATE TABLE IF NOT EXISTS "tabla-usuarios" (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              fecha_registro TEXT DEFAULT CURRENT_TIMESTAMP,
              nombre TEXT NOT NULL,
              email TEXT NOT NULL UNIQUE,
              rol TEXT NOT NULL,
              password_hash TEXT NOT NULL,
              activo INTEGER DEFAULT 1,
              ultimo_login TEXT,
              intentos_fallidos INTEGER DEFAULT 0,
              reset_token TEXT,
              reset_token_expira TEXT)`,
            function (err) {
                if (err) {
                    console.error('Error al crear tabla tabla-usuarios:', err);
                    reject(err);
                } else {
                    console.log('Tabla tabla-usuarios creada/verificada exitosamente');
                    resolve();
                }
            }
        );
    });
}

async function crearUsuarioPredeterminado(db) {
    return new Promise(async (resolve, reject) => {
        try {
            // Verificar si ya existen usuarios
            db.get('SELECT COUNT(*) as count FROM "tabla-usuarios"', async (err, row) => {
                if (err) {
                    console.error('Error al verificar usuarios existentes:', err);
                    reject(err);
                    return;
                }

                if (row.count === 0) {
                    console.log('No hay usuarios en la base de datos. Creando usuario predeterminado...');
                    
                    // Crear usuario administrador predeterminado
                    const usuarioPredeterminado = {
                        nombre: 'Administrador',
                        email: 'admin@riesgos.com',
                        rol: 'admin',
                        password: 'Admin123!' // Contraseña segura por defecto
                    };

                    // Hashear la contraseña
                    const hashedPassword = await bcrypt.hash(usuarioPredeterminado.password, SALT_ROUNDS);

                    const sql = `INSERT INTO "tabla-usuarios" 
                                (nombre, email, rol, password_hash, activo) 
                                VALUES (?, ?, ?, ?, ?)`;

                    db.run(sql, [
                        usuarioPredeterminado.nombre,
                        usuarioPredeterminado.email,
                        usuarioPredeterminado.rol,
                        hashedPassword,
                        1
                    ], function (err) {
                        if (err) {
                            console.error('Error al crear usuario predeterminado:', err);
                            reject(err);
                        } else {
                            console.log('Usuario predeterminado creado exitosamente:');
                            console.log('Email: admin@riesgos.com');
                            console.log('Contraseña: Admin123!');
                            console.log('ROL: admin');
                            console.log('ID:', this.lastID);
                            resolve();
                        }
                    });
                } else {
                    console.log('Ya existen usuarios en la base de datos. No se creará usuario predeterminado.');
                    resolve();
                }
            });
        } catch (error) {
            console.error('Error en crearUsuarioPredeterminado:', error);
            reject(error);
        }
    });
}

module.exports = { up };