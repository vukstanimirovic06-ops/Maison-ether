/**
 * MAISON ÉTHER — application shell.
 * Plain-name hash routing keeps the site fully static (GitHub Pages friendly)
 * and works inside embedded previews that only pass simple "#name" hashes:
 *   (none) or #top            home
 *   #collection, #story …     home, scrolled to a section
 *   #fragrance-<slug>         product detail
 *   #journal-<slug>           journal article
 *   #checkout                 demonstration checkout
 *   #info-<page>              information pages
 */
import { findItem, findArticle, INFO_PAGES } from './data.js';
import * as bag from './bag.js';
import * as V from './views.js';

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const HOME_SECTIONS = ['collection', 'story', 'craft', 'discovery', 'journal', 'invitation', 'top'];

const view = $('[data-view]');
const header = $('[data-header]');
let currentRoute = null;
let cleanups = [];

/* ------------------------------------------------------------------ */
/* Meta                                                                */
/* ------------------------------------------------------------------ */
const DEFAULT_DESC = $('meta[name="description"]').content;
function setMeta(title, desc = DEFAULT_DESC, ld = null) {
  document.title = title;
  $('meta[name="description"]').content = desc;
  $('meta[property="og:title"]').content = title;
  $('meta[property="og:description"]').content = desc;
  $('#ld-page').textContent = ld ? JSON.stringify(ld) : '';
}

/* ------------------------------------------------------------------ */
/* Router                                                              */
/* ------------------------------------------------------------------ */
function parse() {
  let hash = decodeURIComponent(location.hash || '').slice(1);
  // Legacy "#/fragrance/sillage" style links map onto the plain names.
  if (hash.startsWith('/')) hash = hash.slice(1).replace('/', '-').replace(/\/$/, '');
  if (hash === 'main') return { name: 'skip' };
  if (!hash || HOME_SECTIONS.includes(hash)) return { name: 'home', section: hash || null };
  const m = hash.match(/^(fragrance|journal|info)-(.+)$/);
  if (m) return { name: m[1], param: m[2], section: null };
  if (hash === 'checkout' || hash === 'confirmation') return { name: hash, section: null };
  return { name: 'notfound', section: null };
}

function render() {
  const r = parse();
  if (r.name === 'skip') { $('#main').focus(); return; }
  const key = `${r.name}/${r.param || ''}`;

  if (key === currentRoute && r.name === 'home') {
    scrollToSection(r.section, true);
    return;
  }
  currentRoute = key;
  cleanups.forEach((fn) => fn());
  cleanups = [];
  closeMenu(false);
  closeBag(false);

  let html;
  document.body.classList.toggle('is-home', r.name === 'home');

  switch (r.name) {
    case 'home':
      html = V.home();
      setMeta('MAISON ÉTHER — Contemporary French Niche Perfumery');
      break;
    case 'fragrance': {
      const p = findItem(r.param);
      if (!p) { html = V.notFound(); setMeta('Not found — MAISON ÉTHER'); break; }
      html = V.product(p);
      setMeta(`${p.name} — ${p.slug === 'discovery-set' ? 'Discovery Set' : 'Eau de Parfum'} | MAISON ÉTHER`, p.description, {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: `${p.name}${p.slug === 'discovery-set' ? '' : ' Eau de Parfum'}`,
        description: p.description,
        image: `assets/img/${p.images[0]}-1000.webp`,
        brand: { '@type': 'Brand', name: 'MAISON ÉTHER' },
        category: 'Fragrance',
      });
      break;
    }
    case 'journal': {
      const a = findArticle(r.param);
      if (!a) { html = V.notFound(); setMeta('Not found — MAISON ÉTHER'); break; }
      html = V.article(a);
      setMeta(`${a.title} — Journal | MAISON ÉTHER`, a.dek, {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: a.title,
        description: a.dek,
        image: `assets/img/${a.image}-1000.webp`,
        publisher: { '@type': 'Organization', name: 'MAISON ÉTHER' },
      });
      break;
    }
    case 'checkout':
      html = V.checkout(bag.getLines(), bag.subtotal());
      setMeta('Demo Checkout — MAISON ÉTHER', 'Demonstration checkout for the MAISON ÉTHER design concept. No payment is taken.');
      break;
    case 'confirmation':
      html = V.confirmation();
      setMeta('Demonstration complete — MAISON ÉTHER');
      break;
    case 'info': {
      const page = INFO_PAGES[r.param];
      if (!page) { html = V.notFound(); setMeta('Not found — MAISON ÉTHER'); break; }
      html = V.info(page);
      setMeta(`${page.title} — MAISON ÉTHER`);
      break;
    }
    default:
      html = V.notFound();
      setMeta('Not found — MAISON ÉTHER');
  }

  view.innerHTML = html;
  view.classList.remove('view--in');
  void view.offsetWidth; // restart the entrance transition
  view.classList.add('view--in');

  if (r.name === 'home') {
    initHero();
    initTrack();
    initNewsletter();
  }
  if (r.name === 'fragrance') { initGallery(); initBuy(); }
  if (r.name === 'checkout') initCheckout();

  initReveals();
  updateHeader();
  markActiveNav();

  if (r.section) {
    requestAnimationFrame(() => scrollToSection(r.section, false));
  } else {
    window.scrollTo({ top: 0, behavior: 'instant' });
    if (r.name !== 'home') $('#main').focus({ preventScroll: true });
  }
}

function scrollToSection(id, smooth) {
  if (!id || id === 'top') {
    window.scrollTo({ top: 0, behavior: smooth && !reduceMotion.matches ? 'smooth' : 'instant' });
    return;
  }
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: smooth && !reduceMotion.matches ? 'smooth' : 'instant', block: 'start' });
  // Move focus for keyboard and screen-reader users without a second jump.
  const heading = el.querySelector('h2');
  if (heading) {
    heading.setAttribute('tabindex', '-1');
    heading.focus({ preventScroll: true });
  }
}

/* ------------------------------------------------------------------ */
/* Header                                                              */
/* ------------------------------------------------------------------ */
function updateHeader() {
  const solid = !document.body.classList.contains('is-home') || window.scrollY > 40;
  header.classList.toggle('is-solid', solid);
}
window.addEventListener('scroll', updateHeader, { passive: true });

function markActiveNav() {
  $$('[data-nav]').forEach((a) => a.removeAttribute('aria-current'));
  if (!document.body.classList.contains('is-home')) return;
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        $$('[data-nav]').forEach((a) => a.toggleAttribute('aria-current', a.dataset.nav === e.target.id));
      });
    },
    { rootMargin: '-45% 0px -50% 0px' }
  );
  ['collection', 'story', 'craft', 'discovery', 'journal'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) io.observe(el);
  });
  cleanups.push(() => io.disconnect());
}

/* ------------------------------------------------------------------ */
/* Dialog helpers (menu + bag)                                         */
/* ------------------------------------------------------------------ */
let lastFocus = null;
const backgroundEls = () => [header, $('#main'), $('.site-footer')];

function trapFocus(container, e) {
  if (e.key !== 'Tab') return;
  const f = $$('a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])', container).filter((el) => el.offsetParent !== null);
  if (!f.length) return;
  const first = f[0], last = f[f.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

function openDialog(el, focusSel) {
  lastFocus = document.activeElement;
  el.hidden = false;
  document.body.classList.add('no-scroll');
  backgroundEls().forEach((b) => b !== el && b.setAttribute('inert', ''));
  // Two frames: let the element render closed first so the transition runs.
  requestAnimationFrame(() => requestAnimationFrame(() => {
    el.classList.add('is-open');
    ($(focusSel, el) || el).focus({ preventScroll: true });
  }));
}

function closeDialog(el, restore = true) {
  if (el.hidden) return;
  el.classList.remove('is-open');
  document.body.classList.remove('no-scroll');
  backgroundEls().forEach((b) => b.removeAttribute('inert'));
  const done = () => { if (!el.classList.contains('is-open')) el.hidden = true; };
  if (reduceMotion.matches) done();
  else setTimeout(done, 520);
  if (restore && lastFocus) lastFocus.focus({ preventScroll: true });
}

/* Mobile menu */
const menu = $('#menu');
const menuBtn = $('[data-menu-open]');
function openMenu() { openDialog(menu, '.menu__nav a'); menuBtn.setAttribute('aria-expanded', 'true'); }
function closeMenu(restore = true) { closeDialog(menu, restore); menuBtn.setAttribute('aria-expanded', 'false'); }
menuBtn.addEventListener('click', openMenu);
menu.addEventListener('click', (e) => {
  const link = e.target.closest('[data-menu-close]');
  if (!link) return;
  // Links navigate via hashchange; close without returning focus to the toggle.
  closeMenu(!link.matches('a'));
  // Same-hash clicks do not fire hashchange; handle them explicitly.
  if (link.matches('a') && link.getAttribute('href') === location.hash) {
    e.preventDefault();
    scrollToSection(location.hash.slice(1), true);
  }
});
menu.addEventListener('keydown', (e) => trapFocus(menu, e));
window.matchMedia('(min-width: 1024px)').addEventListener('change', (m) => m.matches && closeMenu(false));

/* Bag drawer */
const bagEl = $('#bag');
function openBag() { renderBag(); openDialog(bagEl, '.bag__head .icon-btn'); }
function closeBag(restore = true) { closeDialog(bagEl, restore); }

document.addEventListener('click', (e) => {
  if (e.target.closest('[data-bag-open]')) openBag();
  const closer = e.target.closest('[data-bag-close]');
  if (closer && bagEl.contains(closer)) closeBag(!closer.matches('a'));
});
bagEl.addEventListener('keydown', (e) => trapFocus(bagEl, e));
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  if (!bagEl.hidden) closeBag();
  if (!menu.hidden) closeMenu();
});

bagEl.addEventListener('click', (e) => {
  const line = e.target.closest('[data-line]');
  if (!line) return;
  const key = line.dataset.line;
  const current = bag.getLines().find((l) => l.key === key);
  if (!current) return;
  const step = e.target.closest('[data-line-qty]');
  if (step) {
    const next = current.qty + Number(step.dataset.lineQty);
    bag.setQty(key, next);
    // Keep focus on the matching control after re-render.
    const sel = next <= 0 ? '.bag__head .icon-btn' : `[data-line="${key}"] [data-line-qty="${step.dataset.lineQty}"]`;
    requestAnimationFrame(() => ($(sel, bagEl) || $('.bag__head .icon-btn', bagEl)).focus());
    if (next <= 0) toast(`${current.product.name} removed from your bag`);
  }
  if (e.target.closest('[data-line-remove]')) {
    bag.remove(key);
    toast(`${current.product.name} removed from your bag`);
    requestAnimationFrame(() => $('.bag__head .icon-btn', bagEl).focus());
  }
});

function renderBag() {
  const lines = bag.getLines();
  $('[data-bag-body]').innerHTML = V.bagBody(lines);
  $('[data-bag-foot]').innerHTML = V.bagFoot(lines, bag.subtotal());
  const n = bag.count();
  $('[data-bag-count-label]').textContent = n ? `(${n})` : '';
}

function renderCount() {
  const n = bag.count();
  $$('[data-bag-count]').forEach((el) => {
    el.textContent = n;
    el.classList.toggle('has-items', n > 0);
  });
}
bag.subscribe(() => { renderCount(); if (!bagEl.hidden) renderBag(); });

/* ------------------------------------------------------------------ */
/* Toast                                                               */
/* ------------------------------------------------------------------ */
let toastTimer;
function toast(msg) {
  const t = $('[data-toast]');
  t.textContent = msg;
  t.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('is-visible'), 3200);
}

/* ------------------------------------------------------------------ */
/* Hero slideshow                                                      */
/* ------------------------------------------------------------------ */
function initHero() {
  const hero = $('[data-hero]');
  if (!hero) return;
  const slides = $$('[data-slide]', hero);
  const captions = $$('[data-caption]', hero);
  const dots = $$('[data-goto]', hero);
  const pauseBtn = $('[data-pause]', hero);
  const INTERVAL = 7000;
  let index = 0;
  let timer = null;
  let userPaused = reduceMotion.matches;
  let hoverPaused = false;

  // Defer non-active slides until the first image is ready (keeps LCP lean).
  const firstImg = $('img', slides[0]);
  const reveal = () => hero.classList.add('is-ready');
  if (firstImg.complete) reveal(); else firstImg.addEventListener('load', reveal, { once: true });
  setTimeout(reveal, 1500);

  function go(i) {
    index = (i + slides.length) % slides.length;
    slides.forEach((s, k) => {
      s.classList.toggle('is-active', k === index);
      s.toggleAttribute('aria-hidden', k !== index);
      const im = $('img', s);
      if (k === index && !im.alt) im.alt = ''; // decorative duplicates stay silent
    });
    captions.forEach((c, k) => {
      c.classList.toggle('is-active', k === index);
      c.toggleAttribute('aria-hidden', k !== index);
      c.tabIndex = k === index ? 0 : -1;
    });
    dots.forEach((d, k) => { d.classList.toggle('is-active', k === index); d.setAttribute('aria-pressed', String(k === index)); });
    hero.dataset.tone = slides[index].dataset.tone;
    restartProgress();
  }

  function restartProgress() {
    dots.forEach((d) => d.classList.remove('is-running'));
    if (isRunning()) {
      void dots[index].offsetWidth;
      dots[index].classList.add('is-running');
    }
  }

  const isRunning = () => !userPaused && !hoverPaused && !document.hidden;

  function schedule() {
    clearInterval(timer);
    timer = null;
    if (isRunning()) timer = setInterval(() => go(index + 1), INTERVAL);
    hero.classList.toggle('is-paused', !isRunning());
    restartProgress();
  }

  function setPaused(p) {
    userPaused = p;
    pauseBtn.setAttribute('aria-label', p ? 'Play slideshow' : 'Pause slideshow');
    pauseBtn.classList.toggle('is-paused', p);
    schedule();
  }

  dots.forEach((d) => d.addEventListener('click', () => { go(Number(d.dataset.goto)); schedule(); }));
  pauseBtn.addEventListener('click', () => setPaused(!userPaused));
  const content = $('.hero__content', hero);
  content.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') { hoverPaused = true; schedule(); } });
  content.addEventListener('pointerleave', () => { hoverPaused = false; schedule(); });
  hero.addEventListener('focusin', () => { hoverPaused = true; schedule(); });
  hero.addEventListener('focusout', (e) => { if (!hero.contains(e.relatedTarget)) { hoverPaused = false; schedule(); } });
  const onVis = () => schedule();
  document.addEventListener('visibilitychange', onVis);

  // Pause when the hero scrolls out of view.
  const io = new IntersectionObserver(([e]) => { hoverPaused = !e.isIntersecting; schedule(); }, { threshold: 0.2 });
  io.observe(hero);

  setPaused(userPaused);
  go(0);
  cleanups.push(() => { clearInterval(timer); io.disconnect(); document.removeEventListener('visibilitychange', onVis); });
}

/* ------------------------------------------------------------------ */
/* Collection track position (mobile swipe)                            */
/* ------------------------------------------------------------------ */
function initTrack() {
  const track = $('[data-track]');
  const pos = $('[data-track-pos]');
  if (!track || !pos) return;
  const cards = $$('.fragrance', track);
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => { if (e.isIntersecting) pos.textContent = `0${cards.indexOf(e.target) + 1}`; }),
    { root: track, threshold: 0.6 }
  );
  cards.forEach((c) => io.observe(c));
  cleanups.push(() => io.disconnect());
}

/* ------------------------------------------------------------------ */
/* Scroll reveals                                                      */
/* ------------------------------------------------------------------ */
function initReveals() {
  const els = $$('[data-reveal]');
  if (reduceMotion.matches || !('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('is-in'));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    }),
    { rootMargin: '0px 0px -8% 0px', threshold: 0.12 }
  );
  els.forEach((el) => io.observe(el));
  cleanups.push(() => io.disconnect());
}

/* ------------------------------------------------------------------ */
/* Product gallery                                                     */
/* ------------------------------------------------------------------ */
function initGallery() {
  const g = $('[data-gallery]');
  if (!g) return;
  const slides = $$('[data-gslide]', g);
  const thumbs = $$('[data-thumb]', g);
  const count = $('[data-gcount]', g);
  let i = 0;
  const show = (n) => {
    i = (n + slides.length) % slides.length;
    slides.forEach((s, k) => { s.classList.toggle('is-active', k === i); s.toggleAttribute('aria-hidden', k !== i); });
    thumbs.forEach((t, k) => { t.classList.toggle('is-active', k === i); t.setAttribute('aria-pressed', String(k === i)); });
    count.textContent = i + 1;
  };
  thumbs.forEach((t) => t.addEventListener('click', () => show(Number(t.dataset.thumb))));
  $('[data-gprev]', g).addEventListener('click', () => show(i - 1));
  $('[data-gnext]', g).addEventListener('click', () => show(i + 1));
  g.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') show(i - 1);
    if (e.key === 'ArrowRight') show(i + 1);
  });
  // Touch swipe on the stage
  const stage = $('[data-gstage]', g);
  let x0 = null;
  stage.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') x0 = e.clientX; });
  stage.addEventListener('pointerup', (e) => {
    if (x0 === null) return;
    const dx = e.clientX - x0;
    if (Math.abs(dx) > 40) show(i + (dx < 0 ? 1 : -1));
    x0 = null;
  });
}

/* ------------------------------------------------------------------ */
/* Add to bag                                                          */
/* ------------------------------------------------------------------ */
function initBuy() {
  const form = $('[data-buy]');
  if (!form) return;
  const slug = $('[data-pdp]').dataset.pdp;
  const product = findItem(slug);
  const qty = form.elements.qty;
  const priceEl = $('[data-price]', form);

  const clampQty = () => {
    const n = Math.max(1, Math.min(bag.MAX_QTY, Math.round(Number(qty.value) || 1)));
    qty.value = n;
    return n;
  };
  const updatePrice = () => {
    const ml = Number(form.querySelector('input[name="size"]:checked').value);
    const s = product.sizes.find((x) => x.ml === ml);
    priceEl.textContent = bag.formatPrice(s.price * clampQty());
  };

  form.addEventListener('change', updatePrice);
  qty.addEventListener('input', () => { if (qty.value !== '') updatePrice(); });
  $$('[data-qty]', form).forEach((b) =>
    b.addEventListener('click', () => { qty.value = clampQty() + Number(b.dataset.qty); updatePrice(); })
  );
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const ml = Number(form.querySelector('input[name="size"]:checked').value);
    const n = clampQty();
    bag.add(slug, ml, n);
    const btn = $('.buy__add', form);
    btn.classList.add('is-added');
    $('span', btn).textContent = 'Added';
    setTimeout(() => { btn.classList.remove('is-added'); $('span', btn).textContent = 'Add to Bag'; }, 1600);
    openBag(); // the drawer itself confirms the addition
  });
}

/* ------------------------------------------------------------------ */
/* Newsletter (demo)                                                   */
/* ------------------------------------------------------------------ */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
function initNewsletter() {
  const form = $('[data-newsletter]');
  if (!form) return;
  const input = form.elements.email;
  const msg = $('#nl-msg');
  const set = (text, state) => {
    msg.textContent = text;
    form.dataset.state = state;
    input.setAttribute('aria-invalid', String(state === 'error'));
  };
  input.addEventListener('input', () => { if (form.dataset.state === 'error' && EMAIL_RE.test(input.value.trim())) set('', ''); });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const v = input.value.trim();
    if (!v) { set('Please enter your email address.', 'error'); input.focus(); return; }
    if (!EMAIL_RE.test(v)) { set('Please enter a valid email address, for example name@domain.com.', 'error'); input.focus(); return; }
    const btn = form.querySelector('button');
    btn.disabled = true;
    set('One moment…', 'loading');
    setTimeout(() => {
      btn.disabled = false;
      input.value = '';
      set('Thank you. This is a demonstration — no mailing list is connected, so your address was not sent or stored.', 'success');
    }, 700);
  });
}

/* ------------------------------------------------------------------ */
/* Demo checkout                                                       */
/* ------------------------------------------------------------------ */
function initCheckout() {
  const form = $('[data-checkout]');
  if (!form) return;
  const err = $('[data-form-error]', form);
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const invalid = [...form.elements].filter((el) => el.required && (!el.value.trim() || (el.type === 'email' && !EMAIL_RE.test(el.value.trim()))));
    [...form.elements].forEach((el) => el.required && el.setAttribute('aria-invalid', String(invalid.includes(el))));
    if (invalid.length) {
      err.textContent = `Please complete ${invalid.length === 1 ? 'the highlighted field' : `the ${invalid.length} highlighted fields`}.`;
      invalid[0].focus();
      return;
    }
    bag.clear();
    location.hash = '#confirmation';
  });
}

/* ------------------------------------------------------------------ */
/* Boot                                                                */
/* ------------------------------------------------------------------ */
// Same-hash anchor clicks (e.g. pressing "Collection" twice) should still scroll.
document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href^="#"]');
  if (!a || e.defaultPrevented || a.closest('#menu')) return;
  if (a.getAttribute('href') === location.hash && document.body.classList.contains('is-home')) {
    e.preventDefault();
    scrollToSection(location.hash.slice(1), true);
  }
});

window.addEventListener('hashchange', render);
$$('[data-year]').forEach((el) => (el.textContent = new Date().getFullYear()));
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
renderCount();
render();
requestAnimationFrame(() => document.body.classList.remove('is-loading'));
