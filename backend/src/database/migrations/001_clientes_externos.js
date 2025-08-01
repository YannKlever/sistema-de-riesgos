async function up(db) {
    await createTable(db);
    // Aquí podrías añadir futuras migraciones para esta tabla
}

async function createTable(db) {
    return new Promise((resolve, reject) => {
        db.run(`CREATE TABLE IF NOT EXISTS "tabla-clientes-externos" (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              fecha_registro TEXT DEFAULT CURRENT_TIMESTAMP,
              oficina TEXT,
              ejecutivo TEXT,
              cliente_interno_id INTEGER, 
              tipo_sociedad TEXT,
              nombres_propietario TEXT,
              apellidos_propietario TEXT,
              tipo_documento_propietario TEXT,
              nro_documento_propietario TEXT,
              extension_propietario TEXT,
              otra_extension_propietario TEXT,
              fecha_nacimiento TEXT,
              lugar_nacimiento TEXT,
              nacionalidad TEXT,
              pais_residencia TEXT,
              estado_civil TEXT,
              telefono TEXT,
              celular TEXT,
              profesion TEXT,
              razon_social TEXT,
              nit TEXT,
              matricula_comercio TEXT,
              actividad TEXT,
              riesgo_profesion_actividad TEXT,
              lugar_trabajo TEXT,
              cargo TEXT,
              gestion_ingreso TEXT,
              riesgo_zona TEXT,
              ingresos_mensuales REAL,
              volumen_actividad REAL,
              frecuencia_actividad TEXT,
              categoria_pep TEXT,
              domicilio_persona_sucursal TEXT,
              domicilio_comercial_legal TEXT,
              correo TEXT,
              nombres_conyugue TEXT,
              apellidos_conyugue TEXT,
              actividad_conyugue TEXT,
              ocupacion_conyugue TEXT,
              nombres_representante TEXT,
              apellidos_representante TEXT,
              tipo_documento_representante TEXT,
              nro_documento_representante TEXT,
              extension_representante TEXT,
              otra_extension_representante TEXT,
              ramo_seguro TEXT,
              tipo_documento TEXT,
              fecha_inicio TEXT,
              fecha_fin TEXT,
              nro_poliza TEXT,
              valor_prima_dolares REAL,
              frecuencia_contacto_fisico TEXT,
              frecuencia_contacto_digital TEXT,
              medio_comunicacion TEXT,
              medio_pago TEXT,
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
              ramo_seguro_numerico INTEGER,
              tipo_documento_numerico INTEGER,
              valor_prima_dolares_numerico INTEGER,
              frecuencia_contacto_fisico_numerico INTEGER,
              frecuencia_contacto_digital_numerico INTEGER,
              medio_comunicacion_numerico INTEGER,
              medio_pago_numerico INTEGER,
              integridad_documental_numerico INTEGER,
              exactitud_documental_numerico INTEGER,
              vigencia_documental_numerico INTEGER,
              relevancia_informacion_numerico INTEGER,
              consistencia_informacion_numerico INTEGER,
              comportamiento_cliente_numerico INTEGER,

              promedio_riesgo_canal_distribucion REAL DEFAULT 0,
              promedio_riesgo_cliente_externo REAL DEFAULT 0,

              impacto INTEGER,
              probabilidad INTEGER,




              FOREIGN KEY(cliente_interno_id) REFERENCES "tabla-clientes-internos"(id) 
              )`,
            function (err) {
                if (err) {
                    console.error('Error al crear tabla tabla-clientes-externos:', err);
                    reject(err);
                } else {
                    console.log('Tabla tabla-clientes-externos creada/verificada exitosamente');
                    resolve();
                }
            }
        );
    });
}

module.exports = { up };