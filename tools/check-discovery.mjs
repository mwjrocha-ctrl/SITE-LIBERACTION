import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { renderComponents } from './render-components.mjs';

const origin = 'https://liberaction.io';
const read = path => readFile(path, 'utf8');

export async function checkDiscovery(pages) {
  const llms = await read('llms.txt');
  assert.match(llms, /^# Liberaction\r?\n/, 'llms.txt precisa começar pelo título em Markdown.');
  const links = [...llms.matchAll(/^- \[([^\]]+)\]\((https:\/\/[^\s)]+)\)/gm)];
  assert.ok(links.length > 0, 'llms.txt precisa ter links Markdown reconhecíveis.');
  const services = ['estrutura-offshore', 'criptoativos'];
  for (const service of services) {
    assert.ok(links.some(([, , url]) => url === `${origin}/pt/${service}/`), `O serviço ${service} deve estar no llms.txt.`);
  }
  for (const [, label, href] of links) {
    const url = new URL(href);
    assert.equal(url.origin, origin, `Link fora do site em llms.txt: ${label}`);
    assert.match(url.pathname, /^\/pt\/(?:[a-z0-9-]+\/)?$/);
    const html = await read(`${url.pathname.slice(1)}index.html`);
    assert.ok(html.includes(`<link rel="canonical" href="${href}"`), `Link não canônico em llms.txt: ${href}`);
    // Contact and policy resources may intentionally be noindex; they remain useful to agents.
    assert.ok(!/http-equiv="refresh"/i.test(html), `Redirecionamento em llms.txt: ${href}`);
  }

  for (const path of pages.filter(path => path.startsWith('pt/'))) {
    const html = await read(path);
    if (/http-equiv="refresh"/i.test(html)) continue;
    const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1] || '';
    const headings = [...main.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/g)];
    assert.equal(headings.length, 1, `A página precisa de um H1 no HTML inicial: ${path}`);
    assert.ok(headings[0][1].replace(/<[^>]+>/g, '').trim(), `H1 vazio: ${path}`);
    assert.equal(renderComponents(html), html, `Conteúdo pré-renderizado desatualizado: ${path}`);
    assert.ok(html.includes('rel="describedby" type="text/plain" href="https://liberaction.io/llms.txt"'), `llms.txt não está vinculado: ${path}`);
    for (const [, json] of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) JSON.parse(json);
  }

  const sitemap = await read('sitemap.xml');
  for (const service of services) {
    const servicePage = await read(`pt/${service}/index.html`);
    const data = JSON.parse(servicePage.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
    const webPage = data['@graph'].find(item => item['@type'] === 'WebPage');
    const offering = data['@graph'].find(item => item['@type'] === 'Service');
    assert.equal(offering?.url, `${origin}/pt/${service}/`, 'O serviço deve usar a URL da página existente.');
    assert.equal(webPage.mainEntity?.['@id'], offering['@id']);
    assert.equal(offering.provider?.['@id'], `${origin}/#organization`);
    assert.ok(sitemap.includes(`<loc>${offering.url}</loc>`));
  }
  for (const [, href] of sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)) {
    const url = new URL(href);
    assert.equal(url.origin, origin);
    assert.match(url.pathname, /^\/pt\/(?:[a-z0-9-]+\/)?$/);
    const html = await read(`${url.pathname.slice(1)}index.html`);
    assert.ok(html.includes(`<link rel="canonical" href="${href}"`), `URL não canônica no sitemap: ${href}`);
    assert.ok(!/http-equiv="refresh"|content="noindex/i.test(html), `URL não indexável no sitemap: ${href}`);
  }
  console.log(`Descoberta validada: ${links.length} links Markdown, sitemap, dados estruturados e títulos no HTML.`);
}
