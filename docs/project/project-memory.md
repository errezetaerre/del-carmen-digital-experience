# Project Memory

Version: 1.4

Document ID:

DOC-MEN

Project:

Del Carmen Digital Experience

Parent Brand:

Rō Visual

Document Type:

Governance

Authority Level:

Highest

Status:

🟢 Approved

Owner:

Del Carmen Digital Experience

Last Updated:

2026-09-01

------------------------------------------------------------------------

# Purpose

This document is the single source of truth for all approved project
decisions.

It records only finalized decisions.

Ideas and proposals are intentionally excluded.

Every AI assistant, designer and developer must consult this document
before generating code, interfaces or documentation.

------------------------------------------------------------------------

## Decision 001

Category

Brand

Decision

The official project name is:

Del Carmen Digital Experience

Status

## Superseded by Decision 022

## Decision 002

Category

Brand

Decision

The parent creative brand is:

R≈ç Visual

Status

Approved

------------------------------------------------------------------------

## Decision 003

Category

Artist Signature

Decision

The artist identity is:

Del Carmen (RZR)

Status

Approved

------------------------------------------------------------------------

## Decision 004

Category

Language

Decision

The entire project is written in English.

Status

Approved

------------------------------------------------------------------------

## Decision 005

Category

Brand Philosophy

Decision

The experience is human, universal and contemplative.

It is never explicitly religious.

Status

Approved

------------------------------------------------------------------------

## Decision 006

Category

Experience

Decision

The visitor should slow down instead of being pushed to purchase.

Status

Approved

------------------------------------------------------------------------

## Decision 007

Category

Golden Rule

Decision

The artwork is always more important than the interface.

Status

Approved

------------------------------------------------------------------------

## Decision 008

Category

Visual Identity

Decision

Official slogan:

Painting the Eternal Essence Within

Status

Approved

------------------------------------------------------------------------

## Decision 009

Category

Visual Language

Decision

The website breathes.

Large whitespace is mandatory.

Status

Approved

------------------------------------------------------------------------

## Decision 010

Category

Color System

Decision

Smoke Ivory

Smoke Charcoal

Muted Bronze

Warm Linen

These are the official base colors.

Status

Superseded by Decision 023

------------------------------------------------------------------------

## Decision 011

Category

Navigation

Decision

Conventional navigation labels are maintained to avoid confusing users.

Status

Approved

------------------------------------------------------------------------

## Decision 012

Category

Architecture

Decision

Frontend follows Feature-Based Architecture.

Backend follows MVC with Service Layer and Repository Pattern.

Status

Approved

------------------------------------------------------------------------

## Decision 013

Category

Technology

Decision

The canonical technology stack is governed by tech-stack.md.

The project currently uses:

-   Next.js
-   React
-   TypeScript
-   Tailwind CSS
-   Vercel

Future infrastructure and platform technologies are introduced according
to the approved roadmap and architecture documents.

Motion technology is governed separately by Decision 024.

Status

Approved

------------------------------------------------------------------------

## Decision 014

Category

Development

Decision

The project is modular.

Every section is developed as an independent reusable component.

Status

Approved

------------------------------------------------------------------------

## Decision 015

Category

Documentation

Decision

Documentation drives development.

Code is generated only after documentation is approved.

Status

Approved

------------------------------------------------------------------------

## Decision 016

Category

Methodology

Decision

Every approved document becomes immutable unless a strategic decision
requires revision.

Status

Approved

------------------------------------------------------------------------

## Decision 017

Category

Future Vision

Decision

The architecture must support future expansion including:

Virtual Museum

Marketplace

Online Academy

Artist Community

Collector Dashboard

without structural redesign.

Status

Approved

------------------------------------------------------------------------

## Decision 018

Category

Production

Decision

The Home page is the first production milestone.

All future modules must inherit its design principles.

Status

Approved

  ---------------------
  \## Decision 019
  ---------------------
  \## Decision 020

  Category

  Documentation

  Status

  Approved

  Decision

  Each core concept
  must have a single
  source of truth.

  Documents must
  reference each other
  instead of
  duplicating content.

  The Brand Philosophy
  is the highest-level
  document for all
  identity-related
  decisions.

  Every identity
  document must inherit
  from it.

  Reasoning

  A single source of
  truth prevents
  inconsistencies,
  simplifies
  maintenance and
  ensures that AI
  assistants, designers
  and developers always
  work from the same
  foundation.

  Impact

  No future document
  may redefine the
  brand philosophy.

  Changes to the brand
  must be made only in
  brand-philosophy.md
  and then inherited by
  the rest of the
  documentation.

  No new division
  should be created
  without updating the
  Brand Ecosystem.
  ---------------------

Decision 021 Category Code Convention Status Approved Decision The
project follows the following naming conventions: ‚Ä¢ Folders use
lowercase. ‚Ä¢ React Components use PascalCase. ‚Ä¢ TypeScript
interfaces and types use PascalCase. ‚Ä¢ Utility files (index.ts,
types.ts, constants.ts, helpers.ts, etc.) use lowercase. ‚Ä¢ Each
reusable component follows the same internal structure: component-name/
ComponentName.tsx types.ts index.ts

Reasoning A single naming convention improves consistency, readability
and maintainability across the entire codebase while reducing ambiguity
during development.

Impact All future folders, components and modules must follow this
convention unless an architectural decision explicitly states otherwise.

------------------------------------------------------------------------

## Decision 022

Category

Visual Rhythm

Status

Approved

Date

2026-08-14

Dependencies

-   design-tokens.md
-   visual-language.md
-   home-specification.md
-   home-wireframe.md

Decision

Space is an intentional compositional material.

Large whitespace is not mandatory.

The experience must breathe without creating excessive or arbitrary
separation between scenes.

The canonical semantic vertical rhythm is:

-   Compact
-   Default
-   Generous

Exact values are governed by design-tokens.md.

Scene-specific spacing may remain local when required by an approved
artistic composition.

Reasoning

The Home implementation demonstrated that excessive vertical spacing can
interrupt narrative continuity.

The objective is contemplation, not emptiness.

Impact

Future sections must use intentional spatial rhythm rather than
automatically applying large whitespace.

This decision supersedes Decision 009.

------------------------------------------------------------------------

## Decision 023

Category

Color System

Status

Approved

Date

2026-08-14

Dependencies

-   design-tokens.md
-   visual-language.md

Decision

The current Del Carmen Digital Experience uses a predominantly dark
institutional environment.

The canonical visual hierarchy includes:

-   Deep neutral backgrounds
-   Soft white primary text
-   Muted secondary text
-   Primary Gold for selected visual focal points
-   Muted Bronze for interaction and secondary emphasis
-   Smoke Ivory as an available light editorial surface

The exact canonical values are governed exclusively by design-tokens.md.

The artwork remains the most colorful visual element whenever possible.

Reasoning

The implemented Home established darkness as a primary visual material
that creates silence, depth and visual support around the artwork.

Smoke Ivory remains part of the broader system but no longer defines the
primary Home environment.

Impact

Future Home scenes must inherit the established dark visual environment
unless an explicitly approved composition requires a light surface.

This decision supersedes Decision 010.

------------------------------------------------------------------------

## Decision 024

Category

Motion

Status

Approved

Date

2026-08-14

Dependencies

-   tech-stack.md
-   design-tokens.md
-   visual-language.md

Decision

GSAP is the approved motion technology for advanced artistic and
immersive motion in Del Carmen Digital Experience.

Motion must remain subordinate to the artwork.

Advanced motion is introduced only when required by an approved
experience.

Motion infrastructure must not be created prematurely.

Reduced-motion accessibility is mandatory.

Reasoning

The project requires a motion system capable of supporting future
atmospheric, scroll-based and immersive experiences while preserving
precise artistic control.

Impact

Framer Motion is not the canonical motion technology for the project.

Future advanced motion implementation should use GSAP unless an explicit
architectural decision revises this choice.

------------------------------------------------------------------------

## Decision 025

Category

Typography

Status

Approved

Date

2026-08-14

Dependencies

-   design-tokens.md
-   visual-language.md

Decision

The canonical typography system combines:

Cormorant Garamond

for display, editorial and expressive artistic language.

Geist

for body copy, navigation, metadata, labels, buttons and interface
language.

Geist Mono

is reserved for technical contexts when required.

Reasoning

The combination creates a deliberate contrast between classical artistic
expression and contemporary digital clarity.

Impact

Future interface typography must inherit this hierarchy unless an
explicit visual-language revision is approved.

------------------------------------------------------------------------

## Decision 026

Category

Layout System

Status

Approved

Date

2026-08-14

Dependencies

-   design-tokens.md
-   repository-structure.md
-   home-wireframe.md

Decision

Global horizontal layout behavior is centralized through the shared
Container primitive.

Canonical location:

src/shared/layout/container/

Container governs recurring content width and responsive page gutters.

Scene-specific composition may intentionally exceed or diverge from
Container when required by an approved immersive composition.

Reasoning

Repeated max-width and responsive padding values created unnecessary
duplication across sections.

Centralizing global layout behavior improves consistency and
maintainability without removing artistic compositional freedom.

Impact

Future sections must use Container for standard global layout instead of
recreating page gutters and content widths locally.

------------------------------------------------------------------------

## Decision 027

Category

Design System

Status

Approved

Date

2026-08-14

Dependencies

-   design-tokens.md
-   visual-language.md

Decision

Repeated global visual decisions must be centralized.

Scene-specific values may remain local when they represent deliberate
compositional behavior.

Not every numeric value should become a global token.

A value should be promoted to the Design System when it represents a
recurring or platform-level visual rule.

Reasoning

The project requires consistency without creating premature abstractions
or removing the flexibility required by artistic scenes.

Impact

Future development must avoid both arbitrary duplication and unnecessary
tokenization.

------------------------------------------------------------------------

## Decision 028

Category

Home Architecture

Status

Approved

Date

2026-08-14

Dependencies

-   home-specification.md
-   home-wireframe.md

Decision

The canonical Home narrative order is:

01 ‚Äî Hero / Arrival

02 ‚Äî Featured Artwork

03 ‚Äî Artist Statement

04 ‚Äî Collection

05 ‚Äî Journal

06 ‚Äî Invitation / Newsletter

07 ‚Äî Footer

Reasoning

The sequence establishes a deliberate narrative progression:

Identity

‚Üì

Artwork

‚Üì

Artist and Philosophy

‚Üì

Broader Collection

‚Üì

Thought and Process

‚Üì

Connection

‚Üì

Institutional Closure

Impact

The order must remain stable unless an explicit Home experience revision
is approved.

------------------------------------------------------------------------

## Decision 029

Category

Home Milestone

Status

Approved

Date

2026-08-14

Dependencies

-   home-specification.md
-   home-wireframe.md
-   design-tokens.md
-   visual-language.md

Decision

The structural and visual foundation of the Home is consolidated.

The following scenes currently constitute the canonical Home:

-   Hero
-   Featured Artwork
-   Artist Statement
-   Featured Collection
-   Selected Works
-   Journal Preview
-   Invitation / Newsletter
-   Footer

The Home now consumes the shared visual and layout system where
recurring patterns exist.

Advanced motion, final artwork optimization and other explicitly planned
behaviors remain separate future implementation work.

Reasoning

The Home has reached sufficient structural and visual maturity to serve
as the first reference implementation of the Del Carmen Design System.

Impact

Future Home work should prioritize refinement, responsive validation,
content integration, accessibility, performance and approved motion
rather than unnecessary structural redesign.

------------------------------------------------------------------------

## Decision 030

Category

Interaction Language

Status

Approved

Date

2026-08-14

Dependencies

-   design-tokens.md
-   visual-language.md

Decision

Del Carmen primarily uses typographic interaction.

Editorial calls to action use the shared Button and LinkButton system
with restrained underline treatments.

Navigation links remain visually clean and generally do not use
decorative underlines.

Legal links use simple typographic interaction.

Social links use monochromatic inline SVG icons with restrained
interaction states.

Reasoning

The interface should communicate interactivity without introducing
conventional application-style visual weight.

Impact

Future interaction patterns must preserve this hierarchy unless
functional requirements justify a different control treatment.

------------------------------------------------------------------------

## Decision 031

Category

Documentation Semantics

Status

Approved

Date

2026-08-14

Decision

Project documentation must distinguish clearly between:

-   Implemented / Canonical
-   Approved Direction / Planned

The presence of a feature in an approved specification does not
automatically mean that the feature has already been implemented.

Reasoning

The project contains approved future concepts such as advanced motion
and immersive interaction systems that should not be mistaken for
current implementation state.

Impact

All future documentation must explicitly identify planned behavior when
implementation has not yet occurred.

------------------------------------------------------------------------

## Decision 032

Category

Artwork Media Roles

Status

Approved

Date

2026-08-26

Dependencies

-   artwork-model.md
-   home-specification.md

Decision

Artwork media roles are context-specific and must not be interchanged
implicitly. Primary remains the canonical artwork representation for
Artwork Detail. Thumbnail is used for compact archive/gallery discovery
when available. Collection is an optional editorial artwork
representation used by curated Collection / Selected Works surfaces.

Reasoning

Separating these roles prevents an editorial crop or archive thumbnail
from accidentally replacing the canonical artwork image in detail
experiences.

Impact

Presentation components must resolve the image role explicitly and use
Primary only as the defined fallback.

------------------------------------------------------------------------

## Decision 033

Category

Artwork Series Media

Status

Approved

Date

2026-08-26

Dependencies

-   artwork-model.md
-   home-specification.md

Decision

ArtworkSeries may own dedicated editorial media when a real curatorial
requirement exists. The current canonical role is `images.featured`,
used by the Home Featured Collection experience. If unavailable, the
series may fall back to its `coverArtworkId`.

Reasoning

A series may require an editorial cover composition that is different
from the canonical representation of any individual member Artwork.

Impact

Series editorial media remains independent from Artwork Primary,
Thumbnail and Collection representations.

------------------------------------------------------------------------

## Decision 034

Category

Home Architecture

Status

Approved

Date

2026-08-26

Dependencies

-   home-specification.md
-   home-wireframe.md
-   roadmap.md

------------------------------------------------------------------------

## Decision 035

Category

Artist Page Experience

Status

Approved

Date

2026-08-30

Dependencies

-   artist-specification.md
-   artist-wireframe.md
-   roadmap.md
-   brand-philosophy.md
-   visual-language.md

Decision

The Artist Page is a canonical editorial experience of the Del Carmen
Digital Experience.

Its public route is:

`/artist`

The page is not a traditional biography, résumé, exhibition archive or
awards page.

Its canonical narrative consists of six principal scenes:

01 --- Artist Hero

02 --- The Artist

03 --- Artistic Philosophy

04 --- The Practice

05 --- The Journey

06 --- The Work / Explore the Work

The underlying narrative progression is:

Curiosity → Observation → Discipline → Discovery → Art

The artistic journey is presented through meaningful encounters rather
than as a conventional chronological résumé.

Academic technique is presented as a foundation rather than a
destination, while the continuing search for an authentic visual
language is presented as artistic evolution.

The page ultimately returns attention from the artist to the artwork.

Reasoning

The Artist experience requires a human and philosophical narrative
capable of explaining how observation, technology, drawing, academic
formation, painting and lived experience gradually converged into the
artist's current practice.

A curated editorial narrative preserves the contemplative character of
Del Carmen more effectively than a conventional professional biography.

Impact

Future Artist Page development must preserve the approved six-scene
narrative and its editorial character unless an explicit Artist
experience revision is approved.

Complete exhibition, awards and recognition systems must remain separate
from the curated Artist narrative.

The canonical editorial and spatial definitions are governed by
`artist-specification.md` and `artist-wireframe.md`.

------------------------------------------------------------------------

## Decision 036

Category

Artist Media Experience

Status

Approved

Date

2026-08-30

Dependencies

-   artist-specification.md
-   artist-wireframe.md
-   artist-implementation.md
-   design-tokens.md
-   visual-language.md

Decision

Artist media is narrative media rather than decorative media.

The Practice and Journey experiences must remain conceptually capable of
supporting evolving media without requiring reconstruction of their
surrounding editorial composition.

Practice follows the conceptual visual progression:

Environment → Material → Work

Its principal media region may evolve from a static image toward
cinematic process media or video when a real requirement exists.

Journey Media is a dedicated editorial memory experience associated with
The Journey.

The approved initial direction for Journey Media is a slow cinematic
photographic sequence moving from right to left.

Journey Media:

-   may intentionally escape the normal Container;
-   may combine photographs of different dimensions, orientations, ages
    and documentary qualities;
-   does not behave as a conventional carousel;
-   does not require arrows, pagination dots, slide counters or equal
    cards;
-   may use continuous environmental movement;
-   must provide appropriate reduced-motion behavior;
-   may evolve toward cinematic sequence or video when a real
    requirement exists.

Authentic photographs, artwork and documented artistic process remain
the narrative foundation.

AI-assisted media may support atmosphere, transitions, depth or subtle
motion, but must not fabricate biographical events.

The memory of the teacher whose encouragement became a decisive moment
in the artist's return to drawing must be preserved as part of the
Journey narrative.

If presented publicly as a direct quotation, its exact wording and
attribution must first be confirmed.

Reasoning

The Artist experience includes memory, process and passage of time that
cannot always be expressed most effectively through static editorial
layouts.

Media flexibility allows these experiences to evolve while preserving
authenticity and avoiding premature implementation complexity.

Impact

Future implementation must not bind Practice or Journey composition
unnecessarily to one media technology.

Journey Media must remain distinct from Artwork Gallery and other
artwork discovery systems.

Continuous movement is permitted for environmental media, while
disclosure of required narrative information remains driven by physical
scroll position.

------------------------------------------------------------------------

## Decision 037

Category

Artist Implementation Architecture

Status

Approved

Date

2026-08-30

Dependencies

-   artist-specification.md
-   artist-wireframe.md
-   artist-implementation.md
-   repository-structure.md
-   design-tokens.md
-   visual-language.md
-   tech-stack.md

Decision

The Artist experience is owned by:

`src/domains/artist/`

and exposed publicly through:

`src/app/artist/page.tsx`

Artist v1.0 is an editorial domain and does not require persistence
infrastructure.

Server Components are the default.

Client Components are introduced only where browser-specific behavior
requires them, including GSAP motion, continuous media movement or
future interactive media behavior.

Artist-specific components remain local to the Artist domain until
genuine cross-domain reuse exists.

The shared `Container` remains the authority for standard editorial
alignment.

Journey Media may intentionally escape the Container as an approved
compositional exception.

Practice Media and Journey Media are Artist-local responsibilities and
must not become generalized media frameworks prematurely.

Journey milestones use lightweight local structured data and do not
introduce a global timeline or milestone model.

Narrative motion remains restrained, scene-specific and driven by
physical scroll position.

Continuous movement is permitted for Journey Media because it does not
control access to required narrative information.

Hydration-safe motion initialization and reduced-motion accessibility
are mandatory.

The Artist closing experience reuses the existing shared interaction
system and leads to:

`/artworks`

Reasoning

Artist requires enough architectural separation to support its editorial
composition, motion and media behavior without introducing
infrastructure unsupported by current product requirements.

The architecture inherits successful patterns established during Home
while preserving Artist-specific composition and avoiding premature
abstractions.

Impact

Artist implementation must proceed scene by scene through the
established modular approval workflow.

No Artist CMS, database, generalized timeline engine, generalized
carousel engine, generalized media framework or AI video infrastructure
should be introduced for v1.0 without a new demonstrated requirement.

The canonical implementation architecture is governed by
`artist-implementation.md`.

The canonical Home now contains eight sequential scenes: Hero, Featured
Artwork, Artist Statement, Featured Collection, Selected Works, Journal
Preview, Invitation / Newsletter and Footer.

Reasoning

Featured Collection and Selected Works serve different curatorial
purposes: one introduces a series; the other presents selected
individual artworks.

Impact

## Future Home documentation and implementation must preserve this distinction unless an explicit Home experience revision is approved.

## Decision 038

Category

Artist Page Completion

Status

Approved / Complete / Frozen

Date

2026-09-01

Dependencies

-   artist-specification.md v1.2
-   artist-wireframe.md v1.2
-   artist-implementation.md v1.1
-   design-tokens.md
-   visual-language.md
-   tech-stack.md

Decision

Artist Page v1.0 is complete, approved and frozen.

The canonical public route is:

`/artist`

The completed experience contains six scenes:

01 --- Artist Hero\
02 --- The Artist\
03 --- Artistic Philosophy\
04 --- The Practice\
05 --- The Journey\
06 --- The Work

The final Journey desktop experience uses a pinned GSAP timeline with a
peripheral vertical Journey Navigator.

The Journey Navigator:

-   represents the five approved milestones;
-   uses Primary Gold for the active milestone;
-   supports bidirectional scroll synchronization;
-   supports direct click navigation;
-   snaps to real stable milestone positions after scrolling stops;
-   uses pointer-proximity magnification as a restrained dock-style
    interaction;
-   places its rail and date labels outside the primary editorial copy
    column;
-   remains desktop-only.

Tablet and mobile preserve natural document flow.

The Journey Navigator is Artist-local and does not establish a
generalized platform timeline component.

Global Navigation remains owned by the application shell.

The Artist route maps to the existing About navigation state rather than
introducing a separate Artist navigation item.

Footer is a shared layout component at:

`src/shared/layout/footer/`

and may be composed by individual page/domain experiences rather than
being forced globally.

Reasoning

The Artist experience has completed its modular approval cycle and now
represents the canonical implementation of the approved Artist
specification and wireframe.

Freezing the module protects the visual and technical decisions already
validated while allowing future project work to proceed without
repeatedly reopening completed scenes.

Impact

Artist should not be redesigned during Phase 1 unless a verified bug,
accessibility defect, production issue or explicitly approved experience
revision requires a change.

The next Phase 1 page focus is About.

The canonical Artist documents are:

-   `artist-specification.md` v1.2
-   `artist-wireframe.md` v1.2
-   `artist-implementation.md` v1.1
