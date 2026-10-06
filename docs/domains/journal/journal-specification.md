# Journal Specification

Version: 1.0

Document ID:
DOC-JOURNAL-SPEC

Project:
Del Carmen Digital Experience

Parent Brand:
Rō Visual

Document Type:
Domain / Experience Specification

Authority Level:
High

Status:
🟢 Approved — Reconstructed from Current Implementation

Owner:
Del Carmen Digital Experience

Last Updated:
2026-10-05

---

# Reconstruction Notice

This document reconstructs the canonical Journal specification from the current supplied Journal implementation.

It does not invent functionality that is absent from the supplied code.

The reconstruction is based on:

- `src/domains/journal/`
- `src/app/journal/page.tsx`
- `src/app/journal/[slug]/page.tsx`

The Journal implementation predates this canonical specification; this document reconciles documentation with the implemented Phase 1 experience.

---

# Purpose

Journal is the editorial and reflective domain of Del Carmen Digital Experience.

Its role is to extend the visitor journey from seeing artwork into thought, memory, process, conversation and contemplation.

Journal is not a conventional blog feed.

It is an editorial experience in which writing, media, atmosphere and motion are composed as a sequence.

Canonical emotional transition:

`seeing → thinking`

---

# Public Routes

Journal Index:

`/journal`

Journal Entry:

`/journal/[slug]`

The index is the discovery surface.

The entry route is the immersive story surface for one Journal entry.

---

# Domain Model

## JournalEntry

```ts
interface JournalEntry {
    slug: string;
    category: string;
    year: number;
    title: string;
    excerpt: string;
    image: string;
    journalImage?: string;
    featured?: boolean;
}
```

Responsibilities:

- `slug` — canonical route identifier.
- `category` — editorial classification.
- `year` — publication/editorial year.
- `title` — public title.
- `excerpt` — short editorial introduction.
- `image` — canonical clean/original image used by broader Journal experiences.
- `journalImage` — optional editorial image prepared specifically for Journal Index presentation.
- `featured` — optional curation flag.

## JournalStory

```ts
interface JournalStory {
    slug: string;
    scenes: JournalScene[];
}
```

A Journal Entry and Journal Story are joined by the same `slug`.

A detail route is valid only when both the entry and its story exist.

If either is missing, the route resolves through Next.js `notFound()`.

## JournalScene

```ts
interface JournalScene {
    id: string;
    layout:
        | "centered"
        | "split-left"
        | "split-right"
        | "immersive";
    media?: JournalSceneMedia;
    eyebrow?: string;
    title?: string;
    text?: string;
}
```

Scene media supports:

- image;
- video;
- optional video poster.

---

# Journal Index

The Journal Index opens with an editorial introduction:

Eyebrow:
`Journal`

Headline:
`Thoughts, stories and quiet observations.`

Supporting statement:
`Reflections on art, memory, creation and the quiet moments that shape the work.`

Entries are presented as a vertical editorial catalogue.

Desktop alternates image/content orientation by index.

Each entry exposes:

- editorial media;
- category;
- year;
- catalogue position;
- title;
- excerpt;
- route to `/journal/[slug]`.

The index is contemplative and spatial rather than a compact article grid.

---

# Journal Entry Experience

Each Journal Entry contains:

1. Editorial Hero
2. Ordered Story Scenes
3. Journal Collection
4. Shared Footer

The Hero exposes:

- link back to Journal;
- category;
- year;
- title;
- excerpt;
- `Scroll to explore ↓` invitation.

Story scenes are rendered in their declared order.

The implementation supports four scene compositions.

## Centered

Media becomes full atmospheric background.

Copy is centered over the media.

## Immersive

Media occupies the full scene atmosphere.

Copy is anchored toward the lower portion of the scene.

## Split Left

Media and copy form two editorial surfaces.

Media occupies the left side on large screens.

## Split Right

Same editorial structure with media on the right.

On smaller screens the grid naturally recomposes vertically.

---

# Journal Collection

After the story, the current entry is excluded and all remaining Journal entries form the Journal Collection.

The collection provides:

- `Journal Collection` heading;
- `Continue through the remaining reflections.`;
- link to `/journal`;
- shared `KineticCarousel`;
- links to other Journal entries.

The collection reuses the shared kinetic interaction primitive rather than creating a Journal-specific carousel engine.

This reuse does not make Journal presentation rules global KineticCarousel rules.

---

# Motion Language

Journal uses GSAP for approved editorial and atmospheric motion.

The implementation includes:

- Index introduction reveal;
- Index image parallax derived directly from current viewport position;
- Entry Hero editorial reveal;
- scene media scaling;
- scene copy reveal;
- luminous atmospheric fields;
- scroll-linked scene transitions;
- atmospheric continuity between adjacent scenes;
- Journal Collection arrival.

The story preserves normal document scrolling.

No pinning or scroll hijacking is part of the current Journal story architecture.

Motion must remain subordinate to reading and artwork.

---

# Reduced Motion

`prefers-reduced-motion: reduce` is respected.

When reduced motion is requested, animated state is cleared so content remains directly available.

Reduced motion is a canonical accessibility requirement, not an optional enhancement.

---

# Media Behavior

Journal Index prefers:

`journalImage ?? image`

Journal Entry scenes use media declared in `JournalStory`.

Video scenes:

- autoplay;
- muted;
- loop;
- playsInline;
- optional poster.

Current image elements use decorative empty alt text in the supplied implementation.

Accessibility semantics for future editorial media may be refined when content requirements distinguish decorative from meaningful imagery.

---

# Data Source

Current Phase 1 data is local TypeScript data:

`data/journalEntries.ts`

`data/journalStories.ts`

Current helpers include:

- `getJournalEntries()`
- `getJournalEntryBySlug(slug)`
- `getAdjacentJournalEntries(slug)`
- `getJournalStoryBySlug(slug)`

`getAdjacentJournalEntries()` exists in the data layer but is not currently used by the supplied detail route.

The existence of the helper does not make previous/next entry navigation part of the current canonical UI.

---

# Current Content State

The supplied Journal Entry catalogue contains multiple entries.

The supplied Journal Story data currently contains a fully defined scene story for:

`the-art-of-remembering`

Therefore, only entries with both `JournalEntry` and `JournalStory` data can resolve as implemented detail experiences.

This is a current content/data limitation, not a reason to remove the remaining catalogue entries from the domain model.

---

# Shared Dependencies

Journal currently depends on:

- shared `Container`;
- shared `Footer`;
- shared `KineticCarousel`;
- Next.js `Link`;
- Next.js App Router;
- GSAP;
- GSAP ScrollTrigger.

Journal must not duplicate these shared responsibilities locally without a demonstrated requirement.

---

# Future Evolution

Journal is expected to evolve as the broader Del Carmen content platform develops.

Possible future persistence, CMS/Admin, search, richer editorial metadata, SEO, publishing workflow, media infrastructure or content taxonomy must be introduced through approved architecture.

The current local TypeScript data model is the canonical Phase 1 implementation, not a permanent prohibition against future content infrastructure.

Future evolution must preserve the Journal's contemplative editorial identity.

---

# Canonical Principle

Journal should feel like entering a reflection, not opening a conventional blog.

The interface supports thought.

The writing, imagery and atmosphere remain the protagonists.

---

Del Carmen Digital Experience

Painting the Eternal Essence Within
