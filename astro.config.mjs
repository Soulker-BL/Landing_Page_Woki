import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Cambia esta URL por tu dominio real (importante para SEO, sitemap y canonical)
export default defineConfig({
  site: 'https://woki.com.pe',
  integrations: [sitemap()],
});
