/**
 * Script que monitorea la carpeta raíz y actualiza el sitemap
 * automáticamente cuando se crea o modifica un archivo HTML
 * 
 * Uso: node watch-files.js
 * 
 * Requiere: npm install chokidar
 */

const SitemapUpdater = require('./sitemap-updater');
const chokidar = require('chokidar');
const path = require('path');

const sitemapUpdater = new SitemapUpdater();

console.log('👀 Iniciando monitoreo de archivos HTML...');
console.log('   El sitemap se actualizará automáticamente cuando se creen o modifiquen archivos HTML\n');

// Monitorear archivos HTML en la carpeta raíz
const watcher = chokidar.watch('*.html', {
    ignored: /node_modules/,
    persistent: true,
    ignoreInitial: true // No procesar archivos existentes al iniciar
});

// Evento cuando se agrega un nuevo archivo
watcher.on('add', async (filePath) => {
    const filename = path.basename(filePath);
    console.log(`📄 Nuevo archivo detectado: ${filename}`);
    
    try {
        await sitemapUpdater.updateSitemap();
        console.log(`✅ Sitemap actualizado con la nueva página: ${filename}\n`);
    } catch (error) {
        console.error(`❌ Error al actualizar sitemap: ${error.message}\n`);
    }
});

// Evento cuando se modifica un archivo existente
watcher.on('change', async (filePath) => {
    const filename = path.basename(filePath);
    console.log(`🔄 Archivo modificado: ${filename}`);
    
    try {
        await sitemapUpdater.updateSitemap();
        console.log(`✅ Sitemap actualizado (fecha de modificación actualizada)\n`);
    } catch (error) {
        console.error(`❌ Error al actualizar sitemap: ${error.message}\n`);
    }
});

// Evento cuando se elimina un archivo
watcher.on('unlink', async (filePath) => {
    const filename = path.basename(filePath);
    console.log(`🗑️  Archivo eliminado: ${filename}`);
    
    try {
        await sitemapUpdater.updateSitemap();
        console.log(`✅ Sitemap actualizado (página removida)\n`);
    } catch (error) {
        console.error(`❌ Error al actualizar sitemap: ${error.message}\n`);
    }
});

// Manejo de errores
watcher.on('error', error => {
    console.error(`❌ Error en el monitor: ${error.message}`);
});

// Mensaje cuando el monitor está listo
watcher.on('ready', () => {
    console.log('✅ Monitor activo. Esperando cambios en archivos HTML...\n');
    console.log('   Presiona Ctrl+C para detener el monitor\n');
});

// Manejo de cierre limpio
process.on('SIGINT', () => {
    console.log('\n\n🛑 Deteniendo monitor...');
    watcher.close();
    process.exit(0);
});

