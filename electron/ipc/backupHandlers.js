// ipc/backupHandlers.js
const fs = require('fs');
const path = require('path');
const { app, dialog } = require('electron');
const db = require('../../backend/src/database/db');

function setupBackupHandlers(ipcMain) {
    // Función para obtener la ruta de la base de datos
    const getDatabasePath = () => {
        // Para desarrollo
        if (process.env.NODE_ENV === 'development') {
            return path.join(__dirname, '../../../database.sqlite');
        }
        
        // Para producción (en Electron)
        const userDataPath = app.getPath('userData');
        return path.join(userDataPath, 'database.sqlite');
    };

    // Método para hacer backup de la base de datos
    ipcMain.handle('backup-database', async (_, backupPath) => {
        try {
            console.log('Iniciando backup en:', backupPath);
            
            // Verificar que el directorio de destino existe
            if (!fs.existsSync(backupPath)) {
                return { 
                    success: false, 
                    error: 'El directorio de destino no existe' 
                };
            }

            // Obtener la ruta de la base de datos actual
            const dbPath = getDatabasePath();
            console.log('Ruta de la base de datos:', dbPath);

            if (!fs.existsSync(dbPath)) {
                return { 
                    success: false, 
                    error: 'No se encontró la base de datos' 
                };
            }

            // Crear nombre de archivo con timestamp
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const backupFileName = `database.sqlite`;
    
            const fullBackupPath = path.join(backupPath, backupFileName);

            // Copiar el archivo de la base de datos
            fs.copyFileSync(dbPath, fullBackupPath);

            // Verificar que el backup se creó correctamente
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

    // Método para restaurar base de datos
    ipcMain.handle('restore-database', async (_, backupFilePath) => {
        try {
            console.log('Iniciando restauración desde:', backupFilePath);
            
            // Verificar que el archivo de backup existe
            if (!fs.existsSync(backupFilePath)) {
                return { 
                    success: false, 
                    error: 'El archivo de backup no existe' 
                };
            }

            // Obtener la ruta de la base de datos actual
            const dbPath = getDatabasePath();
            
            // Cerrar la conexión actual a la base de datos
            if (db && typeof db.close === 'function') {
                await db.close();
            }

            // Hacer backup de la base de datos actual antes de restaurar
            const backupCurrentPath = path.join(path.dirname(dbPath), `pre_restore_backup_${Date.now()}.db`);
            if (fs.existsSync(dbPath)) {
                fs.copyFileSync(dbPath, backupCurrentPath);
            }

            try {
                // Copiar el archivo de backup sobre la base de datos actual
                fs.copyFileSync(backupFilePath, dbPath);

                // Reabrir la conexión a la base de datos si es necesario
                if (db && typeof db.initialize === 'function') {
                    await db.initialize();
                }

                console.log('Restauración completada exitosamente');
                return {
                    success: true,
                    message: 'Base de datos restaurada exitosamente'
                };

            } catch (restoreError) {
                // En caso de error, restaurar el backup original
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

    // Método para listar backups disponibles
    ipcMain.handle('list-backups', async (_, directoryPath) => {
        try {
            if (!fs.existsSync(directoryPath)) {
                return { success: false, error: 'El directorio no existe' };
            }

            const files = fs.readdirSync(directoryPath);
            const backupFiles = files
                .filter(file => file.startsWith('backup_') && file.endsWith('.db'))
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

    // Método para seleccionar directorio
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

    // Método para abrir diálogo nativo
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

module.exports = setupBackupHandlers;