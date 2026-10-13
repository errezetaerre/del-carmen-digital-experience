# Del Carmen — compact Home Artwork and touch Artbook fixes

This update preserves the approved desktop Glass Artbook and corrects Home panel proportions, touch landscape entry, information scrolling and interrupted page turns.

## Apply this update

If the preceding Home/mobile package is installed, replace or add these **8 files**:

| Path | Change |
| --- | --- |
| `src/shared/ui/artwork/ArtworkLightbox.module.css` | Compact horizontal Home panel; fixed photo/dot tracks |
| `src/shared/ui/artwork/GlassArtworkFrame.tsx` | Initial frame dimensions match the compact layout |
| `src/app/artworks/[slug]/page.tsx` | Responsive entry boundary; explicit standard choice preserved in detail navigation |
| `src/domains/artworks/components/ArtworkDetailResponsiveEntry.tsx` | New: automatic touch landscape entry, with image-dialog deferral |
| `src/domains/artworks/components/glass-artbook/ArtworkGlassArtbook.tsx` | Explicit Exit choice; portrait fallback retains current artwork and context |
| `src/domains/artworks/components/glass-artbook/ArtworkGlassArtbook.module.css` | Constrained viewport grid, native information scroll and touch surfaces |
| `src/domains/artworks/components/glass-artbook/runtime.mjs` | Direction-based touch swipes; capture/cancellation recovery; shared viewport rules |
| `src/domains/artworks/components/glass-artbook/runtime.d.mts` | Declarations for both viewport rules |

The ZIP includes **15 source files** for the complete integration. These seven remain unchanged from the preceding package:

- `src/domains/home/sections/collection/CollectionGallery.tsx`
- `src/shared/ui/artwork/ArtworkLightbox.tsx`
- `src/shared/ui/artwork/glassAccents.ts`
- `src/domains/artworks/components/ArtworkDetailScene.tsx`
- `src/domains/artworks/components/ArtworkDetailViewer.tsx`
- `src/domains/artworks/components/glass-artbook/types.ts`
- `src/domains/artworks/components/glass-artbook/index.ts`

Merge individual files into their matching paths. Do not replace entire Home, UI or Artworks directories with this partial package. Store this README with project documentation. If installing from the original desktop-only integration, apply all supplied source files.

The Home/shared UI baseline remains the current `home-domain.zip` and `ui.zip` supplied on 13 October 2026. Other supplied Home, UI, catalogue and kinetic-experience files are retained unchanged.

## Home Artwork panel

The maximum panel height changes from 940 px to **564 px**, a 40% reduction. On wider screens the single glass panel becomes a horizontal rectangle: the primary image and position dots stay on the left; metadata, description preview and actions occupy the right. The panel keeps its previous maximum width of 1040 px. Smaller viewports still constrain it to available space, so the percentage reduction depends on actual screen height.

The full photograph uses `object-fit: contain`. Its reserved area and the dot track do not change with description length. Three-line preview, Read more/less, upward reading overlay, contextual links, arrows, touch zoom and the approved warm bronze accents remain available. Existing text styles/colors are retained. Small portrait screens retain a stacked layout; short landscape screens retain compact metadata and Read more access.

`presentation="glass"` is enabled only by the existing Home gallery. Other callers keep the default standard presentation. No new background render or WebGL context is added to Home.

## Artwork detail on phones and iPad

| Screen/input | Default detail behavior |
| --- | --- |
| Touch landscape, at least 640 × 300 CSS px | Automatically opens the two-page Glass Artbook |
| Touch portrait, including iPad Pro 1024 × 1366 | Standard detail with existing image zoom |
| Insufficient landscape space | Standard detail |
| Desktop mouse/trackpad | Standard detail with Open Artbook; approved book remains available at its desktop threshold |

The landscape threshold measures CSS viewport dimensions. Desktop book eligibility is width ≥1024 px with a fine pointer and hover, or usable landscape dimensions. CSS, renderer and React eligibility use the same rule. Phones and tablets with a coarse primary pointer enter automatically when horizontal. No reload is needed after rotating the standard page.

URL modes:

- `/artworks/epifania-nupcial`: responsive default.
- `/artworks/epifania-nupcial?experience=glass`: explicit book entry.
- `/artworks/epifania-nupcial?experience=standard`: explicit standard choice.

**Exit** and Escape choose explicit standard mode, preventing immediate automatic reentry. Previous/Next in that view preserve the choice. **Open Artbook** can override it. Archive/Series return links remain free of the view-mode parameter. Category/year/medium/Series context stays intact.

Rotating an open book to portrait returns to standard detail for the currently selected artwork. Turning back to landscape automatically reenters unless standard mode was explicitly chosen. An open individual-image zoom dialog defers either transition until it closes; rotation does not interrupt zoom/pan. The renderer, inert state, focus, scroll locks, listeners and observers are released when the book closes.

### Scroll and page turns

The information leaf has a bounded height and native vertical scrolling, including touch momentum. Vertical touch intent never captures a turning sheet, even during an existing settling animation. The image surface owns its horizontal swipe; the information surface allows native vertical panning.

A touch swipe left selects Next and a swipe right selects Previous from either leaf. Mouse dragging and immediate mouse regrab retain the approved physical behavior. Previous/Next controls remain visible beneath the book, with neighboring titles below their labels.

Pointer capture is acquired before changing drag/turn state. A browser rejection leaves the current rest/settling state intact. Pointer cancellation, lost capture, a second finger, window blur or document hiding release ownership and settle to the nearest endpoint. Document-level pointer release also completes a drag that ends outside the original surface. History changes, rotation and disposal relinquish native capture. These paths prevent an ownerless drag from leaving a page raised indefinitely.

## Approved Artbook continuity

Desktop proportions remain asymmetric at 1.65:1 with a 4 px hinge gap. Only the photograph has the approved 1.1× local enlargement. Quote precedes the separator; Medium combines medium/support before Dimensions and Status.

The selected left glass leaf drops on entry with its approved small rebound. The guide pulses every five seconds until interaction, then moves to the footer. Fine-pointer proximity, release inertia, history navigation and existing individual-image zoom remain available.

The camera stays `max(1040 px, widest page × 2.35)` throughout a turn. There is no angle-based fitting, bending or width interpolation. Reflection remains 60%, corner light independently 90%, with warm bronze accents. Four persistent WebGL canvases are reused. The original standalone 11B-23 HTML remains unchanged.

## Verification

| Check | Result |
| --- | --- |
| TS/TSX/MTS syntax | 106 files parsed, including unchanged source inputs |
| Catalogue | 45 Artworks and 4 Artwork Series |
| Standard/immersive navigation context | 197 cases each passed; standard server scenes preserved inside the responsive boundary |
| Standard entry links | All 45 preserve artwork/context |
| Artbook interactions | 39 passed, including touch direction, external release, vertical intent during settling, capture rejection, cancellation, lost capture, second finger and backgrounding |
| React/URL bridge | One renderer across navigation; portrait creates none; zoom defers orientation transitions; explicit standard mode prevents automatic reentry |
| Shared Artwork viewer | 9 contracts passed: default presentation, glass opt-in, reader/resize/Escape, links, navigation, swipe/pinch/reset, cleanup and approved accents |
| Viewport policy | 17 cases, including Samsung 915 × 412, iPhone 932 × 430, iPad 1024 × 1366 / 1366 × 1024 and desktop |
| Native shader | Actual Mesa EGL/GLES3 compile/render passed in 10 poses |
| Package | 15 source files + README; ZIP integrity and source preservation checked |

React, DOM, GSAP timing and WebGL lifecycle checks use contract doubles. The native shader check renders actual shader pixels. A full Next.js build and Safari/Chrome device review were not available in this partial workspace.

## Check in the complete project

Run the project's normal type/lint checks and `npm run build`. The supplied archives omit the complete package/configuration, global styles/layout and actual public image assets.

On Samsung/iPhone: open a normal artwork URL in portrait, rotate to landscape, swipe both ways, vertically scroll the information, use image zoom, rotate with zoom open, close zoom, then test Exit and Open Artbook. On iPad: repeat in both orientations, including a turn interrupted by a second finger or switching apps. Confirm native momentum scroll and controls remain usable in Safari and Chrome.

In Home, review landscape/portrait photographs, long titles/descriptions, Read more/less, position dots and existing zoom. The glass frame should read as a compact horizontal rectangle on wider screens without description-driven image movement.

Official 11B-23 HTML SHA-256:

`4ae0de0273fe3eeae079067e92a82719cfa16cde8823a50b6e3e1560dd8383d2`
