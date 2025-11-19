const { app } = require('electron');
const path = require('path');

module.exports = {
  isProduction: true,
  frontendUrl: `file://${path.join(__dirname, '../../frontend/build/index.html')}`,
  database: {
    path: () => path.join(app.getPath('userData'), 'database.sqlite')
  },
  logging: {
    level: 'silent',
    console: false,
    file: false,
  }
};