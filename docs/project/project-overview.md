# Project Overview

Version: 1.2

Document ID:\
DOC-PO

Project:\
Del Carmen Digital Experience

Parent Brand:\
Rō Visual

Document Type:\
Overview

Authority Level:\
Medium

Status:\
🟢 Approved

Owner:\
Del Carmen Digital Experience

Last Updated:\
2026-08-26

------------------------------------------------------------------------

## Overview

Del Carmen Digital Experience is the official digital platform for the
artistic universe of Del Carmen.

The project seeks to create an immersive digital experience where fine
art, memory, contemplation and technology coexist naturally.

Rather than functioning as a conventional portfolio, the platform is
conceived as an evolving digital ecosystem capable of growing alongside
the artistic career of Del Carmen.

------------------------------------------------------------------------

## Vision

To create one of the most refined digital experiences for contemporary
fine art, where every interaction reflects beauty, serenity and timeless
craftsmanship.

------------------------------------------------------------------------

## Mission

To connect people with meaningful works of art through an elegant
digital experience that respects both artistic integrity and
technological excellence.

------------------------------------------------------------------------

## Documentation Structure

``` text
docs/
├── architecture/
├── components/
├── database/
├── identity/
├── pages/
├── project/
└── prompts/
```

------------------------------------------------------------------------

## Documentation Hierarchy

### Identity

-   Brand Philosophy
-   Brand Lexicon
-   Design Tokens

### Business

-   Domain Model
-   Artwork Model

### Architecture

-   Repository Structure
-   System Architecture
-   Folder Architecture
-   Tech Stack

### User Experience

-   Home Specification
-   Home Wireframe
-   Home Moodboard
-   Home Art Direction
-   Hero Blueprint
-   Visual Language

### Production

-   Project Memory
-   Roadmap
-   Implementation Roadmap
-   Governance
-   Master Index
-   Future AI Prompts

------------------------------------------------------------------------

## Current Project Status

### Foundation

Completed:

-   Brand Philosophy
-   Design Tokens
-   Project Manifesto
-   Project Memory
-   Repository Structure
-   System Architecture
-   Folder Architecture
-   Tech Stack
-   Home Specification
-   Home Wireframe
-   Home Moodboard
-   Governance
-   Documentation System

### Current Development Stage

**Phase 1 --- MVP Implementation**

The architectural foundation is complete and active implementation is
underway.

The Home experience has progressed through its principal scenes,
including Hero, Featured Artwork, Artist Statement, Featured Collection,
Selected Works, Journal Preview, Invitation and Footer.

The artwork experience has also progressed beyond the initial gallery
foundation, including artwork discovery, filtering, artwork detail
experiences, responsive interaction patterns and artwork-series support.

The platform continues to be implemented incrementally according to the
approved architecture, documentation hierarchy and governance rules.

------------------------------------------------------------------------

## Current Experience Architecture

The public experience is being developed around distinct but connected
content levels:

``` text
Home
├── Curated artwork experiences
├── Featured collections / series
└── Editorial and invitation experiences

Artworks
├── Artwork discovery
├── Category filtering
└── Artwork detail

Collections / Series
├── Series discovery
├── Series detail
└── Related artworks
```

Artwork and series media remain semantically distinct. Individual
artworks maintain their canonical visual representations, while an
Artwork Series may define its own editorial media for collection-level
presentation.

------------------------------------------------------------------------

## Development Principles

-   Documentation precedes implementation.
-   Business drives architecture.
-   Architecture supports implementation.
-   Simplicity over unnecessary complexity.
-   Progressive scalability.
-   Reusable components.
-   Domain-oriented organization.
-   Consistency before convenience.
-   Approved documentation and implementation must remain synchronized.
-   New capabilities should extend the architecture rather than force
    rewrites.

------------------------------------------------------------------------

## Final Statement

Del Carmen Digital Experience is designed as a long-term digital
platform.

Every decision made throughout the project should reinforce artistic
excellence, technical quality and a timeless user experience.

The platform should evolve progressively while preserving the
conceptual, visual and architectural principles established at its
foundation.

------------------------------------------------------------------------

Del Carmen Digital Experience\
*Painting the Eternal Essence Within*


---

# Project Overview Evolution Update — 2026-10-05

This section extends the complete approved Project Overview v1.1 above.

DOC-PO remains **Medium Authority / Approved**.

## Current Interpretation

Del Carmen Digital Experience remains an evolving digital ecosystem rather than a conventional portfolio.

The original Vision, Mission and Development Principles remain valid.

The project has progressed substantially beyond the implementation snapshot recorded in v1.1.

This addendum records that evolution without deleting the earlier historical state.

## Documentation Evolution

The current documentation system now includes established areas for:

- architecture and governance;
- identity;
- experience;
- domains;
- page-level specifications and implementation;
- project memory and roadmap.

The exact physical documentation tree is governed by the current repository/documentation package rather than the older illustrative tree in this Overview.

The older tree remains preserved as historical context.

## Current Phase

The project remains in:

`Phase 1 — MVP`

The current documentation focus is source-of-truth reconciliation after substantial Phase 1 implementation advances.

This does not cancel remaining QA, production, deployment or roadmap work.

## Current Experience Advances

Since the v1.1 snapshot, approved implementation has advanced through:

- Collections discovery for ArtworkSeries;
- Series detail experiences;
- shared KineticCarousel;
- contextual Artwork Lightbox;
- Series-aware Artwork Detail navigation;
- three-scene kinetic Artwork Detail navigation;
- direct trackpad/pointer interaction with momentum continuity;
- symmetric edge resistance;
- current-document Artwork Detail onboarding behavior;
- Journal implementation advances beyond the supplied documentation package.

The current canonical domain relationship is:

`ArtworkSeries` = canonical body-of-work model

`/collections` = editorial discovery experience

`/series/[slug]` = ArtworkSeries detail

Visitor-facing `Collection` remains valid editorial terminology.

## Completed / Frozen Phase 1 Areas

The documentation records completed/frozen Phase 1 experiences including:

- Artist;
- About;
- Contact;
- Newsletter.

Frozen protects approved work while still allowing verified bug fixes, accessibility corrections, production requirements or explicitly approved revisions.

## Documentation Status Nuance

A document listed historically as `Completed` in an Overview is not automatically promoted to Approved if its own canonical metadata says Draft or In Progress.

For example, foundational and architectural documents retain their own explicit status unless a later approved decision changes it.

This prevents summary documents from silently overriding source-document governance.

## Journal Reconciliation

Journal implementation has progressed beyond the supplied canonical documentation package.

The absence of a dedicated Journal specification in that package must not be interpreted as cancellation or nonexistence.

Journal remains a documentation reconciliation item.

## Future Platform Direction

The long-term ecosystem remains preserved.

Future capabilities documented elsewhere — including Collector experiences, CMS/Admin, Marketplace, Virtual Museum, Academy, Community, Rō Visual Lab and unified ecosystem capabilities — remain part of the project's planned evolution unless explicitly superseded.

Not implemented does not mean removed.

## Audit Note

Version 1.2 uses the conservative documentation method.

The complete supplied v1.1 Overview is preserved above apart from Version metadata.

Historical project-state statements remain visible.

Later implementation is recorded as evolution rather than rewriting the earlier snapshot.
