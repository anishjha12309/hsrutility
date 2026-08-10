/**
 * Rasterises the brand mark into every PNG slot the site references.
 *
 *   public/icon.svg  ->  icon-192.png, icon-512.png, apple-touch-icon.png
 *   (inline OG art)  ->  og.png
 *
 * Run with `npm run icons`. Sharp ships as an Astro dependency, so there is
 * nothing extra to install.
 *
 * The mark geometry here mirrors src/components/Logo.astro and public/*.svg.
 * When the real logo lands, replace public/icon.svg + public/favicon.svg, update
 * MARK below, and re-run — no other file needs to change.
 */

import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pub = join(root, 'public');

const BLUE = '#0B4FFF';
const WHITE = '#FFFFFF';
const MUTED = '#C9D4FF';

/** The Aperture mark on a 32-unit grid — mirrors src/components/Logo.astro.
    Semi-opaque whites in the luminance mask composite source-over, so the
    overlaps come out brighter than the discs — same layering as the SVGs. */
const MARK = (id) => `
  <mask id="${id}">
    <rect width="32" height="32" fill="#000"/>
    <circle cx="16" cy="10.5" r="7.5" fill="#fff" opacity="0.62"/>
    <circle cx="11" cy="19" r="7.5" fill="#fff" opacity="0.62"/>
    <circle cx="21" cy="19" r="7.5" fill="#fff" opacity="0.62"/>
  </mask>`;

/**
 * Open Graph card, 1200x630.
 *
 * Set in Arial rather than Space Grotesk: this is rasterised by sharp's SVG
 * renderer, which only sees fonts installed on the machine. Arial is the declared
 * fallback for the display face anyway, so the card stays on-brand. Swap for the
 * real face by embedding it as a base64 @font-face if this ever needs to be
 * pixel-exact.
 */
const OG_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${WHITE}" stop-opacity="0.16"/>
      <stop offset="100%" stop-color="${WHITE}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="hairline" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${WHITE}" stop-opacity="0.7"/>
      <stop offset="100%" stop-color="${WHITE}" stop-opacity="0"/>
    </linearGradient>
    ${MARK('ogmark')}
  </defs>

  <rect width="1200" height="630" fill="${BLUE}"/>
  <ellipse cx="980" cy="120" rx="470" ry="400" fill="url(#glow)"/>

  <!-- Brand row -->
  <g transform="translate(84, 74)">
    <svg x="0" y="0" width="56" height="56" viewBox="0 0 32 32">
      <rect width="32" height="32" fill="${WHITE}" mask="url(#ogmark)"/>
    </svg>
    <text x="74" y="40" font-family="Arial, Helvetica, sans-serif" font-size="32" font-weight="bold" fill="${WHITE}">HSR Utility</text>
  </g>

  <rect x="84" y="176" width="420" height="1" fill="url(#hairline)"/>

  <!-- Headline — Georgia is the declared fallback for Instrument Serif, so the
       card carries the site's serif display voice without embedding the face. -->
  <text x="84" y="300" font-family="Georgia, 'Times New Roman', serif" font-size="74" fill="${WHITE}">Screens worth <tspan font-style="italic">looking</tspan> at.</text>
  <text x="84" y="386" font-family="Georgia, 'Times New Roman', serif" font-size="74" fill="${MUTED}">Made for someone specific.</text>

  <!-- Sub -->
  <text x="84" y="462" font-family="Helvetica, Arial, sans-serif" font-size="26" fill="${MUTED}">Wallpapers, live wallpapers and ringtones for specific cultural audiences.</text>

  <!-- Footer row -->
  <text x="84" y="556" font-family="Helvetica, Arial, sans-serif" font-size="24" font-weight="bold" fill="${WHITE}">Pakiza</text>
  <text x="176" y="556" font-family="Helvetica, Arial, sans-serif" font-size="24" fill="${MUTED}">·</text>
  <text x="200" y="556" font-family="Helvetica, Arial, sans-serif" font-size="24" font-weight="bold" fill="${WHITE}">Arul</text>
  <text x="1116" y="556" text-anchor="end" font-family="Helvetica, Arial, sans-serif" font-size="24" fill="${MUTED}">hsrutility.com</text>
</svg>`;

const iconSvg = await readFile(join(pub, 'icon.svg'));

const targets = [
  { name: 'icon-192.png', size: 192 },
  { name: 'icon-512.png', size: 512 },
  { name: 'apple-touch-icon.png', size: 180 },
];

for (const { name, size } of targets) {
  await sharp(iconSvg, { density: 384 })
    .resize(size, size, { fit: 'contain' })
    .png({ compressionLevel: 9, palette: true })
    .toFile(join(pub, name));
  console.log(`  ✓ ${name}  ${size}x${size}`);
}

await sharp(Buffer.from(OG_SVG), { density: 96 })
  .resize(1200, 630)
  .png({ compressionLevel: 9, quality: 90 })
  .toFile(join(pub, 'og.png'));
console.log('  ✓ og.png  1200x630');

// Keep the OG source alongside the output so it can be tweaked without reading JS.
await writeFile(join(pub, 'og.svg'), OG_SVG);
console.log('  ✓ og.svg  (source)');
