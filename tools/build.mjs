import { readFile, writeFile, mkdir, readdir, copyFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { basename } from 'node:path';
import postcss from 'postcss';
import tailwind from 'tailwindcss';
import cssnano from 'cssnano';
import purgecssModule from '@fullhuman/postcss-purgecss';
import { build, transform } from 'esbuild';
import sharp from 'sharp';
import { optimize } from 'svgo';
import { renderComponents } from './render-components.mjs';
import { criticalStyles, inlineFontUrls, renderStaticIcons, scheduleAnalytics, selectStyles } from './performance-assets.mjs';

const utf8 = file => readFile(file,'utf8');
const purgecss=purgecssModule.default||purgecssModule;
const hash = data => createHash('sha256').update(data).digest('hex').slice(0,12);
await mkdir('assets',{recursive:true});
async function asset(name,extension,data){
  const path=`assets/${name}.${hash(data)}.${extension}`;
  await writeFile(path,data); return path;
}
const pages=['index.html','404.html'];
async function findPages(directory){
  for(const entry of await readdir(directory,{withFileTypes:true})){
    const path=`${directory}/${entry.name}`;
    if(entry.isDirectory()) await findPages(path);
    else if(entry.name.endsWith('.html')) pages.push(path);
  }
}
await findPages('pt');
const documents=new Map(await Promise.all(pages.map(async path=>[path,(await utf8(path)).replace(/\s*<style id="critical-css"[^>]*>[\s\S]*?<\/style>/g,'')])));
const analytics=documents.get('pt/contato/index.html').match(/<!-- Google tag[\s\S]*?<!-- End Meta Pixel Code -->/)?.[0];
if(!analytics)throw new Error('Analytics snippet missing');
const source=await utf8('script.js');
const footerContact=`<address class="footer-contact"><ul class="footer-contact-list"><li class="footer-contact-item"><i data-lucide="map-pin" aria-hidden="true"></i><a href="https://www.google.com/maps/search/?api=1&query=Torre+Jurer%C3%AA+A+Rod.+Jos%C3%A9+Carlos+Daux+5500+Florian%C3%B3polis" target="_blank" rel="noopener noreferrer">Torre Jurerê A — Rod. José Carlos Daux, 5500 — 2º andar — Saco Grande, Florianópolis — SC, 88032-005</a></li><li class="footer-contact-item"><svg class="lucide" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg><a href="https://wa.me/5511953448220" target="_blank" rel="noopener noreferrer" aria-label="Conversar com a Liberaction pelo WhatsApp">+55 11 95344-8220</a></li><li class="footer-contact-item"><i data-lucide="instagram" aria-hidden="true"></i><a href="https://www.instagram.com/liberaction_/" target="_blank" rel="noopener noreferrer" aria-label="Instagram da Liberaction">@liberaction_</a></li></ul></address>`;

// Static icons are rendered into HTML; bundle only icons used by dynamic menus.
const iconNames=new Set(['menu','x']);
for(const match of source.matchAll(/icon:'([a-z0-9-]+)'/g)) iconNames.add(match[1]);
async function bundleIcons(names){
  const exports=[...names].map(name=>name.split('-').map(part=>part[0].toUpperCase()+part.slice(1)).join(''));
  return build({stdin:{contents:`import Alpine from 'alpinejs'; import {createIcons,${exports.join(',')}} from 'lucide'; window.Alpine=Alpine; window.lucide={createIcons:()=>createIcons({nameAttr:'data-runtime-icon',icons:{${exports.join(',')}}})};`,resolveDir:process.cwd()},bundle:true,minify:true,write:false,format:'iife',target:'es2020'});
}
const bundle=await bundleIcons(iconNames);
const formStart=source.indexOf('  function getMetaCookie(');
const effectsStart=source.indexOf('  const revealObserver=');
if(formStart<0||effectsStart<formStart)throw new Error('Application source boundaries changed');
const app=await transform(source.slice(0,formStart)+source.slice(effectsStart),{minify:true,target:'es2020'});
const appPath=await asset('app','js',bundle.outputFiles[0].text+'\n'+app.code+'\nwindow.Alpine.start();');
const navigationStart=source.indexOf('  function siteNavigation(');
const siteAppStart=source.indexOf('  function siteApp(');
const legacyFormStart=source.indexOf('  function contactForm(');
const diagnosticStart=source.indexOf('  // Chave p');
if(navigationStart<0||siteAppStart<navigationStart||legacyFormStart<formStart||diagnosticStart<legacyFormStart)throw new Error('Contact source boundaries changed');
const contactSource=source.slice(navigationStart,siteAppStart)+source.slice(formStart,legacyFormStart)+source.slice(diagnosticStart,effectsStart);
const contactIconNames=new Set(['menu','x']);
for(const match of source.slice(navigationStart,siteAppStart).matchAll(/icon:'([a-z0-9-]+)'/g))contactIconNames.add(match[1]);
const contactBundle=await bundleIcons(contactIconNames);
const contactApp=await transform(contactSource,{minify:true,target:'es2020'});
const contactAppPath=await asset('contact','js',contactBundle.outputFiles[0].text+'\n'+contactApp.code+'\nwindow.Alpine.start();');
const contactFirstInput=await transform(await utf8('tools/contact-first-input.js'),{minify:true,target:'es2020'});

let fonts='';
const fontPaths={};
for(const [slug,family,style] of [['inter','Inter','normal'],['plus-jakarta-sans','Plus Jakarta Sans','normal']]){
  const file=`node_modules/@fontsource-variable/${slug}/files/${slug}-latin-wght-${style}.woff2`;
  const path=await asset(slug,'woff2',await readFile(file));
  fontPaths[slug]=path;
  fonts+=`@font-face{font-family:'${family}';font-style:${style};font-weight:100 900;font-display:swap;src:url('./${basename(path)}') format('woff2');}\n`;
  await copyFile(`node_modules/@fontsource-variable/${slug}/LICENSE`,`assets/${slug}-LICENSE.txt`);
}
const theme={extend:{fontFamily:{sans:['Inter','sans-serif'],display:['Plus Jakarta Sans','sans-serif']},colors:{ink:'#0B0B0C',paper:'#FFFFFF',fog:'#F7F7F5',line:'#E8E8E4',muted:'#6A6A66',blue:'#55B3F8'},boxShadow:{soft:'0 22px 70px rgba(12,12,12,.07)',float:'0 35px 100px rgba(12,12,12,.10)'}}};
const usedStyles=await postcss([purgecss({content:[...pages,'script.js'],defaultExtractor:content=>content.match(/[^<>"'`\s]*[^<>"'`\s:]/g)||[],safelist:{standard:['html','body','in','active','open','scroll-ink','scroll-word-group','scroll-char',/^lucide/,/^footer-contact/,/^faq-/,/^tl-/,/^is-/,/^about-public-/]}})]).process(await utf8('style.css'),{from:'style.css'});
const cssInput='@tailwind base;\n@tailwind components;\n'+fonts+usedStyles.css+'\n@tailwind utilities;';
const css=await postcss([tailwind({content:[...pages,'./script.js'],theme}),cssnano({preset:'default'})]).process(cssInput,{from:undefined});
const cssPath=await asset('site','css',css.css);
const contactDocument=renderStaticIcons(documents.get('pt/contato/index.html'));
const contactCss=await selectStyles(css.css, contactDocument.replace(/<template id="[\s\S]*?<\/template>/g,''), true);
const contactCssPath=await asset('contact','css',contactCss);

const images=new Map();
for(const name of ['foto-victoria','victoria-cnn','victoria-blockchain-rio','podcast-settee','podcast-blocktrends','coluna-livecoins']){
  const input=`imagens/${name}.jpg`;
  const metadata=await sharp(input).metadata();
  const variants=[];
  for(const width of [480,800,1200].filter(w=>w<=metadata.width)){
    const data=await sharp(input).rotate().resize({width,withoutEnlargement:true}).webp({quality:78,effort:6}).toBuffer();
    variants.push({width,path:await asset(name+'-'+width,'webp',data)});
  }
  images.set(input,{...metadata,variants});
}
const svgPaths={};
for(const name of ['logo','favicon-light-mode','favicon-dark-mode']){
  const svg=optimize(await utf8(`imagens/${name}.svg`),{multipass:true,plugins:[{name:'preset-default',params:{overrides:{removeViewBox:false}}}]});
  svgPaths[name]=name==='logo' ? await asset(name,'svg',svg.data) : await asset(name,'png',await sharp(Buffer.from(svg.data)).resize({height:64}).png({palette:true}).toBuffer());
}

for(const [path,original] of documents){
  // The redirect document does not need application assets.
  if(/<meta http-equiv="refresh"/i.test(original)) continue;
  const isContact=path==='pt/contato/index.html';
  const pageCssPath=isContact?contactCssPath:cssPath;
  const pageAppPath=isContact?contactAppPath:appPath;
  const rendered=renderStaticIcons(renderComponents(original));
  const critical=isContact?inlineFontUrls(contactCss):await criticalStyles(css.css,rendered);
  const stylesheet=isContact?'':`\n  <link rel="stylesheet" href="${pageCssPath}" media="print" onload="this.media='all'" />\n  <noscript><link rel="stylesheet" href="${pageCssPath}" /></noscript>`;
  const headInject=`<style id="critical-css" data-stylesheet="${pageCssPath}">${critical}</style>${stylesheet}\n  <link rel="preload" href="${fontPaths['plus-jakarta-sans']}" as="font" type="font/woff2" crossorigin />\n  <link rel="preload" href="${fontPaths.inter}" as="font" type="font/woff2" crossorigin />${isContact?`\n  <script id="contact-first-input">${contactFirstInput.code}</script>`:''}\n  <script defer src="${pageAppPath}"></script>`;
  let html=original
    .replace(/\s*<style id="critical-css"[^>]*>[\s\S]*?<\/style>/g,'')
    .replace(/\s*<script id="contact-first-input">[\s\S]*?<\/script>/g,'')
    .replace(/\s*<link[^>]+(?:fonts\.googleapis\.com|fonts\.gstatic\.com)[^>]*>/g,'')
    .replace(/\s*<link[^>]+rel="preload"[^>]*>/g,'')
    .replace(/\s*<script[^>]+src="https:\/\/(?:cdn\.tailwindcss\.com|cdn\.jsdelivr\.net|unpkg\.com)[^"]*"[^>]*><\/script>/g,'')
    .replace(/\s*<script>\s*tailwind\.config\s*=[\s\S]*?<\/script>/g,'')
    .replace(/\s*<script[^>]+src="(?:script\.js|assets\/(?:app|contact)\.[^"]+\.js)"[^>]*><\/script>/g,'')
    .replace(/\s*<link rel="stylesheet"[^>]*>(?:\s*<noscript><link rel="stylesheet"[^>]*><\/noscript>)?/g,'')
    .replace('</head>', `  ${headInject}\n</head>`)
    .replace(/ x-init="init\(\)"/g,'');
  if(isContact)html=html.replace('x-data="siteApp()"','x-data="siteNavigation()"');
  if(!html.includes('class="footer-contact"')){
    html=html.replace(/(<p class="mt-4 max-w-sm text-sm leading-7 text-white\/43">[^<]*<\/p>)/,`$1${footerContact}`);
  }
  for(const [name,svg] of Object.entries(svgPaths)){
    const pattern=new RegExp(`(?:imagens/${name}\\.svg|assets/${name}\\.[a-f0-9]+\\.(?:svg|png))`,'g');
    html=html.replace(pattern,svg);
  }
  html=html.replace(/(<link rel="icon" )type="image\/svg\+xml"/g,'$1type="image/png"');
  html=html.replace(/<button @click="mobile=!mobile"(?! aria-label)/g,'<button @click="mobile=!mobile" aria-label="Abrir ou fechar menu" :aria-expanded="mobile"');
  html=html.replace(/<img\b[^>]*>/g,tag=>{
    if(/class="(?:brand-logo|footer-logo)"/.test(tag)){
      return tag.replace(/\s+(width|height)="[^"]*"/g,'').replace(/\s*\/>$/,' width="2831" height="424" />');
    }
    for(const [input,image] of images){
      const name=basename(input,'.jpg');
      if(tag.includes(input)||tag.includes(`assets/${name}-`)){
        const variants=image.variants, fallback=variants.find(v=>v.width===800)||variants.at(-1);
        tag=tag.replace(/\s+(src|srcset|sizes|width|height)="[^"]*"/g,'');
        return tag.replace(/\s*\/>$/,` src="${fallback.path}" srcset="${variants.map(v=>v.path+' '+v.width+'w').join(', ')}" sizes="(max-width: 768px) calc(100vw - 40px), (max-width: 1100px) 50vw, 600px" width="${image.width}" height="${image.height}" />`);
      }
    }
    return tag;
  });
  html=renderComponents(html);
  html=scheduleAnalytics(renderStaticIcons(html.replace(/<!-- Google tag[\s\S]*?<!-- End Meta Pixel Code -->/,analytics)));
  if(path.startsWith('pt/') && !html.includes('rel="describedby"')){
    html=html.replace('</head>','  <link rel="describedby" type="text/plain" href="https://liberaction.io/llms.txt" />\n</head>');
  }
  if(!html.includes('<noscript><style>.reveal')){
    html=html.replace('</head>','  <noscript><style>.reveal{opacity:1!important;transform:none!important}</style></noscript>\n</head>');
  }
  await writeFile(path,html);
}
const manifest={css:cssPath,js:appPath,contact:{css:contactCssPath,js:contactAppPath},fonts:fontPaths,images:Object.fromEntries(images),icons:svgPaths};
await writeFile('assets/manifest.json',JSON.stringify(manifest,null,2)+'\n');
console.log(JSON.stringify({cssBytes:Buffer.byteLength(css.css),jsBytes:Buffer.byteLength(bundle.outputFiles[0].text+app.code),icons:iconNames.size,pages:documents.size-1},null,2));
