# Woki landing

Landing en Astro 5 para la plataforma de taxi urbano Woki en Cerro de Pasco.

## Imágenes

Las imágenes que usa el código están en `src/assets/images/`. Reemplaza el archivo correspondiente conservando su nombre para que Astro siga generando formatos AVIF/WebP y tamaños responsivos. Las copias antiguas de `public/images/` se mantienen por compatibilidad y no son la fuente de las imágenes integradas en los componentes.

| Archivo | Uso | Medida de referencia |
| --- | --- | --- |
| `conductor.jpg` | Foto de la sección Conductores y base para la imagen social | 1448 × 1086 px; el recurso social se recorta a 1200 × 630 px |
| `woki-nosotros.jpg` | Fondo del banner de Nosotros | 1448 × 1086 px o mayor, horizontal |
| `woki-contacto.jpg` | Fondo del banner de Contacto | 1448 × 1086 px o mayor, horizontal |
| `pasos/pasajero-1.jpg` a `pasajero-4.jpg` | Una imagen para cada etapa del pasajero | 1448 × 1086 px, proporción 4:3 |
| `pasos/conductor-1.jpg` a `conductor-4.jpg` | Una imagen para cada etapa del conductor | 1448 × 1086 px, proporción 4:3 |

Para compartir la landing en redes, prepara una imagen social original de **1200 × 630 px**. Actualmente se genera a partir de `conductor.jpg`; se puede cambiar desde la propiedad `assets.socialImage` en `src/data/site.ts`.

Las imágenes de pasos y de Conductores se renderizan con `astro:assets` como AVIF/WebP responsivos. En Nosotros y Contacto, Astro genera una versión WebP para usarla como fondo CSS. Los textos alternativos por etapa se editan en `src/data/content.ts` junto con `passengerSteps` y `driverSteps`.

## SEO, indexación y despliegue

- `astro.config.mjs` toma el dominio canónico de `PUBLIC_SITE_URL`, usa rutas sin barra final y genera sitemap con `lastmod` de la compilación.
- Canonical y Open Graph usan la URL del sitio configurada. Cada página puede definir su propia imagen social, texto alternativo y `ogType` desde `Layout.astro`.
- La home tiene un H1 con “taxi” y “Cerro de Pasco”; las descripciones tienen entre 120 y 155 caracteres.
- Los datos estructurados incluyen `WebSite`, `LocalBusiness`/`TaxiService`, preguntas frecuentes en la home y páginas con breadcrumb. La ficha de Google Play solo aparece si se configura su URL. Las páginas legales solo agregan `BreadcrumbList`.
- Los despliegues de preview de Vercel se construyen con `noindex` y sin sitemap. Usa `PUBLIC_NOINDEX=true` para bloquear la indexación del dominio de prueba `*.vercel.app`; quita esa variable al publicar en el dominio definitivo. `PUBLIC_NOINDEX` está vacío por defecto para permitir la indexación normal.
- `robots.txt` se genera desde Astro y referencia el sitemap del mismo dominio `site` que usa `astro.config.mjs`.
- Vercel aplica caché inmutable a `/_astro/*` e `/images/*`, además de cabeceras de seguridad. GTM sigue esperando el consentimiento de analítica.

### Variables de entorno

Configura estas variables en `.env` para desarrollo y en Vercel para cada entorno:

| Variable | Uso |
| --- | --- |
| `PUBLIC_SITE_URL` | Dominio canónico, por ejemplo `https://woki.com.pe` |
| `PUBLIC_NOINDEX` | `true` para impedir indexación de una versión de prueba |
| `PUBLIC_GOOGLE_PLAY_URL` | URL pública de la ficha de Woki en Google Play |
| `PUBLIC_CONTACT_FORM_ENDPOINT` | Endpoint que recibe el formulario de contacto |
| `PUBLIC_GOOGLE_SITE_VERIFICATION` | Token de verificación de Search Console |

`PUBLIC_GOOGLE_PLAY_URL` y `PUBLIC_CONTACT_FORM_ENDPOINT` pueden permanecer vacías mientras no estén disponibles. No se debe configurar un teléfono, email, ficha de Play o enlace social temporal como dato público definitivo.

## Comandos

```sh
npm run dev
npm run check
npm run build
```
