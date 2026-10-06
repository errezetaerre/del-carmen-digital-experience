# README-AI — Del Carmen Digital Experience

Version: 1.0

Document ID:
DOC-AI-HANDOFF

Project:
Del Carmen Digital Experience

Parent Brand:
Rō Visual

Document Type:
AI Handoff / Reconstruction Entry Point

Authority Level:
Operational

Status:
🟢 Approved

Owner:
Del Carmen Digital Experience

Last Updated:
2026-10-05

---

# Purpose

This document is the entry point for an AI system, coding agent, developer or future collaborator receiving the Del Carmen Digital Experience project package.

Its purpose is not to redefine the project.

Its purpose is to explain how to interpret the supplied documentation, source code, assets and future architecture without destroying the distinctions already established by the project.

Before generating, rewriting or restructuring implementation, read this document and then follow the documentation authority described below.

---

# Prime Directive

Del Carmen Digital Experience is not a conventional portfolio or generic commerce website.

It is a long-term digital artistic ecosystem designed around contemplation, fine art, memory, humanity and purposeful technology.

The artwork is always more important than the interface.

Technology should support the encounter with the work rather than become the remembered subject of the experience.

Do not redesign the project into a generic template.

Do not optimize away intentional silence, space, pacing or atmosphere merely because a more conventional interface would be easier to implement.

---

# Reconstruction Principle

When reconstructing the project, use this distinction:

```text
DOCUMENTATION
= architectural, experiential and strategic authority

CURRENT SOURCE CODE
= implementation truth for behavior that is already implemented

ASSETS
= visual/media source material

PLANNED / FUTURE DOCUMENTATION
= approved direction, not permission to implement everything immediately
```

The goal is faithful reconstruction, not speculative redesign.

---

# Required Reading Order

Begin with:

1. `project/project-memory.md`
2. `project/master-index.md`
3. `project/project-manifesto.md`
4. `DOCUMENTATION-REVIEW.md`
5. `project/project-overview.md`

Then read the relevant architectural foundation:

6. `architecture/governance.md`
7. `architecture/system-architecture.md`
8. `architecture/domain-model.md`
9. `architecture/repository-structure.md`
10. `project/folder-architecture.md`
11. `project/tech-stack.md`
12. `architecture/implementation-roadmap.md`
13. `project/roadmap.md`

Then identity and experience:

14. `identity/brand-philosophy.md`
15. `identity/brand-lexicon.md`
16. `identity/design-tokens.md`
17. `identity/visual-language.md`
18. `experience/experience-principles.md`
19. `experience/hero-blueprint.md`

After this foundation, read the specification, wireframe and implementation documentation for the module being reconstructed or modified.

Do not read one isolated implementation document and assume it represents the entire project philosophy or future architecture.

---

# Authority and Conflict Resolution

When information overlaps, use the authority model recorded by the current Master Index and Project Memory.

Operationally:

```text
Project Memory / explicit approved decisions
        ↓
Highest-authority architecture / governance
        ↓
Approved domain and page specifications
        ↓
Identity / experience systems
        ↓
Wireframes and implementation documentation
        ↓
Drafts / moodboards / treatments / exploratory material
```

However, source code is authoritative for the exact behavior of an already implemented current feature when documentation describes that same implementation incompletely.

If code and documentation materially disagree:

1. Do not silently choose whichever is easier.
2. Determine whether the documentation describes current, historical, superseded, planned or future state.
3. Check Project Memory and Documentation Review.
4. Preserve the conflict if it cannot be resolved safely.
5. Request clarification before making a destructive architectural change.

---

# Status Vocabulary

Treat decision status and implementation status as separate dimensions.

Examples:

```text
Approved / Implemented
Approved / Future — Not Yet Implemented
Draft / Not Implemented
Approved / Complete / Frozen
Approved Direction / Planned Media Master
Superseded
```

Never interpret:

`not implemented`

as:

`cancelled`

Never interpret:

`planned`

as:

`already implemented`

Never interpret:

`canonical for Phase 1`

as:

`permanently immutable for every future phase`

---

# Conservative Change Method

Use the project's conservative documentation and architecture method:

## PRESERVE

Keep valid existing information and approved future direction.

## EXTEND

Add later approved information without erasing legitimate history.

## UPDATE

Revise when the project has genuinely evolved.

## SUPERSEDE

Replace a prior rule only through an explicit later approved decision, while preserving traceability.

## REMOVE

Use only for objective junk, corruption, proven duplicate material or explicitly obsolete implementation where removal is justified.

Do not simplify the project by deleting future architecture merely because it is not currently visible in the application.

---

# Current Phase

The project remains in Phase 1 — MVP with substantial approved implementation already completed.

Current canonical implementation includes major experiences such as:

- Home;
- Artist;
- About;
- Artworks;
- Collections / Artwork Series;
- Series detail;
- Journal;
- Contact;
- Newsletter;
- shared artwork lightbox behavior;
- shared kinetic artwork browsing;
- Artwork Detail kinetic navigation.

Some modules are explicitly complete/frozen for their current Phase 1 scope.

Frozen means do not casually redesign them.

Verified bugs, accessibility defects, production requirements and explicitly approved revisions remain legitimate reasons for change.

---

# Canonical Domain Boundary

`ArtworkSeries` is the canonical domain model for a body of work.

Public terminology may use:

`Collection`

without creating a parallel `Collection` persistence model.

Canonical public relationship:

```text
/collections
    ↓
editorial discovery of ArtworkSeries

/series/[slug]
    ↓
detailed ArtworkSeries experience
```

Current Phase 1 Artwork relationship:

`Artwork.seriesId?: string`

Future many-to-many evolution remains possible when a demonstrated requirement exists.

Do not introduce a duplicate Collection business model merely because the public UI says “Collection”.

---

# Home

Current canonical narrative:

```text
Hero
→ Featured Artwork
→ Artist Statement
→ Featured Collection
→ Selected Works
→ Journal Preview
→ Invitation
→ Footer
```

Current curation relationship:

```text
Hero                 → Artwork
Featured Artwork     → Artwork
Featured Collection  → ArtworkSeries
Selected Works       → curated Artwork records
Journal Preview      → Journal
Invitation           → continued relationship / Newsletter
```

Do not collapse Featured Collection and Selected Works into one scene.

---

# Motion and Interaction

GSAP is the approved technology for advanced artistic motion where the experience requires it.

Motion remains subordinate to art.

Reduced-motion accessibility is mandatory.

The broader Del Carmen motion vocabulary includes concepts such as:

- Stillness;
- Atmospheric Reveal;
- Materialization;
- Spatial Drift;
- Luminous Accent;
- Portal Transition.

These are expressive concepts, not effects that must appear everywhere.

---

# Shared Kinetic Interaction

Current shared primitive:

```text
src/shared/ui/kinetic-carousel/
├── KineticCarousel.tsx
├── useKineticCarousel.ts
└── index.ts
```

Collections, Series and Journal may reuse this primitive.

Do not create a competing carousel engine for equivalent horizontal artwork browsing without a demonstrated requirement.

Do not convert local editorial composition rules into global KineticCarousel rules.

The current fixed item-width solution and delayed drag ownership behavior are canonical for the approved implementation unless a verified shared defect requires revision.

---

# Artwork Detail

Artwork Detail uses a three-scene spatial navigation model:

```text
previous
current
next
```

Input may include:

- trackpad;
- pointer drag;
- touch/swipe;
- keyboard arrows.

Vertical scrolling remains natural.

Fullscreen viewing is isolated from horizontal scene navigation.

Current physical principle:

> The artwork must feel as though it has weight.

Preserve direct gesture response, momentum continuity, symmetric edge resistance and one-navigation-per-gesture semantics unless an explicitly approved revision changes them.

Do not replace the current interaction with a generic slider merely because it is simpler.

---

# Journal

Journal is an editorial reflection experience rather than a conventional blog.

Current routes:

```text
/journal
/journal/[slug]
```

Current story architecture supports:

```text
centered
split-left
split-right
immersive
```

Journal uses normal vertical document scrolling.

It may use GSAP / ScrollTrigger for atmospheric editorial motion.

Journal Collection reuses the shared KineticCarousel.

The future broader Journal / Content Platform remains distinct from the current Phase 1 implementation.

---

# Completed / Frozen Areas

Current documentation identifies Phase 1 areas including Artist, About architecture, Contact and Newsletter as complete/frozen for their approved scope.

Do not redesign them indirectly while working on another module.

About retains an important media distinction:

- current poster/fallback may be implemented;
- final audiovisual master may remain planned.

---

# Current Technology Baseline

Use `project/tech-stack.md` as canonical technology authority.

The current baseline includes the documented Next.js / React / TypeScript / Tailwind architecture and the current supporting technologies used by implemented Phase 1 services and motion.

Future planned technologies such as PostgreSQL, Prisma, authentication, media infrastructure, CMS/Admin and related platform services remain future architecture until their implementation phase is approved.

Do not prematurely create infrastructure simply because it appears in the long-term architecture.

---

# Design System

Respect:

- `identity/design-tokens.md`
- `identity/visual-language.md`
- `experience/experience-principles.md`

`globals.css` is the current implementation authority for global visual styling where documented.

Use the shared Container for recurring global layout behavior.

Scene-specific immersive composition may intentionally diverge from standard Container geometry when approved.

Do not promote every local numeric value into a global token.

Do not scatter repeated global rules as unrelated magic numbers.

---

# Responsive Reconstruction

Responsive adaptation is not a mechanical reduction of desktop.

Preserve:

- artwork dominance;
- editorial hierarchy;
- visual silence;
- readable typography;
- intentional negative space;
- narrative order;
- interaction meaning.

Mobile may use different geometry or interaction mechanics when necessary while preserving the same emotional hierarchy.

---

# Assets

Treat supplied artwork and media assets as source material.

Do not replace them with generated approximations unless explicitly instructed.

Do not crop, recolor, distort or reinterpret artwork merely to fit a layout.

Artwork integrity has priority over interface convenience.

If a documented asset is absent from the package, report it rather than silently generating a substitute.

---

# Secrets and Environment

Never expect production secrets to be included in a reconstruction package.

Use `.env.example` as the contract for required environment variables.

Do not commit:

- `.env.local`;
- API secrets;
- authentication secrets;
- private tokens;
- production credentials.

When a service cannot function without a missing secret, preserve the integration and report the missing configuration.

Do not replace it with an unrelated service without approval.

---

# Future Architecture

The project intentionally preserves future directions including, where documented:

- PostgreSQL / Prisma;
- authentication;
- Cloudinary/media infrastructure;
- CMS / Admin;
- Marketplace;
- Collector experiences;
- Virtual Museum;
- Academy;
- Community;
- immersive environments;
- exhibitions;
- licensing;
- archive;
- broader content infrastructure.

These are part of the project's trajectory.

They are not a mandate to implement all of them during reconstruction.

---

# AI Behavior

An AI reconstructing or modifying Del Carmen should:

- inspect before changing;
- preserve approved behavior;
- prefer existing shared primitives;
- avoid premature abstraction;
- avoid duplicate domain models;
- avoid speculative infrastructure;
- distinguish bugs from redesign opportunities;
- keep future architecture documented;
- surface unresolved contradictions;
- preserve accessibility;
- validate responsive behavior;
- run build/type/lint checks available to the project;
- never claim completion without verification.

An AI must not treat its own aesthetic preference as authority over approved project decisions.

---

# Reconstruction Success

A reconstruction is successful when:

1. the application runs with the documented technology baseline;
2. canonical public routes resolve;
3. implemented experiences preserve their documented narrative and interaction behavior;
4. shared primitives remain shared;
5. domain boundaries remain intact;
6. artwork/media integrity is preserved;
7. responsive behavior remains coherent;
8. reduced-motion/accessibility behavior remains available;
9. no secrets are required from the package itself;
10. future architecture remains documented without being falsely reported as implemented;
11. build and available static checks pass or unresolved failures are explicitly reported.

Exact visual fidelity should be validated against the supplied source implementation and assets, not inferred solely from prose documentation.

---

# Final Instruction

Reconstruct Del Carmen Digital Experience as Del Carmen Digital Experience.

Do not reconstruct a generic artist portfolio that happens to contain the same content.

Preserve the intention, architecture, atmosphere and evolution of the project.

---

Del Carmen Digital Experience

Painting the Eternal Essence Within
