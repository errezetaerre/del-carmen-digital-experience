# Glass Artbook 11B-23 — Approved immersive Artwork Detail integration

Implements the visual direction approved on 13 October 2026. The official standalone 11B-23 HTML is retained as the optical/physics baseline and remains unchanged.

The approved open-book reference is `Epifanía Nupcial open glass artbook.png` with its original page proportions, information-page width and interior breathing room. The implementation uses asymmetric pages with a 1.65:1 width ratio and a narrow 4 px hinge gap. The 13 October follow-up enlarges only the displayed photograph by 10%, retains a fixed camera throughout each turn, places navigation titles below their labels and uses the authorized entrance alternative: a weighted drop of the actual left image leaf.

## Apply the nine source files

Copy every included source file into the matching path in the complete project, merging with the existing tree. Preserve all other source and public artwork assets.

**If the previous integration is already installed**, this update requires replacing only these two files:

- `src/domains/artworks/components/glass-artbook/runtime.mjs`
- `src/domains/artworks/components/glass-artbook/ArtworkGlassArtbook.module.css`

The other seven source files are unchanged from that integration and are included for a complete first installation.

Updated existing files:

- `src/app/artworks/[slug]/page.tsx`
- `src/domains/artworks/components/ArtworkDetailScene.tsx`
- `src/domains/artworks/components/ArtworkDetailViewer.tsx`

New files:

- `src/domains/artworks/components/glass-artbook/ArtworkGlassArtbook.tsx`
- `src/domains/artworks/components/glass-artbook/ArtworkGlassArtbook.module.css`
- `src/domains/artworks/components/glass-artbook/runtime.mjs`
- `src/domains/artworks/components/glass-artbook/runtime.d.mts`
- `src/domains/artworks/components/glass-artbook/types.ts`
- `src/domains/artworks/components/glass-artbook/index.ts`

The package uses the existing React, React DOM, Next.js and GSAP dependencies. GSAP is already imported by the supplied standard kinetic experience. No additional package or plugin is required.

## Open either experience

Visit the normal artwork detail, for example:

`/artworks/epifania-nupcial`

The new `Open Artbook ↗` link sits beside the authorship label. It opens the same selected artwork in the immersive experience. The existing standard image, typography, fullscreen viewer and kinetic navigation are retained.

Direct immersive link:

`/artworks/epifania-nupcial?experience=glass`

Series example:

`/artworks/epifania-nupcial?series=epifanias&experience=glass`

Category, year, medium and Series context use the existing route calculations. Previous and Next display their respective real artwork titles below the button labels. The labels use the standard gray-to-gold hover; titles stay white and transition from 50% to 100% opacity on hover or keyboard focus. Long titles truncate visually and retain the complete title in the button tooltip and accessible label. Unavailable neighbors have disabled controls and an empty title.

Artwork navigation updates the deep link after the physical turn commits and preserves the renderer. Browser Back/Forward selects the corresponding artwork. This uses Next.js's documented [Native History API integration](https://nextjs.org/docs/app/getting-started/linking-and-navigating#native-history-api).

## Immersive layout and content

The experience is rendered in a fixed body portal above the site navigation. The underlying site becomes inert while open. Page scrolling is locked on the root element independently of the image viewer's body-scroll lock. Focus, inert state and scrolling are restored on exit. `Exit` or Escape returns to the current artwork's standard view with its navigation context; an open image dialog owns Escape first.

The book and its footer share a viewport layout. Previous, Next, their artwork titles, the counter and the permanent learned hint remain visible. The information can scroll within its page on shorter screens instead of pushing navigation below the viewport. Narrow screens use a stacked image/information view with immediate Previous/Next navigation, while the standard experience remains available.

Content order:

1. Year and authorship.
2. Artwork title in the existing display font and colors.
3. Artwork quote.
4. Approved bronze horizontal light separator.
5. One technical definition-list block: **Medium — medium + support**, Dimensions and Status.
6. Description and categories.

The original display/body font classes, copy colors and responsive image-containment classes are reused. A local 1.1× transform enlarges only the DOM photograph from its center; page and information dimensions do not change. The full aspect ratio is retained, with visible overflow instead of image cropping. Images remain canonical `images.primary` DOM media; there is no procedural illustration, decorative image circle, duplicate image title or shader repaint of the artwork. The scene has no enclosing border or solid colored background. The base glass film is neutral black at 5% opacity.

## Entrance, guidance and cursor response

- The landscape cover is removed in favor of the entrance alternative authorized in the follow-up: the actual selected artwork's left rigid-glass leaf starts raised at 66°, accelerates down and settles with a small rigid rebound. The information page stays visible. This entrance plays once per mounted experience, including a fresh entry from standard view, and never restarts during artwork navigation.
- The drop waits for the selected photograph to finish loading, with a 2.5-second maximum wait on stalled loads. A short initial hold makes the movement visible. Normal resize observations and pointer leave cannot prematurely flatten the leaf. Reduced motion and narrow layouts enter at rest.
- Before the first book interaction, the central guidance uses the standard experience's quiet translucent hint styling and pulses softly every five seconds.
- A valid page interaction reduces and moves the same guidance element to the permanent footer. The learned state persists across artwork changes and subsequent entries in the same document.
- Mouse proximity to an available outer edge attracts its entire rigid page by up to 2.6 degrees. Starting a real gesture clears the cue before applying the approved direct drag and release physics. There is no mesh deformation or page bending.
- Reduced motion bypasses the opening, magnetic cue and passive page transition, and docks the guide immediately after interaction.
- An image fullscreen dialog blocks book navigation and pauses active entrance/guide effects. Owned GSAP effects, observers, event handlers, timers, contexts and animation frames are cleaned up on unmount. Abandoning an entrance cannot reopen a disposed experience.

## Material and turn continuity

The approved reflection equations, mirrored information light, bronze/champagne palette, corner geometry and thin page rim are retained. Reflection stays at 60% and corner light remains independently 90%. The entrance and subsequent turns reuse four persistent WebGL canvases. The left leaf's reflections follow its actual entrance angle. Identical resting surfaces are not repainted every frame.

Each turning face retains its corresponding page width. The endpoint geometry matches its static leaf without width interpolation or scaleX. Only underlying content covered by the moving face is masked to prevent duplicate copy and artwork showing through the transparent material.

The camera distance is `max(1040 px, widest page × 2.35)` and depends only on the resting layout. It remains fixed throughout both directions of a turn, including its midpoint. There is no fitting to the viewport, camera recession or shrinking to keep corners inside the screen. The rigid projection may extend beyond the viewport; the navigation remains above it. The shader's approved optical model is unchanged.

## Individual image fullscreen

The expansion icon remains beside the artwork. It reuses `ArtworkDetailViewer` with its existing 1–3× zoom, pan, pinch, reset and Escape behavior. The only fullscreen-portal change is an optional destination inside the immersive layer; standard mode still targets `document.body`. Closing it returns to the same book state.

No new artwork file or artificial enlargement is included. The supplied record for Epifanía declares a 1376 × 768 px primary image. Maximum-zoom sharpness must be reviewed against the actual source; a higher-resolution photograph can improve detail later without changing this interaction.

## Verification completed

| Check | Result |
| --- | --- |
| TypeScript/TSX/MTS syntax parsing | 35 source files parsed |
| Real catalogue exercised | 45 Artworks and 4 Artwork Series |
| Standard route context | 197 cases preserved |
| Immersive route context | 197 cases passed |
| Standard entry links | All 45 use the selected artwork and preserve query context |
| Runtime interaction/state checks | 34 passed, including selected-leaf entry, rigid rebound, load readiness/fallback, entrance resize/pointer ownership, guidance timing and docking, proximity, modal isolation, fixed turn projection, interruption, title updates, history, regrab and cleanup |
| React/URL bridge contract | One renderer across navigation; body portal, independent scroll lock, focus/inert restoration, Exit and modal-aware Escape passed |
| Native shader compilation/render | Mesa EGL/GLES3 passed; neutral 5% film, clear exterior, warm independently lit corners, 10 tested poses |
| Official optical baseline | Reflection model and corner profile retained; standalone HTML SHA-256 unchanged |

DOM/WebGL, React hooks and GSAP timing are tested with contract doubles. The native GLES3 check compiles and renders the actual shader. These checks do not substitute for a full browser compositor or Next.js build.

## Checks in the complete project

The supplied source ZIPs do not include package/configuration files, shared/global implementations or actual `public/artworks` image assets. Full type checking, linting, application build and visual review must run in the complete project.

Run the project's usual checks and `npm run build`. Review the weighted left-leaf entry from standard mode; the first guidance-to-footer handoff; long titles and both hover colors; the photograph's 10% enlargement; portraits and landscapes; low-height and touch layouts; forward/backward drag and wheel; individual image fullscreen; Exit; browser history; and opening/closing during navigation. Confirm the page proportions against the approved open-book reference using the actual fonts and browser viewport. Projected corners are intentionally allowed outside the viewport during a turn.

Official 11B-23 fingerprint:

`4ae0de0273fe3eeae079067e92a82719cfa16cde8823a50b6e3e1560dd8383d2`
