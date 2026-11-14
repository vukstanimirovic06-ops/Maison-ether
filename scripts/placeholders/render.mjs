/**
 * Rasterises the placeholder scenes to responsive WebP files in assets/img.
 * Usage: node scripts/placeholders/render.mjs [filter]
 * Requires Playwright (globally available) and Python 3 with Pillow.
 */
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');
import { mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import * as S from './scenes.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const out = path.join(root, 'assets/img');
const tmp = path.join(root, '.render-tmp');
mkdirSync(out, { recursive: true });
mkdirSync(tmp, { recursive: true });

const F = (n) => `file://${root}/assets/fonts/${n}.woff2`;
const css = `
@font-face{font-family:'Cormorant Garamond';font-weight:500;src:url(${F('cormorant-garamond-latin-500-normal')})}
@font-face{font-family:'Cormorant Garamond';font-weight:400;src:url(${F('cormorant-garamond-latin-400-normal')})}
@font-face{font-family:'Manrope';font-weight:400;src:url(${F('manrope-latin-400-normal')})}
@font-face{font-family:'Manrope';font-weight:500;src:url(${F('manrope-latin-500-normal')})}
@font-face{font-family:'Manrope';font-weight:600;src:url(${F('manrope-latin-600-normal')})}
html,body{margin:0;background:#000}svg{display:block}`;

// name -> [svg, responsive widths]
const jobs = {};
for (const k of ['sillage', 'lumiere', 'nocturne']) {
  jobs[`hero-${k}`] = [S.heroWide(k), [960, 1600, 2400]];
  jobs[`hero-${k}-m`] = [S.heroTall(k), [600, 900, 1200]];
  jobs[`product-${k}`] = [S.product(k), [640, 1000, 1600]];
  jobs[`detail-${k}-cap`] = [S.detailCap(k), [640, 1000, 1600]];
  jobs[`detail-${k}-light`] = [S.detailLight(k), [640, 1000, 1600]];
}
jobs['philosophy-light'] = [S.stoneLight(1600, 2000, 'sillage'), [640, 1000, 1600]];
jobs['philosophy-fabric'] = [S.fabric(1600, 2000, 'lumiere'), [640, 1000, 1600]];
jobs['craft-vessels'] = [S.vessels(), [640, 1000, 1600]];
jobs['craft-amber'] = [S.amberMacro(), [640, 1000, 1600]];
jobs['craft-materials'] = [S.materials(), [640, 1000, 1600]];
jobs['discovery-set'] = [S.discoveryBox(2000, 1500), [800, 1400, 2000]];
jobs['discovery-detail'] = [S.discoveryBox(2000, 1500, true), [800, 1400, 2000]];
jobs['journal-scent'] = [S.journalScent(), [640, 1000, 1600]];
jobs['journal-light'] = [S.stoneLight(1600, 2000, 'lumiere'), [640, 1000, 1600]];
jobs['journal-ritual'] = [S.fabric(1600, 2000, 'sillage'), [640, 1000, 1600]];
jobs['og'] = [S.ogImage(), [1200]];

const filter = process.argv[2];
const browser = await chromium.launch();
const page = await browser.newPage();
for (const [name, [svg, widths]] of Object.entries(jobs)) {
  if (filter && !name.includes(filter)) continue;
  const [, W, H] = svg.match(/width="(\d+)" height="(\d+)"/).map(Number);
  await page.setViewportSize({ width: W, height: H });
  const html = path.join(tmp, `${name}.html`);
  writeFileSync(html, `<!doctype html><meta charset="utf-8"><style>${css}</style>${svg}`);
  await page.goto(`file://${html}`);
  await page.evaluate(() => document.fonts.ready);
  const png = path.join(tmp, `${name}.png`);
  await page.screenshot({ path: png, type: 'png' });
  execFileSync('python3', ['-I', '-c', `
import sys
from PIL import Image
src, out, name = sys.argv[1], sys.argv[2], sys.argv[3]
im = Image.open(src).convert('RGB')
for w in map(int, sys.argv[4:]):
    h = round(im.height * w / im.width)
    r = im.resize((w, h), Image.LANCZOS)
    if name == 'og':
        r.save(f"{out}/{name}.jpg", quality=86, optimize=True, progressive=True)
    else:
        r.save(f"{out}/{name}-{w}.webp", quality=80, method=6)
`, png, out, name, ...widths.map(String)]);
  console.log('rendered', name);
}
await browser.close();
rmSync(tmp, { recursive: true, force: true });
