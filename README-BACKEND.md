# Backend para Actualización Automática de Sitemap

Este backend permite actualizar automáticamente el archivo `sitemap.xml` cada vez que se crea una nueva página o publicación en el sitio web.

## 📋 Requisitos

- Node.js (versión 14 o superior)
- npm (incluido con Node.js)

## 🚀 Instalación

1. Instala las dependencias:
```bash
npm install
```

## 💻 Uso

### Opción 1: Actualización Automática mediante API

Inicia el servidor backend:

```bash
npm start
```

El servidor se ejecutará en `http://localhost:3000` (o el puerto especificado en la variable de entorno `PORT`).

#### Endpoints disponibles:

**1. Actualizar sitemap completo**
```bash
POST /api/sitemap/update
```

Ejemplo con cURL:
```bash
curl -X POST http://localhost:3000/api/sitemap/update
```

**2. Agregar una nueva página**
```bash
POST /api/sitemap/add-page
Content-Type: application/json

{
  "filename": "portafolio.html",
  "priority": "0.9",
  "changefreq": "monthly"
}
```

Ejemplo con cURL:
```bash
curl -X POST http://localhost:3000/api/sitemap/add-page \
  -H "Content-Type: application/json" \
  -d '{"filename": "portafolio.html", "priority": "0.9", "changefreq": "monthly"}'
```

**3. Ver estado del sitemap**
```bash
GET /api/sitemap/status
```

**4. Verificar salud del servidor**
```bash
GET /api/health
```

### Opción 2: Actualización Manual con Script

**Actualizar sitemap completo:**
```bash
npm run update-sitemap
```

O directamente:
```bash
node sitemap-updater.js
```

**Agregar una nueva página:**
```bash
node add-page.js portafolio.html 0.9 monthly
```

Parámetros:
- `filename` (requerido): Nombre del archivo HTML
- `priority` (opcional): Prioridad de 0.0 a 1.0 (default: 0.8)
- `changefreq` (opcional): Frecuencia de actualización (default: monthly)

**Monitoreo automático de archivos (recomendado para desarrollo):**
```bash
npm run watch
```

Este comando monitorea la carpeta raíz y actualiza el sitemap automáticamente cuando:
- Se crea un nuevo archivo HTML
- Se modifica un archivo HTML existente
- Se elimina un archivo HTML

*Nota: Requiere instalar chokidar: `npm install chokidar`*

## 🔧 Integración con tu Flujo de Trabajo

### Integración con Git Hooks

Puedes agregar un hook de Git para actualizar el sitemap automáticamente después de cada commit:

Crea `.git/hooks/post-commit`:
```bash
#!/bin/sh
node sitemap-updater.js
git add sitemap.xml
git commit --amend --no-edit
```

### Integración con CI/CD

Si usas GitHub Actions, GitLab CI, o similar, puedes agregar un paso que actualice el sitemap:

```yaml
# Ejemplo para GitHub Actions
- name: Update sitemap
  run: |
    npm install
    npm run update-sitemap
    git add sitemap.xml
    git commit -m "Update sitemap" || exit 0
    git push
```

### Integración con CMS o Panel de Administración

Si tienes un panel de administración o CMS, puedes llamar a la API cuando se publique contenido nuevo:

```javascript
// Ejemplo en JavaScript
async function publishNewPage(filename) {
    // ... lógica para crear la página ...
    
    // Actualizar sitemap
    await fetch('http://localhost:3000/api/sitemap/add-page', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            filename: filename,
            priority: '0.9',
            changefreq: 'monthly'
        })
    });
}
```

## 📝 Prioridades y Frecuencias Recomendadas

- **Homepage** (`index.html`): priority 1.0, changefreq weekly
- **Páginas principales** (servicios, portafolio): priority 0.9, changefreq monthly
- **Páginas informativas** (nosotros, contacto): priority 0.8, changefreq monthly
- **Blog**: priority 0.7, changefreq weekly
- **Páginas secundarias**: priority 0.6-0.7, changefreq monthly

## 🔍 Cómo Funciona

1. El módulo `sitemap-updater.js` escanea la carpeta raíz buscando archivos `.html`
2. Para cada archivo, determina su URL, prioridad y frecuencia de actualización
3. Obtiene la fecha de última modificación de cada archivo
4. Genera el XML del sitemap según el estándar de sitemaps.org
5. Escribe el archivo `sitemap.xml` actualizado

## 🌐 Configuración del Dominio

Si necesitas cambiar el dominio base, edita la propiedad `baseUrl` en `sitemap-updater.js`:

```javascript
this.baseUrl = 'https://www.techfixsolutions.site';
```

## 🛠️ Solución de Problemas

**Error: "Cannot find module 'express'"**
- Ejecuta `npm install` para instalar las dependencias

**El sitemap no se actualiza**
- Verifica que el servidor esté ejecutándose
- Revisa los permisos de escritura en la carpeta raíz
- Verifica los logs del servidor para ver errores

**Páginas no aparecen en el sitemap**
- Asegúrate de que los archivos HTML estén en la carpeta raíz
- Verifica que los archivos tengan la extensión `.html`

## 📚 Estructura de Archivos

```
.
├── package.json           # Configuración y dependencias
├── server.js              # Servidor Express con API endpoints
├── sitemap-updater.js     # Módulo principal de actualización
├── add-page.js            # Script de utilidad para agregar páginas
├── sitemap.xml            # Archivo sitemap generado
└── README-BACKEND.md      # Esta documentación
```

## 📄 Licencia

MIT

