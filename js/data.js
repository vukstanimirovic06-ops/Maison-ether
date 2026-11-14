/**
 * Catalogue and editorial content for MAISON ÉTHER (a fictional design concept).
 * Prices are concept prices for demonstration only.
 */

export const PRODUCTS = [
  {
    slug: 'sillage',
    index: '01',
    name: 'Sillage',
    line: 'The warmth that lingers.',
    notes: ['Amber', 'Sandalwood', 'Vanilla'],
    family: 'Amber · Woody',
    description:
      'A sensual composition of golden warmth and quiet depth. An intimate trace that remains long after the moment has passed.',
    pyramid: {
      top: ['Saffron', 'Mandarin peel'],
      heart: ['Sandalwood', 'Orris butter'],
      base: ['Amber', 'Vanilla absolute', 'Labdanum'],
    },
    story:
      'Sillage is the word for the trail a fragrance leaves in the air behind someone who has just walked past. We composed it for the hour when sunlight turns the colour of honey and settles on warm stone — a scent that does not announce itself, but stays.',
    mood: 'Golden hour · warm stone · soft shadow',
    sizes: [
      { ml: 50, price: 130 },
      { ml: 100, price: 185 },
    ],
    defaultSize: 100,
    images: ['product-sillage', 'detail-sillage-cap', 'detail-sillage-light', 'hero-sillage'],
    alt: {
      'product-sillage': 'Sillage eau de parfum, a rectangular glass flacon with amber liquid and a stone cap, on a travertine plinth in late-afternoon light',
      'detail-sillage-cap': 'Close view of the honed stone cap and ivory label of the Sillage flacon',
      'detail-sillage-light': 'Amber light cast through the Sillage flacon onto pale stone',
      'hero-sillage': 'The Sillage flacon on travertine with long window shadows across the wall',
    },
    tone: 'warm',
  },
  {
    slug: 'lumiere',
    index: '02',
    name: 'Lumière',
    line: 'Light, made tangible.',
    notes: ['Bergamot', 'Iris', 'White Musk'],
    family: 'Floral · Musk',
    description:
      'A luminous expression of clarity and softness. Delicate citrus, powdery iris, and the intimacy of clean skin.',
    pyramid: {
      top: ['Bergamot', 'Neroli'],
      heart: ['Iris', 'Violet leaf'],
      base: ['White musk', 'Ambrette seed'],
    },
    story:
      'Lumière began with a morning in a limestone room — diffused daylight, linen, the faint powder of iris. It is a study in transparency: everything is visible, nothing is loud.',
    mood: 'Diffused daylight · pale limestone · ivory',
    sizes: [
      { ml: 50, price: 120 },
      { ml: 100, price: 175 },
    ],
    defaultSize: 100,
    images: ['product-lumiere', 'detail-lumiere-cap', 'detail-lumiere-light', 'hero-lumiere'],
    alt: {
      'product-lumiere': 'Lumière eau de parfum, a clear glass flacon with pale liquid and a limestone cap, in soft diffused daylight',
      'detail-lumiere-cap': 'Close view of the pale limestone cap and label of the Lumière flacon',
      'detail-lumiere-light': 'Soft daylight refracted through the Lumière flacon onto limestone',
      'hero-lumiere': 'The Lumière flacon on pale limestone in diffused morning light',
    },
    tone: 'light',
  },
  {
    slug: 'nocturne',
    index: '03',
    name: 'Nocturne',
    line: 'After darkness, desire.',
    notes: ['Oud', 'Black Pepper', 'Incense'],
    family: 'Smoky · Woody',
    description:
      'A deeper exploration of mystery and contrast. Smoky woods, warm spice, and an unforgettable evening presence.',
    pyramid: {
      top: ['Black pepper', 'Cardamom'],
      heart: ['Incense', 'Cypriol'],
      base: ['Oud accord', 'Vetiver', 'Benzoin'],
    },
    story:
      'Nocturne belongs to the moment after the lamps are lowered. Resinous smoke, the bite of black pepper, a dark wood that warms on skin — composed for contrast, and for evenings that are remembered long after.',
    mood: 'Side light · smoked glass · deep espresso',
    sizes: [
      { ml: 50, price: 145 },
      { ml: 100, price: 210 },
    ],
    defaultSize: 100,
    images: ['product-nocturne', 'detail-nocturne-cap', 'detail-nocturne-light', 'hero-nocturne'],
    alt: {
      'product-nocturne': 'Nocturne eau de parfum, a smoked glass flacon with dark liquid and an espresso stone cap, in dramatic side light',
      'detail-nocturne-cap': 'Close view of the dark stone cap and label of the Nocturne flacon',
      'detail-nocturne-light': 'A narrow beam of warm light passing through the Nocturne flacon onto dark stone',
      'hero-nocturne': 'The Nocturne flacon on dark stone with a single shaft of evening light',
    },
    tone: 'dark',
  },
];

export const DISCOVERY = {
  slug: 'discovery-set',
  name: 'The Discovery Set',
  line: 'Find the Scent That Finds You.',
  description:
    'An intimate introduction to the world of MAISON ÉTHER. Three distinct expressions, waiting to become part of your story.',
  contents: ['Sillage — 2 ml Eau de Parfum', 'Lumière — 2 ml Eau de Parfum', 'Nocturne — 2 ml Eau de Parfum'],
  family: 'Three compositions',
  story:
    'Each vial holds enough to wear a fragrance for several days — long enough to learn how it changes on your skin from morning to evening. The set arrives in an ivory presentation box, designed to be kept.',
  sizes: [{ ml: 6, label: '3 × 2 ml', price: 35 }],
  defaultSize: 6,
  images: ['discovery-set', 'discovery-detail', 'product-sillage', 'product-nocturne'],
  alt: {
    'discovery-set': 'The MAISON ÉTHER Discovery Set: three miniature vials in an ivory presentation box, lid resting behind',
    'discovery-detail': 'The three Discovery Set vials — Sillage, Lumière and Nocturne — standing in their ivory tray',
    'product-sillage': 'Sillage eau de parfum on travertine',
    'product-nocturne': 'Nocturne eau de parfum on dark stone',
  },
  tone: 'light',
};

export const ALL_ITEMS = [...PRODUCTS, DISCOVERY];
export const findItem = (slug) => ALL_ITEMS.find((p) => p.slug === slug);

export const ARTICLES = [
  {
    slug: 'the-language-of-scent',
    index: '01',
    title: 'The Language of Scent',
    dek: 'Exploring the relationship between fragrance, memory, and emotion.',
    category: 'Essay',
    read: '5 min read',
    image: 'journal-scent',
    alt: 'Pale smoke rising through a shaft of warm light against dark stone',
    body: [
      'Of all the senses, smell is the one we find hardest to describe and the easiest to remember. A few molecules in the air can return us, without warning, to a kitchen, a coat, a summer we had not thought about in years.',
      'Part of the reason is physical. The olfactory system has an unusually short path to the regions of the brain associated with emotion and memory. Scent tends to arrive as feeling first and as language later — if at all.',
      'This is why we rarely talk about fragrance in terms of chemistry. We borrow words from other senses: warm, bright, soft, dark. We speak of notes, as if perfume were music; of accords and harmony, of a composition that unfolds over time.',
      'When we compose at the Maison, we begin with a moment rather than a material. Light on stone at the end of a day. Linen drying near an open window. A room after the candles have been put out. The ingredients are chosen afterwards, to translate that moment into something that can be worn.',
      'A fragrance is finished, in a sense, only when someone else wears it — when it meets their skin, their habits, their own memories. What remains is no longer ours. It becomes part of how someone is remembered.',
    ],
  },
  {
    slug: 'notes-on-light',
    index: '02',
    title: 'Notes on Light',
    dek: 'A visual exploration of atmosphere, materials, and inspiration.',
    category: 'Atelier',
    read: '4 min read',
    image: 'journal-light',
    alt: 'Diffused daylight falling across a pale limestone wall in soft diagonal bands',
    body: [
      'Light is the material we return to most often, even though it is not an ingredient at all.',
      'Each of our three compositions began with a particular quality of light. Sillage with the low amber sun of late afternoon, raking across travertine. Lumière with the even, shadowless brightness of an overcast morning in a pale room. Nocturne with a single lamp in the dark, throwing long and decisive shadows.',
      'We collect these references the way a painter might: photographs of walls, fabric samples, small pieces of stone. They are pinned beside the work in progress and consulted often. When a composition drifts, we look back at the light it was meant to describe.',
      'The same thinking shaped the flacon. Thick glass bends light; a heavy base gathers it. The colour of the liquid is not decoration but a hint of what the fragrance will feel like — warm, clear, or smoked.',
      'Atmosphere is difficult to explain and immediately recognisable. It is what we try, quietly, to bottle.',
    ],
  },
  {
    slug: 'the-ritual-of-fragrance',
    index: '03',
    title: 'The Ritual of Fragrance',
    dek: 'A thoughtful guide to experiencing and wearing perfume.',
    category: 'Guide',
    read: '6 min read',
    image: 'journal-ritual',
    alt: 'Sheer fabric moving gently in warm afternoon light',
    body: [
      'There is no correct way to wear perfume, only ways that suit you better. A few habits, though, help a fragrance show itself as it was intended.',
      'Apply to skin rather than clothing, on places that are warm: the inside of the wrists, the base of the throat, behind the ears. Warmth carries a fragrance outward and lets it develop.',
      'Resist the urge to rub your wrists together. It does not damage the fragrance, but it hurries it, flattening the first impression before it has had time to open.',
      'Allow a fragrance time. The first minutes are bright and fleeting; the heart reveals itself after a quarter of an hour; the base may stay with you until evening. When trying something new, wear it for a full day before deciding.',
      'Keep your flacon away from direct sunlight and heat — a drawer or a cool shelf is ideal. Light and warmth gradually alter a fragrance, however beautiful the bottle looks on a sunny windowsill.',
      'Finally, consider restraint. The most memorable fragrances are often noticed only at close distance. Leave something for others to discover.',
    ],
  },
];

export const findArticle = (slug) => ARTICLES.find((a) => a.slug === slug);

export const INFO_PAGES = {
  contact: {
    title: 'Contact',
    body: [
      'MAISON ÉTHER is a fictional brand created as a design concept. There is no customer service team, boutique or postal address.',
      'In a production version of this site, this page would list client-care contact options, opening hours and boutique information.',
    ],
  },
  shipping: {
    title: 'Shipping & Returns',
    body: [
      'This website is a demonstration. No products are sold, shipped or returned, and no orders are processed.',
      'A production version would describe delivery regions, timeframes, costs and the returns policy here.',
    ],
  },
  privacy: {
    title: 'Privacy',
    body: [
      'This demonstration site does not collect personal data. The shopping bag is stored only in your own browser (localStorage) so that it persists between visits; you can clear it at any time by emptying the bag or clearing site data.',
      'The newsletter and checkout forms are demonstrations: nothing you type is sent to a server or stored.',
      'The site uses no analytics, advertising trackers or third-party cookies. Fonts are self-hosted.',
    ],
  },
  terms: {
    title: 'Terms',
    body: [
      'MAISON ÉTHER is a fictional design concept. Products, prices and stories on this site are illustrative and are not offered for sale.',
      'Imagery currently shown consists of illustrative placeholder artwork pending dedicated campaign photography.',
    ],
  },
};
