# Artwork Implementation

Version: 1.7
Document ID: DOC-ART-IMP
Project: Del Carmen Digital Experience
Parent Brand: Rō Visual
Document Type: Implementation
Owner: Del Carmen Digital Experience
Last Updated: 2026-10-17
Status: Implemented in the integration patch; full-project build and visual/device verification pending.

## Ownership and scope

Artwork remains canonical artwork data. ArtworkSeries remains the canonical grouping behind Collections. HomeCuration owns the Featured reference. Recognition records reference Artwork IDs without becoming artwork categories, sale states or duplicated Home flags.

This implementation combines the existing realisation-state foundation with the approved Halo presentation. Cart, checkout, public price design, printed editions, commissions, the sales PDF, EN/ES and persistent database integration remain separate next stages. No payment provider, environment variable or package dependency is introduced.

## Catalogue state and factual boundaries

The 45 records retain their supplied data. Four projects have explicit `planned` / `unavailable` state: `buda`, `margarita`, `recordando_mi_puerto` and `la_mujer_del_bosque`, all planned for 2027. Other entries retain their previous completed-work meaning. This is not an independent physical-inventory audit.

State is explicit; year and positive price never infer completion or purchase availability. Only `completed` plus `available` passes `isArtworkAvailable()`. Future commerce must additionally validate the physical-piece/edition offer, price/currency, stock and delivery on the server.

| State | Public presentation |
| --- | --- |
| `planned` | Coming Soon; planned year; frosted preview |
| `in-progress` | In Progress; planned year; frosted preview |
| `completed` | Recorded year and existing availability: Available, Reserved, Sold or Not available |

A sold unique original uses **Sold**. Exhausted print/edition stock and its Sold Out presentation belong to the future offer model.

The only published recognition remains **Sendero del Sol — Honourable Mention, La No Bienal, fifth edition, 2024**, sourced from the approved Artist Journey narrative. No example awards, mentions or selections from the prototypes are seeded into the catalogue. Featured is derived from `homeCuration.featuredWork.artworkId`, currently Sendero del Sol, and remains independent of recognition and availability.

## Approved Halo identity

`getArtworkPresentation()` returns derived badge descriptors with stable ID, semantic `kind`, label and optional detail. Symbols are selected by kind rather than matching display copy:

| Kind | Symbol | Public label |
| --- | --- | --- |
| `featured` | Star | Featured |
| `honourable-mention` | Medal | Honourable Mention |
| `award` | Trophy | Award |
| `selection` | Circled check | Official Selection |
| `planned` | Hourglass | Coming Soon in the preview |
| `in-progress` | Clock | In Progress in the preview |

`ArtworkBadges` uses the approved small uppercase Geist text: 10px, weight 400, line-height 1.5 and .055em tracking. The luminous bronze gradient is `#b18955 → #f0d5a3 → #c49759`. Its icon halo stays inside the glyph box. The underline appears on hover/focus and persists while details are open. There is no permanent rectangular badge frame or ribbon background in the below-image treatment.

## Presentation surfaces

| Surface | Placement and interaction |
| --- | --- |
| Home Selected Works, Archive and Series cards | Existing 4:5 image/title/year/hover composition. Top-right vertical symbols on 40% black; card rollover or keyboard focus reveals labels and details. A badge tap opens its label without opening the artwork. The main artwork action remains a sibling, avoiding nested buttons. |
| Collections preview strip | Same insignia family inside the existing linked image. Passive labels expand on link hover/focus. The link retains its single navigation action and the existing strip/hero motion. |
| Home Featured Work | Below the image, aligned to its painted left edge. Existing metadata remains in place. |
| Shared lightbox | Below the painted image, outside zoom and aligned to its left edge. Position dots and caption retain their dedicated areas. |
| Standard detail | Below the image; the technical sheet keeps its established typography, fields and columns. Status remains in the technical sheet. |
| Glass Artbook | Below the artwork on the left page, aligned to its masked image bounds. Two stable React ribbon slots belong to their actual art faces. Their separate page-local reveal windows inherit the painting’s native leaf perspective and clip the downward exit at that page’s edge. The source descends while closing and the destination rises while expanding. |

All thumbnail cards, including planned and in-progress works, retain the established full technical rollover and keyboard-focus reveal: title, medium/support, dimensions, year and Discover. The thumbnail-only Coming Soon/In Progress group sits higher, leaving the revealed title clear. Card aspect ratios, type, image dimensions and the metadata animation remain unchanged.

The below-image ribbon scrolls slowly back and forth only when its labels overflow. It pauses on hover, keyboard focus, touch dragging, open details, hidden documents, an explicit pause control or reduced-motion preference. Horizontal drag and arrow keys allow manual reading. A detail popover uses existing overlay space; Escape closes it and restores focus. No ticker is mounted for fitting labels or thumbnail rails.

Gesture ownership is explicit: the Halo band does not initiate kinetic scene navigation, book turns or corner-proximity motion. Its pointer/wheel events and the native navigation guards isolate its own reading interaction.

## Image size, masks and available space

`ArtworkImageHighlights` measures the actual object-contain painted rectangle, including letterboxing. It does not resize the artwork. It uses available space beneath the painting first. When the lightbox needs extra clearance, its panel and navigation band grow by the same amount, preserving image-stage dimensions. Native vertical scrolling remains available for that additional space. An ordinary work with no distinction reserves no Halo band.

In the glass lightbox, a stationary `imageMask` clips the transformed zoom layer. The below-image ribbon is outside this mask. The six technical-caption slots, description expansion and established orientation compositions remain separate from the new band.

The runtime aligns each ribbon in the local coordinates of its own artwork face, including resize/image-load changes. The face supplies native 3D projection; screen-space image bounds are not used for positioning. It retains the approved leaf sizes, image enlargement, rigid geometry, masks, optical reflection at 60%, corner intensity at 90%, warm accents and turn/navigation dynamics.

## Coming Soon

`artworkPreviewMarkup()` supplies the same frosted preview to the React component and the book callback. Only faint reference colours/forms remain visible: blur 26px, saturation .7 and opacity .2. The upcoming image is not exposed through the standard viewer's expand action. Planned cards, Collections previews, both lightbox presentations and the book use this treatment.

The hourglass has a dedicated 23px centred wrapper. The label group is a flex column with a **5px gap** at **38% from the top**. This preserves the corrected alignment even after the icon is rendered. The thumbnail variant places the group at `calc(15% + 20px)` from the top; up to 180px wide it uses `calc(10% + 20px)` and an 18px symbol. The requested adjustment is a fixed 20 CSS pixels downward at both breakpoints. The default treatment keeps the approved 38% position (20% in previews up to 180px wide). Type adapts down in these smallest previews. The 5px icon-to-label gap, frosted colours and opacity remain unchanged. Existing card titles and planned-year copy remain responsible for identifying the work.

This is visual concealment, not access control: the existing reference media remains a public site asset. A genuinely private unreleased image would need a separate non-public media policy later.

## Featured Collection

`isFeaturedArtworkSeries(seriesId)` reads `homeCuration.featuredCollection.seriesId`, currently `yasemi`. `FeaturedSeriesBadge` uses the existing Halo star, uppercase 10px Geist label and luminous bronze gradient, with an inline 15px footprint in the established eyebrow. It is a descriptive curatorial marker with no invented award or extra navigation action.

Home Featured Collection, the selected Collections hero and its Series detail header use the same query and marker. Other Series retain Artwork Series. Chronology, Series status, descriptions, layouts and CollectionHeroMotion remain unchanged. The marker does not confer Featured or a prize on every artwork in that Series.

## Book insignias on their physical pages

Two stable React ribbon hosts each have their own transparent `ga-highlights-window`. The runtime reparents the complete window directly into the physical face that owns its artwork. The window lies above the face content/reflection at z-index 6, uses the face’s rounded profile and clips only the local insignia exit. The painting, rigid leaf, corner accents and existing content mask keep their own geometry and overflow.

| Turn | Source insignia owner | Destination insignia owner |
| --- | --- | --- |
| Next | Resting left artwork leaf | Turning back artwork face |
| Previous | Turning front artwork face | Resting left artwork leaf |

The windows therefore inherit the same native transforms and camera perspective as their paintings. The badge does not stay floating over the scene while its image moves. Page-local clipping keeps its downward slide inside the owning page until it leaves that page’s lower edge; the rigid sheet itself is not cropped or resized.

`syncHighlights()` runs from the same `render()` used by actual pointer moves and the existing spring loop. During 0–90 degrees the source moves downward; during 90–180 degrees the destination rises with the expanding page. Holding a dragged page holds the matching offset. Reversing beyond the midpoint retracts the destination and restores the source before cancellation. Neither slot fades out; only the existing opening sequence hides the band.

`onHighlightArtwork(slot, artwork)` keeps the two portal data slots populated with source/destination content. The portal host and its React children stay mounted while their containing window moves between physical faces. A readiness marker prevents a pending destination portal from displaying the prior work. Completed turns reparent the already revealed destination to the resting artwork leaf; cancellations return the same source. Both transfers happen synchronously in the existing render step, with no post-turn return timer or remount at completion.

Image alignment reads untransformed face-local image offsets and dimensions, including the image’s approved local scale. It clamps the visible painting bounds to the physical leaf and caches unchanged geometry. Alignment never derives local placement from a perspective-distorted screen rectangle. Open distinction detail height also uses local offset measurements, so perspective does not change the clipping distance.

Both ribbons become inert during a turn; the inactive host remains inert at rest and its ticker reading pauses. `aria-hidden` follows opening/readiness and full visual displacement, independently of the interaction lock. The current artwork, image-expansion action, Exit destination and browser history still commit through `onNavigate` at the established completion point. Physics, navigation queues, camera, shader and optical intensity controls remain unchanged.

## Archive filtering and navigation context

`/artworks` adds **All works | Featured**, independent of category/year/medium. `featured=true` composes with the existing filters and is retained when entering detail, opening/exiting Glass and returning to the archive. Empty combinations use the existing empty state. All works removes only the Featured constraint; Clear filters resets all archive filters.

The selection is a Home curatorial selection, not a substitute for Award or Honourable Mention. No new category or persisted Featured boolean is introduced. A valid Series context continues to own its own navigation sequence. Initial eligible phone/tablet-landscape entry opens Glass automatically. Once Standard is shown or explicitly chosen through Exit, previous/next navigation carries `experience=standard` and retains Standard until Open Artbook is selected.

## Responsive entry and loading feedback

The page-bound 3D insignia design and first loading treatment were visually approved by the project owner on 2026-10-17. This refinement extends landscape entry and connects the loading feedback to the actual resource preparation. Physical page geometry, native insignia ownership, turn/spring dynamics, shader and optical intensities retain the approved implementation.

`ArtworkDetailResponsiveEntry` checks the viewport once per entry, including a fresh browser reload. An unmarked detail URL opens Glass in landscape at least 640px wide and 300px high: viewport widths through 1366px do not depend on the primary pointer, allowing phone/tablet emulation; larger viewports qualify when `any-pointer: coarse` reports touch. Tablet height is no longer capped at 600px. A paired mouse therefore does not exclude a touch tablet. Larger fine-pointer desktop viewports, portrait and insufficient-size viewports retain Standard. Automatic candidates remain inside the existing runtime book capability.

The automatic entry shows Opening Artbook while routing with replace rather than adding an extra entry to browser history. CSS hides the initial Standard paint only in the eligible viewport, retains its layout during the initial check, and the opening phase unmounts the hidden kinetic view. There is no orientation-change listener that reopens Glass during reading. A fresh unmarked landscape reload repeats the check; a `glass` URL restores the book directly. An explicit `standard` URL remains Standard after reload, preserving Exit and Standard navigation until Open Artbook is chosen. This distinction is intentional rather than an emulator failure. A noscript link selects explicit Standard so the automatic-entry fallback does not become a dead end with scripting disabled.

`artworkExperienceHref()` builds the shared mode URL. Exit, Escape and the book's orientation fallback choose `experience=standard`. Every Standard previous/next href and neighbouring scene also carries that value, including swipe navigation. Open Artbook replaces the value with glass. Series/category/year/medium/Featured context is preserved; archive/Series Back links omit the experience marker.

`CollectionGallery` uses a navigation transition to mark the chosen detail thumbnail busy, expose a small Opening status and prevent repeat requests for that same work while pending. Another artwork can still be chosen; the displayed pending state follows the latest target. It clears when navigation settles. Home and Series lightbox selection remain immediate; the shared card also has a transient pressed outline.

`ArtworkLinkFeedback` runs as a descendant of Next Link. Collections preview links show a compact pending overlay; Open Artbook, lightbox detail and Home Featured Work links show a thin loading underline positioned outside text flow. Their labels, frame dimensions and touch ownership stay in place. `ArtworkLoading` supplies English status copy, a warm spinner and polite live announcements. Reduced motion disables both spinner and underline animation. Existing Coming Soon placement and shared Halo rendering/styles are unchanged.

`src/app/artworks/[slug]/loading.tsx` supplies the route fallback. The Glass wrapper displays Opening Artbook during client initialisation and Preparing Artbook while the runtime prepares the selected spread. The initial root remains laid out but invisible so masks, font discovery, canvas dimensions and local insignia alignment are prepared at their real sizes. The resource overlay ends before the approved opening animation, keeping that animation visible.

`GlassArtbookOptions.onLoadStateChange` reports loading/ready/error with the intended Artwork ID. The runtime verifies load events, nonzero natural dimensions and `HTMLImageElement.decode()` for the primary asset and displayed images, then awaits the current `document.fonts.ready` after layout discovery. Browsers without decode retain the load/dimension check. The former 2.5-second forced opening is removed. Ready or broken cached images are distinguished explicitly. The book wrapper makes only the book host inert while loading or in error, with polite status feedback; Exit remains available above the loading panel.

Only current and adjacent assets are preloaded and retained. Adjacent downloads run in parallel without holding a ready selected spread or downloading all 45 images. If a requested incoming image is not decoded, the current spread stays intact under Loading artwork and its requested turn continues once that image is ready. A pending drag/wheel request becomes a normal turn after loading, without retaining a released pointer. Existing ready-image dragging and fast button navigation keep their approved physics.

An image error, decode error or 30-second resource timeout exposes This artwork could not finish loading, Try again and an explicit Standard alternative; it never forces an incomplete spread open. Retry rebuilds the failed image job and resumes the same intended preparation. Replaced selections and disposal invalidate prior continuations; cleanup removes image listeners and resource timers. Window blur cancels an unstarted pending turn while retaining the current spread. No artificial minimum delay or fake progress is added, and prefetched links can still open immediately.

The framework APIs used here are documented in [Next useLinkStatus](https://nextjs.org/docs/app/api-reference/functions/use-link-status), [Next loading convention](https://nextjs.org/docs/app/api-reference/file-conventions/loading) and [React useTransition](https://react.dev/reference/react/useTransition). Resource readiness uses [HTMLImageElement.decode](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/decode), [complete](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/complete) and [Document.fonts](https://developer.mozilla.org/en-US/docs/Web/API/Document/fonts). No dependency update is required by this patch.

## Installation

This update contains **20 source files**, including the complete six-file Glass Artbook folder, and three canonical documents:

- `src/app/artworks/[slug]/loading.tsx`
- `src/app/artworks/[slug]/page.tsx`
- `src/domains/artworks/components/ArtworkDetailResponsiveEntry.module.css`
- `src/domains/artworks/components/ArtworkDetailResponsiveEntry.tsx`
- `src/domains/artworks/components/ArtworkDetailScene.tsx`
- `src/domains/artworks/components/glass-artbook/ArtworkGlassArtbook.module.css`
- `src/domains/artworks/components/glass-artbook/ArtworkGlassArtbook.tsx`
- `src/domains/artworks/components/glass-artbook/index.ts`
- `src/domains/artworks/components/glass-artbook/runtime.d.mts`
- `src/domains/artworks/components/glass-artbook/runtime.mjs`
- `src/domains/artworks/components/glass-artbook/types.ts`
- `src/domains/artworks/presentation/artworkExperience.ts`
- `src/domains/collections/components/CollectionPreviewArtwork.tsx`
- `src/domains/home/sections/collection/CollectionArtwork.tsx`
- `src/domains/home/sections/collection/CollectionGallery.tsx`
- `src/domains/home/sections/featuredArtwork/FeaturedArtwork.tsx`
- `src/shared/ui/artwork/ArtworkLightbox.tsx`
- `src/shared/ui/artwork/ArtworkLinkFeedback.tsx`
- `src/shared/ui/artwork/ArtworkLoading.tsx`
- `src/shared/ui/artwork/ArtworkNavigationFeedback.module.css`
- `docs/domains/artworks/artwork-implementation.md`
- `docs/domains/collection/collection-specification.md`
- `docs/architecture/repository-structure.md`

The update has 23 entries. `index.ts` and `runtime.d.mts` preserve the book's directory import and engine declarations. Merge its files into the existing project; do not replace entire shared folders with a partial folder. No integration-review README, dependency or environment variable is added.

From the actual project root:

```sh
unzip -o "$HOME/Downloads/Del_Carmen_Artwork_Entrada_Landscape_y_Loading_2026-10-17_v2.zip" -d .
npm run build
```

## Validation and remaining verification

Sixty-two isolated checks pass against the compiled actual source. Entry cases include phone/tablet landscape, fine-pointer emulation, touch tablets with a paired mouse, fresh reloads, portrait/desktop and insufficient-size fallbacks, explicit Standard bypass and rotation without reopening. Resource cases include actual displayed-image and primary-asset decoding, delayed fonts, complete/broken cached images, loads longer than the former 2.5-second deadline, decode rejection, timeout and retry, independent adjacent preloading, incoming-turn gating, stale-selection suppression, disposal cleanup and engines without decode. Wrapper checks retain a usable Exit through loading/error and verify the ready state removes only the overlay and interaction lock. Existing acknowledgement, link pending, mode/context and noscript cases are retained.

The actual Server Page output is also checked for Featured context across automatic/explicit entry, clean archive Back links and Standard mode on previous/next hrefs and all neighbouring scenes. The retained cases cover the approved badge identities, future-work previews, all-card hover/focus, filtering, image/zoom masks, ticker reading and page-bound insignia ownership/rotation/reversal/reparenting.

All 223 TS/TSX/MTS/MJS files parse, and all 391 local imports resolve. The runtime changes are readiness/lifecycle guards; the material stylesheet adds loading treatment and extends the approved landscape scrollport to eligible emulation and touch tablets. The shader, rim renderer, page geometry, insignia ownership/alignment/slide, movement/release response and fast-navigation spring/queue remain checked against the approved source. Coming Soon, shared Halo rendering/styles, image highlights, optical accents, CollectionHeroMotion, catalogue/model/recognition records and Home curation remain byte-identical.

The compiled-code checks use local React/Next/DOM stand-ins; the constructed window markup is independently parsed with an HTML parser. They are not a complete React renderer, TypeScript project check, production Next build, real-browser render or physical-device review. The supplied snapshot has no package/configuration root, installed project dependencies or public assets, so the complete build must run in the real repository:

```sh
npm run build
```

Then review slow and prefetched navigation from Archive thumbnails, Collections previews, Home Featured Work and lightbox detail actions. On phone and tablet landscape, including emulation without touch, check direct unmarked entry and fresh reload, direct glass URLs, Exit followed by Standard reload/navigation, rotation and explicit Open Artbook. With throttled networking confirm the preparation indicator remains until the image and fonts are ready, the opening animation remains visible, and a missing image exposes retry/Standard options. Retain portrait and larger desktop compositions and review keyboard, reduced-motion, scroll, image/zoom masks and the already approved page-bound insignias. Check filtered and Series return journeys as well. Build success does not replace that visual review.
