import assert from 'node:assert/strict';
import { chromium } from 'playwright-core';
import { readFile, readdir, mkdir, writeFile } from 'node:fs/promises';

await mkdir('reports/performance', { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
const report = { routes: [], errors: [], forms: [], firstPaint: [] };
const base = process.env.PREVIEW_URL || 'http://localhost:8081';
try {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  context.setDefaultTimeout(8000);
  const analyticsRequests = [];
  await context.route(/googletagmanager|facebook\.net|facebook\.com/, route => {
    analyticsRequests.push(route.request().url());
    return route.fulfill({ status: 200, contentType: 'text/javascript', body: '' });
  });
  const page = await context.newPage();
  page.on('pageerror', error => report.errors.push(error.message));
  page.on('response', response => { if (response.status() >= 400) report.errors.push(`${response.status()} ${response.url()}`); });
  const routes = ['', ...(await readdir('pt', { withFileTypes: true })).filter(entry => entry.isDirectory()).map(entry => entry.name + '/')];
  for (const route of routes) {
    for (const width of [360, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: 844 });
      const response = await page.goto(`${base}/pt/${route}`);
      assert.equal(response.status(), 200);
      await page.waitForFunction(() => document.querySelector('svg.lucide') && !document.querySelector('header [x-cloak]'));
      await page.evaluate(() => document.fonts.ready);
      assert.ok(await page.locator('h1').first().textContent(), route);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `${route} overflow ${width}`);
      assert.equal(await page.locator('.footer-contact-item a').count(), 3, route);
      report.routes.push({ route: route || 'home', width });
    }
  }
  await page.goto(`${base}/404.html`);
  await page.waitForFunction(() => document.querySelector('svg.lucide') && !document.querySelector('header [x-cloak]'));
  assert.ok(await page.locator('h1').textContent());
  // Initial content and icons remain visible while the application is still downloading.
  for (const route of ['', 'contato/', 'estrutura-offshore/']) {
    const slow = await context.newPage();
    let release;
    const gate = new Promise(resolve => { release = resolve; });
    await slow.route(/assets\/(app|contact)\.[\da-f]+\.js/, async request => { await gate; await request.continue(); });
    await slow.goto(`${base}/pt/${route}`, { waitUntil: 'commit' });
    await slow.locator('h1').waitFor({ state: 'visible' });
    await slow.evaluate(() => document.fonts.ready);
    const before = await slow.locator('h1').boundingBox();
    assert.ok(await slow.locator('svg.lucide').count() > 0);
    if (route === 'contato/') {
      assert.equal(await slow.locator('[data-tl-step="1"] .tl-option').count(), 8);
      await slow.locator('[data-tl-step="1"] .tl-option').first().click();
    }
    release();
    await slow.waitForLoadState('load');
    await slow.evaluate(() => document.fonts.ready);
    const after = await slow.locator('h1').boundingBox();
    if (route === 'contato/') assert.equal(await slow.locator('[data-tl-step="1"] .tl-option').first().getAttribute('aria-checked'), 'true');
    for (const key of ['x', 'y', 'width', 'height']) assert.ok(Math.abs(before[key] - after[key]) < 2, `${route} first paint changed: ${key}`);
    report.firstPaint.push({ route: route || 'home', before, after });
    await slow.close();
  }
  for (const route of ['', 'contato/']) {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${base}/pt/${route}`);
    await page.getByRole('button', { name: 'Abrir ou fechar menu' }).click();
    await page.locator('[x-show="mobile"]').waitFor({ state: 'visible' });
    await page.getByRole('button', { name: 'Abrir ou fechar menu' }).click();
    await page.locator('[x-show="mobile"]').waitFor({ state: 'hidden' });
    await page.setViewportSize({ width: 1440, height: 844 });
    await page.getByRole('button', { name: 'Soluções', exact: true }).hover();
    await page.locator('.solutions-panel').waitFor({ state: 'visible' });
    assert.equal(await page.locator('.solutions-panel svg.lucide').count(), 5);
  }
  const early = await context.newPage();
  let releaseEarly;
  const earlyGate = new Promise(resolve => { releaseEarly = resolve; });
  await early.route(/assets\/contact\.[\da-f]+\.js/, async request => { await earlyGate; await request.continue(); });
  await early.goto(`${base}/pt/contato/`, { waitUntil: 'commit' });
  await early.locator('[data-tl-step="1"] .tl-option').nth(2).click();
  await early.locator('[data-tl-step="1"]').getByRole('button', { name: 'OK', exact: true }).click();
  releaseEarly();
  await early.locator('[data-tl-step="2"]').waitFor({ state: 'visible' });
  assert.equal(await early.evaluate(() => window.Alpine.$data(document.querySelector('main')).form.need), 'Estrutura offshore');
  await early.close();
  report.forms.push('Choice and OK clicked before the app finished downloading were preserved.');

  let payload = '', attempts = 0;
  await context.route('https://script.google.com/**', route => {
    attempts++;
    payload = route.request().postData() || '';
    return route.fulfill({ status: 200, contentType: 'application/json', headers: { 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify(attempts === 1 ? { ok: false, error: 'Simulated failure' } : { ok: true, qualified: true }) });
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/pt/contato/?fbclid=performance-test&test_event_code=LOCAL_TEST`);
  const step = number => page.locator(`[data-tl-step="${number}"]`);
  await step(1).getByRole('button', { name: 'OK', exact: true }).click();
  await page.locator('.tl-error').waitFor({ state: 'visible' });
  assert.ok(await page.locator('.tl-error').isVisible());
  await page.keyboard.press('c');
  await page.keyboard.press('Enter');
  await step(2).getByRole('textbox').fill('Teste de Performance');
  await step(2).getByRole('button', { name: 'OK', exact: true }).click();
  await step(3).getByRole('textbox', { name: 'Qual é o seu WhatsApp?' }).fill('11987654321');
  assert.equal(await step(3).getByRole('textbox', { name: 'Qual é o seu WhatsApp?' }).inputValue(), '(11) 98765-4321');
  await step(3).getByRole('button', { name: 'Escolher país e código DDI/DDD' }).click();
  await page.locator('.tl-phone-search-input').fill('Portugal');
  await step(3).locator('.tl-dropdown-item').first().click();
  await step(3).getByRole('textbox', { name: 'Qual é o seu WhatsApp?' }).fill('912345678');
  await step(3).getByRole('button', { name: 'OK', exact: true }).click();
  await step(4).getByRole('textbox').fill('invalid');
  await step(4).getByRole('button', { name: 'OK', exact: true }).click();
  await page.locator('.tl-error').waitFor({ state: 'visible' });
  assert.ok(await page.locator('.tl-error').isVisible());
  await step(4).getByRole('textbox').fill('performance@example.com');
  await step(4).getByRole('button', { name: 'OK', exact: true }).click();
  await step(5).getByRole('textbox').fill('Portugal');
  await page.locator('.tl-country-menu .tl-dropdown-item').first().click();
  await step(5).getByRole('button', { name: 'OK', exact: true }).click();
  await step(6).getByRole('radio').nth(2).click();
  await step(6).getByRole('button', { name: 'OK', exact: true }).click();
  await step(7).getByRole('textbox').fill('Teste local. Não enviar para atendimento.');
  await page.getByRole('button', { name: 'Pergunta anterior' }).click();
  assert.equal(await step(6).getByRole('radio').nth(2).getAttribute('aria-checked'), 'true');
  await step(6).getByRole('button', { name: 'OK', exact: true }).click();
  await page.evaluate(() => { window.Alpine.$data(document.querySelector('main')).startedAt = Date.now() - 10000; });
  await step(7).getByRole('button', { name: 'Enviar solicitação' }).click();
  await page.locator('.tl-error').waitFor({ state: 'visible' });
  assert.equal(attempts, 1);
  assert.equal(await step(7).getByRole('textbox').inputValue(), 'Teste local. Não enviar para atendimento.');
  await step(7).getByRole('button', { name: 'Enviar solicitação' }).click();
  await page.locator('.tl-scenario-a').waitFor({ state: 'visible' });
  assert.equal(attempts, 2);
  for (const value of ['Teste de Performance', '+351 912345678', 'performance@example.com', 'Portugal', 'R$ 3 milhões a R$ 10 milhões', 'LOCAL_TEST', 'performance-test']) assert.ok(payload.includes(value), `Missing submission data: ${value}`);
  assert.ok((await page.locator('.tl-btn-priority-wa').getAttribute('href')).startsWith('https://wa.me/5511953448220?text='));
  assert.ok(await page.evaluate(() => window.fbq.queue.some(event => event[0] === 'track' && event[1] === 'Lead')));
  report.forms.push('Seven steps, keyboard, validation, phone/country search, back, retry, payload, qualification, WhatsApp and Lead event passed with mocked backend.');
  // Backend qualification must remain authoritative.
  await context.unroute('https://script.google.com/**');
  await context.route('https://script.google.com/**', route => route.fulfill({ status: 200, contentType: 'application/json', headers: { 'Access-Control-Allow-Origin': '*' }, body: '{"ok":true,"qualified":false}' }));
  await page.goto(`${base}/pt/contato/`);
  await page.waitForFunction(() => window.Alpine?.$data(document.querySelector('main')).total === 7);
  await page.evaluate(async () => {
    const form = window.Alpine.$data(document.querySelector('main'));
    form.step = 7;
    form.startedAt = Date.now() - 10000;
    Object.assign(form.form, { need: 'Estrutura offshore', name: 'Teste local', whatsapp: '+55 11 98765-4321', email: 'performance@example.com', assets: 'Até R$ 1 milhão' });
    await form.submit();
  });
  await page.locator('.tl-scenario-b').waitFor({ state: 'visible' });
  report.forms.push('Non-priority confirmation passed.');
  assert.ok(analyticsRequests.some(url => url.includes('googletagmanager')));
  assert.ok(analyticsRequests.some(url => url.includes('fbevents')));
  // The failed mock submission deliberately logs one caught error.
  assert.deepEqual(report.errors.filter(error => !error.includes('Simulated failure')), []);
  try {
    const before = JSON.parse(await readFile('reports/performance/before-geometry.json'));
    const after = JSON.parse(await readFile('reports/performance/after-geometry.json'));
    for (const [index, old] of before.entries()) {
      for (const key of ['x', 'y', 'width', 'height']) assert.ok(Math.abs(old.geometry[key] - after[index].geometry[key]) < 2, `Visual regression ${old.route} ${old.width} ${key}`);
    }
    report.visualBaselineCompared = true;
  } catch (error) { if (error.code !== 'ENOENT') throw error; report.visualBaselineCompared = false; }
  console.log(JSON.stringify({ responsiveChecks: report.routes.length, firstPaint: report.firstPaint.length, forms: report.forms, errors: report.errors }));
} finally {
  await writeFile('reports/performance/check.json', JSON.stringify(report, null, 2));
  await browser.close();
}
