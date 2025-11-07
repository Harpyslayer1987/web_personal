#!/usr/bin/env node

/**
 * Script de utilidad para agregar una nueva página al sitemap manualmente
 * Uso: node add-page.js <filename> [priority] [changefreq]
 * Ejemplo: node add-page.js portafolio.html 0.9 monthly
 */

const SitemapUpdater = require('./sitemap-updater');

const args = process.argv.slice(2);

if (args.length === 0) {
    console.log('📝 Uso: node add-page.js <filename> [priority] [changefreq]');
    console.log('');
    console.log('Ejemplos:');
    console.log('  node add-page.js portafolio.html');
    console.log('  node add-page.js blog.html 0.7 weekly');
    console.log('  node add-page.js nueva-pagina.html 0.9 monthly');
    console.log('');
    console.log('Parámetros:');
    console.log('  filename    - Nombre del archivo HTML (requerido)');
    console.log('  priority    - Prioridad (0.0 - 1.0, default: 0.8)');
    console.log('  changefreq  - Frecuencia: always, hourly, daily, weekly, monthly, yearly, never (default: monthly)');
    process.exit(1);
}

const filename = args[0];
const priority = args[1] || '0.8';
const changefreq = args[2] || 'monthly';

const updater = new SitemapUpdater();

console.log(`🔄 Agregando página al sitemap...`);
console.log(`   Archivo: ${filename}`);
console.log(`   Prioridad: ${priority}`);
console.log(`   Frecuencia: ${changefreq}`);
console.log('');

updater.addPage(filename, priority, changefreq)
    .then(() => {
        console.log('✅ Página agregada exitosamente al sitemap.xml');
        process.exit(0);
    })
    .catch(error => {
        console.error('❌ Error al agregar la página:', error.message);
        process.exit(1);
    });

