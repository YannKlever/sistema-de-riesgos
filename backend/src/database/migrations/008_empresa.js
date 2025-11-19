function up(db) {
    createTable(db);
}

function createTable(db) {
    try {
        db.prepare(`CREATE TABLE IF NOT EXISTS "tabla-empresa" (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            nit TEXT NOT NULL UNIQUE,
            direccion TEXT,
            telefono TEXT,
            fecha_creacion TEXT DEFAULT CURRENT_TIMESTAMP,
            fecha_actualizacion TEXT DEFAULT CURRENT_TIMESTAMP
        )`).run();

            } catch (err) {
                throw err;
    }
}

module.exports = { up };