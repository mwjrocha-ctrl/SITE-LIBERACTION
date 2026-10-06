import sharp from 'sharp';
import { unlink } from 'node:fs/promises';

// Prepare photo of Victoria (crop face / bust)
const victoriaBust = await sharp('imagens/foto-victoria.jpg')
  .extract({ left: 300, top: 200, width: 1800, height: 1800 })
  .resize(480, 480)
  .composite([{
    input: Buffer.from('<svg><circle cx="240" cy="240" r="236" fill="#fff" /></svg>'),
    blend: 'dest-in'
  }])
  .png()
  .toBuffer();

const victoriaBorder = Buffer.from(`
<svg width="500" height="500">
  <circle cx="250" cy="250" r="244" fill="none" stroke="rgba(85,179,248,0.4)" stroke-width="4" />
  <circle cx="250" cy="250" r="248" fill="none" stroke="rgba(126,190,238,0.15)" stroke-width="2" />
</svg>
`);

const victoriaFramed = await sharp({
  create: { width: 500, height: 500, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } }
})
  .composite([
    { input: victoriaBorder, top: 0, left: 0 },
    { input: victoriaBust, top: 10, left: 10 }
  ])
  .png()
  .toBuffer();

// Resize white logo
const logo = await sharp('imagens/livecoins-logo-white.png').resize({ width: 340 }).png().toBuffer();

// Background
const bg = await sharp('imagens/livecoins-cover.jpg')
  .resize(1280, 720, { fit: 'cover' })
  .modulate({ brightness: 0.35, saturation: 0.5 })
  .toBuffer();

const svgOverlay = Buffer.from(`
<svg width="1280" height="720" viewBox="0 0 1280 720" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="blueGlow" cx="20%" cy="30%" r="60%">
      <stop offset="0%" stop-color="#55b3f8" stop-opacity="0.22"/>
      <stop offset="100%" stop-color="#05080c" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="overlay" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#070b10" stop-opacity="0.95"/>
      <stop offset="55%" stop-color="#070b10" stop-opacity="0.85"/>
      <stop offset="100%" stop-color="#070b10" stop-opacity="0.65"/>
    </linearGradient>
  </defs>
  <rect width="1280" height="720" fill="url(#overlay)" />
  <rect width="1280" height="720" fill="url(#blueGlow)" />
  <rect x="40" y="40" width="1200" height="640" rx="20" fill="none" stroke="rgba(126,190,238,0.18)" stroke-width="1.5"/>

  <!-- Badge -->
  <g transform="translate(80, 85)">
    <rect width="210" height="34" rx="17" fill="rgba(85,179,248,0.1)" stroke="rgba(85,179,248,0.35)" stroke-width="1"/>
    <text x="105" y="22" fill="#55B3F8" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="700" letter-spacing="2" text-anchor="middle">COLUNISTA OFICIAL</text>
  </g>

  <!-- Titles -->
  <text x="80" y="320" fill="#FFFFFF" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="52" font-weight="800" letter-spacing="-1.5">Artigos &amp; Análises</text>
  <text x="80" y="380" fill="#55B3F8" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="52" font-weight="800" letter-spacing="-1.5">no Livecoins</text>
  
  <text x="80" y="445" fill="#E2E8F0" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="22" font-weight="600">Tributação de Criptoativos &amp; Proteção Patrimonial</text>
  <text x="80" y="485" fill="#8896A6" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="400">Análises sobre regularização fiscal e segurança jurídica para investidores.</text>

  <!-- Victoria name footer in banner -->
  <g transform="translate(80, 560)">
    <line x1="0" y1="0" x2="520" y2="0" stroke="rgba(126,190,238,0.18)" stroke-width="1"/>
    <text x="0" y="36" fill="#FFFFFF" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="18" font-weight="700">Victória Galasso</text>
    <text x="0" y="58" fill="#6B7988" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="600" letter-spacing="1">FUNDADORA DA LIBERACTION · COLUNISTA LIVECOINS</text>
  </g>
</svg>
`);

await sharp(bg)
  .composite([
    { input: svgOverlay, top: 0, left: 0 },
    { input: logo, top: 150, left: 80 },
    { input: victoriaFramed, top: 110, left: 710 }
  ])
  .jpeg({ quality: 92 })
  .toFile('imagens/coluna-livecoins.jpg');

console.log('Successfully generated imagens/coluna-livecoins.jpg');

// Clean temporary files
try { await unlink('imagens/livecoins-cover.jpg'); } catch {}
try { await unlink('imagens/livecoins-logo-raw.png'); } catch {}
try { await unlink('imagens/livecoins-logo-white.png'); } catch {}
