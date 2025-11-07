const fs = require('fs-extra');
const path = require('path');

/**
 * Clase para gestionar la actualización automática del sitemap.xml
 */
class SitemapUpdater {
    constructor() {
        this.baseUrl = 'https://www.techfixsolutions.site';
        this.sitemapPath = path.join(__dirname, 'sitemap.xml');
        this.pagesPath = __dirname;
    }

    /**
     * Escanea la carpeta raíz y encuentra todos los archivos HTML
     * @returns {Array} Array de objetos con información de las páginas
     */
    scanHTMLFiles() {
        const files = fs.readdirSync(this.pagesPath);
        const htmlFiles = files.filter(file => file.endsWith('.html') && file !== 'index.html');
        
        const pages = [
            {
                url: `${this.baseUrl}/`,
                filename: 'index.html',
                priority: '1.0',
                changefreq: 'weekly'
            }
        ];

        htmlFiles.forEach(file => {
            const urlPath = file === 'index.html' ? '/' : `/${file}`;
            let priority = '0.8';
            let changefreq = 'monthly';

            // Asignar prioridades según el tipo de página
            if (file.includes('service') || file.includes('servicio')) {
                priority = '0.9';
            } else if (file.includes('about') || file.includes('nosotros')) {
                priority = '0.8';
            } else if (file.includes('contact') || file.includes('contacto')) {
                priority = '0.8';
            } else if (file.includes('blog')) {
                priority = '0.7';
                changefreq = 'weekly';
            } else if (file.includes('portafolio') || file.includes('portfolio')) {
                priority = '0.9';
            }

            pages.push({
                url: `${this.baseUrl}${urlPath}`,
                filename: file,
                priority: priority,
                changefreq: changefreq
            });
        });

        return pages;
    }

    /**
     * Obtiene la fecha de última modificación de un archivo
     * @param {string} filename - Nombre del archivo
     * @returns {string} Fecha en formato YYYY-MM-DD
     */
    getLastModified(filename) {
        try {
            const filePath = path.join(this.pagesPath, filename);
            const stats = fs.statSync(filePath);
            const date = new Date(stats.mtime);
            return date.toISOString().split('T')[0];
        } catch (error) {
            // Si no se puede obtener la fecha, usar la fecha actual
            return new Date().toISOString().split('T')[0];
        }
    }

    /**
     * Genera el contenido XML del sitemap
     * @param {Array} pages - Array de páginas a incluir
     * @returns {string} Contenido XML del sitemap
     */
    generateSitemapXML(pages) {
        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
        xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

        pages.forEach(page => {
            const lastmod = this.getLastModified(page.filename);
            xml += '  <url>\n';
            xml += `    <loc>${page.url}</loc>\n`;
            xml += `    <lastmod>${lastmod}</lastmod>\n`;
            xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
            xml += `    <priority>${page.priority}</priority>\n`;
            xml += '  </url>\n';
        });

        xml += '</urlset>\n';
        return xml;
    }

    /**
     * Actualiza el archivo sitemap.xml
     * @param {Object} newPage - Opcional: información de una nueva página a agregar
     * @returns {Promise<boolean>} True si se actualizó correctamente
     */
    async updateSitemap(newPage = null) {
        try {
            // Escanear todas las páginas HTML existentes
            let pages = this.scanHTMLFiles();

            // Si se proporciona una nueva página, agregarla
            if (newPage) {
                const exists = pages.some(p => p.url === newPage.url);
                if (!exists) {
                    pages.push({
                        url: newPage.url || `${this.baseUrl}/${newPage.filename}`,
                        filename: newPage.filename,
                        priority: newPage.priority || '0.8',
                        changefreq: newPage.changefreq || 'monthly'
                    });
                }
            }

            // Generar el XML del sitemap
            const xmlContent = this.generateSitemapXML(pages);

            // Escribir el archivo
            await fs.writeFile(this.sitemapPath, xmlContent, 'utf8');

            console.log(`✅ Sitemap actualizado exitosamente con ${pages.length} páginas`);
            return true;
        } catch (error) {
            console.error('❌ Error al actualizar el sitemap:', error);
            throw error;
        }
    }

    /**
     * Agrega una nueva página al sitemap
     * @param {string} filename - Nombre del archivo HTML
     * @param {string} priority - Prioridad (0.0 - 1.0)
     * @param {string} changefreq - Frecuencia de cambio (always, hourly, daily, weekly, monthly, yearly, never)
     * @returns {Promise<boolean>} True si se agregó correctamente
     */
    async addPage(filename, priority = '0.8', changefreq = 'monthly') {
        const url = filename === 'index.html' 
            ? `${this.baseUrl}/` 
            : `${this.baseUrl}/${filename}`;

        return await this.updateSitemap({
            url: url,
            filename: filename,
            priority: priority,
            changefreq: changefreq
        });
    }
}

// Si se ejecuta directamente, actualizar el sitemap
if (require.main === module) {
    const updater = new SitemapUpdater();
    updater.updateSitemap()
        .then(() => {
            console.log('Sitemap actualizado correctamente');
            process.exit(0);
        })
        .catch(error => {
            console.error('Error:', error);
            process.exit(1);
        });
}

module.exports = SitemapUpdater;

