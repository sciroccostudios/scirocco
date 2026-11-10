import type { APIRoute } from 'astro';

// Generated so the sitemap URL tracks `site` in astro.config.mjs rather than
// hardcoding a domain that is still being confirmed.
export const GET: APIRoute = ({ site }) => {
  const body = [
    'User-agent: *',
    'Allow: /',
    '',
    ...(site ? [`Sitemap: ${new URL('sitemap-index.xml', site).href}`] : []),
  ].join('\n');

  return new Response(`${body}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
