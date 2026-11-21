import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadEnv } from 'vite';
import { getSiteConfig } from '../src/data/site-config.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const env = { ...loadEnv('production', root, ''), ...process.env };
const siteConfig = getSiteConfig(env);
const errors = [];

function assert(condition, message) {
  if (!condition) errors.push(message);
}

async function filesUnder(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map((entry) => {
    const absolute = path.join(directory, entry.name);
    return entry.isDirectory() ? filesUnder(absolute) : absolute;
  }));
  return files.flat();
}

function metaContent(html, expression) {
  const match = html.match(expression);
  return match?.[1]?.replaceAll('&amp;', '&').replaceAll('&quot;', '"').trim() ?? '';
}

const outputFiles = await filesUnder(dist);
const htmlFiles = outputFiles.filter((file) => file.endsWith('.html') && !/^google[\da-f]+\.html$/i.test(path.basename(file)));
assert(htmlFiles.length > 0, 'No se encontraron páginas HTML compiladas en dist.');

const pages = [];
const pageByPath = new Map();
for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  const relative = path.relative(dist, file).split(path.sep).join('/');
  const canonical = metaContent(html, /<link\s+rel="canonical"\s+href="([^"]+)"/i);
  const title = html.match(/<title>(.*?)<\/title>/is)?.[1]?.replace(/\s+/g, ' ').trim() ?? '';
  const description = metaContent(html, /<meta\s+name="description"\s+content="([^"]*)"/i);
  const ogUrl = metaContent(html, /<meta\s+property="og:url"\s+content="([^"]*)"/i);
  const ogImage = metaContent(html, /<meta\s+property="og:image"\s+content="([^"]*)"/i);
  const ogImageAlt = metaContent(html, /<meta\s+property="og:image:alt"\s+content="([^"]*)"/i);
  const themeColor = metaContent(html, /<meta\s+name="theme-color"\s+content="([^"]*)"/i);
  const pageUrl = canonical ? new URL(canonical) : null;
  const routePath = pageUrl?.pathname || '';
  const normalizedPath = routePath === '/' ? '/' : routePath.replace(/\/+$/, '');
  assert(Boolean(canonical), `${relative}: falta canonical.`);
  assert(Boolean(title), `${relative}: falta <title>.`);
  assert((html.match(/<h1\b/gi) ?? []).length === 1, `${relative}: cada página debe tener exactamente un H1.`);
  assert(title.length <= 60, `${relative}: title supera 60 caracteres (${title.length}).`);
  assert(description.length >= 120 && description.length <= 155, `${relative}: meta description debe tener entre 120 y 155 caracteres (tiene ${description.length}).`);
  assert(ogUrl === canonical, `${relative}: og:url no coincide con canonical.`);
  assert(Boolean(ogImage), `${relative}: falta og:image.`);
  assert(Boolean(ogImageAlt), `${relative}: falta og:image:alt.`);
  assert(Boolean(themeColor), `${relative}: falta theme-color.`);
  if (pageUrl) {
    assert(pageUrl.origin === new URL(siteConfig.siteUrl).origin, `${relative}: canonical usa un dominio distinto al configurado (${canonical}).`);
    assert(normalizedPath === routePath, `${relative}: canonical no sigue trailingSlash: never (${canonical}).`);
    const page = { file, html, relative, canonical, normalizedPath };
    pages.push(page);
    assert(!pageByPath.has(normalizedPath), `${relative}: canonical duplicado (${normalizedPath}).`);
    pageByPath.set(normalizedPath, page);
  }
  if (ogImage) {
    try {
      const imageUrl = new URL(ogImage);
      const imageFile = path.join(dist, decodeURIComponent(imageUrl.pathname.replace(/^\//, '')));
      await stat(imageFile);
    } catch {
      errors.push(`${relative}: og:image no apunta a una imagen generada en dist (${ogImage}).`);
    }
  }
  if (siteConfig.isNoIndex) assert(/<meta\s+name="robots"\s+content="noindex, nofollow"\s*\/?\s*>/i.test(html), `${relative}: falta meta robots noindex, nofollow.`);

  const jsonLdMatches = [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)];
  const jsonLd = [];
  for (const [, content] of jsonLdMatches) {
    try {
      jsonLd.push(JSON.parse(content));
    } catch (error) {
      errors.push(`${relative}: JSON-LD inválido (${error.message}).`);
    }
  }
  const flattened = jsonLd.flatMap((item) => Array.isArray(item) ? item : [item]);
  const organizationNodes = flattened.filter((item) => item?.['@id'] === `${siteConfig.siteUrl}/#organization`);
  assert(organizationNodes.length <= 1, `${relative}: hay más de una entidad Organization/LocalBusiness con el mismo @id.`);
  if (normalizedPath === '/') {
    assert(organizationNodes.length === 1, 'La portada debe tener una entidad Organization/LocalBusiness compartida.');
    const localBusiness = organizationNodes[0];
    const types = Array.isArray(localBusiness?.['@type']) ? localBusiness['@type'] : [localBusiness?.['@type']];
    assert(types.includes('Organization') && types.includes('LocalBusiness') && types.includes('TaxiService'), 'La entidad principal debe identificar Organization, LocalBusiness y TaxiService con el mismo @id.');
  }

  const mainHtml = html.match(/<main\b[\s\S]*?<\/main>/i)?.[0] ?? '';
  const mainText = mainHtml.replace(/<script\b[\s\S]*?<\/script>|<style\b[\s\S]*?<\/style>|<svg\b[\s\S]*?<\/svg>/gi, ' ')
    .replace(/<[^>]+>/g, ' ').replace(/&[a-z#0-9]+;/gi, ' ').replace(/\s+/g, ' ').trim();
  const wordCount = mainText ? mainText.split(/\s+/).length : 0;
  if (['/como-funciona', '/seguridad', '/conductores'].includes(normalizedPath)) {
    assert(wordCount >= 300 && wordCount <= 500, `${normalizedPath}: el contenido principal tiene ${wordCount} palabras; se esperan entre 300 y 500.`);
  }

  for (const [imageTag] of html.matchAll(/<img\b[^>]*>/gi)) {
    assert(/\balt="[^"]*"/i.test(imageTag), `${relative}: hay una imagen sin atributo alt.`);
    assert(/\bwidth="\d+"/i.test(imageTag) && /\bheight="\d+"/i.test(imageTag), `${relative}: una imagen no incluye width y height para reservar espacio.`);
    assert(/\bloading="(?:lazy|eager)"/i.test(imageTag), `${relative}: una imagen no declara loading.`);
    if (/fetchpriority="high"/i.test(imageTag)) assert(/loading="eager"/i.test(imageTag), `${relative}: una imagen prioritaria debe cargar inmediatamente.`);
    else assert(/loading="lazy"/i.test(imageTag), `${relative}: las imágenes fuera de la primera vista deben cargar lazy.`);
  }
  if (['/como-funciona', '/conductores'].includes(normalizedPath)) {
    assert(/fetchpriority="high"/i.test(mainHtml), `${normalizedPath}: la imagen principal debe tener fetchpriority=high.`);
  }
}

assert(new Set(pages.map((page) => page.html.match(/<title>(.*?)<\/title>/is)?.[1]?.replace(/\s+/g, ' ').trim() ?? '')).size === pages.length, 'Los titles deben ser únicos entre páginas.');
assert(new Set(pages.map((page) => metaContent(page.html, /<meta\s+name="description"\s+content="([^"]*)"/i))).size === pages.length, 'Las meta descriptions deben ser únicas entre páginas.');

const expectedPagePaths = ['/', '/como-funciona', '/seguridad', '/conductores', '/nosotros', '/contacto', '/aviso-legal', '/privacidad', '/terminos', '/terminos-conductor', '/cookies'];
if (!siteConfig.isNoIndex) {
  const sitemapPath = path.join(dist, 'sitemap.xml');
  let sitemap = '';
  try { sitemap = await readFile(sitemapPath, 'utf8'); } catch {}
  assert(sitemap.trim().length > 0, 'sitemap.xml no existe o está vacío.');
  const locations = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(([, location]) => location.trim());
  assert(locations.length === expectedPagePaths.length, `El sitemap debe incluir ${expectedPagePaths.length} URLs (encontradas ${locations.length}).`);
  const expectedUrls = expectedPagePaths.map((route) => new URL(route, siteConfig.siteUrl).href);
  assert(expectedUrls.every((url) => locations.includes(url)), 'El sitemap no contiene exactamente las rutas públicas configuradas en el dominio canónico.');
  assert(new Set(locations).size === locations.length, 'El sitemap contiene URLs duplicadas.');

  let robots = '';
  try { robots = await readFile(path.join(dist, 'robots.txt'), 'utf8'); } catch {}
  assert(robots.includes(`Sitemap: ${new URL('/sitemap.xml', siteConfig.siteUrl).href}`), 'robots.txt no incluye la URL del sitemap del dominio configurado.');
  assert(!/^Disallow:\s*\/$/m.test(robots), 'robots.txt bloquea todo el sitio aunque la compilación permite indexar.');
} else {
  try {
    await stat(path.join(dist, 'sitemap.xml'));
    assert(false, 'El modo noindex debe omitir el archivo sitemap.xml.');
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  let robots = '';
  try { robots = await readFile(path.join(dist, 'robots.txt'), 'utf8'); } catch {}
  assert(/^Disallow:\s*\/$/m.test(robots), 'En modo noindex, robots.txt debe contener Disallow: /.');
  assert(!/^Sitemap:/m.test(robots), 'En modo noindex, robots.txt no debe anunciar un sitemap.');
}

const expectedPlayUrl = env.PUBLIC_GOOGLE_PLAY_URL?.trim();
const home = pageByPath.get('/');
if (home) {
  const appSchemaPresent = /"@type":"MobileApplication"/.test(home.html);
  assert(expectedPlayUrl ? appSchemaPresent : !appSchemaPresent, 'MobileApplication debe aparecer solo cuando PUBLIC_GOOGLE_PLAY_URL está configurado.');
  if (!expectedPlayUrl) assert(/aria-disabled="true"[^>]*aria-label="Próximamente en Google Play"/.test(home.html), 'El botón de Google Play debe mostrarse como Próximamente y desactivado si no hay URL.');
}

if (env.PUBLIC_CONTACT_FORM_ENDPOINT?.trim()) {
  // El envío se valida por la configuración; el endpoint no se consulta desde este script.
} else {
  const contact = pageByPath.get('/contacto');
  assert(Boolean(contact && /id="contact-form-unavailable"/.test(contact.html) && /<button[^>]*type="submit"[^>]*disabled/.test(contact.html)), 'Sin endpoint, el formulario debe explicar que no está disponible y desactivar el envío.');
}

for (const page of pages) assert(!/href=["']mailto:[^"']+@(example\.(?:com|org)|localhost)(?:["'])/i.test(page.html), `${page.relative}: contiene un enlace de correo de ejemplo.`);
for (const page of pages) assert(!/href=["']https:\/\/wa\.me\//i.test(page.html), `${page.relative}: contiene un enlace de WhatsApp temporal.`);

for (const page of pages) {
  const anchors = [...page.html.matchAll(/\bhref\s*=\s*(["'])(.*?)\1/gi)].map(([, , href]) => href.trim());
  for (const href of anchors) {
    if (!href || href.startsWith('#') && href.length === 1 || /^(mailto:|tel:|javascript:|data:)/i.test(href)) continue;
    let target;
    try { target = new URL(href, page.canonical); } catch { errors.push(`${page.relative}: enlace inválido (${href}).`); continue; }
    if (target.origin !== new URL(page.canonical).origin) continue;
    const targetPath = target.pathname === '/' ? '/' : target.pathname.replace(/\/+$/, '');
    const targetPage = pageByPath.get(targetPath);
    if (targetPage) {
      if (target.hash) {
        const id = decodeURIComponent(target.hash.slice(1));
        assert(new RegExp(`\\bid=["']${id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["']`).test(targetPage.html), `${page.relative}: el ancla ${href} no existe en el destino.`);
      }
      continue;
    }
    const assetPath = path.join(dist, decodeURIComponent(target.pathname.replace(/^\//, '')));
    try { await stat(assetPath); } catch { errors.push(`${page.relative}: enlace interno roto (${href}).`); }
  }
}

if (errors.length) {
  console.error(`SEO check encontró ${errors.length} problema(s):\n- ${errors.join('\n- ')}`);
  process.exitCode = 1;
} else {
  console.log(`SEO check correcto: ${pages.length} páginas, metadatos, JSON-LD, enlaces internos y configuración ${siteConfig.isNoIndex ? 'noindex' : 'indexable'} validados.`);
}
