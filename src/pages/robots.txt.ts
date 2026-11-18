import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const noIndex = import.meta.env.PUBLIC_NOINDEX === 'true' || import.meta.env.VERCEL_ENV === 'preview';
  const sitemap = noIndex || !site ? '' : `\nSitemap: ${new URL('/sitemap.xml', site).href}`;
  const body = `User-agent: *\nAllow: /${sitemap}\n`;

  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
