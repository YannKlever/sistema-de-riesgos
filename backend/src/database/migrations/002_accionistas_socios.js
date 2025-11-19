function up(db) {
    createTable(db);
}

function createTable(db) {
    try {
        db.prepare(`CREATE TABLE IF NOT EXISTS "tabla-accionistas-socios" (
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
            domicilio_persona TEXT,
            actividad TEXT,
            riesgo_actividad TEXT,
            riesgo_zona TEXT,
            categoria_pep TEXT,
            ingresos_mensuales REAL,
            volumen_actividad REAL,
            frecuencia_actividad TEXT,
            participacion_accionaria TEXT,
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
            riesgo_inherente REAL,
            mitigacion TEXT,
            mitigacion_numerico REAL,
            mitigacion_adicional TEXT,
            riesgo_residual REAL
        )`).run();

        
    } catch (err) {
                throw err;
    }
}

module.exports = { up };