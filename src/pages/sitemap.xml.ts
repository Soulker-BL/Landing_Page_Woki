import type { APIRoute } from 'astro';

const pages = ['', 'nosotros', 'contacto', 'aviso-legal', 'privacidad', 'terminos'];

export const GET: APIRoute = ({ site }) => {
  const noIndex = import.meta.env.PUBLIC_NOINDEX === 'true' || import.meta.env.VERCEL_ENV === 'preview';
  if (noIndex || !site) return new Response('', { status: 404 });

  const lastmod = new Date().toISOString().slice(0, 10);
  const urls = pages.map((path) => {
    const location = new URL(path ? `/${path}` : '/', site).href;
    return `<url><loc>${location}</loc><lastmod>${lastmod}</lastmod></url>`;
  }).join('');
  const body = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;

  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
