const fs = require('fs');
const path = require('path');
const { app, dialog } = require('electron');
const db = require('../../backend/src/database/db');

function setupBackupHandlers(ipcMain) {
    const getDatabasePath = () => {
        // Para desarrollo - verifica múltiples formas de detectar el entorno
        const isDev = process.env.NODE_ENV === 'development' ||
            process.defaultApp ||
            /[\\/]electron[\\/]/.test(process.execPath) ||
            process.argv.some(arg => arg.includes('dev'));

        if (isDev) {
            const devPath = path.join(__dirname, '../../backend/database.sqlite');
            return devPath;
        }

        // Para producción (en Electron)
        const userDataPath = app.getPath('userData');
        const prodPath = path.join(userDataPath, 'database.sqlite');
        return prodPath;
    };

    const getDatabaseFiles = (dbPath) => {
        const baseDir = path.dirname(dbPath);
        const baseName = path.basename(dbPath, '.sqlite');
        
        const files = [
            dbPath, // database.sqlite
            path.join(baseDir, `${baseName}.sqlite-shm`), // Archivo SHM
            path.join(baseDir, `${baseName}.sqlite-wal`),  // Archivo WAL
            path.join(baseDir, `${baseName}.sqlite-hsm`)   // Archivo HSM
        ];
        
        return files;
    };

    ipcMain.handle('backup-database', async (_, backupPath) => {
        try {
            if (!fs.existsSync(backupPath)) {
                return {
                    success: false,
                    error: 'El directorio de destino no existe'
                };
            }

            const dbPath = getDatabasePath();

            if (!fs.existsSync(dbPath)) {
                return {
                    success: false,
                    error: 'No se encontró la base de datos principal'
                };
            }

            // Obtener todos los archivos de la base de datos
            const dbFiles = getDatabaseFiles(dbPath);

            // Verificar qué archivos existen
            const existingFiles = dbFiles.filter(file => fs.existsSync(file));

            if (existingFiles.length === 0) {
                return {
                    success: false,
                    error: 'No se encontraron archivos de base de datos'
                };
            }

            // Crear carpeta de backup con timestamp
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const backupFolderName = `backup_${timestamp}`;
            const fullBackupPath = path.join(backupPath, backupFolderName);
            
            // Crear directorio para el backup
            fs.mkdirSync(fullBackupPath);

            // Copiar todos los archivos existentes
            const copiedFiles = [];
            let totalSize = 0;

            for (const file of existingFiles) {
                const fileName = path.basename(file);
                const destPath = path.join(fullBackupPath, fileName);
                
                fs.copyFileSync(file, destPath);
                
                if (fs.existsSync(destPath)) {
                    const stats = fs.statSync(destPath);
                    copiedFiles.push({
                        name: fileName,
                        size: stats.size
                    });
                    totalSize += stats.size;
                }
            }

            return {
                success: true,
                message: `Backup completado exitosamente. Se copiaron ${copiedFiles.length} archivos.`,
                folderPath: fullBackupPath,
                files: copiedFiles,
                totalSize: totalSize,
                folderName: backupFolderName
            };

        } catch (error) {
            return {
                success: false,
                error: `Error al realizar el backup: ${error.message}`
            };
        }
    });

    ipcMain.handle('restore-database', async (_, backupFolderPath) => {
        try {
            if (!fs.existsSync(backupFolderPath)) {
                return {
                    success: false,
                    error: 'La carpeta de backup no existe'
                };
            }

            const dbPath = getDatabasePath();
            const baseDir = path.dirname(dbPath);
            const baseName = path.basename(dbPath, '.sqlite');

            // Cerrar la conexión a la base de datos si existe
            if (db && typeof db.close === 'function') {
                await db.close();
            }

            // Crear backup de los archivos actuales antes de restaurar
            const currentBackupFolder = path.join(baseDir, `pre_restore_backup_${Date.now()}`);
            if (!fs.existsSync(currentBackupFolder)) {
                fs.mkdirSync(currentBackupFolder);
            }

            const currentDbFiles = getDatabaseFiles(dbPath);
            const existingCurrentFiles = currentDbFiles.filter(file => fs.existsSync(file));
            
            for (const file of existingCurrentFiles) {
                const fileName = path.basename(file);
                const backupPath = path.join(currentBackupFolder, fileName);
                fs.copyFileSync(file, backupPath);
            }

            try {
                // Obtener archivos del backup
                const backupFiles = fs.readdirSync(backupFolderPath);

                // Restaurar cada archivo
                for (const file of backupFiles) {
                    const sourcePath = path.join(backupFolderPath, file);
                    let destFileName = file;
                    
                    // Si el archivo tiene extensiones relacionadas con SQLite, mantener el nombre
                    if (file.includes('.sqlite')) {
                        destFileName = file;
                    }
                    
                    const destPath = path.join(baseDir, destFileName);
                    
                    fs.copyFileSync(sourcePath, destPath);
                }

                // Re-inicializar la base de datos
                if (db && typeof db.initialize === 'function') {
                    await db.initialize();
                }

                return {
                    success: true,
                    message: 'Base de datos restaurada exitosamente'
                };

            } catch (restoreError) {
                // Restaurar los archivos originales
                const backupFiles = fs.readdirSync(currentBackupFolder);
                for (const file of backupFiles) {
                    const sourcePath = path.join(currentBackupFolder, file);
                    const destPath = path.join(baseDir, file);
                    fs.copyFileSync(sourcePath, destPath);
                }

                if (db && typeof db.initialize === 'function') {
                    await db.initialize();
                }

                return {
                    success: false,
                    error: `Error al restaurar: ${restoreError.message}`
                };
            }

        } catch (error) {
            return {
                success: false,
                error: `Error al restaurar la base de datos: ${error.message}`
            };
        }
    });

    ipcMain.handle('list-backups', async (_, directoryPath) => {
        try {
            if (!fs.existsSync(directoryPath)) {
                return { success: false, error: 'El directorio no existe' };
            }

            const items = fs.readdirSync(directoryPath, { withFileTypes: true });
            const backupFolders = items
                .filter(item => item.isDirectory() && item.name.startsWith('backup_'))
                .map(folder => {
                    const folderPath = path.join(directoryPath, folder.name);
                    const files = fs.readdirSync(folderPath);
                    let totalSize = 0;
                    let mainDbFile = null;

                    files.forEach(file => {
                        const filePath = path.join(folderPath, file);
                        const stats = fs.statSync(filePath);
                        totalSize += stats.size;
                        if (file === 'database.sqlite' || file.endsWith('.sqlite')) {
                            mainDbFile = {
                                name: file,
                                size: stats.size,
                                modified: stats.mtime
                            };
                        }
                    });

                    return {
                        name: folder.name,
                        path: folderPath,
                        totalSize: totalSize,
                        fileCount: files.length,
                        files: files,
                        mainDbFile: mainDbFile,
                        modified: mainDbFile ? mainDbFile.modified : new Date()
                    };
                })
                .sort((a, b) => b.modified - a.modified);

            return {
                success: true,
                backups: backupFolders
            };

        } catch (error) {
            return {
                success: false,
                error: `Error al listar backups: ${error.message}`
            };
        }
    });

    ipcMain.handle('select-directory', async () => {
        try {
            const result = await dialog.showOpenDialog({
                properties: ['openDirectory'],
                title: 'Seleccionar directorio para backup',
                buttonLabel: 'Seleccionar carpeta'
            });

            if (!result.canceled && result.filePaths.length > 0) {
                return {
                    success: true,
                    directoryPath: result.filePaths[0]
                };
            } else {
                return {
                    success: false,
                    error: 'No se seleccionó ningún directorio'
                };
            }
        } catch (error) {
            return {
                success: false,
                error: `Error al seleccionar directorio: ${error.message}`
            };
        }
    });

    ipcMain.handle('open-dialog', async (_, options) => {
        try {
            const result = await dialog.showOpenDialog(options);
            return result;
        } catch (error) {
            return { canceled: true, error: error.message };
        }
    });
}

module.exports = setupBackupHandlers;