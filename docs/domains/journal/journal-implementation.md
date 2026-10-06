# Journal Implementation

Version: 1.0

Document ID:
DOC-JOURNAL-IMPL

Project:
Del Carmen Digital Experience

Parent Brand:
Rō Visual

Document Type:
Technical / Implementation

Authority Level:
High

Status:
🟢 Approved — Current Implementation Reconstructed

Owner:
Del Carmen Digital Experience

Last Updated:
2026-10-05

---

# Purpose

This document records the supplied current Phase 1 Journal implementation.

It is a documentation reconciliation artifact: the implementation already exists and this document brings the canonical documentation into alignment with it.

No unobserved backend, CMS, persistence or publishing behavior is assumed.

---

# Implemented Routes

## Journal Index

File:

`src/app/journal/page.tsx`

Responsibility:

- imports Journal domain root;
- renders `<Journal />`.

## Journal Entry

File:

`src/app/journal/[slug]/page.tsx`

Responsibilities:

- resolves async `params`;
- retrieves Journal Entry by slug;
- retrieves Journal Story by slug;
- retrieves complete Journal Entry collection;
- calls `notFound()` when Entry or Story is absent;
- renders `JournalEntryExperience`;
- renders shared Footer.

---

# Domain Structure

Supplied implementation:

```text
src/domains/journal/
├── components/
│   ├── JournalIndex.tsx
│   ├── JournalIndexMotion.tsx
│   └── entry/
│       ├── JournalCollection.tsx
│       ├── JournalEntryExperience.tsx
│       └── JournalEntryMotion.tsx
├── data/
│   ├── journalEntries.ts
│   └── journalStories.ts
├── index.tsx
└── types.ts
```

App routes:

```text
src/app/journal/
├── page.tsx
└── [slug]/
    └── page.tsx
```

macOS metadata such as `.DS_Store` and `__MACOSX` is not part of the implementation and should not be retained in canonical source/documentation packages.

---

# Domain Entry Point

`src/domains/journal/index.tsx`

Responsibilities:

- loads entries through `getJournalEntries()`;
- renders `JournalIndex`;
- renders shared Footer;
- exports Journal entry data/helper types required elsewhere.

The root `<main>` establishes:

- full width;
- horizontal clipping;
- canonical background;
- white text.

---

# Data Layer

## `journalEntries.ts`

Contains the current `JOURNAL_ENTRIES` catalogue.

Exports:

```ts
getJournalEntries()
getJournalEntryBySlug(slug)
getAdjacentJournalEntries(slug)
```

The adjacent helper is currently available but the supplied Journal detail route does not use it.

A commented previous/next retrieval block remains in the route source.

Therefore previous/next Journal navigation must not be documented as implemented UI.

## `journalStories.ts`

Contains `JOURNAL_STORIES`.

Exports:

```ts
getJournalStoryBySlug(slug)
```

Current supplied story content defines scenes for:

`the-art-of-remembering`

Other catalogue entries currently do not have supplied JournalStory records.

The route correctly protects this mismatch through `notFound()`.

---

# Type System

`types.ts` defines:

- `JournalEntry`;
- `JournalSceneLayout`;
- `JournalSceneMedia`;
- `JournalScene`;
- `JournalStory`.

Supported scene layouts:

```text
centered
split-left
split-right
immersive
```

Supported scene media:

```text
image
video
```

Video may include a poster.

---

# Journal Index Component

File:

`components/JournalIndex.tsx`

Responsibilities:

- renders Journal introduction;
- maps Journal entries;
- alternates media/content orientation on large screens;
- links media and editorial action to `/journal/[slug]`;
- uses `journalImage ?? image`;
- displays category/year/index position/title/excerpt;
- provides editorial image hover scaling.

The index is server-renderable presentation.

Motion is isolated into `JournalIndexMotion`, a client component.

---

# Journal Index Motion

File:

`components/JournalIndexMotion.tsx`

Client component.

Technology:

- React `useEffect`;
- GSAP.

Canonical constant:

```ts
const PARALLAX_STRENGTH = 0.55;
```

Responsibilities:

1. Journal introduction reveal.
2. Journal media-plane parallax.
3. reduced-motion detection.
4. scroll/resize listener lifecycle.
5. requestAnimationFrame scheduling.
6. GSAP context cleanup.

Parallax is calculated directly from each media element's current viewport geometry.

The implementation explicitly avoids:

- accumulated scroll delta;
- easing;
- interpolation.

This is a Journal-specific index behavior and should not automatically become a global motion primitive.

---

# Journal Entry Experience

File:

`components/entry/JournalEntryExperience.tsx`

Responsibilities:

- renders Hero;
- maps Story scenes;
- chooses layout renderer from scene data;
- renders Journal Collection.

Internal presentation helpers include:

- `SceneCopy`;
- `SceneMedia`;
- `SceneLight`;
- `JournalSceneBlock`.

## Scene Media

Image:

`<img>`

Video:

- `autoPlay`
- `muted`
- `loop`
- `playsInline`
- optional poster
- MP4 source

## Luminous Accent

`SceneLight` renders two soft atmospheric fields:

- warm brand-gold light core;
- quieter white haze.

Their motion is controlled by `JournalEntryMotion`.

---

# Journal Entry Motion

File:

`components/entry/JournalEntryMotion.tsx`

Client component.

Technology:

- GSAP;
- GSAP ScrollTrigger.

ScrollTrigger is registered at module level.

Primary responsibilities:

- Hero editorial reveal;
- Story scene reveal;
- scene media scaling;
- copy reveal;
- luminous accent animation;
- scroll-linked atmospheric behavior;
- current-scene dissolution;
- next-scene atmospheric pre-echo;
- Journal Collection arrival;
- reduced-motion handling;
- GSAP context cleanup.

The implementation explicitly preserves normal document scroll.

It does not pin Journal story scenes and does not hijack vertical scrolling.

---

# Hero Motion

Reveal hierarchy:

```text
metadata
→ title
→ excerpt
→ scroll invitation
```

The Hero container remains spatially stable.

Children carry temporal animation.

This separates editorial hierarchy from physical layout movement.

---

# Atmospheric Continuity

Between adjacent story scenes:

Current scene may:

- move copy slightly upward;
- reduce copy opacity;
- blur copy;
- scale media;
- reduce luminous field presence.

Next scene may begin atmospheric presence before entering fully:

- light appears;
- light core changes position/scale;
- media establishes restrained presence.

The next copy is not revealed by the pre-echo.

This preserves narrative sequencing.

---

# Journal Collection

File:

`components/entry/JournalCollection.tsx`

Client component.

Responsibilities:

- excludes `currentSlug`;
- returns `null` when no alternatives exist;
- renders heading/copy/index link;
- composes shared `KineticCarousel`;
- maps remaining entries into linked editorial cards.

Uses:

```ts
useMemo(
  () => entries.filter((entry) => entry.slug !== currentSlug),
  [entries, currentSlug]
)
```

KineticCarousel labels:

- `Explore previous journals`
- `Explore more journals`

The viewport receives:

`data-journal-collection-viewport`

so JournalEntryMotion can animate the collection viewport's arrival without taking ownership of the carousel track.

This boundary is important.

Journal owns the arrival composition.

KineticCarousel owns drag/wheel/momentum behavior.

---

# Shared Dependencies

Current Journal imports:

```text
@/shared/layout
@/shared/layout/footer
@/shared/ui/kinetic-carousel
```

External/runtime dependencies include:

```text
next/link
next/navigation
react
gsap
gsap/ScrollTrigger
```

No Journal-specific duplicate Footer, Container or kinetic engine is required.

---

# Accessibility

Implemented considerations include:

- reduced-motion detection;
- semantic `article`, `header`, `section` structures;
- links for Journal navigation;
- `aria-hidden` on decorative lines/overlays/lights;
- muted inline looping video.

Current supplied images use empty `alt=""`.

This is valid for decorative imagery but should be reviewed if future Journal media conveys content that is not otherwise available in text.

The current code does not establish a richer editorial alt-text model.

Do not invent one in documentation.

---

# Current Data / Content Limitations

The supplied index catalogue contains entries whose detail Story data is not yet supplied.

Because detail requires both Entry and Story, those routes resolve to `notFound()` until story data exists.

This is the principal current implementation/content reconciliation issue identified from the supplied files.

Also observed in current data:

- placeholder media paths remain;
- some editorial copy appears provisional;
- at least one title/copy string contains apparent spelling/casing issues.

These observations are content QA items.

They should not be silently corrected by this implementation document because the task is to record current source behavior.

---

# Production / QA Considerations

Before Journal is considered fully production-complete, verify at minimum:

- every public Journal catalogue entry has a matching JournalStory;
- all media paths resolve;
- final editorial copy is approved;
- image semantics/alt strategy is reviewed;
- video poster/fallback behavior is validated;
- responsive scene layouts are tested;
- reduced motion is tested;
- KineticCarousel interaction remains intact inside Journal Collection;
- GSAP/ScrollTrigger cleanup remains correct across client navigation;
- performance of full-bleed media and scroll-linked effects is validated;
- Journal metadata/SEO requirements are defined when SEO work begins.

These are verification requirements, not claims that each item is currently defective.

---

# Future Architecture

The current implementation uses local TypeScript data.

Future approved phases may introduce:

- CMS/Admin;
- database-backed publishing;
- richer editorial metadata;
- drafts/publication status;
- scheduling;
- authorship;
- tags/categories taxonomy;
- search;
- SEO metadata;
- media management/CDN;
- related-entry curation;
- internationalization.

None of these are claimed as implemented today.

Their future introduction must preserve the current domain boundary and contemplative experience unless explicitly revised.

---

# Implementation Status

Journal Index:
🟢 Implemented

Journal Entry architecture:
🟢 Implemented

Four scene layout types:
🟢 Implemented

GSAP editorial/atmospheric motion:
🟢 Implemented

Reduced-motion path:
🟢 Implemented

Shared KineticCarousel Journal Collection:
🟢 Implemented

Complete story data for every catalogue entry:
🟡 Incomplete in supplied source

Production content/media QA:
🟡 Requires verification

Future CMS/database publishing infrastructure:
⚪ Planned / Not Implemented

---

# Canonical Boundary

Journal owns:

- editorial entry/story models;
- Journal discovery presentation;
- Journal story composition;
- Journal-specific atmospheric motion;
- Journal Collection composition.

Shared architecture owns:

- Container;
- Footer;
- KineticCarousel mechanics;
- global design system;
- global app routing/runtime foundations.

This boundary should remain stable unless a demonstrated requirement justifies revision.

---

Del Carmen Digital Experience

Painting the Eternal Essence Within
