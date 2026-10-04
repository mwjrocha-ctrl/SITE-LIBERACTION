import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { resolve, sep } from 'node:path';
import { checkDiscovery } from './check-discovery.mjs';

const root = process.cwd();
const output = resolve(root, '_site');
assert.equal(output, root + sep + '_site', 'A saída deve ficar dentro do projeto.');

const manifest = JSON.parse(await readFile('assets/manifest.json', 'utf8'));
for (const asset of [manifest.js, manifest.css]) {
  const digest = createHash('sha256').update(await readFile(asset)).digest('hex').slice(0, 12);
  assert.ok(asset.includes(`.${digest}.`), `Asset modificado sem atualizar o hash: ${asset}`);
}

const pages = ['404.html'];
async function findPages(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = `${directory}/${entry.name}`;
    if (entry.isDirectory()) await findPages(path);
    else if (entry.name.endsWith('.html')) pages.push(path);
  }
}
await findPages('pt');
for (const page of pages) {
  const html = await readFile(page, 'utf8');
  const redirect = html.match(/<meta http-equiv="refresh" content="0; url=(pt\/[a-z0-9/-]+\/)"\s*\/>/);
  if (redirect) {
    assert.ok(html.includes(`<link rel="canonical" href="https://liberaction.io/${redirect[1]}"`), `Destino canônico incorreto em ${page}`);
    assert.ok(html.includes('<base href="../../"'), `Base incorreta em ${page}`);
    assert.ok(html.includes('content="noindex, follow"'), `Redirecionamento indexável em ${page}`);
    await readFile(`${redirect[1]}index.html`);
    continue;
  }
  const scripts = [...html.matchAll(/<script\b[^>]*\bsrc="([^"]+)"/g)].map(match => match[1]).filter(src => !src.includes('googletagmanager.com'));
  assert.deepEqual(scripts, [manifest.js], `JavaScript desatualizado em ${page}`);
  assert.ok(html.includes(`href="${manifest.css}"`), `CSS desatualizado em ${page}`);
  for (const asset of new Set(html.match(/(?:assets|imagens)\/[a-zA-Z0-9._/-]+\.(?:js|css|woff2|webp|avif|svg|png|jpg)/g))) {
    await readFile(asset);
  }
}

await checkDiscovery(pages);

// Publicar somente os arquivos do site, sem ferramentas ou dependências de desenvolvimento.
await rm(output, { recursive: true, force: true });
await mkdir(output);
for (const path of ['index.html', '404.html', 'pt', 'assets', 'imagens', 'robots.txt', 'sitemap.xml', 'llms.txt', 'CNAME', '.nojekyll']) {
  await cp(path, resolve(output, path), { recursive: true });
}
await writeFile(resolve(output, 'deployment.json'), JSON.stringify({
  commit: process.env.GITHUB_SHA || null,
  builtAt: new Date().toISOString(),
  js: manifest.js,
  css: manifest.css
}, null, 2) + '\n');
console.log(`Site validado: ${pages.length} páginas; publicação preparada em _site/.`);
