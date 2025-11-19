const clientesExternos = require('./001_clientes_externos');
const accionistasSocios = require('./002_accionistas_socios');
const evaluacionesRiesgo = require('./003_evaluaciones_ld_ft');
const clientesInternos = require('./004_clientes_internos');
const productosServicios = require('./005_productos_servicios');
const sucursales = require('./006_sucursales');
const usuarios = require('./007_usuarios');
const empresa = require('./008_empresa');

function runMigrations(db) {
    console.log('Iniciando migraciones...');

    try {
        // Ejecutar migraciones en transacción
        const migrateAll = db.transaction(() => {
            clientesExternos.up(db);
            accionistasSocios.up(db);
            evaluacionesRiesgo.up(db);
            clientesInternos.up(db);
            productosServicios.up(db);
            sucursales.up(db);
            usuarios.up(db);
            empresa.up(db);
        });

        migrateAll();
        console.log('Todas las migraciones se ejecutaron correctamente');
    } catch (err) {
        console.error('Error en las migraciones:', err);
        throw err;
    }
}

module.exports = { runMigrations };