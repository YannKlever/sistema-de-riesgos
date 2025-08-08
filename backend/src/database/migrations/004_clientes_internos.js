async function up(db) {
    await createTable(db);
}

async function createTable(db) {
    return new Promise((resolve, reject) => {
        db.run(`CREATE TABLE IF NOT EXISTS "tabla-clientes-internos" (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              fecha_registro TEXT DEFAULT CURRENT_TIMESTAMP,
              oficina TEXT,
              ejecutivo TEXT,
              nombres_cliente_interno TEXT,
              apellidos_cliente_interno TEXT,
              tipo_documento_cliente_interno TEXT,
              nro_documento_cliente_interno TEXT,
              extension_cliente_interno TEXT,
              otra_extension_cliente_interno TEXT,
              fecha_nacimiento TEXT,
              lugar_nacimiento TEXT,
              nacionalidad TEXT,
              estado_civil TEXT,
              profesion TEXT,
              riesgo_profesion_actividad TEXT,
              domicilio_persona_sucursal TEXT,
              riesgo_zona TEXT,
              categoria_pep TEXT,
              ingresos_mensuales REAL,
              volumen_actividad REAL,
              frecuencia_actividad TEXT,
              integridad_documental TEXT,
              exactitud_documental TEXT,
              vigencia_documental TEXT,
              relevancia_informacion TEXT,
              consistencia_informacion TEXT,
              comportamiento_cliente TEXT,
              observaciones TEXT,
              nacionalidad_numerico INTEGER,
              riesgo_profesion_actividad_numerico INTEGER,
              riesgo_zona_numerico INTEGER,
              categoria_pep_numerico INTEGER,
              ingresos_mensuales_numerico INTEGER,
              volumen_actividad_numerico INTEGER,
              frecuencia_actividad_numerico INTEGER,
              integridad_documental_numerico INTEGER,
              exactitud_documental_numerico INTEGER,
              vigencia_documental_numerico INTEGER,
              relevancia_informacion_numerico INTEGER,
              consistencia_informacion_numerico INTEGER,
              comportamiento_cliente_numerico INTEGER,
              impacto REAL,
              probabilidad REAL,
              promedio_riesgo_cliente_interno REAL     
              )`,
            function (err) {
                if (err) {
                    console.error('Error al crear tabla tabla-clientes-internos:', err);
                    reject(err);
                } else {
                    console.log('Tabla tabla-clientes-internos creada/verificada exitosamente');
                    resolve();
                }
            }
        );
    });
}

module.exports = { up };