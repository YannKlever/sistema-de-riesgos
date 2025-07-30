async function up(db) {
    await createTable(db);
}

async function createTable(db) {
    return new Promise((resolve, reject) => {
        db.run(`CREATE TABLE IF NOT EXISTS "tabla-sucursales" (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              fecha_registro TEXT DEFAULT CURRENT_TIMESTAMP,
              oficina TEXT NOT NULL,
              ubicacion TEXT NOT NULL,
              departamento TEXT NOT NULL,
              riesgo_departamento TEXT NOT NULL,
              municipio TEXT,
              riesgo_municipio TEXT,
              zona TEXT,
              riesgo_zona TEXT,
              frontera TEXT,
              riesgo_frontera TEXT,
              observaciones TEXT,
              riesgo_departamento_numerico INTEGER,
              riesgo_municipio_numerico INTEGER,

              promedio_riesgo_zona_geografica REAL DEFAULT 0,
              impacto INTEGER,
              probabilidad INTEGER,
              
              riesgo_zona_numerico INTEGER,
              riesgo_frontera_numerico INTEGER) `,
            function (err) {
                if (err) {
                    console.error('Error al crear tabla tabla-sucursales:', err);
                    reject(err);
                } else {
                    console.log('Tabla tabla-sucursales creada/verificada exitosamente');
                    resolve();
                }
            }
        );
    });
}

module.exports = { up };