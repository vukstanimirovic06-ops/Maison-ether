/**
 * MAISON ÉTHER — placeholder scene library.
 *
 * These are art-directed *placeholder* renders, drawn as SVG and rasterised
 * by render.mjs. They exist so the site can be reviewed with a coherent visual
 * system before the real campaign photography is produced. Every output file
 * is listed in ASSETS.md and must be replaced with photography before launch.
 *
 * One bottle architecture is shared by every scene: a thick rectangular glass
 * flacon, a heavy clear base, a short stone cap and a small ivory label.
 */

const FONT_SERIF = "'Cormorant Garamond', serif";
const FONT_SANS = "'Manrope', sans-serif";

let uid = 0;
const id = (p) => `${p}${++uid}`;

/* ------------------------------------------------------------------ */
/* Palettes per fragrance                                              */
/* ------------------------------------------------------------------ */
export const LOOKS = {
  sillage: {
    name: 'SILLAGE',
    wallA: '#d9c6b0', wallB: '#b79c82', wallC: '#8a6f5b',
    stoneA: '#e3d4c1', stoneB: '#c9b6a2', stoneShade: '#9c8571',
    sun: '#ffd9a8', sunStrength: 0.62,
    liquidA: '#e3a35c', liquidB: '#b86a2c', liquidOpacity: 0.86,
    glass: '#f4e9dc', cap: ['#e9dcc9', '#bba68f', '#8f7965'],
    caustic: '#f2a24f', shadow: '#5b4434', dark: false,
  },
  lumiere: {
    name: 'LUMIÈRE',
    wallA: '#efe9df', wallB: '#ddd3c5', wallC: '#beb1a1',
    stoneA: '#f3eee6', stoneB: '#ddd4c7', stoneShade: '#b5a897',
    sun: '#fff6e8', sunStrength: 0.45,
    liquidA: '#f6edd6', liquidB: '#e3d2ad', liquidOpacity: 0.55,
    glass: '#ffffff', cap: ['#f6f2ea', '#d9d0c3', '#ab9f90'],
    caustic: '#fff1cf', shadow: '#8c7e6e', dark: false,
  },
  nocturne: {
    name: 'NOCTURNE',
    wallA: '#3a2d27', wallB: '#2a201c', wallC: '#141110',
    stoneA: '#5a4840', stoneB: '#3c302a', stoneShade: '#1a1513',
    sun: '#e7b98a', sunStrength: 0.5,
    liquidA: '#5c3a26', liquidB: '#23150f', liquidOpacity: 0.92,
    glass: '#8f8781', cap: ['#5b4a41', '#3a2f29', '#1b1512'],
    caustic: '#b8743f', shadow: '#070605', dark: true,
  },
};

/* ------------------------------------------------------------------ */
/* Shared filters                                                      */
/* ------------------------------------------------------------------ */
export function defs() {
  return `
  <filter id="grain" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" result="n"/>
    <feColorMatrix in="n" type="saturate" values="0"/>
    <feComponentTransfer><feFuncA type="linear" slope="0.55"/></feComponentTransfer>
  </filter>
  <filter id="stoneTex" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency="0.003 0.022" numOctaves="5" seed="7" result="streak"/>
    <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="2" seed="3" result="pore"/>
    <feBlend in="streak" in2="pore" mode="multiply" result="mix"/>
    <feColorMatrix in="mix" type="matrix" values="0 0 0 0 0.36  0 0 0 0 0.27  0 0 0 0 0.2  -1.1 0 0 0 0.85"/>
  </filter>
  <filter id="soft4"><feGaussianBlur stdDeviation="4"/></filter>
  <filter id="soft12"><feGaussianBlur stdDeviation="12"/></filter>
  <filter id="soft30"><feGaussianBlur stdDeviation="30"/></filter>
  <filter id="soft70"><feGaussianBlur stdDeviation="70"/></filter>
  <filter id="soft1"><feGaussianBlur stdDeviation="1.2"/></filter>
  <filter id="fabric" x="-10%" y="-10%" width="120%" height="120%">
    <feTurbulence type="fractalNoise" baseFrequency="0.0012 0.0016" numOctaves="1" seed="11" result="w"/>
    <feDisplacementMap in="SourceGraphic" in2="w" scale="220" xChannelSelector="R" yChannelSelector="G"/>
    <feGaussianBlur stdDeviation="14"/>
  </filter>
  <filter id="smoke" x="-20%" y="-20%" width="140%" height="140%">
    <feTurbulence type="fractalNoise" baseFrequency="0.0018 0.0025" numOctaves="1" seed="21" result="w"/>
    <feDisplacementMap in="SourceGraphic" in2="w" scale="420" xChannelSelector="R" yChannelSelector="B"/>
    <feGaussianBlur stdDeviation="22"/>
  </filter>`;
}

/* ------------------------------------------------------------------ */
/* Environment                                                         */
/* ------------------------------------------------------------------ */
function wall(W, H, L, { sunX = 0.55, angle = -18 } = {}) {
  const g = id('wall');
  const v = id('vig');
  // Sunlight patch with window-mullion shadows, thrown across the wall.
  const sx = W * sunX;
  const patchW = W * 0.55;
  const bars = [0.22, 0.5, 0.78]
    .map((p) => `<rect x="${sx + patchW * p}" y="${-H * 0.2}" width="${W * 0.018}" height="${H * 1.5}" fill="${L.wallC}" opacity="0.55"/>`)
    .join('');
  return `
  <defs>
    <linearGradient id="${g}" x1="0" y1="0" x2="1" y2="0.4">
      <stop offset="0" stop-color="${L.wallC}"/>
      <stop offset="0.45" stop-color="${L.wallB}"/>
      <stop offset="1" stop-color="${L.wallA}"/>
    </linearGradient>
    <radialGradient id="${v}" cx="0.6" cy="0.45" r="0.85">
      <stop offset="0.5" stop-color="#000" stop-opacity="0"/>
      <stop offset="1" stop-color="#000" stop-opacity="${L.dark ? 0.6 : 0.28}"/>
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#${g})"/>
  <rect width="${W}" height="${H}" fill="#fff" filter="url(#stoneTex)" opacity="${L.dark ? 0.05 : 0.09}"/>
  <g filter="url(#soft30)" transform="rotate(${angle} ${sx} ${H / 2})">
    <rect x="${sx}" y="${-H * 0.2}" width="${patchW}" height="${H * 1.5}" fill="${L.sun}" opacity="${L.sunStrength}"/>
    ${bars}
  </g>
  <rect width="${W}" height="${H}" fill="url(#${v})"/>`;
}

function plinth(W, H, L, { top, x0 = -50, x1 = W + 50, depth = 60 }) {
  const gf = id('pf');
  const gt = id('pt');
  return `
  <defs>
    <linearGradient id="${gt}" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${L.stoneShade}"/>
      <stop offset="0.6" stop-color="${L.stoneB}"/>
      <stop offset="1" stop-color="${L.stoneA}"/>
    </linearGradient>
    <linearGradient id="${gf}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${L.stoneB}"/>
      <stop offset="1" stop-color="${L.stoneShade}"/>
    </linearGradient>
  </defs>
  <polygon points="${x0 + depth},${top - depth} ${x1 - depth * 0.2},${top - depth} ${x1},${top} ${x0},${top}" fill="url(#${gt})"/>
  <rect x="${x0}" y="${top}" width="${x1 - x0}" height="${H - top + 10}" fill="url(#${gf})"/>
  <rect x="${x0}" y="${top}" width="${x1 - x0}" height="3" fill="#fff" opacity="${L.dark ? 0.08 : 0.35}"/>
  <rect x="${x0}" y="${top - depth}" width="${x1 - x0}" height="${H}" fill="#fff" filter="url(#stoneTex)" opacity="${L.dark ? 0.08 : 0.16}"/>`;
}

function finish(W, H, L) {
  return `<rect width="${W}" height="${H}" filter="url(#grain)" opacity="${L.dark ? 0.1 : 0.07}" style="mix-blend-mode:overlay"/>`;
}

/* ------------------------------------------------------------------ */
/* The bottle                                                          */
/* ------------------------------------------------------------------ */
/**
 * Draws the MAISON ÉTHER flacon with its base centred at (cx, base).
 * s = scale (1 → body 220 × 270 units).
 */
export function bottle(L, cx, base, s = 1, { shadow = true, shadowLen = 1.6, label = true } = {}) {
  const bw = 220 * s, bh = 270 * s, r = 9 * s;
  const x = cx - bw / 2, top = base - bh;
  const wall = 15 * s, baseT = 44 * s, airT = 30 * s;
  const neckW = 68 * s, neckH = 15 * s;
  const capW = 118 * s, capH = 86 * s;
  const gLiquid = id('liq'), gLiqV = id('liqv'), gGlass = id('gl'), gCap = id('cap'), gBase = id('bs'), clip = id('clip');

  const shadowPart = shadow
    ? `
    <g filter="url(#soft12)" opacity="${L.dark ? 0.9 : 0.6}">
      <polygon points="${x + 4 * s},${base - 2 * s} ${x + bw},${base - 2 * s} ${x + bw - bh * shadowLen},${base - 26 * s} ${x - bh * shadowLen * 1.05},${base - 20 * s}" fill="${L.shadow}"/>
    </g>
    <g filter="url(#soft30)" style="mix-blend-mode:screen" opacity="0.75">
      <ellipse cx="${x - bh * shadowLen * 0.42}" cy="${base - 14 * s}" rx="${bh * 0.42}" ry="${14 * s}" fill="${L.caustic}"/>
    </g>
    <g filter="url(#soft4)" style="mix-blend-mode:screen" opacity="0.8">
      <ellipse cx="${x - bh * shadowLen * 0.35}" cy="${base - 14 * s}" rx="${bh * 0.18}" ry="${5 * s}" fill="${L.caustic}"/>
    </g>
    <ellipse cx="${cx}" cy="${base + 2 * s}" rx="${bw * 0.56}" ry="${7 * s}" fill="#000" opacity="0.35" filter="url(#soft4)"/>`
    : `<ellipse cx="${cx}" cy="${base + 2 * s}" rx="${bw * 0.56}" ry="${7 * s}" fill="#000" opacity="0.35" filter="url(#soft4)"/>`;

  const labelPart = label
    ? `
    <g>
      <rect x="${cx - 62 * s}" y="${top + bh * 0.36}" width="${124 * s}" height="${78 * s}" fill="#000" opacity="0.18" filter="url(#soft1)" transform="translate(${-1.5 * s} ${1.5 * s})"/>
      <rect x="${cx - 62 * s}" y="${top + bh * 0.36}" width="${124 * s}" height="${78 * s}" fill="#efe7da"/>
      <rect x="${cx - 62 * s}" y="${top + bh * 0.36}" width="${124 * s}" height="${78 * s}" fill="#fff" filter="url(#grain)" opacity="0.12"/>
      <text x="${cx}" y="${top + bh * 0.36 + 31 * s}" text-anchor="middle" font-family="${FONT_SERIF}" font-weight="500" font-size="${12.5 * s}" letter-spacing="${2.6 * s}" fill="#231d19">MAISON ÉTHER</text>
      <rect x="${cx - 9 * s}" y="${top + bh * 0.36 + 41 * s}" width="${18 * s}" height="${0.7 * s}" fill="#231d19" opacity="0.6"/>
      <text x="${cx}" y="${top + bh * 0.36 + 58 * s}" text-anchor="middle" font-family="${FONT_SANS}" font-weight="500" font-size="${6.4 * s}" letter-spacing="${2.4 * s}" fill="#3a302a">${L.name}</text>
      <text x="${cx}" y="${top + bh * 0.36 + 68 * s}" text-anchor="middle" font-family="${FONT_SANS}" font-size="${4.4 * s}" letter-spacing="${1.4 * s}" fill="#6a5c52">EAU DE PARFUM · 100 ML</text>
    </g>`
    : '';

  return `
  <g>
    <defs>
      <linearGradient id="${gLiquid}" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="${L.liquidB}"/>
        <stop offset="0.35" stop-color="${L.liquidA}" stop-opacity="0.9"/>
        <stop offset="0.72" stop-color="${L.liquidA}" stop-opacity="0.75"/>
        <stop offset="0.9" stop-color="${L.liquidA}"/>
        <stop offset="1" stop-color="${L.liquidB}"/>
      </linearGradient>
      <linearGradient id="${gLiqV}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#fff" stop-opacity="0.22"/>
        <stop offset="0.12" stop-color="#fff" stop-opacity="0"/>
        <stop offset="0.85" stop-color="#000" stop-opacity="0"/>
        <stop offset="1" stop-color="#000" stop-opacity="0.25"/>
      </linearGradient>
      <linearGradient id="${gGlass}" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="${L.glass}" stop-opacity="0.32"/>
        <stop offset="0.07" stop-color="${L.glass}" stop-opacity="0.08"/>
        <stop offset="0.93" stop-color="${L.glass}" stop-opacity="0.1"/>
        <stop offset="1" stop-color="${L.glass}" stop-opacity="0.45"/>
      </linearGradient>
      <linearGradient id="${gBase}" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="${L.glass}" stop-opacity="0.25"/>
        <stop offset="0.3" stop-color="${L.liquidA}" stop-opacity="0.25"/>
        <stop offset="0.62" stop-color="#fff" stop-opacity="0.5"/>
        <stop offset="0.7" stop-color="${L.glass}" stop-opacity="0.12"/>
        <stop offset="1" stop-color="#fff" stop-opacity="0.55"/>
      </linearGradient>
      <linearGradient id="${gCap}" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="${L.cap[2]}"/>
        <stop offset="0.45" stop-color="${L.cap[1]}"/>
        <stop offset="0.82" stop-color="${L.cap[0]}"/>
        <stop offset="1" stop-color="${L.cap[1]}"/>
      </linearGradient>
      <clipPath id="${clip}"><rect x="${x}" y="${top}" width="${bw}" height="${bh}" rx="${r}"/></clipPath>
    </defs>
    ${shadowPart}
    <!-- body -->
    <g clip-path="url(#${clip})">
      <rect x="${x}" y="${top}" width="${bw}" height="${bh}" fill="${L.dark ? '#000' : '#fff'}" opacity="${L.dark ? 0.25 : 0.08}"/>
      <rect x="${x + wall}" y="${top + airT}" width="${bw - wall * 2}" height="${bh - airT - baseT}" rx="${4 * s}" fill="url(#${gLiquid})" opacity="${L.liquidOpacity}"/>
      <rect x="${x + wall}" y="${top + airT}" width="${bw - wall * 2}" height="${bh - airT - baseT}" rx="${4 * s}" fill="url(#${gLiqV})"/>
      <ellipse cx="${x + bw * 0.62}" cy="${top + bh * 0.45}" rx="${bw * 0.3}" ry="${bh * 0.32}" fill="${L.dark ? L.caustic : '#fff3dc'}" opacity="${L.dark ? 0.35 : 0.45}" filter="url(#soft12)"/>
      <rect x="${x + wall}" y="${base - baseT - 26 * s}" width="${bw - wall * 2}" height="${26 * s}" fill="${L.liquidB}" opacity="0.45" filter="url(#soft4)"/>
      <rect x="${x + wall}" y="${top + airT}" width="${bw - wall * 2}" height="${2 * s}" fill="#fff" opacity="0.5"/>
      <rect x="${x}" y="${base - baseT}" width="${bw}" height="${baseT}" fill="url(#${gBase})"/>
      <rect x="${x}" y="${base - baseT}" width="${bw}" height="${1.4 * s}" fill="#fff" opacity="0.55"/>
      <rect x="${x}" y="${top}" width="${bw}" height="${bh}" fill="url(#${gGlass})"/>
      <!-- refracted inner wall edges -->
      <rect x="${x + wall - 2 * s}" y="${top + airT}" width="${2 * s}" height="${bh - airT - baseT}" fill="${L.liquidB}" opacity="0.6"/>
      <rect x="${x + bw - wall}" y="${top + airT}" width="${2 * s}" height="${bh - airT - baseT}" fill="${L.liquidB}" opacity="0.5"/>
      <!-- specular -->
      <rect x="${x + bw - 7 * s}" y="${top + 6 * s}" width="${2.2 * s}" height="${bh - 12 * s}" fill="#fff" opacity="0.85" filter="url(#soft1)"/>
      <rect x="${x + bw * 0.74}" y="${top + 8 * s}" width="${9 * s}" height="${bh - 16 * s}" fill="#fff" opacity="0.13" filter="url(#soft4)"/>
      <rect x="${x + 4 * s}" y="${top + 8 * s}" width="${1.4 * s}" height="${bh - 16 * s}" fill="#fff" opacity="0.35"/>
    </g>
    <rect x="${x}" y="${top}" width="${bw}" height="${bh}" rx="${r}" fill="none" stroke="#fff" stroke-opacity="${L.dark ? 0.22 : 0.4}" stroke-width="${1.2 * s}"/>
    ${labelPart}
    <!-- neck -->
    <rect x="${cx - neckW / 2}" y="${top - neckH}" width="${neckW}" height="${neckH + 2}" fill="${L.glass}" opacity="0.35"/>
    <rect x="${cx - neckW / 2}" y="${top - neckH}" width="${neckW}" height="${neckH + 2}" fill="none" stroke="#fff" stroke-opacity="0.35" stroke-width="${s}"/>
    <!-- cap -->
    <rect x="${cx - capW / 2}" y="${top - neckH - capH}" width="${capW}" height="${capH}" rx="${4 * s}" fill="url(#${gCap})"/>
    <rect x="${cx - capW / 2}" y="${top - neckH - capH}" width="${capW}" height="${capH}" rx="${4 * s}" fill="#fff" filter="url(#stoneTex)" opacity="${L.dark ? 0.12 : 0.28}"/>
    <rect x="${cx - capW / 2}" y="${top - neckH - capH}" width="${capW}" height="${1.6 * s}" fill="#fff" opacity="0.4"/>
    <rect x="${cx - capW / 2}" y="${top - neckH - 2 * s}" width="${capW}" height="${2 * s}" fill="#000" opacity="0.25"/>
  </g>`;
}

/* ------------------------------------------------------------------ */
/* Scene builders                                                      */
/* ------------------------------------------------------------------ */
const svg = (W, H, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><defs>${defs()}</defs>${body}</svg>`;

/** Desktop hero: product on the right third, quiet stone to the left. */
export function heroWide(key, W = 2400, H = 1350) {
  const L = LOOKS[key];
  const top = H * 0.8;
  return svg(W, H, `
    ${wall(W, H, L, { sunX: 0.5 })}
    ${plinth(W, H, L, { top, x0: W * 0.38, x1: W + 40, depth: 70 })}
    ${bottle(L, W * 0.7, top - 22 * (W / 2400), 2.05 * (W / 2400), { shadowLen: 1.5 })}
    ${finish(W, H, L)}`);
}

/** Mobile hero: product in the upper-centre, space for text beneath. */
export function heroTall(key, W = 1200, H = 1800) {
  const L = LOOKS[key];
  const top = H * 0.45;
  return svg(W, H, `
    ${wall(W, H, L, { sunX: 0.3, angle: -12 })}
    ${plinth(W, H, L, { top, x0: -40, x1: W + 40, depth: 70 })}
    ${bottle(L, W * 0.57, top - 24 * (W / 1200), 1.32 * (W / 1200), { shadowLen: 1.1 })}
    ${finish(W, H, L)}`);
}

/** Portrait product still, used in the collection and PDP. */
export function product(key, W = 1600, H = 2000) {
  const L = LOOKS[key];
  const top = H * 0.72;
  return svg(W, H, `
    ${wall(W, H, L, { sunX: 0.35, angle: -14 })}
    ${plinth(W, H, L, { top, x0: W * 0.08, x1: W * 1.02, depth: 90 })}
    ${bottle(L, W * 0.56, top - 34, 2.3, { shadowLen: 0.9 })}
    ${finish(W, H, L)}`);
}

/** Close-up of cap and label. */
export function detailCap(key, W = 1600, H = 2000) {
  const L = LOOKS[key];
  return svg(W, H, `
    ${wall(W, H, L, { sunX: 0.2, angle: -8 })}
    ${bottle(L, W * 0.5, H * 1.55, 5.4, { shadow: false })}
    ${finish(W, H, L)}`);
}

/** Light passing through the liquid onto stone. */
export function detailLight(key, W = 1600, H = 2000) {
  const L = LOOKS[key];
  const top = H * 0.38;
  return svg(W, H, `
    <rect width="${W}" height="${H}" fill="${L.stoneB}"/>
    ${plinth(W, H, L, { top, x0: -40, x1: W + 40, depth: 0 })}
    <g filter="url(#soft30)">
      <polygon points="${W * 0.9},${top} ${W * 1.1},${top} ${W * 0.2},${H} ${-W * 0.3},${H}" fill="${L.shadow}" opacity="${L.dark ? 0.85 : 0.45}"/>
    </g>
    <g style="mix-blend-mode:screen">
      <g filter="url(#soft70)"><ellipse cx="${W * 0.42}" cy="${H * 0.7}" rx="${W * 0.3}" ry="${H * 0.12}" fill="${L.caustic}" opacity="0.8"/></g>
    </g>
    ${bottle(L, W * 1.02, top + 30, 3.2, { shadow: false, label: false })}
    ${finish(W, H, L)}`);
}

/** Abstract: sunlight across textured stone. */
export function stoneLight(W = 1600, H = 2000, look = 'sillage') {
  const L = LOOKS[look];
  return svg(W, H, `
    ${wall(W, H, L, { sunX: 0.1, angle: -24 })}
    <g filter="url(#soft12)" opacity="0.5">
      <rect x="${W * 0.62}" y="${-H * 0.1}" width="${W * 0.05}" height="${H * 1.3}" fill="${L.wallC}" transform="rotate(-24 ${W / 2} ${H / 2})"/>
    </g>
    ${finish(W, H, L)}`);
}

/** Abstract: translucent fabric in light. */
export function fabric(W = 1600, H = 2000, look = 'lumiere') {
  const L = LOOKS[look];
  const folds = Array.from({ length: 22 }, (_, i) => {
    const x = (i / 21) * W * 1.2 - W * 0.1;
    const w = W * (0.02 + ((i * 37) % 7) / 120);
    const o = 0.12 + ((i * 13) % 9) / 30;
    return `<rect x="${x}" y="${-H * 0.1}" width="${w}" height="${H * 1.2}" fill="#fff" opacity="${o}"/>`;
  }).join('');
  return svg(W, H, `
    ${wall(W, H, L, { sunX: 0.4, angle: -6 })}
    <g filter="url(#fabric)">${folds}</g>
    <g filter="url(#soft70)" style="mix-blend-mode:screen"><ellipse cx="${W * 0.7}" cy="${H * 0.3}" rx="${W * 0.35}" ry="${H * 0.3}" fill="${L.sun}" opacity="0.6"/></g>
    ${finish(W, H, L)}`);
}

/** Craft: laboratory vessels with ingredients on a stone shelf. */
export function vessels(W = 1600, H = 2000, look = 'sillage') {
  const L = LOOKS[look];
  const top = H * 0.68;
  const flask = (cx, h, w, liq, fill) => {
    const g = id('v');
    const base = top - 10;
    return `
      <defs><linearGradient id="${g}" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="${liq}" stop-opacity="0.95"/><stop offset="0.5" stop-color="${liq}" stop-opacity="0.6"/><stop offset="1" stop-color="${liq}" stop-opacity="0.95"/></linearGradient></defs>
      <g filter="url(#soft12)" opacity="0.4"><polygon points="${cx - w / 2},${base} ${cx + w / 2},${base} ${cx - h * 1.1},${base + 30} ${cx - h * 1.3},${base + 20}" fill="${L.shadow}"/></g>
      <rect x="${cx - w / 2}" y="${base - h * fill}" width="${w}" height="${h * fill}" rx="${w * 0.08}" fill="url(#${g})"/>
      <rect x="${cx - w / 2}" y="${base - h}" width="${w}" height="${h}" rx="${w * 0.08}" fill="#fff" opacity="0.08" stroke="#fff" stroke-opacity="0.55" stroke-width="3"/>
      <rect x="${cx + w / 2 - 14}" y="${base - h + 12}" width="4" height="${h - 24}" fill="#fff" opacity="0.7"/>
      <g filter="url(#soft30)" style="mix-blend-mode:screen"><ellipse cx="${cx - h * 0.7}" cy="${base + 18}" rx="${w * 0.6}" ry="16" fill="${liq}" opacity="0.7"/></g>`;
  };
  return svg(W, H, `
    ${wall(W, H, L, { sunX: 0.3, angle: -16 })}
    ${plinth(W, H, L, { top, x0: -40, x1: W + 40, depth: 110 })}
    ${flask(W * 0.3, H * 0.34, W * 0.13, '#c9822f', 0.55)}
    ${flask(W * 0.55, H * 0.24, W * 0.18, '#e8cf9a', 0.4)}
    ${flask(W * 0.78, H * 0.42, W * 0.09, '#7a4320', 0.7)}
    ${finish(W, H, L)}`);
}

/** Craft: light through amber liquid (macro). */
export function amberMacro(W = 1600, H = 2000) {
  const L = LOOKS.sillage;
  return svg(W, H, `
    <rect width="${W}" height="${H}" fill="#2a1c14"/>
    <g filter="url(#soft70)">
      <ellipse cx="${W * 0.55}" cy="${H * 0.48}" rx="${W * 0.5}" ry="${H * 0.36}" fill="#b5651f"/>
      <ellipse cx="${W * 0.62}" cy="${H * 0.42}" rx="${W * 0.26}" ry="${H * 0.2}" fill="#f2a55a"/>
      <ellipse cx="${W * 0.66}" cy="${H * 0.38}" rx="${W * 0.1}" ry="${H * 0.08}" fill="#ffe2b4"/>
    </g>
    <g filter="url(#soft4)" opacity="0.8">
      ${Array.from({ length: 14 }, (_, i) => `<circle cx="${W * (0.25 + ((i * 47) % 50) / 100)}" cy="${H * (0.3 + ((i * 29) % 40) / 100)}" r="${6 + ((i * 7) % 18)}" fill="none" stroke="#ffd9a6" stroke-width="3" opacity="${0.25 + ((i * 3) % 5) / 10}"/>`).join('')}
    </g>
    <rect x="${W * 0.1}" y="${-10}" width="6" height="${H + 20}" fill="#fff" opacity="0.18" filter="url(#soft4)"/>
    ${finish(W, H, L)}`);
}

/** Craft: raw materials — resin pieces and a dried stem in a stone dish. */
export function materials(W = 1600, H = 2000) {
  const L = LOOKS.sillage;
  const top = H * 0.62;
  const resin = (cx, cy, r, rot) => `
    <g transform="rotate(${rot} ${cx} ${cy})">
      <path d="M${cx - r},${cy} Q${cx - r * 0.6},${cy - r * 0.9} ${cx},${cy - r * 0.8} Q${cx + r * 0.9},${cy - r * 0.6} ${cx + r},${cy + r * 0.1} Q${cx + r * 0.4},${cy + r * 0.7} ${cx - r * 0.3},${cy + r * 0.6} Z" fill="#c07a2f" opacity="0.92"/>
      <path d="M${cx - r * 0.4},${cy - r * 0.4} Q${cx},${cy - r * 0.6} ${cx + r * 0.4},${cy - r * 0.3}" stroke="#ffe0b0" stroke-width="${r * 0.12}" fill="none" opacity="0.7"/>
    </g>`;
  return svg(W, H, `
    ${wall(W, H, L, { sunX: 0.25, angle: -18 })}
    ${plinth(W, H, L, { top, x0: -40, x1: W + 40, depth: 140 })}
    <ellipse cx="${W * 0.5}" cy="${top - 50}" rx="${W * 0.34}" ry="${H * 0.065}" fill="${L.stoneShade}" opacity="0.55" filter="url(#soft12)" transform="translate(-40 30)"/>
    <ellipse cx="${W * 0.5}" cy="${top - 60}" rx="${W * 0.33}" ry="${H * 0.06}" fill="${L.stoneA}"/>
    <ellipse cx="${W * 0.5}" cy="${top - 64}" rx="${W * 0.28}" ry="${H * 0.045}" fill="${L.stoneB}"/>
    ${resin(W * 0.42, top - 70, 46, 10)}${resin(W * 0.53, top - 62, 34, -30)}${resin(W * 0.6, top - 78, 28, 50)}${resin(W * 0.47, top - 84, 24, 70)}
    <g stroke="#6b5a45" stroke-width="5" fill="none" stroke-linecap="round">
      <path d="M${W * 0.2},${top - 40} C${W * 0.35},${top - 160} ${W * 0.5},${top - 250} ${W * 0.62},${top - 420}"/>
    </g>
    ${[0.3, 0.42, 0.52, 0.58].map((t, i) => `<ellipse cx="${W * (0.2 + t * 0.7)}" cy="${top - 40 - t * 600}" rx="46" ry="12" fill="#857256" transform="rotate(${-50 + i * 25} ${W * (0.2 + t * 0.7)} ${top - 40 - t * 600})"/>`).join('')}
    ${finish(W, H, L)}`);
}

/** Discovery Set: ivory box with three miniature vials. */
export function discoveryBox(W = 2000, H = 1500, close = false) {
  const L = LOOKS.lumiere;
  const top = H * 0.74;
  const s = close ? 1.9 : 1;
  const bx = W / 2, bw = 900 * s, bh = 260 * s;
  const vial = (cx, look) => {
    const V = LOOKS[look];
    const vw = 70 * s, vh = 260 * s, base = top - 40 * s;
    return `
      <rect x="${cx - vw / 2}" y="${base - vh}" width="${vw}" height="${vh}" rx="${6 * s}" fill="${V.liquidA}" opacity="${V.liquidOpacity * 0.95}"/>
      <rect x="${cx - vw / 2}" y="${base - vh}" width="${vw}" height="${vh * 0.12}" fill="#fff" opacity="0.5"/>
      <rect x="${cx - vw / 2}" y="${base - vh}" width="${vw}" height="${vh}" rx="${6 * s}" fill="none" stroke="#fff" stroke-opacity="0.7" stroke-width="${1.5 * s}"/>
      <rect x="${cx + vw / 2 - 9 * s}" y="${base - vh + 10 * s}" width="${2.5 * s}" height="${vh - 20 * s}" fill="#fff" opacity="0.8"/>
      <rect x="${cx - vw * 0.42}" y="${base - vh - 44 * s}" width="${vw * 0.84}" height="${44 * s}" rx="${3 * s}" fill="${V.cap[1]}"/>
      <rect x="${cx - vw * 0.42}" y="${base - vh - 44 * s}" width="${vw * 0.84}" height="${44 * s}" rx="${3 * s}" fill="#fff" filter="url(#stoneTex)" opacity="0.25"/>
      <rect x="${cx - vw * 0.4}" y="${base - vh * 0.55}" width="${vw * 0.8}" height="${70 * s}" fill="#efe7da"/>
      <text x="${cx}" y="${base - vh * 0.55 + 40 * s}" text-anchor="middle" font-family="${FONT_SANS}" font-weight="600" font-size="${7 * s}" letter-spacing="${1.2 * s}" fill="#3a302a">${V.name}</text>`;
  };
  return svg(W, H, `
    ${wall(W, H, LOOKS.sillage, { sunX: 0.45, angle: -14 })}
    ${plinth(W, H, LOOKS.sillage, { top, x0: -40, x1: W + 40, depth: 120 })}
    <g filter="url(#soft30)" opacity="0.4"><polygon points="${bx - bw / 2},${top} ${bx + bw / 2},${top} ${bx - bw * 0.2},${top + 60} ${bx - bw},${top + 50}" fill="${LOOKS.sillage.shadow}"/></g>
    <!-- lid leaning behind -->
    <rect x="${bx - bw * 0.48}" y="${top - bh * 2.2}" width="${bw * 0.96}" height="${bh * 1.9}" fill="#ece4d6" transform="rotate(-4 ${bx} ${top})"/>
    <rect x="${bx - bw * 0.48}" y="${top - bh * 2.2}" width="${bw * 0.96}" height="${bh * 1.9}" fill="#fff" filter="url(#grain)" opacity="0.15" transform="rotate(-4 ${bx} ${top})"/>
    <text x="${bx}" y="${top - bh * 1.72}" text-anchor="middle" font-family="${FONT_SERIF}" font-size="${34 * s}" letter-spacing="${8 * s}" fill="#2b241f" transform="rotate(-4 ${bx} ${top})">MAISON ÉTHER</text>
    <text x="${bx}" y="${top - bh * 1.55}" text-anchor="middle" font-family="${FONT_SANS}" font-size="${11 * s}" letter-spacing="${5 * s}" fill="#5d5047" transform="rotate(-4 ${bx} ${top})">THE DISCOVERY SET</text>
    ${vial(bx - 190 * s, 'sillage')}${vial(bx, 'lumiere')}${vial(bx + 190 * s, 'nocturne')}
    <!-- tray front -->
    <rect x="${bx - bw / 2}" y="${top - bh}" width="${bw}" height="${bh}" fill="#f1ebe2"/>
    <rect x="${bx - bw / 2}" y="${top - bh}" width="${bw}" height="${bh}" fill="#c9b6a2" opacity="0.18"/>
    <rect x="${bx - bw / 2}" y="${top - bh}" width="${bw}" height="${4}" fill="#fff" opacity="0.8"/>
    <rect x="${bx - bw / 2}" y="${top - bh}" width="${bw}" height="${bh}" fill="#fff" filter="url(#grain)" opacity="0.15"/>
    <rect x="${bx - bw / 2}" y="${top - bh}" width="${bw * 0.12}" height="${bh}" fill="#000" opacity="0.06"/>
    ${finish(W, H, L)}`);
}

/** Journal: smoke-like air over dark stone. */
export function journalScent(W = 1600, H = 2000) {
  const L = LOOKS.nocturne;
  return svg(W, H, `
    ${wall(W, H, L, { sunX: 0.5, angle: -10 })}
    <g filter="url(#smoke)" opacity="0.6">
      <path d="M${W * 0.5},${H * 1.05} C${W * 0.45},${H * 0.7} ${W * 0.65},${H * 0.5} ${W * 0.5},${H * 0.15}" stroke="#e9d7c3" stroke-width="60" fill="none"/>
      <path d="M${W * 0.55},${H * 1.05} C${W * 0.6},${H * 0.75} ${W * 0.4},${H * 0.55} ${W * 0.58},${H * 0.25}" stroke="#c9a888" stroke-width="30" fill="none"/>
    </g>
    ${finish(W, H, L)}`);
}

export function ogImage(W = 1200, H = 630) {
  return heroWide('sillage', W, H);
}
