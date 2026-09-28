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
const documents=new Map(await Promise.all(pages.map(async path=>[path,await utf8(path)])));
const source=await utf8('script.js');
const footerContact=`<address class="footer-contact"><ul class="footer-contact-list"><li class="footer-contact-item"><i data-lucide="map-pin" aria-hidden="true"></i><a href="https://www.google.com/maps/search/?api=1&query=Torre+Jurer%C3%AA+A+Rod.+Jos%C3%A9+Carlos+Daux+5500+Florian%C3%B3polis" target="_blank" rel="noopener noreferrer">Torre Jurerê A — Rod. José Carlos Daux, 5500 — 2º andar — Saco Grande, Florianópolis — SC, 88032-005</a></li><li class="footer-contact-item"><i data-lucide="message-circle" aria-hidden="true"></i><a href="https://wa.me/5511953448220" target="_blank" rel="noopener noreferrer" aria-label="Conversar com a Liberaction pelo WhatsApp">+55 11 95344-8220</a></li><li class="footer-contact-item"><i data-lucide="instagram" aria-hidden="true"></i><a href="https://www.instagram.com/liberaction_/" target="_blank" rel="noopener noreferrer" aria-label="Instagram da Liberaction">@liberaction_</a></li></ul></address>`;

// Bundle only the icons used in HTML and in Alpine's dynamic menus.
const iconNames=new Set(['menu','x','map-pin','message-circle','instagram']);
for(const text of [...documents.values(),source]){
  for(const match of text.matchAll(/(?<!:)data-lucide="([a-z0-9-]+)"|icon:'([a-z0-9-]+)'/g)) iconNames.add(match[1]||match[2]);
}
const exports=[...iconNames].map(name=>name.split('-').map(part=>part[0].toUpperCase()+part.slice(1)).join(''));
const bundle=await build({stdin:{contents:`import Alpine from 'alpinejs'; import {createIcons,${exports.join(',')}} from 'lucide'; window.Alpine=Alpine; window.lucide={createIcons:()=>createIcons({icons:{${exports.join(',')}}})};`,resolveDir:process.cwd()},bundle:true,minify:true,write:false,format:'iife',target:'es2020'});
const app=await transform(source,{minify:true,target:'es2020'});
const appPath=await asset('app','js',bundle.outputFiles[0].text+'\n'+app.code+'\nwindow.Alpine.start();');

let fonts='';
const fontPaths={};
for(const [slug,family,style] of [['inter','Inter','normal'],['plus-jakarta-sans','Plus Jakarta Sans','normal'],['cormorant-garamond','Cormorant Garamond','italic']]){
  const file=`node_modules/@fontsource-variable/${slug}/files/${slug}-latin-wght-${style}.woff2`;
  const path=await asset(slug,'woff2',await readFile(file));
  fontPaths[slug]=path;
  fonts+=`@font-face{font-family:'${family}';font-style:${style};font-weight:100 900;font-display:swap;src:url('./${basename(path)}') format('woff2');}\n`;
  await copyFile(`node_modules/@fontsource-variable/${slug}/LICENSE`,`assets/${slug}-LICENSE.txt`);
}
const theme={extend:{fontFamily:{sans:['Inter','sans-serif'],display:['Plus Jakarta Sans','sans-serif']},colors:{ink:'#0B0B0C',paper:'#FFFFFF',fog:'#F7F7F5',line:'#E8E8E4',muted:'#6A6A66',blue:'#55B3F8'},boxShadow:{soft:'0 22px 70px rgba(12,12,12,.07)',float:'0 35px 100px rgba(12,12,12,.10)'}}};
const usedStyles=await postcss([purgecss({content:[...pages,'script.js'],defaultExtractor:content=>content.match(/[^<>"'`\s]*[^<>"'`\s:]/g)||[],safelist:{standard:['html','body','in','active','open','scroll-ink','scroll-word-group','scroll-char',/^lucide/,/^footer-contact/]}})]).process(await utf8('style.css'),{from:'style.css'});
const cssInput='@tailwind base;\n@tailwind components;\n'+fonts+usedStyles.css+'\n@tailwind utilities;';
const css=await postcss([tailwind({content:[...pages,'./script.js'],theme}),cssnano({preset:'default'})]).process(cssInput,{from:undefined});
const cssPath=await asset('site','css',css.css);

const images=new Map();
for(const name of ['foto-victoria','victoria-cnn','victoria-blockchain-rio']){
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
  if(path==='index.html') continue;
  let html=original
    .replace(/\s*<link[^>]+(?:fonts\.googleapis\.com|fonts\.gstatic\.com)[^>]*>/g,'')
    .replace(/\s*<link[^>]+rel="preload"[^>]*>/g,'')
    .replace(/\s*<script[^>]+src="https:\/\/(?:cdn\.tailwindcss\.com|cdn\.jsdelivr\.net|unpkg\.com)[^"]*"[^>]*><\/script>/g,'')
    .replace(/\s*<script>\s*tailwind\.config\s*=[\s\S]*?<\/script>/g,'')
    .replace(/\s*<script[^>]+src="(?:script\.js|assets\/app\.[^"]+\.js)"[^>]*><\/script>/g,'')
    .replace(/\s*<link[^>]+rel="preload"[^>]*>/g,'')
    .replace(/<link rel="stylesheet" href="(?:style\.css|assets\/site\.[^"]+\.css)"\s*\/>/g,`<link rel="preload" href="${fontPaths['plus-jakarta-sans']}" as="font" type="font/woff2" crossorigin />\n  <link rel="preload" href="${fontPaths.inter}" as="font" type="font/woff2" crossorigin />\n  <link rel="stylesheet" href="${cssPath}" />\n  <script defer src="${appPath}"></script>`)
    .replace(/ x-init="init\(\)"/g,'');
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
  await writeFile(path,html);
}
const manifest={css:cssPath,js:appPath,fonts:fontPaths,images:Object.fromEntries(images),icons:svgPaths};
await writeFile('assets/manifest.json',JSON.stringify(manifest,null,2)+'\n');
console.log(JSON.stringify({cssBytes:Buffer.byteLength(css.css),jsBytes:Buffer.byteLength(bundle.outputFiles[0].text+app.code),icons:iconNames.size,pages:documents.size-1},null,2));
