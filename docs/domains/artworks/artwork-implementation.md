# Artwork Implementation

Version: 1.0
Document ID: DOC-ART-IMP
Project: Del Carmen Digital Experience
Parent Brand: Rō Visual
Document Type: Implementation
Owner: Del Carmen Digital Experience
Last Updated: 2026-10-16
Status: Implemented for review; full-project build and visual/device verification pending.

## Ownership and scope

The current source catalogue is canonical Artwork data; ArtworkSeries remains its canonical grouping. HomeCuration owns the Featured reference. Recognition records reference Artwork IDs without becoming artwork categories or Home flags.

This implementation adds explicit realisation state and consistent status/distinction labels to current presentation. Cart, checkout, public price design, prints, commissions and the downloadable sales catalogue remain a later commercial stage. No payment, product or inventory service is introduced.

## Catalogue state

Every supplied record now has `creationStatus`. No date comparison determines it.

| State | Presentation | Immediate completed-piece availability |
| --- | --- | --- |
| `planned` | Coming soon; Planned for the recorded year; preview identification | False |
| `in-progress` | In progress; planned year | False |
| `completed` | Recorded year and ordinary availability label | Depends on `availability` |

Availability remains independent, with `unavailable` added alongside `available`, `reserved` and `sold`. Only `completed` + `available` passes the state helper. A positive price does not override artistic state or constitute a purchase offer.

Four user-confirmed projects are migrated to planned/unavailable:

| ID | Artwork | Planned year |
| --- | --- | --- |
| `buda` | Buda | 2027 |
| `margarita` | Margarita | 2027 |
| `recordando_mi_puerto` | Recordando Mi Puerto | 2027 |
| `la_mujer_del_bosque` | La Mujer Del Bosque | 2027 |

Their primary alt text identifies a planned artwork preview. Paths, pixel dimensions, artistic dimensions, classifications, series relationships, years and stored prices retain their existing values. Other records retain their previous completed-work meaning, now made explicit; this is not an independent physical-inventory audit. Future records must choose their state explicitly.

Planned work may remain visible in the archive and its series. It must not be silently removed, relabelled sold/reserved or presented as a completed physical piece ready for immediate purchase. A future commercial implementation must revalidate state, offer, price, currency and availability on the server.

## Recognition and Featured

`ArtworkRecognition` records contain a stable ID, Artwork ID, kind, title, event and year. The supported kinds are award, honourable mention and selection. A selection receives `Official Selection`, a mention `Honourable Mention`, and an actual award `Award-winning`, with the recorded title/event/year explaining the distinction.

The only seeded record is:

| Artwork | Distinction | Event | Year | Existing source |
| --- | --- | --- | --- | --- |
| Sendero del Sol | Honourable Mention | La No Bienal — 5th edition | 2024 | Artist / The Journey, 2023–Present paragraph |

The source narrative is `src/domains/artist/sections/journey/TheJourney.tsx`. Its text remains untouched. No unverified institution, event URL, award or selection is invented. To publish another recognition, confirm its Artwork ID, type, name, event and year and add a record to the recognition dataset. Factual corrections should also review any Artist narrative that mentions the event.

Featured follows `homeCuration.featuredWork.artworkId`, currently Sendero del Sol. The same work therefore displays both its mention and Featured. Changing that reference changes the derived badge; no second boolean or duplicate Home selection is maintained in Artwork.

The presentation query is intentionally separate from the canonical Artwork interface. Its input join reads the reference-only Home curation data, current artwork fields and recognition references, and produces status, year/preview wording and badge descriptors. No dynamic provider or database lookup is involved.

## Current presentation surfaces

| Surface | Integration |
| --- | --- |
| Home Selected Works, Archive and Series cards | Shared CollectionArtwork overlay; planned-year text; accessible action includes labels. Existing aspect ratio, image crop and hover motion are retained. |
| Home Featured Work | Distinctions below the existing metadata, using the current Featured reference. |
| Shared lightbox, standard and glass presentations | Labels overlay the artwork stage outside zoom. The six caption rows, position dots, image constraints, scroll masks and controls retain their source. Planned year replaces the year text without adding caption rows. |
| Standard artwork detail | Shared labels with event/year detail; planned preview and planned-year label; display status comes from the same query. Viewer and column sizes are retained. |
| Glass Artbook information page | Same label/status/year data via the optional runtime callback; event/year and planned preview information in the existing scrollable info. |

Labels use the existing sans typography, bronze/gold tokens, thin outline and translucent dark backing. They have no new animated glow or gesture handlers. The card/lightbox overlays do not consume layout height or intercept pointer input. Artbook labels change information markup only, not leaf material or motion.

The Glass runtime retains its standalone fallback when no presentation callback is supplied. The published React wrapper always supplies the canonical query; install that wrapper with the new helper/types/runtime as one update.

## Preserved implementation boundaries

- Rigid leaf geometry, page-turn physics, queue acceleration, reflection/corner intensity and optical shaders retain their bytes outside the info-render function.
- The full Glass CSS and lightbox CSS are unchanged, including masks, scroll constraints, mobile/tablet orientation rules and six caption slots.
- ArtworkDetailViewer, responsive entry and kinetic experience remain unchanged.
- HomeCuration values, series covers, gallery/filter routing, IDs/slugs and image paths are unchanged.
- New recognition data does not alter authorship or classify a master copy as original authorship.
- Current Contact, Newsletter, consent, retention, legal notices, Journal and About changes remain intact.

## Installation

The ZIP is a patch, not a replacement for complete project folders. Copy these **13 source files** to the matching paths, creating new files where needed:

- `src/domains/artworks/model/artwork.ts`
- `src/domains/artworks/model/artworkRecognition.ts`
- `src/domains/artworks/data/artworks.ts`
- `src/domains/artworks/data/artworkRecognitions.ts`
- `src/domains/artworks/presentation/getArtworkPresentation.ts`
- `src/shared/ui/artwork/ArtworkBadges.tsx`
- `src/shared/ui/artwork/ArtworkLightbox.tsx`
- `src/domains/home/sections/collection/CollectionArtwork.tsx`
- `src/domains/home/sections/featuredArtwork/FeaturedArtwork.tsx`
- `src/domains/artworks/components/ArtworkDetailScene.tsx`
- `src/domains/artworks/components/glass-artbook/ArtworkGlassArtbook.tsx`
- `src/domains/artworks/components/glass-artbook/types.ts`
- `src/domains/artworks/components/glass-artbook/runtime.mjs`

Update these **three canonical documents**:

- `docs/domains/artworks/artwork-model.md`
- `docs/domains/artworks/artwork-implementation.md`
- `docs/architecture/repository-structure.md`

The ZIP has 16 entries. No extra integration-review README is added. The two previously removed root integration-review documents remain removed in the continuing source snapshot and are not shipped.

No new environment variable or dependency is required. The dataset and required model field belong together: do not install only the interface or only part of the presentation helper/runtime bridge.

## Validation record

Eighteen isolated scenarios pass using the real compiled catalogue, presentation query, TSX components and the extracted actual Glass info-render function. React hooks/portals, Next/layout wrappers, CSS module tokens and GSAP are stand-ins; no browser, external service or physical media is accessed.

Coverage includes explicit state for 45 artworks; exactly four planned/unavailable records; unchanged prices/paths/classification/dimensions; year independence; ordinary commercial status labels; the existing mention and reference integrity; Featured following Home curation; synthetic award/selection semantics without publishing fixtures; accessible badge output; card click/layout; standard detail; Home Featured; both lightbox presentations and their six caption slots; Glass metadata and escaping.

For the other 40 completed works without distinctions, the Glass info markup is byte-identical to the previous output. Outside its info-render function, the entire Glass runtime is byte-identical to the previous source. The CSS, responsive entry/viewer/kinetic modules and the preserved portions of card/Featured/lightbox motion/input source are checked separately.

All 214 TS/TSX/MTS/MJS files in this source snapshot parse. Relative to the previous Contact-feedback source, nine source files change and four are added; the other 206 source files are byte-identical. The two authorised documentation deletions are retained separately.

Rolando supplied a successful Next.js 16.2.12 webpack build and TypeScript run for the preceding baseline on 16 October. This new patch has not been built against that complete project: package/configuration root, installed dependencies and `public/` are not supplied here. After installation, run the project's `npm run build`, then inspect Archive/Series cards, Sendero del Sol and the four previews in standard and glass views across desktop, phone and tablet. Actual badge placement, contrast, scroll and touch behavior remain part of that visual/device review.

## Commercial continuation

The next sales work can use the explicit state and recognition data while keeping Product/offer separate from Artwork. Public price layout, original physical piece versus printed reproduction/painted commission, stock/variants, cart, ordering/payment, shipping/returns and the PDF catalogue still require their concrete commercial decisions. This patch does not make those capabilities live.
