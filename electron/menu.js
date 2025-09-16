const { Menu, dialog, app, shell } = require('electron');

function createMenu(mainWindow) {
    const template = [
        {
            label: 'Archivo',
            submenu: [
                {
                    label: 'Nuevo Registro',
                    accelerator: 'Ctrl+N',
                    click: () => {
                        // Enviar solo datos simples
                        if (mainWindow && !mainWindow.isDestroyed()) {
                            mainWindow.webContents.send('menu-action', 'new-record');
                        }
                    }
                },
                { type: 'separator' },
                {
                    label: 'Salir',
                    accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
                    click: () => {
                        app.quit();
                    }
                }
            ]
        },
        {
            label: 'Navegación',
            submenu: [
                {
                    label: 'Clientes - Nuevo registro',
                    accelerator: 'Ctrl+1',
                    click: () => {
                        if (mainWindow && !mainWindow.isDestroyed()) {
                            mainWindow.webContents.send('navigate-to', '/clientes');
                        }
                    }
                },
                {
                    label: 'Parámetros',
                    accelerator: 'Ctrl+2',
                    click: () => {
                        if (mainWindow && !mainWindow.isDestroyed()) {
                            mainWindow.webContents.send('navigate-to', '/parametros');
                        }
                    }
                },
                {
                    label: 'Reportes',
                    accelerator: 'Ctrl+3',
                    click: () => {
                        if (mainWindow && !mainWindow.isDestroyed()) {
                            mainWindow.webContents.send('navigate-to', '/reportes');
                        }
                    }
                },
                {
                    label: 'Gráficos',
                    accelerator: 'Ctrl+4',
                    click: () => {
                        if (mainWindow && !mainWindow.isDestroyed()) {
                            mainWindow.webContents.send('navigate-to', '/graficos');
                        }
                    }
                },
                {
                    label: 'Ajustes',
                    accelerator: 'Ctrl+5',
                    click: () => {
                        if (mainWindow && !mainWindow.isDestroyed()) {
                            mainWindow.webContents.send('navigate-to', '/ajustes');
                        }
                    }
                },
                { type: 'separator' },
                {
                    label: 'Cerrar Ventana',
                    accelerator: 'Ctrl+0',
                    click: () => {
                        if (mainWindow && !mainWindow.isDestroyed()) {
                            mainWindow.close();
                        }
                    }
                }
            ]
        },
        {
            label: 'Ventana',
            submenu: [
                { 
                    role: 'minimize', 
                    label: 'Minimizar',
                    click: () => {
                        if (mainWindow && !mainWindow.isDestroyed()) {
                            mainWindow.minimize();
                        }
                    }
                },
                { 
                    role: 'close', 
                    label: 'Cerrar',
                    click: () => {
                        if (mainWindow && !mainWindow.isDestroyed()) {
                            mainWindow.close();
                        }
                    }
                }
            ]
        },
        {
            label: 'Ayuda',
            submenu: [
                {
                    label: 'Documentación',
                    click: async () => {
                        await shell.openExternal('https://tu-documentacion.com');
                    }
                },
                { type: 'separator' },
                {
                    label: 'Acerca de',
                    click: () => {
                        if (mainWindow && !mainWindow.isDestroyed()) {
                            dialog.showMessageBox(mainWindow, {
                                type: 'info',
                                title: 'Acerca de',
                                message: 'Sistema de Gestión de Riesgos',
                                detail: `Versión ${app.getVersion()}\nDesarrollado por  KeyAxisSystem`
                            }).catch(console.error);
                        }
                    }
                }
            ]
        }
    ];

    try {
        const menu = Menu.buildFromTemplate(template);
        Menu.setApplicationMenu(menu);
        console.log('Menú creado correctamente');
    } catch (error) {
        console.error('Error creando menú:', error);
    }
}

module.exports = { createMenu };