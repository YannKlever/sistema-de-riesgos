const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
const migrations = require('./migrations');
const pathManager = require('../../../electron/utils/pathManager');
const dbPath = pathManager.getDatabasePath();

console.log('Ruta de la base de datos:', dbPath);

// Verifica permisos de escritura
try {
  fs.accessSync(path.dirname(dbPath), fs.constants.W_OK);
  console.log('Tiene permisos de escritura en la carpeta');
} catch (err) {
  console.error('NO tiene permisos de escritura:', err);
}

let db;

try {
  // Con better-sqlite3, OPEN_READWRITE y OPEN_CREATE son opciones diferentes
  db = new Database(dbPath, {
    //verbose: console.log,
    timeout: 5000 // Equivalente a busyTimeout
  });

  console.log('Conexión exitosa a SQLite con better-sqlite3');

  // Configuración adicional de pragmas
  db.pragma('journal_mode = WAL'); // Mejor performance para escrituras
  db.pragma('foreign_keys = ON'); // Activar claves foráneas

  // Ejecutar migraciones
  migrations.runMigrations(db);

} catch (err) {
  console.error('Error al abrir la base de datos:', err);
  process.exit(1);
}

module.exports = db;