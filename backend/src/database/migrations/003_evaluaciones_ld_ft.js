async function up(db) {
    await createTable(db);
}

async function createTable(db) {
    return new Promise((resolve, reject) => {
        db.run(`CREATE TABLE IF NOT EXISTS "evaluaciones_riesgo_ld_ft" (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                fecha_evaluacion TEXT DEFAULT CURRENT_TIMESTAMP,
                usuario TEXT,
                
                /* Sección 1: Administración del Riesgo de LD/FT */
                p1_1 TEXT,
                p1_1_numerico INTEGER,
                p1_2 TEXT,
                p1_2_numerico INTEGER,
                
                /* Sección 2: Involucramiento de la Administración */
                p2_1 TEXT,
                p2_1_numerico INTEGER,
                p2_2 TEXT,
                p2_2_numerico INTEGER,
                p2_3 TEXT,
                p2_3_numerico INTEGER,
                
                /* Sección 3: Política "Conozca a su Cliente" */
                p3_1 TEXT,
                p3_1_numerico INTEGER,
                p3_2 TEXT,
                p3_2_numerico INTEGER,
                p3_3 TEXT,
                p3_3_numerico INTEGER,
                
                /* Sección 4: Monitoreo de Transacciones */
                p4_1 TEXT,
                p4_1_numerico INTEGER,
                p4_2 TEXT,
                p4_2_numerico INTEGER,
                p4_3 TEXT,
                p4_3_numerico INTEGER,
                
                /* Sección 5: Gestión del Oficial de Cumplimiento */
                p5_1 TEXT,
                p5_1_numerico INTEGER,
                p5_2 TEXT,
                p5_2_numerico INTEGER,
                p5_3 TEXT,
                p5_3_numerico INTEGER,
                
                /* Sección 6: Programas de Capacitación */
                p6_1 TEXT,
                p6_1_numerico INTEGER,
                p6_2 TEXT,
                p6_2_numerico INTEGER,
                p6_3 TEXT,
                p6_3_numerico INTEGER,
                
                /* Sección 7: Programas de Auditoría */
                p7_1 TEXT,
                p7_1_numerico INTEGER,
                p7_2 TEXT,
                p7_2_numerico INTEGER,
                
                /* Sección 8: Vulnerabilidades en el Proceso de Debida Diligencia */
                p8_1 TEXT,
                p8_1_numerico INTEGER,
                p8_2 TEXT,
                p8_2_numerico INTEGER,
                p8_3 TEXT,
                p8_3_numerico INTEGER,
                
                /* Sección 9: Vulnerabilidades en los Controles Internos */
                p9_1 TEXT,
                p9_1_numerico INTEGER,
                p9_2 TEXT,
                p9_2_numerico INTEGER,
                p9_3 TEXT,
                p9_3_numerico INTEGER,

                promedio_riesgo REAL DEFAULT 0,
                impacto INTEGER,
                probabilidad INTEGER,
                
                detalles TEXT
               
            )`,
            function (err) {
                if (err) {
                    console.error('Error al crear tabla evaluaciones_riesgo_ld_ft:', err);
                    reject(err);
                } else {
                    console.log('Tabla evaluaciones_riesgo_ld_ft creada/verificada exitosamente');
                    resolve();
                }
            }
        );
    });
}

module.exports = { up };