# Collections Specification

Version: 0.1

Document ID: DOC-COL-SPEC

Project: Del Carmen Digital Experience

Parent Brand: Rō Visual

Document Type: Domain Specification

Authority Level: High

Status: 🟡 Approved Direction / In Development

Owner: Del Carmen Digital Experience

Last Updated: 2026-09-10

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

The Hero owns presentation and media composition, not curatorial content.

Conceptual responsibility:

```ts
type CollectionHero = {
  media: CollectionHeroMedia;
  layout?: "default" | "content-left";
};
```

`default` means content left / media right.

`content-left` means media left / content right.

The ambiguous inverse name `content-right` is not used.

A preferred component boundary is conceptually:

```tsx
<CollectionHero collection={collection} />
```

rather than passing a large set of duplicated loose content props.

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

Text readability uses a localized black-to-transparent directional gradient rather than a blanket dark overlay across the entire artwork.

For `default`, the stronger dark treatment begins on the content side and fades toward the media. For `content-left`, the direction is inverted.

The fade may extend approximately toward 60% of the composition as an initial visual reference. Exact stops and opacity are implementation details to be validated visually.

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

Desktop Collection Heroes may include a curated preview labelled conceptually `Works in this collection`.

The preview contains up to approximately four real artworks shown initially as narrow masked windows / strips rather than conventional cards.

Primary interaction:

- hovering the preview group expands all visible artwork windows together
- the expanded state reveals a substantial portion of each artwork, approximately 60–75% as an initial visual target
- once expanded, an individual artwork may receive a restrained micro-hover exposing title, year and/or directional affordance

The major reveal belongs to the group. Individual artworks must not each perform a competing dramatic expansion.

This interaction is intentionally curatorial and cinematic rather than resembling an e-commerce product grid.

The preview should have a dedicated presentation responsibility such as `CollectionPreviewWorks` / `CollectionPreviewArtwork`. The existing detailed gallery artwork component should not be repurposed merely to avoid a small specialized component.

The final artwork-selection rule is not frozen. Existing series data, artwork order and future featured relationship data should be evaluated during implementation before introducing new fields.

## Mobile

Mobile does not render the desktop Works Preview.

There are no artwork strips, horizontal thumbnail carousel or scroll-triggered substitute for the desktop hover interaction. The mobile Hero, collection information and `Explore Collection` action are sufficient.

Where architecture permits, desktop preview media should not be unnecessarily loaded on mobile merely to hide it with CSS.

## Motion and Scroll

The page uses natural vertical scroll. Scroll motion and Works Preview hover are separate interaction layers:

- scroll reveals the Collection Hero
- hover reveals the desktop artwork preview
- artwork micro-hover identifies an individual work

Hero entrance motion should remain restrained. Initial implementation references may include subtle media opacity/scale settling and a small content translate/fade entrance.

A desktop Hero may begin around `min-height: 80svh` as a visual hypothesis so the following collection can remain perceptible. This value is not frozen until visual QA.

All motion must respect `prefers-reduced-motion`, consistent with existing Del Carmen interaction behavior.

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

The existing `/series/[slug]` route remains the detailed collection experience.

Its gallery responsibility is already implemented through the Artwork Series domain and should remain distinct from `/collections` preview behavior.

The detail experience may evolve to include:

- title and artistic metadata
- full `statement`
- Featured Artwork
- detailed artwork gallery
- Exhibition History
- artwork exploration
- Continue Exploring / return navigation

These additions should extend the existing series experience rather than duplicate it inside `/collections`.

## Current Implementation Compatibility

At the time of this specification, the working codebase already contains `ArtworkSeries` under the Artworks domain and `/series/[slug]` consumes it. Home also resolves its featured collection through existing Artwork Series data/services.

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

This specification records approved direction before implementation and is intentionally not frozen.

Workflow:

Specification → component/file architecture → wireframe as needed → implementation → visual/responsive QA → specification reconciliation → implementation documentation → Approved / Frozen.

Implementation discoveries may refine non-semantic values such as exact Hero height, gradient stops, reveal percentages or animation timing. The specification should be updated only when a discovery changes a durable system or experience rule.

## Status

Collections v0.1 defines the approved Phase 1 conceptual and UX direction. Component architecture and implementation remain pending. After implementation and QA, this document must be reconciled with the final behavior before being promoted to Approved / Frozen.
