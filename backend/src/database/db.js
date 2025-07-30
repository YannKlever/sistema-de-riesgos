const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const migrations = require('./migrations');

const dbPath = path.join(__dirname, '../../database.sqlite');
console.log('Ruta ABSOLUTA de la DB:', path.resolve(dbPath));

// Verifica permisos de escritura
try {
  fs.accessSync(path.dirname(dbPath), fs.constants.W_OK);
  console.log('Tiene permisos de escritura en la carpeta');
} catch (err) {
  console.error('NO tiene permisos de escritura:', err);
}

const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
  if (err) {
    console.error('Error al abrir la base de datos:', err);
    return;
  }
  console.log('Conexión exitosa a SQLite');
  
  // Configuración de la base de datos
  db.configure("busyTimeout", 5000);
  
  // Ejecutar migraciones
  migrations.runMigrations(db);
});

module.exports = db;