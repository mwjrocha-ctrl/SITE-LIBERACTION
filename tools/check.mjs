import { chromium } from 'playwright-core';
import { readFile, writeFile } from 'node:fs/promises';
const browser=await chromium.connectOverCDP('http://localhost:9223');
const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
const page=await context.newPage();
const errors=[],requests=[];
page.on('pageerror',error=>errors.push(error.message));
page.on('response',response=>{if(response.status()>=400)errors.push(response.status()+' '+response.url())});
page.on('request',request=>requests.push(request.url()));
const routes=['','quem-somos/','contato/','diagnostico/','criptoativos/','estrutura-offshore/','saida-fiscal-do-brasil/','planejamento-patrimonial-internacional/','regularizacao-fiscal-criptoativos/','aviso-legal/','termos-de-uso/','politica-de-cookies/','politica-de-privacidade/'];
const results=[];
for(const route of routes){
  await page.goto('http://localhost:8081/pt/'+route,{waitUntil:'networkidle'});
  await page.evaluate(()=>document.fonts.ready);
  results.push({route,heading:await page.locator('h1').first().textContent(),icons:await page.locator('svg.lucide').count(),overflow:await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)});
  if(route===''){
    if(await page.locator('.background-motion-toggle').count())errors.push('Background motion control is still visible');
    const heroAnimations=await page.locator('.hero-v67').evaluate(element=>element.getAnimations({subtree:true}).filter(animation=>animation.playState==='running').length);
    if(heroAnimations<2)errors.push('Hero technology background is not continuously animated');
    await page.screenshot({path:'reports/after-desktop.png'});
    await page.locator('.signature-statement').scrollIntoViewIfNeeded();
    await page.waitForTimeout(900);
    await page.locator('.signature-statement').screenshot({path:'reports/signature-desktop.png'});
    await page.getByRole('button',{name:'Soluções',exact:true}).hover();
    await page.locator('.solutions-panel').waitFor({state:'visible',timeout:2000}).catch(()=>errors.push('Desktop menu did not open'));
    await page.setViewportSize({width:390,height:844});
    await page.locator('header button').filter({has:page.locator('[data-lucide="menu"]')}).click();
    await page.locator('[x-show="mobile"]').waitFor({state:'visible',timeout:2000}).catch(()=>errors.push('Mobile menu did not open'));
    await page.locator('header button').filter({has:page.locator('[data-lucide="x"]')}).click();
    await page.locator('[x-show="mobile"]').waitFor({state:'hidden',timeout:2000});
    await page.screenshot({path:'reports/after-mobile.png'});
    await page.setViewportSize({width:1440,height:1000});
  }
}
const summary={errors,externalRequests:[...new Set(requests.filter(url=>!url.startsWith('http://localhost:8081')))],routes:results};
await writeFile('reports/check.json',JSON.stringify(summary,null,2));
console.log(JSON.stringify(summary,null,2));
await context.close();await browser.close();
if(errors.length)process.exitCode=1;
