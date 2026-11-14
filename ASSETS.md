# Image assets — replacement list

**Every image in `assets/img/` is placeholder artwork.** The images are SVG scenes rendered by
`scripts/placeholders/` so the site can be reviewed with one consistent bottle design and lighting
scheme. They are not photographs and must not be presented as finished product imagery.
The site footer and Terms page say so.

To replace one, export the photograph at the largest width listed, then save WebP files at each
width using the same file names (`name-WIDTH.webp`). No code changes are needed.

| Name | Aspect | Widths | Use | Photo brief |
|---|---|---|---|---|
| `hero-sillage` | 16:9 | 960 / 1600 / 2400 | Desktop hero, slide 1 | Amber flacon on travertine, warm late sun from the right, long window shadows. Bottle in the right third, left 55% kept quiet for the headline. |
| `hero-sillage-m` | 2:3 | 600 / 900 / 1200 | Mobile hero, slide 1 | Same scene shot for portrait: bottle in the upper-centre, plain stone in the lower half for text. |
| `hero-lumiere`, `hero-lumiere-m` | as above | as above | Hero, slide 2 | Clear flacon, pale limestone, soft diffused daylight. |
| `hero-nocturne`, `hero-nocturne-m` | as above | as above | Hero, slide 3 | Smoked flacon, espresso stone, a single hard side light. |
| `product-{sillage,lumiere,nocturne}` | 4:5 | 640 / 1000 / 1600 | Collection cards, PDP main image, bag | Hero product still on a plinth. |
| `detail-{slug}-cap` | 4:5 | 640 / 1000 / 1600 | PDP gallery | Macro of the stone cap and label. |
| `detail-{slug}-light` | 4:5 | 640 / 1000 / 1600 | PDP gallery | Light passing through the liquid onto stone (caustics). |
| `philosophy-light` | 4:5 | 640 / 1000 / 1600 | The Maison | Sunlight raking across textured stone. |
| `philosophy-fabric` | 4:5 | 640 / 1000 / 1600 | The Maison | Translucent linen moving in daylight. |
| `craft-vessels` | 4:5 | 640 / 1000 / 1600 | The Craft | Glass laboratory vessels with raw materials. |
| `craft-amber` | 4:5 | 640 / 1000 / 1600 | The Craft | Light through amber liquid, macro. |
| `craft-materials` | 4:5 | 640 / 1000 / 1600 | The Craft | Resins and dried botanicals in a stone dish. |
| `discovery-set` | 4:3 | 800 / 1400 / 2000 | Discovery Set section and PDP | Ivory presentation box, three vials, lid leaning behind. |
| `discovery-detail` | 4:3 | 800 / 1400 / 2000 | Discovery Set PDP | Close-up of the three vials in the tray. |
| `journal-scent` | 4:5 | 640 / 1000 / 1600 | Journal 01 | Smoke or air moving through light on a dark ground. |
| `journal-light` | 4:5 | 640 / 1000 / 1600 | Journal 02 | Diffused light on a pale wall. |
| `journal-ritual` | 4:5 | 640 / 1000 / 1600 | Journal 03 | Fabric and skin in warm light. |
| `og.jpg` | 1200×630 | — | Open Graph share image | Crop of the Sillage hero. |

**Bottle architecture (keep it the same in every shot):** thick rectangular glass flacon with softly
bevelled vertical edges, a heavy clear base, a short cylindrical stone cap (travertine, limestone or
dark stone depending on the fragrance), and a small ivory label reading `MAISON ÉTHER`, then the
fragrance name, then `EAU DE PARFUM · 100 ML`.

To regenerate the placeholders: `npm install && npm run render:placeholders` (needs Playwright with
Chromium and Python 3 with Pillow).
