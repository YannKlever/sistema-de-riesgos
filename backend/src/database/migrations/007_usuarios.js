async function up(db) {
    await createTable(db);
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

module.exports = { up };