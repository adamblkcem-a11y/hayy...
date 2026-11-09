import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

const root = process.cwd();
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.json': 'application/json' };
const port = Number(process.env.PORT) || 3000;

createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  try {
    if (url.pathname === '/api/hayy') {
      const api = await import('../api/hayy.js');
      const handler = api[req.method];
      if (!handler) { res.writeHead(405).end(); return; }
      const chunks = []; for await (const c of req) chunks.push(c);
      const request = new Request(url, { method: req.method, headers: req.headers, body: req.method === 'GET' ? undefined : Buffer.concat(chunks) });
      const response = await handler(request);
      res.writeHead(response.status, Object.fromEntries(response.headers));
      res.end(Buffer.from(await response.arrayBuffer()));
      return;
    }
    let path = url.pathname === '/' ? '/index.html' : url.pathname === '/admin' ? '/admin.html' : url.pathname;
    path = normalize(path).replace(/^(\.\.[/\\])+/, '');
    if (path.startsWith('/api') || path.startsWith('/scripts') || path.includes('node_modules') || path.startsWith('/.')) { res.writeHead(404).end(); return; }
    const data = await readFile(join(root, path));
    res.writeHead(200, { 'content-type': types[extname(path)] || 'application/octet-stream' }).end(data);
  } catch (e) {
    if (e.code !== 'ENOENT') console.error(e);
    res.writeHead(404).end('Not found');
  }
}).listen(port, () => console.log(`Hayy running on http://localhost:${port}`));
