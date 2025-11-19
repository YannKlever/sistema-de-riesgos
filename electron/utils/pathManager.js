const { app } = require('electron');
const path = require('path');
const fs = require('fs');
const config = require('../config');

class PathManager {
    constructor() {
        this.setupPaths();
        this.migrateDatabase();
    }

    setupPaths() {
        // Crear directorio de usuario si no existe
        if (config.isProduction && !fs.existsSync(app.getPath('userData'))) {
            fs.mkdirSync(app.getPath('userData'), { recursive: true });
        }
    }

    getDatabasePath() {
        return config.database.path();
    }

    getFrontendUrl() {
        return config.frontendUrl;
    }

    // Copiar base de datos de desarrollo a producción si es necesario
    migrateDatabase() {
        if (config.isProduction) {
            const devDbPath = path.join(__dirname, '../../backend/database.sqlite');
            const prodDbPath = this.getDatabasePath();

            // Solo migrar si la BD de desarrollo existe y la de producción no
            if (fs.existsSync(devDbPath) && !fs.existsSync(prodDbPath)) {
                try {
                    fs.copyFileSync(devDbPath, prodDbPath);

                    // Copiar también los archivos WAL si existen
                    const walFiles = ['-shm', '-wal'];
                    walFiles.forEach(suffix => {
                        const source = devDbPath + suffix;
                        const target = prodDbPath + suffix;
                        if (fs.existsSync(source)) {
                            fs.copyFileSync(source, target);
                        }
                    });

                } catch (error) {
                    // Silenciar error de migración
                }
            }
        }
    }

    // Obtener ruta para guardar backups
    getBackupPath(filename = null) {
        const backupDir = path.join(app.getPath('userData'), 'backups');
        if (!fs.existsSync(backupDir)) {
            fs.mkdirSync(backupDir, { recursive: true });
        }
        return filename ? path.join(backupDir, filename) : backupDir;
    }

    // Verificar si existe el build del frontend
    hasFrontendBuild() {
        const buildPath = path.join(__dirname, '../../frontend/build/index.html');
        return fs.existsSync(buildPath);
    }
}

module.exports = new PathManager();