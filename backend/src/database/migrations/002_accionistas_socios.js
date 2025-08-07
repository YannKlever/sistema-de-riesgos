async function up(db) {
    await createTable(db);
}

async function createTable(db) {
    return new Promise((resolve, reject) => {
        db.run(`CREATE TABLE IF NOT EXISTS "tabla-accionistas-socios" (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              fecha_registro TEXT DEFAULT CURRENT_TIMESTAMP,
              oficina TEXT,
              ejecutivo TEXT,
              nombres_accionistas_socios TEXT,
              apellidos_accionistas_socios TEXT,
              tipo_documento_accionistas_socios TEXT,
              nro_documento_accionistas_socios TEXT,
              extension_accionistas_socios TEXT,
              otra_extension_accionistas_socios TEXT,
              fecha_nacimiento TEXT,
              lugar_nacimiento TEXT,
              nacionalidad TEXT,
              estado_civil TEXT,
              actividad TEXT,
              riesgo_actividad TEXT,
              riesgo_zona TEXT,
              categoria_pep TEXT,
              ingresos_mensuales REAL,
              volumen_actividad REAL,
              frecuencia_actividad TEXT,
              participacion_accionaria TEXT,
              domicilio_persona TEXT,
              integridad_documental TEXT,
              exactitud_documental TEXT,
              vigencia_documental TEXT,
              relevancia_informacion TEXT,
              consistencia_informacion TEXT,
              comportamiento_cliente TEXT,
              observaciones TEXT,
              nacionalidad_numerico INTEGER,
              riesgo_actividad_numerico INTEGER,
              riesgo_zona_numerico INTEGER,
              categoria_pep_numerico INTEGER,
              ingresos_mensuales_numerico INTEGER,
              volumen_actividad_numerico INTEGER,
              frecuencia_actividad_numerico INTEGER,
              participacion_accionaria_numerico INTEGER,
              integridad_documental_numerico INTEGER,
              exactitud_documental_numerico INTEGER,
              vigencia_documental_numerico INTEGER,
              relevancia_informacion_numerico INTEGER,
              consistencia_informacion_numerico INTEGER,
              comportamiento_cliente_numerico INTEGER,
              probabilidad REAL,
              impacto REAL,
              promedio_riesgo_accionista_socio REAL
              )`,
            function (err) {
                if (err) {
                    console.error('Error al crear tabla tabla-accionistas-socios:', err);
                    reject(err);
                } else {
                    console.log('Tabla tabla-accionistas-socios creada/verificada exitosamente');
                    resolve();
                }
            }
        );
    });
}

module.exports = { up };