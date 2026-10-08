import * as icons from 'lucide';
import postcss from 'postcss';
import purgecssModule from '@fullhuman/postcss-purgecss';

const purgecss = purgecssModule.default || purgecssModule;
const extractor = content => content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || [];
const escapeAttribute = value => String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const serialize = ([tag, attrs, children = []]) => `<${tag}${Object.entries(attrs).map(([key, value]) => ` ${key}="${escapeAttribute(value)}"`).join('')}>${children.map(serialize).join('')}</${tag}>`;

// Static icons are available on first paint. Only Alpine's menus need runtime icons.
export function renderStaticIcons(html) {
  return html.replace(/<i\b([^>]*)(?<!:)data-lucide="([a-z0-9-]+)"([^>]*)>\s*<\/i>/g, (tag, before, name, after) => {
    const key = name.split('-').map(part => part[0].toUpperCase() + part.slice(1)).join('');
    const icon = icons[key];
    if (!icon) throw new Error(`Unknown icon: ${name}`);
    const attrs = Object.fromEntries([...`${before}${after}`.matchAll(/([\w:-]+)="([^"]*)"/g)].map(match => [match[1], match[2]]));
    return serialize(['svg', { ...icon[1], ...attrs, 'data-lucide': name, class: `lucide lucide-${name} ${attrs.class || ''}`.trim() }, icon[2]]);
  }).replace(/:data-lucide=/g, ':data-runtime-icon=');
}

export async function selectStyles(css, html, form = false) {
  return (await postcss([purgecss({
    content: [{ raw: html, extension: 'html' }],
    defaultExtractor: extractor,
    safelist: { standard: ['html', 'body', 'in', 'active', 'open', /^lucide/, ...(form ? [/^tl-/, /^is-/] : [])] }
  })]).process(css, { from: undefined })).css;
}

export async function criticalStyles(css, html) {
  const header = html.match(/<header\b[\s\S]*?<\/header>/)?.[0] || '';
  const firstSection = html.match(/<main\b[^>]*>[\s\S]*?<section\b[\s\S]*?<\/section>/)?.[0] || '';
  const backgrounds = html.match(/<body\b[^>]*>([\s\S]*?)<header\b/)?.[1] || '';
  // Use the final cascade, including responsive rules, instead of a second hand-written theme.
  const selected = await selectStyles(css, `<html><body>${backgrounds}${header}${firstSection}</main></body></html>`);
  // Font URLs are relative to the document's base, whereas the external CSS lives in assets/.
  return inlineFontUrls(selected);
}

export function inlineFontUrls(css) {
  return css.replace(/url\((['"]?)(?:\.\/)?([^/'")\s]+\.woff2)\1\)/g, 'url($1assets/$2$1)');
}

export function scheduleAnalytics(html) {
  // Layout-driven scroll events must not compete with the initial render.
  // Genuine pointer, keyboard, touch and wheel input still flush the existing event queues.
  html = html.replace(/\s*if\(document.readyState!=='complete'\)\{window.addEventListener\('load', _loadAnalytics, \{once:true\}\);return;\}/g, '');
  return html.replace("['scroll','touchstart','pointerdown','click','keydown']", "['wheel','touchstart','pointerdown','click','keydown']")
    .replace('if(window._analyticsLoaded) return;', "if(window._analyticsLoaded) return;\n      if(document.readyState!=='complete'){window.addEventListener('load', _loadAnalytics, {once:true});return;}")
    .replace('window.addEventListener(ev, _loadAnalytics, { once: true, passive: true });',
      "window.addEventListener(ev, function(){setTimeout(_loadAnalytics, 0);}, { once: true, passive: true });");
}
