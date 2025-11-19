function up(db) {
    createTable(db);
}

function createTable(db) {
    try {
        db.prepare(`CREATE TABLE IF NOT EXISTS "tabla-sucursales" (
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
            riesgo_zona_numerico INTEGER,
            riesgo_frontera_numerico INTEGER,
            probabilidad REAL,
            impacto_texto TEXT,
            impacto REAL,
            promedio_riesgo_zona_geografica REAL
        )`).run();

            } catch (err) {
                throw err;
    }
}

module.exports = { up };