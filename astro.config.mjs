import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';
import { getSiteConfig } from './src/data/site-config.mjs';

export default defineConfig(({ mode }) => {
  const fileEnv = loadEnv(mode, process.cwd(), '');
  const siteConfig = getSiteConfig({ ...fileEnv, ...process.env });
  return {
    site: siteConfig.siteUrl,
    trailingSlash: 'never',
    vite: { envPrefix: ['PUBLIC_', 'VERCEL_'] },
  };
});
