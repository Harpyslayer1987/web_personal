/**
 * Ejemplo de webhook que se puede integrar con servicios externos
 * o usar como endpoint adicional en el servidor
 * 
 * Este archivo muestra cómo integrar la actualización del sitemap
 * cuando se crea una nueva página desde un CMS, formulario, o sistema externo
 */

const SitemapUpdater = require('./sitemap-updater');
const express = require('express');
const router = express.Router();

const sitemapUpdater = new SitemapUpdater();

/**
 * Webhook para cuando se crea una nueva página
 * Este endpoint puede ser llamado por:
 * - Un CMS (Content Management System)
 * - Un formulario de administración
 * - Un sistema de publicación automática
 * - GitHub Actions después de un push
 */
router.post('/webhook/new-page', async (req, res) => {
    try {
        const { filename, priority, changefreq, url } = req.body;

        if (!filename) {
            return res.status(400).json({
                success: false,
                message: 'El campo "filename" es requerido'
            });
        }

        // Agregar la nueva página al sitemap
        await sitemapUpdater.addPage(
            filename,
            priority || '0.8',
            changefreq || 'monthly'
        );

        console.log(`✅ Nueva página agregada: ${filename}`);

        res.json({
            success: true,
            message: `Página ${filename} agregada al sitemap exitosamente`,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('❌ Error en webhook:', error);
        res.status(500).json({
            success: false,
            message: 'Error al procesar el webhook',
            error: error.message
        });
    }
});

/**
 * Webhook para actualizar el sitemap completo
 * Útil para actualizaciones masivas o sincronización
 */
router.post('/webhook/update-all', async (req, res) => {
    try {
        await sitemapUpdater.updateSitemap();
        
        console.log('✅ Sitemap actualizado completamente');

        res.json({
            success: true,
            message: 'Sitemap actualizado exitosamente',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('❌ Error al actualizar sitemap:', error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar el sitemap',
            error: error.message
        });
    }
});

module.exports = router;

/**
 * EJEMPLO DE USO:
 * 
 * Si quieres usar estos webhooks en tu server.js, agrega:
 * 
 * const webhookRouter = require('./webhook-example');
 * app.use('/api', webhookRouter);
 * 
 * Luego puedes llamar:
 * POST /api/webhook/new-page
 * POST /api/webhook/update-all
 */

