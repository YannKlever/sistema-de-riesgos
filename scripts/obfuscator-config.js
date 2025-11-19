// Configuración balanceada para javascript-obfuscator
module.exports = {
  compact: true,
  controlFlowFlattening: false,    // Desactivado para mejor performance
  controlFlowFlatteningThreshold: 0,
  deadCodeInjection: false,        // Desactivado para evitar problemas
  deadCodeInjectionThreshold: 0,
  debugProtection: false,          // Desactivado para testing inicial
  debugProtectionInterval: 0,
  disableConsoleOutput: false,     // Mantener console.log para debugging
  identifierNamesGenerator: 'hexadecimal',
  identifiersPrefix: '',
  inputFileName: '',
  log: false,
  renameGlobals: false,            // Desactivado para evitar problemas con Electron
  reservedNames: [],
  reservedStrings: [],
  rotateStringArray: true,
  seed: 0,
  selfDefending: false,            // Desactivado inicialmente
  sourceMap: false,
  sourceMapBaseUrl: '',
  sourceMapFileName: '',
  sourceMapMode: 'separate',
  stringArray: true,
  stringArrayEncoding: ['base64'],
  stringArrayThreshold: 0.75,
  target: 'node',                  // Para Electron/Node.js
  transformObjectKeys: false,      // Desactivado para evitar problemas
  unicodeEscapeSequence: false
};