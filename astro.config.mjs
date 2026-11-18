import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const fileEnv = loadEnv(mode, process.cwd(), '');
  const site = (process.env.PUBLIC_SITE_URL?.trim() || fileEnv.PUBLIC_SITE_URL?.trim() || 'https://woki.com.pe').replace(/\/+$/, '');
  return {
    site,
    trailingSlash: 'never',
    vite: { envPrefix: ['PUBLIC_', 'VERCEL_'] },
  };
});
