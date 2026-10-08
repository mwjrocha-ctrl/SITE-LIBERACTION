import { chromium } from 'playwright-core';
import lighthouse from 'lighthouse';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';

const label = process.argv[2] || 'after';
const routes = process.argv.slice(3);
if (!routes.length) {
  routes.push('contato', 'home');
  for (const entry of await readdir('pt', { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name === 'contato') continue;
    if (!/<meta http-equiv="refresh"/i.test(await readFile(`pt/${entry.name}/index.html`, 'utf8'))) routes.push(entry.name);
  }
  routes.push('404');
}
await mkdir('reports/performance', { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, args: ['--remote-debugging-port=9224'] });
try {
  for (const route of routes) {
    const result = await lighthouse(route === '404' ? 'http://localhost:8081/404.html' : `http://localhost:8081/pt/${route === 'home' ? '' : route + '/'}`, {
      port: 9224, output: 'json', onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'], logLevel: 'error'
    });
    await writeFile(`reports/performance/${label}-${route}.json`, result.report);
    console.log(JSON.stringify({ route, scores: Object.fromEntries(Object.entries(result.lhr.categories).map(([key, value]) => [key, value.score * 100])), metrics: Object.fromEntries(['first-contentful-paint', 'largest-contentful-paint', 'total-blocking-time', 'speed-index', 'cumulative-layout-shift'].map(key => [key, result.lhr.audits[key].displayValue])) }));
  }
} finally { await browser.close(); }
