const clientesExternos = require('./001_clientes_externos');
const accionistasSocios = require('./002_accionistas_socios');
const evaluacionesRiesgo = require('./003_evaluaciones_ld_ft');
const clientesInternos = require('./004_clientes_internos');
const productosServicios = require('./005_productos_servicios');
const sucursales = require('./006_sucursales');
const usuarios = require('./007_usuarios');

async function runMigrations(db) {
    console.log('Iniciando migraciones...');

    try {
        await clientesExternos.up(db);
        await accionistasSocios.up(db);
        await evaluacionesRiesgo.up(db);
        await clientesInternos.up(db);
        await productosServicios.up(db);
        await sucursales.up(db);
        await usuarios.up(db);

        console.log('Todas las migraciones se ejecutaron correctamente');
    } catch (err) {
        console.error('Error en las migraciones:', err);
        throw err;
    }
}

module.exports = { runMigrations };