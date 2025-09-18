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

        console.log('NODE_ENV:', process.env.NODE_ENV);
        console.log('process.defaultApp:', process.defaultApp);
        console.log('process.execPath:', process.execPath);
        console.log('Modo desarrollo detectado:', isDev);

        if (isDev) {
            const devPath = path.join(__dirname, '../../backend/database.sqlite');
            console.log('Usando ruta de desarrollo:', devPath);
            return devPath;
        }

        // Para producción (en Electron)
        const userDataPath = app.getPath('userData');
        const prodPath = path.join(userDataPath, 'database.sqlite');
        console.log('Usando ruta de producción:', prodPath);
        return prodPath;
    };

    ipcMain.handle('backup-database', async (_, backupPath) => {
        try {
            console.log('Iniciando backup en:', backupPath);

            if (!fs.existsSync(backupPath)) {
                return {
                    success: false,
                    error: 'El directorio de destino no existe'
                };
            }

            const dbPath = getDatabasePath();
            console.log('Ruta de la base de datos:', dbPath);

            if (!fs.existsSync(dbPath)) {
                return {
                    success: false,
                    error: 'No se encontró la base de datos'
                };
            }

            // CORRECCIÓN: Usar timestamp en el nombre del archivo
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const backupFileName = `backup_${timestamp}.sqlite`;

            const fullBackupPath = path.join(backupPath, backupFileName);

            fs.copyFileSync(dbPath, fullBackupPath);

            if (fs.existsSync(fullBackupPath)) {
                const stats = fs.statSync(fullBackupPath);
                console.log('Backup creado exitosamente:', fullBackupPath);

                return {
                    success: true,
                    message: 'Backup completado exitosamente',
                    filePath: fullBackupPath,
                    fileSize: stats.size,
                    fileName: backupFileName
                };
            } else {
                return {
                    success: false,
                    error: 'Error al crear el archivo de backup'
                };
            }

        } catch (error) {
            console.error('Error en backup-database:', error);
            return {
                success: false,
                error: `Error al realizar el backup: ${error.message}`
            };
        }
    });

    ipcMain.handle('restore-database', async (_, backupFilePath) => {
        try {
            console.log('Iniciando restauración desde:', backupFilePath);

            if (!fs.existsSync(backupFilePath)) {
                return {
                    success: false,
                    error: 'El archivo de backup no existe'
                };
            }

            const dbPath = getDatabasePath();

            if (db && typeof db.close === 'function') {
                await db.close();
            }

            const backupCurrentPath = path.join(path.dirname(dbPath), `pre_restore_backup_${Date.now()}.sqlite`);
            if (fs.existsSync(dbPath)) {
                fs.copyFileSync(dbPath, backupCurrentPath);
            }

            try {
                fs.copyFileSync(backupFilePath, dbPath);

                if (db && typeof db.initialize === 'function') {
                    await db.initialize();
                }

                console.log('Restauración completada exitosamente');
                return {
                    success: true,
                    message: 'Base de datos restaurada exitosamente'
                };

            } catch (restoreError) {
                console.error('Error en restauración, restaurando backup original:', restoreError);
                if (fs.existsSync(backupCurrentPath)) {
                    fs.copyFileSync(backupCurrentPath, dbPath);
                    if (db && typeof db.initialize === 'function') {
                        await db.initialize();
                    }
                }

                return {
                    success: false,
                    error: `Error al restaurar: ${restoreError.message}`
                };
            }

        } catch (error) {
            console.error('Error en restore-database:', error);
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

            const files = fs.readdirSync(directoryPath);
            // CORRECCIÓN: Incluir archivos .sqlite
            const backupFiles = files
                .filter(file => (file.startsWith('backup_') || file === 'database.sqlite') &&
                    (file.endsWith('.db') || file.endsWith('.sqlite')))
                .map(file => {
                    const filePath = path.join(directoryPath, file);
                    const stats = fs.statSync(filePath);
                    return {
                        name: file,
                        path: filePath,
                        size: stats.size,
                        modified: stats.mtime,
                        created: stats.birthtime
                    };
                })
                .sort((a, b) => b.modified - a.modified);

            return {
                success: true,
                backups: backupFiles
            };

        } catch (error) {
            console.error('Error en list-backups:', error);
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
            console.error('Error en select-directory:', error);
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
            console.error('Error en open-dialog:', error);
            return { canceled: true, error: error.message };
        }
    });
}

// CORRECCIÓN: Eliminar las líneas redundantes al final
module.exports = setupBackupHandlers;