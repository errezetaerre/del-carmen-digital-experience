# About Implementation

Version: 1.0

Document ID: DOC-AI

Project: Del Carmen Digital Experience

Parent Brand: Rō Visual

Document Type: Implementation

Authority Level: High

Status: 🟢 Approved / Complete / Frozen

Owner: Del Carmen Digital Experience

Last Updated: 2026-09-07

---

# Purpose

This document records the canonical implementation architecture of About Page v1.0.

It distinguishes implemented behavior from the planned final audiovisual master for The Encounter.

---

# Public Route

`src/app/about/page.tsx`

Public URL:

`/about`

---

# Domain Ownership

Canonical domain:

`src/domains/about/`

Current structure:

```text
src/domains/about/
├── index.tsx
└── sections/
    ├── hero/
    │   ├── AboutHero.tsx
    │   └── AboutHeroMotion.tsx
    ├── film/
    │   └── AboutFilm.tsx
    ├── essence/
    │   ├── AboutEssence.tsx
    │   └── AboutEssenceMotion.tsx
    ├── ecosystem/
    │   ├── AboutEcosystem.tsx
    │   └── AboutEcosystemMotion.tsx
    └── continue/
        ├── AboutContinue.tsx
        └── AboutContinueMotion.tsx
```

The `film/` folder may remain in the domain, but `AboutFilm` is not a separately rendered scene in the canonical page composition.

The film/poster experience belongs inside Hero.

---

# Canonical Composition

```tsx
<main>
  <AboutHero />
  <AboutEssence />
  <AboutEcosystem />
  <AboutContinue />
  <Footer />
</main>
```

The shared Footer is imported from:

`src/shared/layout/footer/`

---

# Server / Client Boundaries

Server Components remain the default.

Client Components are introduced only for browser-dependent GSAP behavior.

The motion components are:

- `AboutHeroMotion`
- `AboutEssenceMotion`
- `AboutEcosystemMotion`
- `AboutContinueMotion`

No generalized About motion framework is required.

Motion remains scene-specific.

---

# Hero Media

Current poster:

`public/about/film/the_encounter_poster.png`

The poster is rendered as full-bleed background media.

The future final film must be replaceable without changing the surrounding scene architecture.

The Play control is independent HTML/CSS UI.

It must not be embedded into the poster image.

The background media is decorative relative to the visible textual meaning and may therefore use empty alt text.

---

# Motion Architecture

GSAP is the canonical motion technology.

All About motion follows these rules:

- no generic repeated fade system
- no default scrub behavior
- disclosure depends on physical scroll position
- ordinary reveals run once
- reduced-motion accessibility is mandatory
- GSAP contexts and matchMedia contexts are cleaned up
- scene-specific composition remains local

---

# Hero Motion

Hero motion runs on initial scene presentation rather than a ScrollTrigger.

Mobile portrait:

`(max-width: 767px) and (orientation: portrait)`

Sequence:

01 Media  
02 Eyebrow  
03 Headline lines  
04 Copy  
05 Play  
06 Atmospheric light

Tablet / desktop / landscape preserve the approved cinematic overlapping timing.

Hero content is visible by default.

`.about-hero-motion` must not be added to the global hydration-hidden selector.

---

# Essence Motion

Hydration protection:

`.about-essence-motion`

The wrapper is hidden only when reduced motion is not requested.

The animation is prepared while hidden, then the wrapper becomes visible.

Trigger:

`.about-essence-content`

Approved start:

`top 58%`

Behavior:

Rule → Eyebrow → progressive word illumination → Supporting Copy

`once: true`

No scrub.

---

# Ecosystem Motion

Hydration protection:

`.about-ecosystem-motion`

Trigger:

`.about-ecosystem-architecture`

Approved start:

`top 62%`

Behavior:

Context → Parent → Parent Connector → Horizontal Connector → Child Connectors → Child Identities

`once: true`

No scrub.

---

# Continue Motion

Hydration protection:

`.about-continue-motion`

Trigger:

`.about-continue-pathways`

Approved start:

`top 58%`

`once: true`

## Mobile Portrait

The motion is grouped by semantic path.

Sequence:

Eyebrow → Heading → complete Artist path → complete Artworks path

Each path reveals its line, title, supporting copy and arrow before the next path begins.

## Tablet / Desktop / Landscape

The approved existing editorial overlap remains unchanged.

---

# Hydration Safety

The canonical no-preference hydration protection includes separate selectors for:

- `.about-essence-motion`
- `.about-ecosystem-motion`
- `.about-continue-motion`

Hero is deliberately excluded because its content must remain visible before JavaScript initialization.

Reduced-motion users receive visible static content.

---

# Layout

The shared named Container export is used as:

```tsx
import { Container } from "@/shared/layout/container";
```

Standard editorial alignment uses Container.

Hero full-bleed media is an approved compositional exception.

The page root prevents horizontal overflow with `overflow-x-clip`.

---

# Responsive Status

About-specific responsive QA has been completed.

Reviewed behavior includes:

- Hero copy and media crop
- independent Play positioning
- Essence typography
- Ecosystem hierarchy
- Continue pathways
- shared Footer
- desktop
- tablet
- mobile portrait
- mobile landscape

Navigation links and About-related routes have also been reviewed.

---

# Accessibility Requirements

Implemented / required:

- reduced-motion support
- visible static fallback
- accessible Play label
- textual meaning outside audiovisual media
- no essential information communicated solely by animation

Before the final film becomes production-active:

- Play must invoke a real media experience rather than remain misleading
- final film must have an accessible transcript or equivalent textual alternative
- sound must remain optional for comprehension

---

# Planned Media Replacement

The final ~60-second film `The Encounter` is not yet the canonical production master.

Its treatment is approved separately in `about-film-treatment.md`.

The current poster-based Hero is the canonical implemented About v1.0 visual state.

Replacing the poster with the approved final film is a media integration task, not an About architecture redesign.

---

# Freeze Rule

About v1.0 must not be redesigned during Phase 1 unless a verified bug, accessibility defect, production issue or explicitly approved experience revision requires change.
