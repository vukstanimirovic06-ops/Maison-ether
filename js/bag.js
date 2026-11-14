/**
 * Demo shopping bag. State lives in memory and is mirrored to localStorage
 * when available. No order, payment or personal data ever leaves the browser.
 */
import { findItem } from './data.js';

const KEY = 'maison-ether:bag:v1';
const MAX_QTY = 10;
const listeners = new Set();

let items = load();

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    // Drop anything that no longer matches the catalogue.
    return Array.isArray(parsed)
      ? parsed.filter((i) => findItem(i.slug)?.sizes.some((s) => s.ml === i.ml) && i.qty > 0)
      : [];
  } catch {
    return [];
  }
}

function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
  } catch {
    /* storage unavailable (private mode, blocked) — keep working in memory */
  }
  listeners.forEach((fn) => fn(getLines()));
}

const keyOf = (slug, ml) => `${slug}:${ml}`;

export function getLines() {
  return items.map((i) => {
    const product = findItem(i.slug);
    const size = product.sizes.find((s) => s.ml === i.ml);
    return { ...i, key: keyOf(i.slug, i.ml), product, size, total: size.price * i.qty };
  });
}

export const count = () => items.reduce((n, i) => n + i.qty, 0);
export const subtotal = () => getLines().reduce((n, l) => n + l.total, 0);

export function add(slug, ml, qty = 1) {
  const existing = items.find((i) => i.slug === slug && i.ml === ml);
  if (existing) existing.qty = Math.min(MAX_QTY, existing.qty + qty);
  else items.push({ slug, ml, qty: Math.min(MAX_QTY, qty) });
  save();
}

export function setQty(key, qty) {
  const item = items.find((i) => keyOf(i.slug, i.ml) === key);
  if (!item) return;
  if (qty <= 0) items = items.filter((i) => i !== item);
  else item.qty = Math.min(MAX_QTY, qty);
  save();
}

export function remove(key) {
  items = items.filter((i) => keyOf(i.slug, i.ml) !== key);
  save();
}

export function clear() {
  items = [];
  save();
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export { MAX_QTY };

export const formatPrice = (n) =>
  new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);
