import { rm } from 'node:fs/promises';
import path from 'node:path';
import { loadEnv } from 'vite';
import { getSiteConfig } from '../src/data/site-config.mjs';

const env = { ...loadEnv('production', process.cwd(), ''), ...process.env };
const { isNoIndex } = getSiteConfig(env);

if (isNoIndex) await rm(path.resolve(process.cwd(), 'dist', 'sitemap.xml'), { force: true });
