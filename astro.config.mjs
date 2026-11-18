import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const fileEnv = loadEnv(mode, process.cwd(), '');
  const site = (process.env.PUBLIC_SITE_URL?.trim() || fileEnv.PUBLIC_SITE_URL?.trim() || 'https://woki.com.pe').replace(/\/+$/, '');
  const vercelEnv = process.env.VERCEL_ENV || fileEnv.VERCEL_ENV;
  const noIndexBuild = process.env.PUBLIC_NOINDEX === 'true' || fileEnv.PUBLIC_NOINDEX === 'true' || vercelEnv === 'preview';
  return {
    site,
    trailingSlash: 'never',
    vite: { envPrefix: ['PUBLIC_', 'VERCEL_'] },
    integrations: noIndexBuild ? [] : [sitemap({
      serialize(item) {
        return { ...item, lastmod: new Date() };
      },
    })],
  };
});
