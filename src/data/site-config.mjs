export const DEFAULT_SITE_URL = 'https://woki.pe';

const withoutTrailingSlash = (value) => value.replace(/\/+$/, '');

function normalizeSiteUrl(value) {
  const url = new URL(withoutTrailingSlash(value));
  if (url.hostname.toLowerCase() === 'www.woki.pe') url.hostname = 'woki.pe';
  return withoutTrailingSlash(url.href);
}

export function getSiteConfig(env = {}) {
  const requestedSiteUrl = normalizeSiteUrl(env.PUBLIC_SITE_URL?.trim() || DEFAULT_SITE_URL);
  const productionHost = env.VERCEL_PROJECT_PRODUCTION_URL?.trim().toLowerCase() || '';
  const isNoIndex = env.PUBLIC_NOINDEX === 'true'
    || env.VERCEL_ENV === 'preview'
    || productionHost.endsWith('.vercel.app');
  const deploymentHost = env.VERCEL_URL?.trim() || env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  const siteUrl = isNoIndex && deploymentHost
    ? withoutTrailingSlash(`https://${deploymentHost}`)
    : requestedSiteUrl;

  return { siteUrl, isNoIndex, requestedSiteUrl };
}

export function getContactEmail(siteUrl) {
  const hostname = new URL(siteUrl).hostname.replace(/^www\./i, '');
  return `hola@${hostname}`;
}
