const bcrypt = require('bcryptjs');
const SALT_ROUNDS = 12;

function up(db) {
    createTable(db);
    crearUsuarioPredeterminado(db);
}

function createTable(db) {
    try {
        db.prepare(`CREATE TABLE IF NOT EXISTS "tabla-usuarios" (
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
            reset_token_expira TEXT
        )`).run();

            } catch (err) {
                throw err;
    }
}

function crearUsuarioPredeterminado(db) {
    try {
        // Verificar si ya existen usuarios
        const stmt = db.prepare('SELECT COUNT(*) as count FROM "tabla-usuarios"');
        const row = stmt.get();

        if (row.count === 0) {
            console.log('No hay usuarios en la base de datos. Creando usuario predeterminado...');

            // Crear usuario administrador predeterminado
            const usuarioPredeterminado = {
                nombre: 'Administrador',
                email: 'admin@riesgos.com',
                rol: 'admin',
                password: 'Admin123!' // Contraseña segura por defecto
            };

            // Hashear la contraseña de forma síncrona (bcryptjs es más rápido y compatible)
            const hashedPassword = bcrypt.hashSync(usuarioPredeterminado.password, SALT_ROUNDS);

            const insertStmt = db.prepare(`INSERT INTO "tabla-usuarios" 
                        (nombre, email, rol, password_hash, activo) 
                        VALUES (?, ?, ?, ?, ?)`);

            const result = insertStmt.run([
                usuarioPredeterminado.nombre,
                usuarioPredeterminado.email,
                usuarioPredeterminado.rol,
                hashedPassword,
                1
            ]);

            
        } else {
            console.log('Ya existen usuarios en la base de datos. No se creará usuario predeterminado.');
        }
    } catch (error) {
        console.error('Error en crearUsuarioPredeterminado:', error);
        throw error;
    }
}

module.exports = { up };