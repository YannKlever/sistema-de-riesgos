const JavaScriptObfuscator = require('javascript-obfuscator');
const fs = require('fs-extra');
const path = require('path');
const config = require('./obfuscator-config');

class Obfuscator {
  constructor() {
    this.sourceDirs = [
      '../electron',
      '../backend/src'
    ];
    this.targetDir = '../dist-obfuscated';
    this.excludedPatterns = [
      'config/**/*.js',
      '**/*.config.js',
      'node_modules/**',
      '*.json',
      '*.html',
      '*.css',
      '*.sqlite*',
      '*.map' // Excluir source maps
    ];
  }

  async obfuscateProject() {
    console.log('🔒 Iniciando proceso de obfuscación...');

    try {
      // Limpiar directorio temporal
      await fs.remove(this.targetDir);

      // Obfuscar cada directorio fuente
      for (const sourceDir of this.sourceDirs) {
        await this.obfuscateDirectory(sourceDir);
      }

      // Copiar y ofuscar frontend build
      await this.processFrontendBuild();

      // Copiar archivos esenciales
      await this.copyEssentialFiles();

      // Crear package.json optimizado
      await this.createOptimizedPackageJson();

      console.log('✅ Obfuscación completada exitosamente');

    } catch (error) {
      console.error('❌ Error durante la obfuscación:', error);
      process.exit(1);
    }
  }

  async obfuscateDirectory(sourceDir) {
    const fullSourcePath = path.resolve(__dirname, sourceDir);
    const relativeTargetPath = path.relative('../', sourceDir);
    const fullTargetPath = path.resolve(__dirname, this.targetDir, relativeTargetPath);

    console.log(`📁 Obfuscando: ${sourceDir} -> ${fullTargetPath}`);

    if (!await fs.pathExists(fullSourcePath)) {
      console.log(`⚠️  Directorio no encontrado: ${fullSourcePath}`);
      return;
    }

    await fs.ensureDir(fullTargetPath);
    await this.processDirectory(fullSourcePath, fullTargetPath);
  }

  async processDirectory(sourcePath, targetPath) {
    const items = await fs.readdir(sourcePath);

    for (const item of items) {
      const sourceItemPath = path.join(sourcePath, item);
      const targetItemPath = path.join(targetPath, item);
      const stat = await fs.stat(sourceItemPath);

      if (this.shouldExclude(sourceItemPath)) {
        console.log(`   ⏭️  Excluido: ${path.relative(__dirname, sourceItemPath)}`);
        continue;
      }

      if (stat.isDirectory()) {
        await this.processDirectory(sourceItemPath, targetItemPath);
      } else if (stat.isFile() && path.extname(item) === '.js') {
        await this.obfuscateFile(sourceItemPath, targetItemPath);
      } else {
        // Copiar archivos no-JS directamente
        await fs.copy(sourceItemPath, targetItemPath);
        console.log(`   📄 Copiado: ${path.relative(__dirname, sourceItemPath)}`);
      }
    }
  }

  async processFrontendBuild() {
    const frontendSource = path.resolve(__dirname, '../frontend/build');
    const frontendTarget = path.resolve(__dirname, this.targetDir, 'frontend/build');

    if (await fs.pathExists(frontendSource)) {
      console.log('📁 Procesando build del frontend...');

      // Copiar toda la estructura primero
      await fs.copy(frontendSource, frontendTarget);

      // Ahora ofuscar solo los archivos JS en static/js/
      await this.obfuscateFrontendJs(frontendTarget);

      console.log('   ✅ Frontend procesado y ofuscado');
    } else {
      console.log('⚠️  Build del frontend no encontrado, ejecuta npm run build-frontend primero');
    }
  }

  async obfuscateFrontendJs(frontendTargetPath) {
    const staticJsPath = path.join(frontendTargetPath, 'static/js');

    if (!await fs.pathExists(staticJsPath)) {
      console.log('   ⚠️  No se encontró static/js en el build del frontend');
      return;
    }

    console.log('   🔒 Ofuscando bundles de React...');

    try {
      const items = await fs.readdir(staticJsPath);
      let obfuscatedCount = 0;

      for (const item of items) {
        const filePath = path.join(staticJsPath, item);
        const stat = await fs.stat(filePath);

        // Ofuscar solo archivos JS (no .map ni otros)
        if (stat.isFile() && path.extname(item) === '.js' && !item.includes('.map')) {
          await this.obfuscateFrontendFile(filePath);
          obfuscatedCount++;
        }
      }

      console.log(`   ✅ ${obfuscatedCount} bundles de React ofuscados`);

    } catch (error) {
      console.error('   ❌ Error ofuscando frontend:', error.message);
    }
  }

  async obfuscateFrontendFile(filePath) {
    try {
      const code = await fs.readFile(filePath, 'utf8');

      // Configuración específica para frontend (más ligera)
      const frontendConfig = {
        ...config,
        target: 'browser', // Cambiar a browser para frontend
        selfDefending: true, // Activar solo para frontend
        debugProtection: false // Mantener desactivado para evitar problemas
      };

      const obfuscatedCode = JavaScriptObfuscator.obfuscate(code, frontendConfig).getObfuscatedCode();
      await fs.writeFile(filePath, obfuscatedCode, 'utf8');

      console.log(`      ✅ Ofuscado: ${path.basename(filePath)}`);

    } catch (error) {
      console.error(`      ❌ Error ofuscando ${path.basename(filePath)}:`, error.message);
      // No hacemos fallback aquí para evitar corromper el frontend
    }
  }

  shouldExclude(filePath) {
    const relativePath = path.relative(path.resolve(__dirname, '..'), filePath);

    // Convertir a formato compatible con Windows
    const normalizedPath = relativePath.replace(/\\/g, '/');

    return this.excludedPatterns.some(pattern => {
      // Patrones simples sin minimatch
      if (pattern.includes('**')) {
        const regexPattern = pattern
          .replace(/\*\*/g, '.*')
          .replace(/\*/g, '[^/]*')
          .replace(/\//g, '\\/');
        const regex = new RegExp(`^${regexPattern}$`);
        return regex.test(normalizedPath);
      } else {
        return normalizedPath.includes(pattern);
      }
    });
  }

  async obfuscateFile(sourcePath, targetPath) {
    try {
      const code = await fs.readFile(sourcePath, 'utf8');

      // No ofuscar archivos vacíos o muy pequeños
      if (code.length < 50) {
        await fs.copy(sourcePath, targetPath);
        console.log(`   📄 Copiado (muy pequeño): ${path.relative(__dirname, sourcePath)}`);
        return;
      }

      const obfuscatedCode = JavaScriptObfuscator.obfuscate(code, config).getObfuscatedCode();

      await fs.ensureDir(path.dirname(targetPath));
      await fs.writeFile(targetPath, obfuscatedCode, 'utf8');

      console.log(`   ✅ Ofuscado: ${path.relative(__dirname, sourcePath)}`);

    } catch (error) {
      console.error(`   ❌ Error ofuscando ${sourcePath}:`, error.message);
      // En caso de error, copiar el archivo original
      await fs.copy(sourcePath, targetPath);
      console.log(`   📄 Copiado (fallback): ${path.relative(__dirname, sourcePath)}`);
    }
  }

  async copyEssentialFiles() {
    const essentialFiles = [
      '../electron-builder.json'
    ];

    // Archivos de base de datos (si existen)
    const dbFiles = [
      '../backend/database.sqlite',
      '../backend/database.sqlite-shm',
      '../backend/database.sqlite-wal'
    ];

    for (const file of essentialFiles) {
      const sourcePath = path.resolve(__dirname, file);
      const targetPath = path.resolve(__dirname, this.targetDir, file.replace('../', ''));

      if (await fs.pathExists(sourcePath)) {
        await fs.ensureDir(path.dirname(targetPath));
        await fs.copy(sourcePath, targetPath);
        console.log(`   📄 Copiado: ${file}`);
      }
    }

    // Copiar archivos de DB solo si existen
    for (const dbFile of dbFiles) {
      const sourcePath = path.resolve(__dirname, dbFile);
      if (await fs.pathExists(sourcePath)) {
        const targetPath = path.resolve(__dirname, this.targetDir, dbFile.replace('../', ''));
        await fs.ensureDir(path.dirname(targetPath));
        await fs.copy(sourcePath, targetPath);
        console.log(`   💾 Copiado: ${dbFile}`);
      }
    }
  }

  async createOptimizedPackageJson() {
    const sourcePackageJsonPath = path.resolve(__dirname, '../package.json');
    const targetPackageJsonPath = path.resolve(__dirname, this.targetDir, 'package.json');

    const packageJson = await fs.readJson(sourcePackageJsonPath);

    // Crear package.json optimizado para producción
    const optimizedPackageJson = {
      name: packageJson.name,
      version: packageJson.version,
      description: packageJson.description,
      author: packageJson.author,
      main: packageJson.main,
      homepage: packageJson.homepage,
      dependencies: packageJson.dependencies,
      // Solo scripts esenciales
      scripts: {
        "postinstall": "electron-builder install-app-deps"
      }
    };

    await fs.writeJson(targetPackageJsonPath, optimizedPackageJson, { spaces: 2 });
    console.log('   📄 Package.json optimizado creado');
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  const obfuscator = new Obfuscator();
  obfuscator.obfuscateProject();
}

module.exports = Obfuscator;