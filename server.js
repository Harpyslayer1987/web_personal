const express = require('express');
const bodyParser = require('body-parser');
const SitemapUpdater = require('./sitemap-updater');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Instancia del actualizador de sitemap
const sitemapUpdater = new SitemapUpdater();

/**
 * Endpoint para actualizar el sitemap automáticamente
 * POST /api/sitemap/update
 */
app.post('/api/sitemap/update', async (req, res) => {
    try {
        await sitemapUpdater.updateSitemap();
        res.json({
            success: true,
            message: 'Sitemap actualizado exitosamente'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al actualizar el sitemap',
            error: error.message
        });
    }
});

/**
 * Endpoint para agregar una nueva página al sitemap
 * POST /api/sitemap/add-page
 * Body: { filename, priority?, changefreq? }
 */
app.post('/api/sitemap/add-page', async (req, res) => {
    try {
        const { filename, priority, changefreq } = req.body;

        if (!filename) {
            return res.status(400).json({
                success: false,
                message: 'El campo "filename" es requerido'
            });
        }

        await sitemapUpdater.addPage(
            filename,
            priority || '0.8',
            changefreq || 'monthly'
        );

        res.json({
            success: true,
            message: `Página ${filename} agregada al sitemap exitosamente`
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al agregar la página al sitemap',
            error: error.message
        });
    }
});

/**
 * Endpoint para obtener el estado del sitemap
 * GET /api/sitemap/status
 */
app.get('/api/sitemap/status', async (req, res) => {
    try {
        const pages = sitemapUpdater.scanHTMLFiles();
        res.json({
            success: true,
            totalPages: pages.length,
            pages: pages
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener el estado del sitemap',
            error: error.message
        });
    }
});

/**
 * Endpoint de salud del servidor
 * GET /api/health
 */
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString()
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor backend iniciado en el puerto ${PORT}`);
    console.log(`📝 Endpoints disponibles:`);
    console.log(`   POST /api/sitemap/update - Actualizar sitemap`);
    console.log(`   POST /api/sitemap/add-page - Agregar nueva página`);
    console.log(`   GET  /api/sitemap/status - Estado del sitemap`);
    console.log(`   GET  /api/health - Estado del servidor`);
});

module.exports = app;

