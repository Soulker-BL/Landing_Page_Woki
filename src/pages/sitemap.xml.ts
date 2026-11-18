import type { APIRoute } from 'astro';
import { brand } from '../data/site';

const pages = ['', 'como-funciona', 'seguridad', 'conductores', 'nosotros', 'contacto', 'aviso-legal', 'privacidad', 'terminos'];

export const GET: APIRoute = () => {
  if (brand.noIndex) return new Response('', { status: 404 });

  const lastmod = new Date().toISOString().slice(0, 10);
  const urls = pages.map((path) => {
    const location = new URL(path ? `/${path}` : '/', brand.siteUrl).href;
    return `<url><loc>${location}</loc><lastmod>${lastmod}</lastmod></url>`;
  }).join('');
  const body = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;

  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
