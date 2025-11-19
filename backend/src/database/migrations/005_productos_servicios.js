function up(db) {
    createTable(db);
}

function createTable(db) {
    try {
        db.prepare(`CREATE TABLE IF NOT EXISTS "tabla-productos-servicios" (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            fecha_registro TEXT DEFAULT CURRENT_TIMESTAMP,
            oficina TEXT,
            producto_servicio TEXT NOT NULL,
            riesgo_producto TEXT NOT NULL,
            riesgo_cliente TEXT NOT NULL,
            observaciones TEXT,
            riesgo_producto_numerico INTEGER,
            riesgo_cliente_numerico INTEGER,
            probabilidad REAL,
            impacto_texto TEXT,
            impacto REAL,
            promedio_riesgo_producto_servicio REAL
        )`).run();

            } catch (err) {
                throw err;
    }
}

module.exports = { up };