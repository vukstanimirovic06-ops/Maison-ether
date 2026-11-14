/**
 * View templates. Each returns an HTML string; behaviour is attached in app.js.
 */
import { PRODUCTS, DISCOVERY, ARTICLES } from './data.js';
import { formatPrice } from './bag.js';

/* ------------------------------------------------------------------ */
/* Images                                                              */
/* ------------------------------------------------------------------ */
const SETS = {
  hero: { widths: [960, 1600, 2400], w: 2400, h: 1350 },
  heroM: { widths: [600, 900, 1200], w: 1200, h: 1800 },
  portrait: { widths: [640, 1000, 1600], w: 1600, h: 2000 },
  wide: { widths: [800, 1400, 2000], w: 2000, h: 1500 },
};

function setFor(name) {
  if (/^hero-.*-m$/.test(name)) return SETS.heroM;
  if (name.startsWith('hero-')) return SETS.hero;
  if (name.startsWith('discovery-')) return SETS.wide;
  return SETS.portrait;
}

const srcset = (name) => setFor(name).widths.map((w) => `assets/img/${name}-${w}.webp ${w}w`).join(', ');
const src = (name) => `assets/img/${name}-${setFor(name).widths[1]}.webp`;

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

/** Responsive <img>. All imagery is currently placeholder artwork (see ASSETS.md). */
export function img(name, { alt = '', sizes = '100vw', eager = false, cls = '' } = {}) {
  const { w, h } = setFor(name);
  return `<img class="${cls}" src="${src(name)}" srcset="${srcset(name)}" sizes="${sizes}" width="${w}" height="${h}" alt="${esc(alt)}" ${
    eager ? 'fetchpriority="high"' : 'loading="lazy"'
  } decoding="async" data-placeholder>`;
}

/** Art-directed hero: a dedicated tall composition for small screens. */
function heroPicture(key, alt, eager) {
  const m = `hero-${key}-m`;
  const d = `hero-${key}`;
  return `<picture>
    <source media="(max-width: 767.98px)" srcset="${srcset(m)}" sizes="100vw">
    ${img(d, { alt, eager, cls: 'hero__img' })}
  </picture>`;
}

const arrow = '<span class="arrow" aria-hidden="true">→</span>';
const eyebrow = (t, cls = '') => `<p class="eyebrow ${cls}">${t}</p>`;

/* ------------------------------------------------------------------ */
/* Home                                                                */
/* ------------------------------------------------------------------ */
function hero() {
  const slides = PRODUCTS.map(
    (p, i) => `
    <div class="hero__slide${i === 0 ? ' is-active' : ''}" data-slide="${i}" data-tone="${p.tone}" ${i === 0 ? '' : 'aria-hidden="true"'}>
      ${heroPicture(p.slug, i === 0 ? p.alt[`hero-${p.slug}`] : '', i === 0)}
    </div>`
  ).join('');

  const captions = PRODUCTS.map(
    (p, i) => `
    <a class="hero__caption${i === 0 ? ' is-active' : ''}" href="#/fragrance/${p.slug}" data-caption="${i}" ${i === 0 ? '' : 'tabindex="-1" aria-hidden="true"'}>
      <span class="hero__caption-index">N° ${p.index}</span>
      <span class="hero__caption-name">${p.name}</span>
      <span class="hero__caption-notes">${p.notes.join(' · ')}</span>
    </a>`
  ).join('');

  const dots = PRODUCTS.map(
    (p, i) => `<button type="button" class="hero__dot${i === 0 ? ' is-active' : ''}" data-goto="${i}" aria-label="Show ${p.name}" aria-pressed="${i === 0}"><span></span></button>`
  ).join('');

  return `
  <section class="hero" aria-roledescription="carousel" aria-label="Featured fragrances" data-hero>
    <div class="hero__media" aria-live="off">${slides}</div>
    <div class="hero__shade" aria-hidden="true"></div>
    <div class="hero__content">
      <p class="eyebrow eyebrow--light hero__eyebrow" data-intro>The Art of the Unseen</p>
      <h1 class="hero__title" data-intro>The Art of Being <em>Remembered.</em></h1>
      <p class="hero__lede" data-intro>A collection of extraordinary fragrances, created to capture what words cannot.</p>
      <div class="hero__actions" data-intro>
        <a class="pill pill--light" href="#collection">Explore the Collection ${arrow}</a>
        <a class="text-link text-link--light" href="#story">Discover our world</a>
      </div>
      <div class="hero__controls" data-intro>
        <div class="hero__dots" role="group" aria-label="Choose fragrance">${dots}</div>
        <button type="button" class="hero__pause" data-pause aria-label="Pause slideshow">
          <svg viewBox="0 0 12 12" aria-hidden="true" class="i-pause"><path d="M3.5 2v8M8.5 2v8"/></svg>
          <svg viewBox="0 0 12 12" aria-hidden="true" class="i-play"><path d="M3.5 2 10 6l-6.5 4Z"/></svg>
        </button>
      </div>
    </div>
    <div class="hero__captions" data-intro>${captions}</div>
  </section>`;
}

function collection() {
  const cards = PRODUCTS.map((p) => {
    const size = p.sizes.find((s) => s.ml === p.defaultSize);
    return `
    <article class="fragrance" data-reveal>
      <a class="fragrance__media" href="#/fragrance/${p.slug}" aria-label="${p.name} — view fragrance" tabindex="-1">
        ${img(`product-${p.slug}`, { alt: p.alt[`product-${p.slug}`], sizes: '(max-width: 767px) 84vw, 31vw', cls: 'zoom' })}
      </a>
      <div class="fragrance__body">
        <p class="fragrance__index">N° ${p.index}</p>
        <h3 class="fragrance__name"><a href="#/fragrance/${p.slug}">${p.name}</a></h3>
        <p class="fragrance__line">${p.line}</p>
        <p class="fragrance__notes">${p.notes.join('<span aria-hidden="true"> / </span>')}</p>
        <p class="fragrance__desc">${p.description}</p>
        <div class="fragrance__meta">
          <span>${size.ml} ml Eau de Parfum</span>
          <span class="fragrance__price">${formatPrice(size.price)}</span>
        </div>
        <a class="text-link" href="#/fragrance/${p.slug}">Discover ${p.name} ${arrow}</a>
      </div>
    </article>`;
  }).join('');

  return `
  <section class="section collection" id="collection" aria-labelledby="collection-title">
    <div class="wrap">
      <header class="section-head" data-reveal>
        ${eyebrow('The Fragrance Collection')}
        <h2 class="display" id="collection-title">An Expression of the <em>Invisible.</em></h2>
        <p class="section-head__lede">Three distinctive compositions. Three ways of leaving an impression.</p>
      </header>
      <div class="collection__track" data-track tabindex="0" role="region" aria-label="Fragrances — scroll horizontally on small screens">
        ${cards}
      </div>
      <p class="collection__hint" aria-hidden="true"><span data-track-pos>01</span> / 03 — swipe</p>
    </div>
  </section>`;
}

function philosophy() {
  return `
  <section class="section philosophy" id="story" aria-labelledby="story-title">
    <div class="wrap philosophy__grid">
      <figure class="philosophy__main" data-reveal>
        ${img('philosophy-light', { alt: 'Late-afternoon sunlight falling across a textured travertine wall in long diagonal bands', sizes: '(max-width: 767px) 100vw, 46vw' })}
      </figure>
      <div class="philosophy__text">
        ${eyebrow('The Maison', '')}
        <h2 class="display" id="story-title" data-reveal>What Remains <em>Unspoken.</em></h2>
        <div class="prose" data-reveal>
          <p class="prose__lead">Some moments are impossible to preserve. A fleeting glance. The warmth of sunlight on skin. The familiar presence of someone unforgettable.</p>
          <p>At MAISON ÉTHER, we believe fragrance gives form to these invisible experiences.</p>
          <p>Every composition is an invitation to remember, to feel, and to discover something deeply personal.</p>
        </div>
      </div>
      <figure class="philosophy__aside" data-reveal>
        ${img('philosophy-fabric', { alt: 'Translucent linen moving gently in diffused daylight', sizes: '(max-width: 767px) 60vw, 24vw' })}
        <figcaption>Linen, morning light. A study for Lumière.</figcaption>
      </figure>
    </div>
  </section>`;
}

function craft() {
  const pillars = [
    ['Selection', 'Every composition begins with a short list of materials, chosen for character rather than abundance — resins, woods, roots and flowers that each have a clear role to play.'],
    ['Composition', 'Formulas are built slowly, through many small variations. Most are set aside. Those that remain are refined until nothing can be removed without the idea being lost.'],
    ['Tradition & Modernity', 'We draw on the classical structure of French perfumery — top, heart and base — while allowing contemporary materials and quieter proportions to shape the result.'],
    ['Detail', 'Concentration, maceration time, the weight of the glass, the texture of the cap: every decision is tested against the same question — does it serve the moment we set out to capture?'],
  ];
  return `
  <section class="section craft" id="craft" aria-labelledby="craft-title">
    <div class="wrap">
      <header class="craft__head">
        ${eyebrow('The Art of Perfumery', 'eyebrow--light')}
        <h2 class="display" id="craft-title" data-reveal>Composed with <em>Intention.</em></h2>
        <p class="craft__lede" data-reveal>Perfumery is equal parts discipline and experiment. Our approach is deliberately unhurried: fewer materials, more attention, and the patience to let a composition become what it needs to be.</p>
      </header>
      <div class="craft__gallery">
        <figure class="craft__fig craft__fig--a" data-reveal>${img('craft-vessels', { alt: 'Three glass vessels holding amber, pale and dark fragrance materials on a stone shelf', sizes: '(max-width: 767px) 100vw, 40vw' })}</figure>
        <figure class="craft__fig craft__fig--b" data-reveal>${img('craft-amber', { alt: 'Light passing through amber liquid, glowing in a darkened room', sizes: '(max-width: 767px) 60vw, 26vw' })}</figure>
        <figure class="craft__fig craft__fig--c" data-reveal>${img('craft-materials', { alt: 'Pieces of amber resin and a dried botanical stem in a shallow stone dish', sizes: '(max-width: 767px) 60vw, 26vw' })}</figure>
      </div>
      <ol class="craft__pillars">
        ${pillars.map(([t, d], i) => `<li data-reveal><span class="craft__num">0${i + 1}</span><h3>${t}</h3><p>${d}</p></li>`).join('')}
      </ol>
    </div>
  </section>`;
}

function discovery() {
  const size = DISCOVERY.sizes[0];
  return `
  <section class="section discovery" id="discovery" aria-labelledby="discovery-title">
    <div class="wrap discovery__grid">
      <a class="discovery__media" href="#/fragrance/discovery-set" tabindex="-1" aria-hidden="true" data-reveal>
        ${img('discovery-set', { alt: DISCOVERY.alt['discovery-set'], sizes: '(max-width: 767px) 100vw, 58vw', cls: 'zoom' })}
      </a>
      <div class="discovery__text" data-reveal>
        ${eyebrow('MAISON ÉTHER — The Discovery Set')}
        <h2 class="display" id="discovery-title">Find the Scent <em>That Finds You.</em></h2>
        <p class="discovery__desc">${DISCOVERY.description}</p>
        <ul class="discovery__list">
          ${PRODUCTS.map((p) => `<li><span>${p.name}</span><span>${p.notes.join(' · ')}</span></li>`).join('')}
        </ul>
        <div class="discovery__buy">
          <span class="discovery__price">${formatPrice(size.price)} <small>${size.label} Eau de Parfum</small></span>
          <a class="pill pill--dark" href="#/fragrance/discovery-set">Discover the Set ${arrow}</a>
        </div>
      </div>
    </div>
  </section>`;
}

function journal() {
  return `
  <section class="section journal" id="journal" aria-labelledby="journal-title">
    <div class="wrap">
      <header class="section-head section-head--row" data-reveal>
        <div>
          ${eyebrow('Journal')}
          <h2 class="display" id="journal-title">Notes from <em>the Maison.</em></h2>
        </div>
      </header>
      <div class="journal__grid">
        ${ARTICLES.map(
          (a) => `
        <article class="entry" data-reveal>
          <a href="#/journal/${a.slug}" class="entry__link">
            <div class="entry__media">${img(a.image, { alt: a.alt, sizes: '(max-width: 767px) 100vw, 31vw', cls: 'zoom' })}</div>
            <p class="entry__meta"><span>${a.index}</span><span>${a.category}</span><span>${a.read}</span></p>
            <h3 class="entry__title">${a.title}</h3>
            <p class="entry__dek">${a.dek}</p>
            <span class="text-link">Read ${arrow}</span>
          </a>
        </article>`
        ).join('')}
      </div>
    </div>
  </section>`;
}

export function invitation() {
  return `
  <section class="section invitation" id="invitation" aria-labelledby="invite-title">
    <div class="wrap invitation__grid">
      <div data-reveal>
        ${eyebrow('An Invitation', 'eyebrow--light')}
        <h2 class="display" id="invite-title">Stay Close to <em>the Unseen.</em></h2>
      </div>
      <div data-reveal>
        <p class="invitation__desc">Receive occasional notes from the Maison — new compositions, stories, and private discoveries.</p>
        <form class="newsletter" data-newsletter novalidate>
          <label class="visually-hidden" for="nl-email">Email address</label>
          <div class="newsletter__row">
            <input id="nl-email" name="email" type="email" inputmode="email" autocomplete="email" placeholder="Your email address" aria-describedby="nl-msg nl-note" required>
            <button class="pill pill--light" type="submit">Subscribe</button>
          </div>
          <p class="newsletter__msg" id="nl-msg" role="status" aria-live="polite"></p>
          <p class="newsletter__note" id="nl-note">Demonstration form — no mailing list is connected and your address is not sent or stored.</p>
        </form>
      </div>
    </div>
  </section>`;
}

export function home() {
  return hero() + collection() + philosophy() + craft() + discovery() + journal() + invitation();
}

/* ------------------------------------------------------------------ */
/* Product detail                                                      */
/* ------------------------------------------------------------------ */
export function product(p) {
  const isSet = p.slug === 'discovery-set';
  const size = p.sizes.find((s) => s.ml === p.defaultSize);
  const others = PRODUCTS.filter((o) => o.slug !== p.slug);

  const thumbs = p.images
    .map(
      (name, i) => `<button type="button" class="gallery__thumb${i === 0 ? ' is-active' : ''}" data-thumb="${i}" aria-label="View image ${i + 1} of ${p.images.length}" aria-pressed="${i === 0}">
        ${img(name, { alt: '', sizes: '96px' })}
      </button>`
    )
    .join('');

  const slides = p.images
    .map(
      (name, i) => `<figure class="gallery__slide${i === 0 ? ' is-active' : ''}" data-gslide="${i}" ${i ? 'aria-hidden="true"' : ''}>
        ${img(name, { alt: p.alt[name], sizes: '(max-width: 899px) 100vw, 56vw', eager: i === 0, cls: name.startsWith('hero-') ? 'is-wide' : '' })}
      </figure>`
    )
    .join('');

  const pyramid = isSet
    ? `<div class="pdp__block"><h2 class="pdp__label">Contents</h2><ul class="pdp__contents">${p.contents.map((c) => `<li>${c}</li>`).join('')}</ul></div>`
    : `<div class="pdp__block">
        <h2 class="pdp__label">Olfactive Pyramid</h2>
        <dl class="pyramid">
          <div><dt>Top</dt><dd>${p.pyramid.top.join(', ')}</dd></div>
          <div><dt>Heart</dt><dd>${p.pyramid.heart.join(', ')}</dd></div>
          <div><dt>Base</dt><dd>${p.pyramid.base.join(', ')}</dd></div>
        </dl>
      </div>`;

  const sizePicker = p.sizes
    .map(
      (s) => `<label class="size">
        <input type="radio" name="size" value="${s.ml}" ${s.ml === size.ml ? 'checked' : ''}>
        <span>${s.label || `${s.ml} ml`}<small>${formatPrice(s.price)}</small></span>
      </label>`
    )
    .join('');

  return `
  <article class="pdp" data-pdp="${p.slug}" data-tone="${p.tone}">
    <div class="pdp__grid">
      <div class="gallery" data-gallery aria-roledescription="carousel" aria-label="${esc(p.name)} images">
        <div class="gallery__stage" data-gstage>${slides}</div>
        <div class="gallery__nav">
          <button type="button" class="icon-btn" data-gprev aria-label="Previous image"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg></button>
          <span class="gallery__count" aria-live="polite"><span data-gcount>1</span> / ${p.images.length}</span>
          <button type="button" class="icon-btn" data-gnext aria-label="Next image"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg></button>
        </div>
        <div class="gallery__thumbs">${thumbs}</div>
      </div>

      <div class="pdp__info">
        <nav class="crumbs" aria-label="Breadcrumb"><a href="#/">Maison</a><span aria-hidden="true">/</span><a href="#${isSet ? 'discovery' : 'collection'}">${isSet ? 'Discovery Set' : 'Collection'}</a><span aria-hidden="true">/</span><span aria-current="page">${p.name}</span></nav>
        ${isSet ? eyebrow('Three samples · Eau de Parfum') : eyebrow(`N° ${p.index} · ${p.family}`)}
        <h1 class="pdp__title">${p.name}</h1>
        <p class="pdp__line">${p.line}</p>
        ${isSet ? '' : `<p class="pdp__notes">${p.notes.join(' / ')}</p>`}
        <p class="pdp__desc">${p.description}</p>

        <form class="buy" data-buy novalidate>
          <fieldset class="buy__sizes">
            <legend class="pdp__label">Size</legend>
            <div class="sizes">${sizePicker}</div>
          </fieldset>
          <div class="buy__row">
            <div class="qty" role="group" aria-label="Quantity">
              <button type="button" data-qty="-1" aria-label="Decrease quantity">−</button>
              <input type="number" name="qty" value="1" min="1" max="10" inputmode="numeric" aria-label="Quantity">
              <button type="button" data-qty="1" aria-label="Increase quantity">+</button>
            </div>
            <button class="pill pill--dark buy__add" type="submit">
              <span>Add to Bag</span><span class="buy__price" data-price>${formatPrice(size.price)}</span>
            </button>
          </div>
          <p class="buy__note">Concept price · demonstration shop, no payment is taken.</p>
        </form>

        ${pyramid}

        <details class="pdp__details" open>
          <summary>The Story</summary>
          <p>${p.story}</p>
        </details>
        <details class="pdp__details">
          <summary>Details</summary>
          <ul class="pdp__facts">
            <li><span>Concentration</span><span>Eau de Parfum</span></li>
            <li><span>Family</span><span>${p.family}</span></li>
            ${isSet ? '<li><span>Presentation</span><span>Ivory box, three 2 ml vials</span></li>' : `<li><span>Flacon</span><span>Thick architectural glass, stone cap</span></li><li><span>Mood</span><span>${p.mood}</span></li>`}
          </ul>
        </details>
        <details class="pdp__details">
          <summary>Wearing</summary>
          <p>Apply to warm skin — wrists, throat, behind the ears — and allow the composition time to unfold. <a class="inline-link" href="#/journal/the-ritual-of-fragrance">Read the ritual of fragrance</a>.</p>
        </details>
      </div>
    </div>

    <section class="pdp__more" aria-labelledby="more-title">
      <div class="wrap">
        <h2 class="display display--sm" id="more-title">Continue <em>Discovering.</em></h2>
        <div class="more__grid">
          ${(isSet ? PRODUCTS : [...others, DISCOVERY])
            .map((o) => {
              const im = o.images[0];
              const s = o.sizes.find((x) => x.ml === o.defaultSize);
              return `<a class="more__card" href="#/fragrance/${o.slug}">
                <div class="more__media">${img(im, { alt: o.alt[im], sizes: '(max-width: 767px) 50vw, 30vw', cls: 'zoom' })}</div>
                <span class="more__name">${o.name}</span>
                <span class="more__price">${formatPrice(s.price)}</span>
              </a>`;
            })
            .join('')}
        </div>
      </div>
    </section>
  </article>`;
}

/* ------------------------------------------------------------------ */
/* Journal article                                                     */
/* ------------------------------------------------------------------ */
export function article(a) {
  const i = ARTICLES.indexOf(a);
  const next = ARTICLES[(i + 1) % ARTICLES.length];
  return `
  <article class="article">
    <header class="article__head wrap wrap--narrow">
      <nav class="crumbs" aria-label="Breadcrumb"><a href="#/">Maison</a><span aria-hidden="true">/</span><a href="#journal">Journal</a></nav>
      <p class="entry__meta"><span>${a.index}</span><span>${a.category}</span><span>${a.read}</span></p>
      <h1 class="article__title">${a.title}</h1>
      <p class="article__dek">${a.dek}</p>
    </header>
    <figure class="article__media wrap">${img(a.image, { alt: a.alt, sizes: '(max-width: 1200px) 100vw, 1200px', eager: true })}</figure>
    <div class="article__body wrap wrap--narrow prose">
      ${a.body.map((p, k) => `<p${k === 0 ? ' class="prose__lead"' : ''}>${p}</p>`).join('')}
    </div>
    <footer class="article__foot wrap wrap--narrow">
      <a class="text-link" href="#journal"><span class="arrow" aria-hidden="true">←</span> All journal entries</a>
      <a class="article__next" href="#/journal/${next.slug}"><span class="eyebrow">Next</span><span>${next.title}</span></a>
    </footer>
  </article>`;
}

/* ------------------------------------------------------------------ */
/* Demo checkout                                                       */
/* ------------------------------------------------------------------ */
export function checkout(lines, total) {
  if (!lines.length) {
    return `
    <section class="page wrap wrap--narrow">
      ${eyebrow('Checkout')}
      <h1 class="page__title">Your bag is <em>empty.</em></h1>
      <p>Explore the collection to add a fragrance.</p>
      <p><a class="pill pill--dark" href="#collection">Explore the Collection ${arrow}</a></p>
    </section>`;
  }
  return `
  <section class="page checkout wrap">
    <div class="checkout__notice" role="note">
      <strong>Demonstration checkout.</strong> This is a portfolio concept: no payment provider or order system is connected. No card details are requested and nothing you enter is sent or stored.
    </div>
    <div class="checkout__grid">
      <form class="checkout__form" data-checkout novalidate>
        ${eyebrow('Checkout')}
        <h1 class="page__title">Delivery <em>details.</em></h1>
        <div class="field"><label for="co-name">Full name</label><input id="co-name" name="name" autocomplete="name" required></div>
        <div class="field"><label for="co-email">Email</label><input id="co-email" name="email" type="email" autocomplete="email" required></div>
        <div class="field"><label for="co-address">Address</label><input id="co-address" name="address" autocomplete="street-address" required></div>
        <div class="field-row">
          <div class="field"><label for="co-city">City</label><input id="co-city" name="city" autocomplete="address-level2" required></div>
          <div class="field"><label for="co-zip">Postcode</label><input id="co-zip" name="zip" autocomplete="postal-code" required></div>
        </div>
        <div class="checkout__pay">
          <p class="pdp__label">Payment</p>
          <p>Payment is not available in this demonstration. Completing the form will simulate a confirmation screen only.</p>
        </div>
        <p class="form-error" data-form-error role="alert"></p>
        <button class="pill pill--dark" type="submit">Complete demo order ${arrow}</button>
      </form>
      <aside class="checkout__summary" aria-labelledby="sum-title">
        <h2 class="pdp__label" id="sum-title">Order summary</h2>
        <ul>
          ${lines
            .map(
              (l) => `<li><span>${l.product.name} <small>${l.size.label || `${l.size.ml} ml`} × ${l.qty}</small></span><span>${formatPrice(l.total)}</span></li>`
            )
            .join('')}
        </ul>
        <p class="checkout__total"><span>Subtotal</span><span>${formatPrice(total)}</span></p>
        <p class="checkout__fine">Shipping and taxes would be calculated by a real checkout.</p>
      </aside>
    </div>
  </section>`;
}

export function confirmation() {
  return `
  <section class="page wrap wrap--narrow confirmation">
    ${eyebrow('Demonstration complete')}
    <h1 class="page__title">Thank you for <em>exploring.</em></h1>
    <p>This was a simulated checkout. <strong>No order was placed, no payment was taken</strong>, and the details you entered were not sent anywhere. Your demo bag has been cleared.</p>
    <p><a class="pill pill--dark" href="#/">Return to the Maison ${arrow}</a></p>
  </section>`;
}

export function info(page) {
  return `
  <section class="page wrap wrap--narrow">
    <nav class="crumbs" aria-label="Breadcrumb"><a href="#/">Maison</a><span aria-hidden="true">/</span><span aria-current="page">${page.title}</span></nav>
    <h1 class="page__title">${page.title}</h1>
    <div class="prose">${page.body.map((p) => `<p>${p}</p>`).join('')}</div>
  </section>`;
}

export function notFound() {
  return `
  <section class="page wrap wrap--narrow">
    ${eyebrow('Not found')}
    <h1 class="page__title">This page has <em>vanished.</em></h1>
    <p>Like a fragrance on the air, what you were looking for is no longer here.</p>
    <p><a class="pill pill--dark" href="#/">Return to the Maison ${arrow}</a></p>
  </section>`;
}

/* ------------------------------------------------------------------ */
/* Bag drawer contents                                                 */
/* ------------------------------------------------------------------ */
export function bagBody(lines) {
  if (!lines.length) {
    return `<div class="bag__empty">
      <p class="bag__empty-title">Your bag is empty.</p>
      <p>Begin with the Discovery Set, or explore the full collection.</p>
      <a class="text-link" href="#discovery" data-bag-close>The Discovery Set ${arrow}</a>
    </div>`;
  }
  return `<ul class="bag__lines">${lines
    .map((l) => {
      const im = l.product.images[0];
      return `<li class="line" data-line="${l.key}">
        <a class="line__media" href="#/fragrance/${l.product.slug}" data-bag-close tabindex="-1" aria-hidden="true">${img(im, { alt: '', sizes: '88px' })}</a>
        <div class="line__info">
          <a class="line__name" href="#/fragrance/${l.product.slug}" data-bag-close>${l.product.name}</a>
          <span class="line__size">${l.size.label || `${l.size.ml} ml`} · Eau de Parfum</span>
          <div class="line__controls">
            <div class="qty qty--sm" role="group" aria-label="Quantity for ${l.product.name}">
              <button type="button" data-line-qty="-1" aria-label="Decrease quantity of ${l.product.name}">−</button>
              <output aria-live="polite">${l.qty}</output>
              <button type="button" data-line-qty="1" aria-label="Increase quantity of ${l.product.name}" ${l.qty >= 10 ? 'disabled' : ''}>+</button>
            </div>
            <button type="button" class="line__remove" data-line-remove>Remove<span class="visually-hidden"> ${l.product.name}</span></button>
          </div>
        </div>
        <span class="line__price">${formatPrice(l.total)}</span>
      </li>`;
    })
    .join('')}</ul>`;
}

export function bagFoot(lines, total) {
  if (!lines.length) return `<button type="button" class="pill pill--outline pill--block" data-bag-close>Continue shopping</button>`;
  return `
    <p class="bag__subtotal"><span>Subtotal</span><span>${formatPrice(total)}</span></p>
    <p class="bag__fine">Shipping and taxes calculated at checkout.</p>
    <a class="pill pill--dark pill--block" href="#/checkout" data-bag-close>Proceed to demo checkout</a>
    <button type="button" class="pill pill--outline pill--block" data-bag-close>Continue shopping</button>`;
}
