# Series — Carousel and Glass ArtBook

The approved Collections Experience preview v3 is integrated into `/series/[slug]`.
`ArtworkSeries` remains the canonical model; `/collections` remains the editorial index.

## Composition

- Wide desktop and tablet landscape (at least 1024 × 640, landscape): two bound pages, gallery left and statement/description right. The gallery displays two artworks in one row and advances in groups of two.
- Portrait and short mobile landscape: preserve the full editorial page and central rigid hinge. One to four works use the existing grid; more than four use the horizontal gallery.
- A single orientation-aware panorama spans the complete editorial surface. Its left and right portions remain continuous across the spine and adhere to their own rotating halves.
- The right-hand statement scrolls independently on wide screens. In portrait, the editorial content scrolls inside its stationary glass frame.
- Glass occupies the viewport and hides the site's global navigation. Only Back to Collections, EN/ES and Exit × remain in the Glass toolbar; collection navigation stays outside the rotating surface. Standard restores the normal navigation. The existing dialog-focus stack isolates the immersive experience and its nested artwork viewer.

## Reused functionality

`SeriesExperience` owns collection selection, two viewing modes, loading feedback and collection navigation.
`SeriesPageSurface` composes the real series data, existing `CollectionArtwork` cards and the approved glass rim.
`seriesGalleryMotion` manages only the local thumbnail rail. Horizontal gallery gestures stay separate from collection gestures; vertical reading remains native.

`CollectionArtwork` supplies the approved thumbnail content, distinctions, coming-soon treatment, Next Image delivery and GSAP rollover. The Series wrapper only adapts title/meta sizing to the available thumbnail width.
Clicking the thumbnail, including the badge area, opens the existing `ArtworkExperienceViewer` with the series' artworks. Standard, portrait Glass, landscape Glass, image enlargement and the full detail CTA remain owned by their existing components.

Collection Carousel reuses `bindArtworkStandardNavigation` and the existing native touch adapter.
Collection Glass reuses `createPortraitArtbookMotion` unchanged in its geometry and physics. Its optional `imagesForPage` callback awaits only the panorama and visible thumbnails. Series also supplies an optional decoded-page cache and material callback. Existing portrait artwork callers omit those options and retain their previous preparation and material behavior.

## Continuous page ownership and loading

Collection IDs are the React keys. A neighbour becomes the current page by moving its existing DOM surface, retaining image nodes, material IDs, gallery state and reading positions. Three unique neighbouring collections remain mounted.

`portraitPageCache` retains decoded readiness in a WeakMap keyed by the actual page node. It checks image-node identity, responsive source, successful image dimensions, fonts and viewport dimensions. A prepared neighbour starts its turn synchronously; source/viewport changes and explicit retries invalidate readiness.

The full preparing panel belongs to entry and explicit mode changes. A genuinely pending turn uses a small delayed status near the controls while the visible book remains on screen. Once the book has been presented, orientation/layout changes and return from an artwork dialog also preserve the visible interface.

## Arrival and guidance

The material is shared with `/artworks/[slug]`: `glassMaterial.mjs` owns the original 11B-23 vertex/fragment shaders, GPU setup and uniform painter. `runtime.mjs` imports that same module. Shader source is preserved byte for byte; reflection remains 60%, corner strength 90%, light 35 degrees and the neutral film 5%.

`seriesGlassReflection` uses the shared WebGL material for both collection halves, driven by the actual rigid face angle. Two GPU contexts are bounded per collection experience: one prepares resting textures and one follows the visible moving face. Resting pages retain their snapshots; each cloned visible half is prepared before it is revealed. There is no second animation clock. Both contexts are released on cleanup.

When WebGL2 is unavailable, a small 2D reflection sampler keeps the pages usable. That fallback is not the definitive GPU rendering and should not be used as visual proof of the exact WebGL appearance. The real GPU glow still requires a WebGL-capable device check.

Only a featured collection receives the existing badge-and-perimeter particle accent when it is ready. The decision uses the canonical series curation, independently of its artworks' awards. An ordinary collection containing a featured or awarded artwork does not trigger a collection border trace. Individual artwork viewers retain their approved distinction effects.

Every collection visit updates the arrival marker, including ordinary collections. Returning to a featured collection therefore replays its accent; a resize or dialog close on the same collection does not replay it. The accent stops on a new gesture, an opened artwork dialog, visibility loss or cleanup. Reduced motion disables it. The five-second lesson uses the existing subtle lift/fall for Glass and the approved gentle slide for Carousel; interaction learns the lesson for the current document.

## URLs, locale and data

- `?view=standard|glass` reflects the collection presentation; `?experience=...` reflects an artwork viewer. The browser preference is the authority after the first choice; old query parameters cannot undo it.
- `?artwork=...` continues to open a work directly. Closing it preserves the collection mode.
- Thumbnail/Discover and Explore in Detail keep the global preference and series context. A first explicit Glass deep link is accepted in a fresh browser. Stored choices then apply to all supported views, including a new document or locale.
- Collection navigation uses native history after the physical landing, retains unrelated query parameters and removes stale artwork selection. Next.js integrates native history with its router; opening or refreshing any collection URL still resolves through its server route and metadata.
- EN/ES copy comes from existing data and reviewed translations. Only interface strings in the `SeriesExperience` namespace are new.
- Three neighbouring collection surfaces are mounted. No public asset, price, artwork status, canonical slug or credential changes in this integration.

## Verification

Run `node --test tests/series-experience.test.mjs`, `npm run lint` and `npm run build`.
Check both locales, direct artwork query links, gallery vs collection drag, statement scrolling, mode changes, browser history, full artwork viewer, portrait/landscape resizing and featured-collection arrival.
The tests cover image visibility, decoded-page identity/invalidation, the approved shader hashes and material uniforms, in addition to navigation and EN/ES mode continuity. Browser QA should observe completed/cancelled turns, repeated featured arrivals, opening/closing a work and orientation changes without a document reload or a full-screen preparing panel during a turn. Rolando approved CIE-20/v3 on 27 October 2026. CIE-21 tracks the global preference and visual consistency changes below.


## Global preference and consistent Glass chrome — CIE-21

`artworkExperiencePreference` owns one browser preference (`standard` or `glass`). `useArtworkExperience` exposes it with `useSyncExternalStore`, a neutral hydration snapshot and cleanup for same-document/storage subscriptions. Standard is the default; viewport queries decide only the book layout. A first explicit deep link may choose Glass in a fresh browser. The preference is retained in localStorage; when storage is denied it works in memory for that document. Only this functional presentation choice is stored, with no identity or tracking data.

`ArtworkOpenArtbook` records the choice when the existing detail Link is activated. `ArtworkPortraitEntry` now selects between the server-rendered Standard scenes and the portrait/landscape books using that same preference. After native Glass page turns, Exit requests the selected artwork's Standard server scenes before revealing them, avoiding a return to the initial artwork. Glass turns retain native history and the approved engines.

The shared gallery viewer and Series use the same preference. `synchronizeSeriesView` updates a collection's presentation parameter without clearing an open artwork selection, campaign fields, locale or hash. Collection navigation still deliberately removes stale artwork selection. Changing locale or resizing never chooses a different mode. Unsupported book viewports fall back to Standard without erasing the stored choice.

`ArtworkExperienceToolbar` supplies Back, EN/ES and Exit ×. Exit changes the global preference to Standard; Back preserves it. Image zoom retains its own close control and never changes the preference. Glass hides the route's main header; Standard restores it. All book navigation labels use the shared control size, line-height and tracking tokens from `globals.css`.

Gallery Glass and Standard now use the same available bounds and 60/40 spread. The Glass gallery image uses a contained, unscaled stage and the information leaf centers its content. Standalone Glass releases unused top padding; portrait uses the same 58svh mobile / 64svh tablet photo caps as Standard. These are layout changes only: no image, original source, curation, translation, detail data or GPU shader is replaced. Standard detail moves year beside authorship above the title, retaining medium, dimensions, status, quote and description in the Glass order.

The two landscape artwork leaves have no grid gap. Inner material edges fade out beneath one central divider; Series removes the broad dark spine band and uses the same fading divider. Outer metallic corners, warm material palette, reflection 60%, corners 90%, original physics, particles, readiness cache and 5-second guidance stay intact.

Validation of this revision: 19 focused Node tests pass, TypeScript and production build pass (125 generated pages); ESLint has zero errors and the same 10 existing warnings. The test environment did not permit interactive browser verification. The received source archive contains no public paintings; final scale, GPU appearance, drag/zoom interaction and physical-device review must therefore be confirmed in the owner's local project. No commit, push, PR or deployment is performed by this delivery.

Run `node --test tests/artwork-experience-preference.test.mjs tests/series-experience.test.mjs` before the existing lint/build checks. Locally verify first-entry Standard, Open Artbook, Back, EN/ES, reload, another series, another artwork, Exit to the currently selected Standard artwork, and closing image zoom without leaving Glass. Check portrait/landscape, reading/drag, named navigation, featured arrivals and photo size using the actual assets.


## Exterior Glass controls — CIE-22, 28 October 2026

Rolando approved the Global Experience v1 spine, copy, sizes and every Standard view. The remaining correction follows `perfecto.png`: exterior controls must occupy their own space above/below the book.

The standalone landscape artwork book now has explicit toolbar and viewport grid rows. Its toolbar positioning uses a parent-qualified selector, so the shared toolbar stylesheet cannot put it back into the book when lazy CSS arrives in a different order. Tablet landscape no longer uses the negative viewport margin, compensating height or scroll offset that could relocate the whole book. The joined spine, approved image scale, optical material and turn engines stay unchanged.

The artwork dialog opened from a Series (the `leermasSerie.png` example) retains the same native navigation buttons and titles. Its footer now occupies a real second grid row below the scene instead of overlapping the artwork. Previous/Next titles are visible again. A React portal adds accessible artwork position dots to the existing control centre; selection calls the existing controller and URL navigation. The active dot tracks the selected artwork. Its rail scrolls itself, never `scrollIntoView`, so neither the book nor the page changes position. Rendering dots does not load more artwork images.

The shared Glass toolbar has qualified positioning too; its landscape inset aligns with the book. Standard CSS/rendering, portrait artwork rendering, global mode preference, real data, shaders, physics and the already-correct collection experience in `perfecto.png` are unchanged.

Validation: 19 existing focused tests pass; TypeScript and production build succeed with 125 generated pages. ESLint has no errors and the same 10 prior warnings. The exact appearance and touch/device behavior remain for local owner review with real public assets. No commit, branch creation, push, PR or deployment belongs to this correction. Continue on `feat/series-glass-experience` until the complete block is approved.
