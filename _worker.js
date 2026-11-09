// Cloudflare entry (Pages advanced mode and Workers with static assets).
// Pages are served from Cloudflare; /api/* is forwarded to the Vercel backend,
// which holds the database and Gmail credentials.
const DEFAULT_API_ORIGIN = 'https://hayy-neon.vercel.app';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname.startsWith('/api/')) {
      const origin = (env.API_ORIGIN || DEFAULT_API_ORIGIN).replace(/\/+$/, '');
      const target = origin + url.pathname + url.search;
      const headers = new Headers(request.headers);
      headers.delete('host');
      headers.delete('cf-connecting-ip');
      const init = { method: request.method, headers, redirect: 'manual' };
      if (request.method !== 'GET' && request.method !== 'HEAD') init.body = await request.arrayBuffer();
      try {
        const res = await fetch(target, init);
        const out = new Response(res.body, res);
        out.headers.set('cache-control', 'no-store');
        return out;
      } catch {
        return new Response(JSON.stringify({ error: 'server' }), { status: 502, headers: { 'content-type': 'application/json' } });
      }
    }

    if (url.pathname === '/admin') url.pathname = '/admin.html';
    const res = await env.ASSETS.fetch(new Request(url, request));
    const out = new Response(res.body, res);
    out.headers.set('X-Content-Type-Options', 'nosniff');
    out.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    return out;
  },
};
