import { chromium } from 'playwright-core';
import { mkdir, writeFile } from 'node:fs/promises';

const label = process.argv[2] || 'after';
await mkdir('reports/performance', { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
const results = [];
try {
  for (const width of [390, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 844 }, reducedMotion: 'reduce' });
    await context.route(/googletagmanager|facebook\.net|facebook\.com/, route => route.abort());
    for (const route of ['', 'contato/', 'quem-somos/', 'estrutura-offshore/']) {
      const page = await context.newPage();
      await page.goto(`http://localhost:8081/pt/${route}`);
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(500);
      const geometry = await page.locator('h1').evaluate(el => {
        const rect = el.getBoundingClientRect();
        const css = getComputedStyle(el);
        return { x: rect.x, y: rect.y, width: rect.width, height: rect.height, fontSize: css.fontSize, lineHeight: css.lineHeight };
      });
      const name = route.replace('/', '') || 'home';
      await page.screenshot({ path: `reports/performance/${label}-${name}-${width}.png` });
      results.push({ route, width, geometry });
      await page.close();
    }
    await context.close();
  }
  await writeFile(`reports/performance/${label}-geometry.json`, JSON.stringify(results, null, 2));
} finally { await browser.close(); }
