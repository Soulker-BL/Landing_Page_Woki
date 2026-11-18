import type { APIRoute } from 'astro';
import { brand } from '../data/site';

export const GET: APIRoute = () => {
  const body = brand.noIndex
    ? 'User-agent: *\nDisallow: /\n'
    : `User-agent: *\nAllow: /\nSitemap: ${new URL('/sitemap.xml', brand.siteUrl).href}\n`;

  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
