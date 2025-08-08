async function up(db) {
    await createTable(db);
}

async function createTable(db) {
    return new Promise((resolve, reject) => {
        db.run(`CREATE TABLE IF NOT EXISTS "tabla-productos-servicios" (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              fecha_registro TEXT DEFAULT CURRENT_TIMESTAMP,
              producto_servicio TEXT NOT NULL,
              riesgo_producto TEXT NOT NULL,
              oficina TEXT,
              riesgo_cliente TEXT NOT NULL,
              observaciones TEXT,
              riesgo_producto_numerico INTEGER,
              riesgo_cliente_numerico INTEGER,
              probabilidad REAL,
              impacto REAL,
              promedio_riesgo_producto_servicio REAL
              )`,
            function (err) {
                if (err) {
                    console.error('Error al crear tabla tabla-productos-servicios:', err);
                    reject(err);
                } else {
                    console.log('Tabla tabla-productos-servicios creada/verificada exitosamente');
                    resolve();
                }
            }
        );
    });
}

module.exports = { up };