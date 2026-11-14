# MAISON ÉTHER

*The Art of the Unseen.* A website concept for a fictional contemporary French niche perfume house.

> **Fictional design concept.** No products are sold. The shopping bag, checkout and newsletter are
> demonstrations that run entirely in the browser. **All imagery is placeholder artwork** that needs
> replacing with campaign photography (see [ASSETS.md](ASSETS.md)).

## Run locally

It is a static site with no build step:

```bash
npm start            # python3 -m http.server 4173
# open http://localhost:4173
```

Any static server works. The page has to be served over HTTP, not opened as `file://`, because it
uses ES modules.

## Deploy (GitHub Pages)

Push to the default branch and turn on **Settings → Pages → Deploy from branch → / (root)**.
Routing is hash-based (`#/fragrance/sillage`), so refreshing any view works on static hosting.
`404.html` sends unknown paths back to the root, and `.nojekyll` stops Jekyll processing.

## Structure

```
index.html            Shell: header, mobile menu, bag drawer, footer, SEO and Open Graph metadata
css/main.css          Design tokens, components, responsive layouts, motion and reduced-motion rules
js/data.js            Catalogue, journal articles and information pages
js/views.js           View templates (home, product, article, checkout, info) and the responsive image helper
js/bag.js             Demo bag state, saved to localStorage
js/app.js             Router, header, dialogs (focus trap, inert), hero slideshow, gallery, forms, reveals
assets/fonts/         Self-hosted Cormorant Garamond and Manrope (latin subset, woff2)
assets/img/           Responsive WebP placeholders
scripts/placeholders/ SVG scene library and renderer for the placeholder art
```

## What is real and what is a demo

| Feature | Status |
|---|---|
| Navigation, routing, product and article views | Working, client-side |
| Size and quantity selection, bag, subtotal, persistence | Working, saved in the browser's localStorage only |
| Checkout | **Demo.** Validates delivery fields, then shows a confirmation that clearly says no order was placed. No card fields; nothing is sent. |
| Newsletter | **Demo.** Validates the email, then says that no list is connected. Nothing is sent or stored. |
| Social links | Labels only; no accounts exist |

Going to production needs a commerce backend or payment provider (for example Shopify or Stripe
Checkout), a mailing-list provider, real photography, and an absolute canonical/OG URL in `index.html`.

## Accessibility and performance

- Semantic landmarks, one `h1` per view, skip link, visible focus styles, and a 44px+ tap target on
  every control.
- The menu and bag are modal dialogs: they trap focus, close on Escape, make the background inert,
  and return focus when they close.
- The hero slideshow can be paused, stops on hover, focus, a hidden tab or when scrolled out of view,
  and does not autoplay under `prefers-reduced-motion`.
- Motion uses transforms and opacity only. Reveals use IntersectionObserver. There is no scroll-linked
  JavaScript. The slow hero drift is off on touch devices.
- Images are responsive (`srcset`/`sizes`) with explicit dimensions so the layout doesn't shift. Images
  below the fold load lazily, and the hero is preloaded per breakpoint with an art-directed mobile crop.
