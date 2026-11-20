# Woki landing

Sitio estático en Astro 5 para Woki, plataforma de taxi urbano en Cerro de Pasco.

## Despliegue en VPS con Docker

Requisitos: Docker Engine y el complemento Docker Compose (`docker compose`) instalados en un VPS Linux. Ejecuta estos comandos en el directorio del proyecto, después de clonarlo o copiarlo al servidor:

```sh
cp .env.example .env
nano .env
docker compose up -d --build
docker compose ps
curl -I http://127.0.0.1:8080/
curl -I http://127.0.0.1:8080/contacto
```

En `.env`, configura `PUBLIC_SITE_URL=https://www.woki.pe` (o tu dominio definitivo), `PUBLIC_NOINDEX=false` y las otras variables públicas que correspondan. Para pruebas sin indexación, usa `PUBLIC_NOINDEX=true`. El formulario requiere un servicio externo configurado en `PUBLIC_CONTACT_FORM_ENDPOINT`; el contenedor sirve únicamente el sitio estático.

Por defecto se publica en `http://IP_DEL_VPS:8080`; permite ese puerto en el firewall del proveedor/VPS si quieres acceso directo. Para servir HTTP en el puerto 80, configura `HTTP_PORT=80` si está libre. Si cambias el puerto, ajústalo también en los comandos `curl`.

La imagen compila con Node 22, ejecuta la verificación de Astro y copia solamente los archivos generados a Nginx. El servidor se ejecuta sin privilegios, con el sistema de archivos de solo lectura, comprobación de salud y reinicio automático. `.env` queda fuera de la imagen; Compose pasa explícitamente las variables públicas como argumentos de compilación. **Cambiar una variable `PUBLIC_*` requiere reconstruir la imagen**:

```sh
# Después de actualizar el código o las variables:
docker compose up -d --build

# Diagnóstico y parada:
docker compose logs --tail=100 -f web
docker compose down
```

### Dominio y HTTPS

Apunta los registros DNS del dominio a la IP del VPS. Para producción con HTTPS, conecta el servicio al proxy inverso de tu VPS (Nginx, Caddy o el panel que uses) y configura allí el certificado TLS y la redirección de HTTP a HTTPS. Configura también el dominio alternativo para redirigir al dominio canónico definido en `PUBLIC_SITE_URL`.

Si el proxy corre directamente en el VPS, configura `BIND_ADDRESS=127.0.0.1` y `HTTP_PORT=8080` en `.env`, vuelve a ejecutar `docker compose up -d --build` y dirige el proxy a `http://127.0.0.1:8080`. Ejemplo del bloque de ubicación para Nginx, dentro del servidor HTTPS que tenga tu certificado:

```nginx
location / {
    proxy_pass http://127.0.0.1:8080;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

Si el proxy corre en otro contenedor, conéctalo a la misma red Docker y usa `http://web:8080` como destino en lugar de `127.0.0.1`. El certificado HTTPS se administra en el proxy; no está incluido en esta imagen.

## SEO e indexación

- El dominio por defecto se define una sola vez en `src/data/site-config.mjs`. Canonical, `og:url`, sitemap, robots y JSON-LD toman la misma URL.
- Las rutas se publican sin barra final (`trailingSlash: 'never'`). La portada usa `/`.
- Cada página define title, descripción, imagen social y texto alternativo. La imagen se genera en tamaño social de 1200 × 630.
- El JSON-LD comparte una sola entidad `Organization`/`LocalBusiness`/`TaxiService`; las otras páginas la referencian. FAQPage solo se incluye en inicio. MobileApplication solo aparece cuando existe el enlace real de Google Play.
- Se genera `sitemap.xml` con nueve páginas públicas. La guía de eliminación de cuenta no se agrega al sitemap.
- `robots.txt` publica la URL del sitemap cuando se permite indexar. En modo de pruebas bloquea el rastreo y Astro elimina el sitemap compilado.
- GTM mantiene su consentimiento actual: el contenedor solo se carga cuando la persona acepta analítica.

### Variables de entorno

Define las variables en `.env` durante desarrollo o en las configuraciones de Vercel correspondientes. `.env.example` muestra las variables disponibles; el dominio por defecto está centralizado en el código.

| Variable | Uso |
| --- | --- |
| `PUBLIC_SITE_URL` | Dominio canónico. Déjala vacía para usar el valor por defecto; en producción define la URL oficial. |
| `PUBLIC_NOINDEX` | Control manual: `true` añade `noindex,nofollow`, bloquea robots y omite el sitemap. |
| `PUBLIC_GOOGLE_PLAY_URL` | URL real de la ficha de Woki en Play Store. Vacía, la app se muestra como próximamente y no se añade MobileApplication. |
| `PUBLIC_CONTACT_FORM_ENDPOINT` | Endpoint que recibe el formulario. Vacío, el envío queda desactivado con una explicación. |
| `PUBLIC_GOOGLE_SITE_VERIFICATION` | Token de verificación de Google Search Console. |
| `VERCEL_ENV` | Variable de Vercel; los despliegues `preview` se marcan automáticamente como no indexables. |
| `VERCEL_URL` | Host del despliegue actual; se usa como canonical temporal en pruebas. |
| `VERCEL_PROJECT_PRODUCTION_URL` | Dominio de producción del proyecto; si acaba en `.vercel.app`, se activa el modo de prueba. |

El modo no indexable se activa si `PUBLIC_NOINDEX=true`, si `VERCEL_ENV=preview` o si el dominio de producción de Vercel todavía es un `*.vercel.app`. Cuando está activo, canonical y Open Graph apuntan al host de despliegue (`VERCEL_URL`); `robots.txt` contiene `Disallow: /` y no se publica el sitemap.

Para que la detección automática funcione, habilita **Enable access to System Environment Variables** en la configuración del proyecto Vercel. Vercel documenta que `VERCEL_PROJECT_PRODUCTION_URL` toma el dominio de producción personalizado más corto o usa `*.vercel.app` si el proyecto aún no tiene uno; la variable también está disponible en previews. Consulta la [documentación de variables de entorno de sistema de Vercel](https://vercel.com/docs/environment-variables/system-environment-variables).

### Cambio de dominio

Cuando se lance el dominio oficial:

1. En Vercel, agrega `www.woki.pe` al proyecto y selecciónalo como dominio principal de producción.
2. Configura `woki.pe` para redirigir permanentemente a `www.woki.pe` desde los ajustes de Domains de Vercel.
3. En variables de entorno de Vercel, define `PUBLIC_SITE_URL` con la URL oficial `https://www.woki.pe` en Production.
4. Quita `PUBLIC_NOINDEX` del entorno Production (o déjala vacía). No fuerces `PUBLIC_NOINDEX=true` en producción.
5. Guarda y vuelve a desplegar Production.
6. Ejecuta `npm run check:seo` en un build de producción con las mismas variables y comprueba que canonical, `og:url`, sitemap y robots usan `www.woki.pe`, que el sitemap lista nueve rutas y que no hay meta `noindex`.
7. En Search Console, verifica la propiedad del dominio y envía `https://www.woki.pe/sitemap.xml` después de que el dominio responda públicamente.

En los previews, Vercel detecta el estado de prueba automáticamente. Para una compilación local indexable se usa el dominio por defecto del proyecto; para comprobar el modo de pruebas, define `PUBLIC_NOINDEX=true` y un host de despliegue `VERCEL_URL`.

## Imágenes y reemplazos

Los componentes importan las imágenes desde `src/assets/images/`; sus rutas, descripciones alternativas y usos están centralizados en `src/data/images.ts`. Reemplaza el archivo de esa ruta conservando su nombre. Astro genera AVIF/WebP y dimensiones responsivas para las imágenes mostradas en `<Picture>`. Las copias en `public/images/**` son provisionales y se conservan; no son la fuente de los componentes.

| Ruta en `src/assets/images/` | Dónde se usa | Recomendación |
| --- | --- | --- |
| `conductor.jpg` | Foto de Conductores y base temporal para la imagen social | 1448 × 1086 px o mayor, horizontal 4:3; para una pieza social original, 1200 × 630 px |
| `woki-nosotros.jpg` | Fondo del banner Nosotros y compartir en esa página | 1448 × 1086 px o mayor, horizontal |
| `woki-contacto.jpg` | Fondo del banner Contacto y compartir en esa página | 1448 × 1086 px o mayor, horizontal |
| `pasos/pasajero-1.jpg` a `pasajero-4.jpg` | Cuatro etapas del pasajero en Cómo funciona | 1448 × 1086 px, 4:3 |
| `pasos/conductor-1.jpg` a `conductor-4.jpg` | Cuatro etapas del conductor en Cómo funciona | 1448 × 1086 px, 4:3 |

Las redes sociales y el sitio pueden recortar sus imágenes al compartirlas. Los metadatos por página usan el campo `image` del layout y mantienen su propio `og:image:alt` aunque las fotos sean provisionales.

## Verificación

```sh
npm run check
npm run check:seo
```

`check:seo` compila y valida títulos y descripciones, canonical y `og:url`, sitemap y robots según el modo, JSON-LD válido, enlaces internos y la ausencia de contactos/enlaces de Play temporales publicados como oficiales.

## Comandos de desarrollo

```sh
npm run dev
npm run build
npm run preview
```
