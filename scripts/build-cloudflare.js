import { cpSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';

const out = 'dist';
rmSync(out, { recursive: true, force: true });
mkdirSync(out);
for (const f of ['index.html', 'admin.html', 'app.js', 'styles.css', '_worker.js']) cpSync(f, `${out}/${f}`);
writeFileSync(`${out}/.assetsignore`, '_worker.js\n');
console.log('Cloudflare build ready in ./dist');
