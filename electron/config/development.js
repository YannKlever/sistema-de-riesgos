const path = require('path');

module.exports = {
  isProduction: false,
  frontendUrl: 'http://localhost:3000',
  database: {
    path: () => path.join(__dirname, '../../backend/database.sqlite')
  },
  logging: {
    level: 'silent',
    console: false,
    file: false,
  }
};