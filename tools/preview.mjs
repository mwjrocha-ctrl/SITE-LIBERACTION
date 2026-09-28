import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { gzipSync } from 'node:zlib';

const root = resolve(process.cwd());
const types = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.jpg':'image/jpeg','.webp':'image/webp','.avif':'image/avif','.woff2':'font/woff2','.txt':'text/plain; charset=utf-8','.xml':'application/xml'};
http.createServer(async (req,res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    const file = resolve(root,'.'+pathname);
    if (!file.startsWith(root+sep) && file!==root || /(^|\/)(\.|node_modules|reports|tools)/.test(pathname)) {
      res.writeHead(403).end(); return;
    }
    const info = await stat(file);
    if (info.isDirectory() && !pathname.endsWith('/')) { res.writeHead(301,{Location:pathname+'/'}).end(); return; }
    const target = info.isDirectory() ? resolve(file,'index.html') : file;
    let body = await readFile(target);
    const extension = extname(target);
    res.setHeader('Content-Type',types[extension]||'application/octet-stream');
    res.setHeader('Vary','Accept-Encoding');
    res.setHeader('Cache-Control',/\.[a-f0-9]{12}\./.test(target) ? 'public, max-age=31536000, immutable' : 'no-cache');
    if (/\.(html|css|js|svg|txt|xml)$/.test(target) && req.headers['accept-encoding']?.includes('gzip')) {
      body = gzipSync(body); res.setHeader('Content-Encoding','gzip');
    }
    res.setHeader('Content-Length',body.length);
    res.writeHead(200).end(req.method==='HEAD' ? undefined : body);
  } catch { res.writeHead(404).end('Not found'); }
}).listen(8081,'127.0.0.1',()=>console.log('Preview: http://localhost:8081/pt/'));
