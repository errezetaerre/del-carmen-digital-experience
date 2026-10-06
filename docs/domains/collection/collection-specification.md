# Collections Specification

Version: 1.1

Document ID: DOC-COL-SPEC

Project: Del Carmen Digital Experience

Parent Brand: Rō Visual

Document Type: Domain Specification

Authority Level: High

Status: 🟢 Approved

Owner: Del Carmen Digital Experience

Last Updated: 2026-10-05

---

## Purpose

Define the canonical Phase 1 Collections experience and its relationship to Artwork Series. Collections is the public editorial index through which visitors discover bodies of work; `/series/[slug]` remains the deeper curatorial experience for an individual series.

The index must feel contemplative, cinematic and editorial rather than like a commercial catalogue.

## Public Routes

`/collections` — editorial index of published collections / artwork series.

`/series/[slug]` — detailed experience for one individual series, for example `/series/yasemi`.

The visitor-facing language may use **Collection**, while the current implementation may continue to use **ArtworkSeries** as the domain model. A parallel Collection data model must not be introduced merely to match UI terminology.

## Experience Boundary

`/collections` discovers and seduces.

`/series/[slug]` develops and allows contemplation.

The Collections index therefore does not reproduce the full statement, artwork gallery, exhibition history or other detailed series content. Those belong to the detail experience.

## Collections Index Structure

The canonical page flow is:

Navigation → Collections Intro → Collection Heroes → Footer / Continue Exploring.

Collections are presented vertically, one below another, using natural page scroll. No horizontal collection carousel is used.

Collections are ordered newest to oldest:

1. `startYear` descending conceptually; reconcile with the current `yearStart` implementation during architecture.
2. `publishedAt` descending as the tie-breaker when available.

Manual `sortOrder` is not required for Phase 1. Featured state is independent of chronological ordering.

## Collections Intro

The page begins with a restrained editorial introduction rather than another full Hero.

Its responsibility is limited to:

- section identity / eyebrow (`COLLECTIONS`)
- short editorial description
- discreet scroll invitation

Provisional reference copy:

`Bodies of work shaped by time, memory, and contemplation.`

The copy is data-driven and may change without changing the component architecture. A long curatorial statement is not displayed in this introduction.

Desktop may use approximately 30–40svh as an initial visual reference. Mobile should be substantially more compact. Exact dimensions remain subject to visual implementation QA.

## Curatorial Content

Each series / collection distinguishes between two levels of editorial copy:

`description` — short reusable text for Heroes, previews and other condensed contexts.

`statement` — extended curatorial text for the detailed `/series/[slug]` experience.

Hero presentation may render the series title, description and metadata, but these values remain owned by domain data and must not be duplicated inside Hero-specific data.

Provisional Yasemi reference:

Description: `A contemplative exploration of serenity, transformation, and the shifting language of color.`

Statement: `Yasemi unfolds as a space of contemplation where the human figure becomes a vessel for serenity, transformation, and iridescence. Through color, movement, and symbolic presence, the collection explores a visual language suspended between the human, the elemental, and the otherworldly.`

## Identity

Conceptually, a collection / series requires:

- `id` — internal identity
- `slug` — stable public URL identity
- `title` — editorial title

These values are domain-owned and must not be duplicated in Hero, card or preview configuration.

## Artistic Lifecycle

The approved conceptual lifecycle is:

- `upcoming`
- `ongoing`
- `completed`

Artistic chronology is represented conceptually by `startYear` and optional `endYear`. An ongoing collection may display metadata such as `2026 — ongoing`.

The current `ArtworkSeries` implementation uses `yearStart`, `yearEnd` and includes `archived` in its status type. During implementation architecture, this must be reconciled without an unnecessary breaking rename.

## Publication Lifecycle

Editorial publication state is conceptually separate from artistic lifecycle:

- `draft`
- `published`
- `archived`

A collection may therefore be `published` and `ongoing` simultaneously. `archived` is an editorial state, not an artistic lifecycle state.

Internal record dates conceptually include:

- `createdAt`
- `updatedAt`
- `publishedAt`

These are distinct from artistic years and exhibition dates. Additional speculative lifecycle timestamps are not required until a real use case exists.

## Collection Hero

Each entry in `/collections` is presented as a large reusable Collection Hero.

The Hero owns presentation and media composition, not duplicated curatorial content.

Hero media orientation and content position are independent editorial decisions and may be configured per responsive breakpoint.

Approved responsive responsibilities are:

```ts
type ArtworkSeriesHeroContentPosition =
  | "top"
  | "bottom"
  | "left"
  | "right";

type ArtworkSeriesHeroMediaVariant =
  | "portrait"
  | "landscape";

interface ArtworkSeriesHeroResponsiveLayout {
  media?: ArtworkSeriesHeroMediaVariant;
  content?: ArtworkSeriesHeroContentPosition;
}

interface ArtworkSeriesHeroLayout {
  mobile?: ArtworkSeriesHeroResponsiveLayout;
  tablet?: ArtworkSeriesHeroResponsiveLayout;
  desktop?: ArtworkSeriesHeroResponsiveLayout;
}
```

The system must not infer content position from media orientation.

The system must not infer portrait media solely from a portrait viewport.

Each Series may therefore establish the composition that best serves its artwork at mobile, tablet and desktop while remaining inside the shared Del Carmen visual system.

The preferred component boundary remains conceptually:

```tsx
<CollectionHero collection={collection} />
```

rather than passing duplicated curatorial values as loose presentation props.

Responsive Collection Hero behavior has completed implementation and visual QA for the current Phase 1 collections.

## Hero Media

Hero media supports both image and video.

Image media uses dedicated desktop and mobile sources rather than relying only on responsive cropping. Width, height and alt text remain structured media data.

Video media may provide separate desktop and mobile sources. A poster is required conceptually for loading and fallback; a mobile-specific poster may be supplied. Editorial atmospheric video defaults may include autoplay, loop and muted behavior, without visible player controls when appropriate.

Image and video occupy the same visual media responsibility so changing media type does not require changing page composition.

The current `ArtworkSeries` implementation already contains `coverArtworkId` and optional featured image data. During architecture, those existing sources must be evaluated before adding new Hero fields. Data must not be duplicated merely to satisfy presentation.

## Hero Content

Hero content may visually include:

- eyebrow
- title
- artistic metadata
- short description
- contextual exhibition information
- `Explore Collection` CTA

These values are derived from the series / collection domain. There is no `hero.description`, `hero.title` or equivalent duplicated curatorial content.

Hero text may be reduced or omitted when the media itself already carries the necessary information. Media type alone does not determine whether text is shown.

## Directional Gradient

Collection Hero readability may use localized darkness, gradients, overlays and atmospheric falloff according to the composition of the current Series.

The original directional black-to-transparent treatment remains part of the visual vocabulary, but the final implementation may use a broader controlled overlay when required by artwork, responsive composition or text placement.

The treatment must preserve artwork visibility and should never behave like a generic blanket filter.

Exact stops, opacity and directional behavior remain implementation-level visual values rather than domain data.

## Visual Identity

`visualIdentity` is an approved collection-level responsibility, but its final API is intentionally deferred.

It may eventually govern collection-specific atmosphere such as background treatment, accents, media treatment, haze, glow, grain, overlays or motion character.

It must not create an independent design system per collection. Global Del Carmen authorities continue to govern typography, spacing, containers, responsive structure, shared UI, heading scale, buttons and fundamental interaction behavior.

Concrete visual-identity fields should be introduced only when real collection implementations require them.

## Highlight

`highlight` is optional and conceptually separate from `visualIdentity`.

It represents a special condition such as an award, recognition, promotion, featured condition or other explicitly approved marker. It describes what is special; `visualIdentity` describes how the collection feels.

The Hero may render a restrained highlight treatment when present. No empty layout space is reserved when absent. The concrete API and badge design remain deferred until a real use case exists.

## Works Preview — Desktop

Desktop Collection Heroes include a curated preview labelled `Works in this collection`.

The label and artwork preview behave as one visually attached, bottom-anchored unit. Artwork expansion grows upward so the label remains connected to the preview rather than drifting away from it.

For one to four artworks, the preview preserves the restrained masked-strip composition. The major reveal belongs to the group: hovering the preview expands the visible artwork windows together, while individual artwork interaction remains secondary and may expose restrained metadata or directional affordance.

A single artwork remains visually centered within the preview composition.

When more than four artworks are available, the preview becomes a horizontal carousel rather than compressing an arbitrary number of artworks into the same width. The carousel preserves the same visual language and exposes a controlled visible window with navigation and drag interaction.

The preview remains a dedicated presentation responsibility such as `CollectionPreviewWorks` / `CollectionPreviewArtwork`. It must not reuse the detailed Series gallery merely to avoid a specialized component.

Artwork targets may preserve Series context when opening deeper artwork experiences.

## Mobile

Mobile does not render the desktop Works Preview.

There are no artwork strips, thumbnail carousel or substitute hover interaction beneath the Collection Hero on mobile. The Hero, collection information and `Explore Collection` action provide the discovery path.

Responsive Hero media and content composition remain independently configurable at the mobile breakpoint.

Where architecture permits, desktop-only preview media should not be unnecessarily loaded on mobile merely to hide it with CSS.

This responsive behavior has completed visual QA for the current Phase 1 collections.

## Motion and Scroll

The page uses natural vertical scroll. Scroll motion and Works Preview interaction remain separate layers:

- scroll introduces and releases the Collection Hero
- group interaction reveals the desktop artwork preview
- individual artwork interaction identifies or opens a specific work

Collection Hero entrance motion is restrained and atmospheric. The current implementation uses subtle media settling and content arrival rather than attention-seeking animation.

Departure behavior may continue to be refined visually without changing the conceptual motion responsibility.

All motion must respect `prefers-reduced-motion`, consistent with Del Carmen interaction behavior.

## Artwork Relationship

The approved future domain direction does not assume that one Artwork can belong to only one Collection.

Conceptually, a relationship entity may evolve toward:

```ts
type CollectionArtwork = {
  collectionId: string;
  artworkId: string;
  order?: number;
  featured?: boolean;
};
```

`order` represents curatorial ordering within a collection.

`featured` represents emphasis inside that collection experience.

A collection-level representative artwork is a separate concept from an artwork being featured within the collection.

The current implementation uses `Artwork.seriesId`, which represents one optional series relationship. Phase 1 Collections must not force a premature data migration solely to satisfy the future model. The relationship should evolve when an actual requirement justifies it.

## Representative Artwork

The collection / series may designate one artwork that represents it externally in previews or other discovery contexts.

This is conceptually distinct from `CollectionArtwork.featured`.

The current implementation's `coverArtworkId` should be evaluated as the existing source for this responsibility before introducing another identifier.

## Exhibitions

Exhibition history is separate from collection artistic lifecycle.

A collection may participate in multiple exhibitions while remaining ongoing. Exhibition data conceptually includes venue/location and `startDate` / optional `endDate`.

Exhibition duration is derived from dates and is not stored redundantly.

When an exhibition is currently active, `/collections` may contextually enrich the relevant Hero with information such as:

`NOW EXHIBITING`

venue

date range

This condition is derived from exhibition dates. `now exhibiting` must not become a Collection lifecycle status.

When the exhibition ends, the contextual Hero enrichment disappears automatically and the permanent collection metadata remains.

Detailed exhibition history belongs to `/series/[slug]`, not the Collections index.

## Detailed Series Experience

The `/series/[slug]` route is the canonical detailed curatorial experience for an individual Artwork Series.

It develops the Series beyond the discovery role of `/collections` and should feel like entering the visual world of that body of work rather than opening a conventional gallery page.

The experience includes:

- Series identity and title
- artistic metadata
- works count and artistic lifecycle status
- Series artwork gallery
- full `statement`
- supporting `description`
- contextual artwork exploration
- Continue Exploring / return navigation
- Exhibition History when available

### Series Metadata

Works count and Series status form a single restrained editorial expression, for example:

`2 WORKS · ONGOING`

Subtle horizontal rules may flank this metadata to reinforce balance and hierarchy.

The rules remain secondary and must not become decorative focal points.

### Series Artwork Presentation

Artwork previews should have greater visual presence than compact discovery thumbnails.

When composition allows, previews may use generous, near-square presentation areas while preserving the identity and integrity of each artwork.

The current intentional composition allows artwork cards to overlap or cross the transition into the darker Series Statement environment. This slight overlap creates depth and continuity and should not be treated as an alignment error.

With a single artwork, the artwork remains horizontally centered.

When the artwork count exceeds the standard desktop gallery capacity, the Series gallery uses a horizontal carousel rather than compressing all works into the available width.

Artwork interaction opens the shared Artwork Lightbox in Series context.

### Series Atmosphere

The upper Series experience may use atmospheric imagery derived from artwork belonging to the current Series.

The atmospheric source may reveal an enlarged or selectively cropped detail rather than the complete artwork. Its purpose is to extend the visual language of the Series into the surrounding environment without competing with the primary artwork presentation.

When multiple suitable artworks exist, the atmospheric source may either:

- select one suitable Series artwork for the experience, or
- transition subtly among multiple Series artworks over time.

A reference interval of approximately 15 seconds may be used by implementation when timed rotation is enabled, but timing is not a visual-language invariant.

Transitions should feel like environmental evolution rather than a slideshow.

The atmosphere may use controlled darkness, gradients, vignette, reduced prominence and other treatments consistent with `visualIdentity`, while preserving the artistic identity and color relationships of the source artwork.

The atmospheric artwork must belong to the current Series. No unrelated decorative imagery should be introduced merely to fill the background.

### Series Statement and Description

The Series Statement is the principal curatorial expression and remains visually dominant.

The Series `description` may appear beneath the Statement as a quieter secondary editorial layer. This creates continuity between the concise description used in discovery contexts and the deeper interpretation provided by the Statement without duplicating either value.

Statement and description remain domain-owned content and must not be duplicated in presentation configuration.

### Decorative Restraint

Peripheral corner quotations, ornamental messages or unrelated editorial fragments are not part of the default Series Detail composition.

They may be introduced only when a specific curatorial reason justifies them.

Artwork, atmosphere, typography, curatorial meaning and negative space remain the primary materials of the page.

### Contextual Artwork Navigation

The shared Artwork Lightbox supports contextual behavior rather than separate competing lightbox implementations.

In Series context:

- close returns to the Series experience
- pagination / dots represent the current Series
- previous and next navigation remain within the current Series
- contemplative artwork information may be shown
- `Explore in detail` opens the Artwork detail while preserving Series context

Artwork detail reached from a Series preserves the originating Series through contextual navigation. Artwork detail reached independently continues to use the broader Artwork/archive context.

### Continue Exploring

Series Detail provides deliberate return paths after contemplation.

The approved current navigation includes:

- `← Back to Collections`
- `Return Home →`

These actions close the Series journey without duplicating the Collections discovery experience.

## Current Implementation Compatibility

The working codebase contains `ArtworkSeries` under the Artworks domain and `/series/[slug]` consumes it. Home and `/collections` resolve collection experiences through the existing Artwork Series source of truth and services.

Therefore:

- `/collections` should consume the existing series source of truth where practical
- a new parallel Collection data model must not be created by default
- naming differences between editorial `Collection` and technical `ArtworkSeries` are acceptable
- existing `yearStart` / `yearEnd`, status semantics, `coverArtworkId`, featured image data and `Artwork.seriesId` must be reconciled deliberately during architecture
- no working API should be renamed solely for conceptual purity

The domain/database may evolve as new requirements become real, but UI structure must not dictate redundant persistence.

## Data Direction

Canonical dependency direction:

Database → Domain → Presentation mapping → UI.

Important visual information should have a structured domain source, but not every domain field needs a visual representation. Database design must not mirror component structure mechanically.

Avoid speculative fields and premature abstractions.

## SEO

Collection-specific SEO implementation is deferred to the site's later global SEO pass.

Future metadata may use collection title, description and representative Hero / artwork media as sensible fallbacks with explicit overrides only when needed. SEO remains a transversal site capability rather than a special Collections subsystem in Phase 1.

## Accessibility and Performance

Collection media requires meaningful alt treatment where applicable. Motion must respect reduced-motion preferences. Interactive previews require accessible behavior independent of hover where necessary for any actionable artwork target.

Responsive media should avoid unnecessary asset downloads where feasible, particularly desktop-only Works Preview assets on mobile.

## Phase 1 Non-Goals

The initial Collections implementation does not require:

- a separate duplicate Collection persistence model
- manual collection sort ordering
- a finalized large `visualIdentity` API
- a finalized Highlight API or award system
- migration to many-to-many Artwork relationships before needed
- collection-specific SEO infrastructure
- mobile replication of desktop artwork-preview interaction
- detailed exhibition history on `/collections`

## Validation and Documentation Lifecycle

This specification has been reconciled with the implemented and visually approved Phase 1 Collections and Series behavior as of Version 1.0.

Future implementation discoveries may refine local non-semantic values such as exact heights, gradient stops, reveal percentages or animation timing without requiring a specification revision.

The specification should be revised when a discovery changes a durable domain, system or experience rule.

New capabilities should continue to follow:

Specification → architecture → implementation → visual/responsive QA → specification reconciliation.

## Status

Collections v1.0 records the approved current Phase 1 Collections and Artwork Series Detail experience.

The current responsive Collection Hero system, Collections discovery behavior, desktop Works Preview behavior, Series gallery behavior, contextual artwork navigation and Series Detail visual direction are approved.

Deferred capabilities remain explicitly deferred where identified in this document and should not be interpreted as missing requirements for the approved Phase 1 experience.



---

# Collections / Series Evolution Update — 2026-10-05

This section extends the supplied v1.0 Collections Specification without deleting, compressing or replacing its approved Phase 1 rules or deferred future direction.

The original v1.0 specification remains preserved above.

## Canonical Domain and Route Boundary

`ArtworkSeries` remains the canonical body-of-work domain model.

`/collections` remains the editorial discovery index for ArtworkSeries.

`/series/[slug]` remains the detailed curatorial ArtworkSeries experience.

Visitor-facing `Collection` remains editorial terminology. No parallel canonical `Collection` persistence model is required for the current experience.

## Chronology Naming

The specification's conceptual `startYear` / `endYear` language maps to the current implementation's `yearStart` / `yearEnd`.

The current implementation names remain valid. No breaking rename is required solely for conceptual purity.

## Current Series Atmosphere

The v1.0 specification permits either one suitable Series artwork or subtle timed rotation among multiple Series artworks.

The current approved Phase 1 implementation uses one artwork-derived atmosphere image per Series.

This is the current implementation choice, not a cancellation of the specification's future ability to evolve toward rotation when a later curatorial requirement justifies it.

## Shared KineticCarousel

For the current approved Phase 1 implementation, the generic carousel responsibility described in v1.0 is fulfilled by the shared KineticCarousel.

Canonical shared location:

`src/shared/ui/kinetic-carousel/`

Files:

• `KineticCarousel.tsx`
• `useKineticCarousel.ts`
• `index.ts`

Collections Works Preview behavior:

• one to four artworks preserve the restrained editorial composition;
• a single artwork remains centered;
• five or more artworks use the shared KineticCarousel.

Series Gallery also uses the shared KineticCarousel when its artwork count exceeds the standard gallery capacity.

The shared primitive owns reusable kinetic mechanics. Collections and Series retain their own editorial composition and presentation responsibilities.

## KineticCarousel Interaction Integrity

The current implementation preserves artwork click behavior by delaying drag ownership until pointer movement crosses the interaction threshold.

The current fixed item-width implementation is canonical for Phase 1 because it resolved partial/sliver visibility in the approved composition.

These are current implementation decisions and may evolve in a later phase if new requirements justify change.

## Contextual Artwork Lightbox

The v1.0 contextual Artwork Navigation direction is now implemented through one shared Artwork Lightbox.

In Series context, close returns to the Series experience; dots represent the current Series; previous/next remain within the current Series; contemplative artwork information may be displayed; and `Explore in detail` preserves Series context.

Independent context uses the applicable broader artwork sequence.

The lightbox uses a document-level portal to preserve correct overlay behavior independently of ancestor transforms/layout.

## Artwork Detail Context Continuity

The Series journey may continue through:

```text
/collections
→ /series/[slug]?artwork=[artwork-slug]
→ Artwork Lightbox
→ /artworks/[artwork-slug]?series=[series-slug]
```

This context is navigational/presentational. It does not create duplicate Artwork or ArtworkSeries entities.

## Artwork Detail Kinetic Navigation

The current Artwork Detail experience supports whole-scene horizontal kinetic navigation.

Previous/current/next artwork scenes coexist in the interaction track when their corresponding neighbors exist.

Series context determines a Series-local navigation set. Independent entry uses the applicable broader Artwork/archive set.

Supported inputs include horizontal trackpad gesture, pointer drag/touch swipe and keyboard left/right arrows. Vertical scrolling remains natural. Fullscreen viewing remains isolated from scene navigation.

The governing physical principle is:

`The artwork must feel as though it has weight.`

Approved current behavior includes direct gesture response, continuous release trajectory/momentum, one-navigation-per-trackpad-burst protection and symmetric edge resistance.

These interaction mechanics extend the Series exploration experience without becoming Series domain data.

## Interaction Onboarding

The Artwork Detail swipe/drag hint is interaction onboarding, not Series or Artwork content.

After a real horizontal interaction, it is learned for the current browser document and remains learned across client-side artwork navigation.

A browser refresh may present it again. No persistent browser storage is required by the current implementation.

## Future Relationship Direction Preserved

The v1.0 future relationship direction remains valid.

The current optional `Artwork.seriesId` relationship remains sufficient for Phase 1.

A future many-to-many Artwork ↔ ArtworkSeries relationship, including curatorial ordering or emphasis, remains possible when a real requirement justifies it.

No premature migration is required.

`coverArtworkId` remains the existing representative-artwork mechanism to evaluate before introducing another representative identifier.

## Deferred Capabilities Preserved

The deferred capabilities documented in v1.0 remain part of the specification's future direction, including richer Exhibition History, contextual `NOW EXHIBITING` enrichment, future `visualIdentity` API evolution, future Highlight/recognition behavior, possible atmosphere rotation, future relationship evolution and later global SEO integration.

Their deferred status does not mean they have been removed.

## Canonical Stability

The following are stable/canonical for the current Phase 1 Collections / Series experience:

• responsive Collection Hero behavior
• Collections Works Preview
• shared KineticCarousel core
• Series Gallery kinetic integration
• contextual Artwork Lightbox
• Artwork Detail Series-context continuity
• Artwork Detail three-scene kinetic navigation and approved edge semantics

Stable/canonical applies to the current approved phase. Future roadmap phases may extend or supersede these systems through an explicit approved decision.

## Audit Note

Version 1.1 uses the conservative documentation method.

The complete supplied v1.0 Collections Specification body is preserved above, apart from Version and Last Updated metadata.

No deferred exhibition, visual-identity, highlight, relationship, atmosphere, SEO or other future capability has been removed.

The update records subsequent implementation while preserving both the approved Phase 1 specification and its deliberate future evolution.
