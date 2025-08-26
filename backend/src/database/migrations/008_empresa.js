async function up(db) {
    await createTable(db);
}

async function createTable(db) {
    return new Promise((resolve, reject) => {
        db.run(`CREATE TABLE IF NOT EXISTS "tabla-empresa" (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            nit TEXT NOT NULL UNIQUE,
            direccion TEXT,
            telefono TEXT,
            fecha_creacion TEXT DEFAULT CURRENT_TIMESTAMP,
            fecha_actualizacion TEXT DEFAULT CURRENT_TIMESTAMP
        )`,
            function (err) {
                if (err) {
                    console.error('Error al crear tabla tabla-empresa:', err);
                    reject(err);
                } else {
                    console.log('Tabla tabla-empresa creada/verificada exitosamente');
                    resolve();
                }
            });
    });
}

module.exports = { up };