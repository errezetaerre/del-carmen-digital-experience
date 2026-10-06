# Project Roadmap

Version: 1.7

Document ID: DOC-RM

Project: Del Carmen Digital Experience

Parent Brand: Rō Visual

Document Type: Planning

Authority Level: Highest

Status: 🟢 Approved

Owner: Del Carmen Digital Experience

Last Updated: 2026-10-05

------------------------------------------------------------------------

# Vision

Build the platform progressively while maintaining a production-ready
architecture from day one.

Each phase delivers a complete, usable milestone.

The project grows through evolution, never through rewrites.

------------------------------------------------------------------------

# Phase 0

FOUNDATION

Status

✅ COMPLETE

Deliverables

Brand Philosophy

Design Tokens

Project Manifesto

Project Memory

Tech Stack

Folder Architecture

Home Specification

Home Wireframe

AI Framework

Documentation System

------------------------------------------------------------------------

# Phase 1

MVP

Goal

Launch the first public version.

Deliverables

Homepage

Home Curation

Navigation

Artwork Gallery

Artwork Details

Artwork Series

Collection / Series Discovery Experience

Series Detail Experience

Artwork Classification Model

Artwork Media Representations

Artist Page --- ✅ COMPLETE / APPROVED / FROZEN

About --- ✅ COMPLETE / APPROVED / FROZEN

Journal Foundation / Preview

Contact --- ✅ COMPLETE / APPROVED / FROZEN

Newsletter --- ✅ COMPLETE / APPROVED / FROZEN

Responsive Design

SEO

Deployment on Vercel

Phase 1 artwork architecture must support:

• Artwork as the canonical individual work • ArtworkSeries as a coherent
body of related artworks • Curated Home placement independent from
Artwork identity • Featured Collection entries that may reference either
an Artwork or an ArtworkSeries • Distinct public image representations
such as Primary, Hero Portrait, Hero Landscape, Collection and Thumbnail
• ArtworkSeries editorial media may exist independently from canonical
Artwork media when a real curatorial requirement exists • Accessibility
metadata, including alt text, for every public artwork image
representation • Explicit distinction between original authored work and
master studies / copies • Independent classification dimensions for
authorship, creation context, medium, category and series

The exact persistence schema is defined only after the canonical Artwork
domain model is approved.

Phase 1 Current Delivery Status

Artist Page --- ✅ COMPLETE / APPROVED / FROZEN

About --- ✅ COMPLETE / APPROVED / FROZEN

Contact --- ✅ COMPLETE / APPROVED / FROZEN

Newsletter --- ✅ COMPLETE / APPROVED / FROZEN

Next Focus --- Responsive QA Global

Target

Public Release v1.0

------------------------------------------------------------------------

# Phase 2

Collectors Platform

Goal

Begin building relationships with collectors.

Deliverables

Collector Registration

Authentication

Artwork Certificates

Private Collection Dashboard

Favorites

Inquiry History

Email Notifications

------------------------------------------------------------------------

# Phase 3

Content Platform

Goal

Position Del Carmen internationally.

Deliverables

Journal

Stories

Creative Process

Articles

Interviews

Exhibitions

Awards and Recognition

Search

Categories

Content may reference Artworks and ArtworkSeries without duplicating
their canonical records.

Exhibitions, awards, process stories and editorial narratives belong to
the content / artist-history experience rather than being treated as
artwork classification values.

------------------------------------------------------------------------

# Phase 4

Administration

Goal

Manage the platform efficiently.

Deliverables

CMS

Artwork Management

Artwork Series Management

Home Curation Management

Journal Management

Media Library

Orders

Collectors

Analytics

Settings

Administration should manage canonical Artwork data separately from
editorial placement and commercial configuration.

------------------------------------------------------------------------

# Phase 5

Marketplace

Goal

Sell more than original paintings.

Deliverables

Prints

Limited Editions

Product Variants

Shopping Cart

Payments

Invoices

Shipping

Order Tracking

Wishlist

Commerce extends the artwork experience without redefining Artwork
identity.

Prints, editions and reproductions are commercial Products associated
with an Artwork.

An Artwork may exist without a Product and may later support multiple
purchasable manifestations, sizes or editions.

The canonical Print / Edition persistence model is defined during this
phase.

------------------------------------------------------------------------

# Phase 6

Virtual Museum

Goal

Create immersive artistic experiences.

Deliverables

3D Museum

Interactive Navigation

Curated Rooms

Audio Narratives

Special Exhibitions

Immersive Collection Experiences

Spatial Artwork Navigation

Advanced Motion / Depth Interactions

These capabilities describe experiential intent rather than a fixed
rendering technology. The implementation technology is selected only
when this phase is designed.

------------------------------------------------------------------------

# Phase 7

Academy

Goal

Teach through art.

Deliverables

Courses

Lessons

Videos

Downloads

Certificates

Student Dashboard

------------------------------------------------------------------------

# Phase 8

Artist Community

Goal

Support emerging artists.

Deliverables

Artist Profiles

Applications

Portfolios

Events

Mentorship

Subscriptions

------------------------------------------------------------------------

# Phase 9

Rō Visual Lab

Goal

Present digital innovation services.

Deliverables

Studio

Case Studies

Services

Research

Experiments

Technology

AI Projects

------------------------------------------------------------------------

# Phase 10

Living Ecosystem

Goal

Connect every platform into one experience.

Deliverables

Unified Authentication

Shared Dashboard

Recommendations

Cross-platform Search

AI Assistant

International Expansion

------------------------------------------------------------------------

# Success Metrics

Visitor Experience

Average session duration

Artwork exploration

Collector inquiries

Newsletter subscriptions

Artwork sales

Community growth

Platform performance

Accessibility

------------------------------------------------------------------------

# Long-Term Vision

Del Carmen Digital Experience is designed to become an internationally
recognized digital destination where art, technology and human
experience coexist in harmony.

The project is built to evolve for decades while preserving its original
vision.

------------------------------------------------------------------------

Del Carmen Digital Experience

Painting the Eternal Essence Within


------------------------------------------------------------------------

# Roadmap Evolution Update — 2026-10-05

This section extends the supplied v1.6 Roadmap without deleting, compressing or replacing its earlier roadmap structure.

The original roadmap above remains preserved as the project plan recorded at its previous update. The additions below record subsequent Phase 1 progress and clarify how current implementation relates to the longer-term roadmap.

## Documentation Principle

This Roadmap describes both:

- where the project currently is; and
- where the project is intended to go.

A capability, technology, module or phase must not be removed merely because it has not yet been implemented.

Future phases remain part of the Del Carmen Digital Experience vision unless an explicit later decision updates, replaces or cancels them.

Implementation status and roadmap intent are separate dimensions.

A roadmap item may therefore be:

- implemented and approved;
- approved / planned but not yet implemented;
- future direction whose detailed implementation may evolve;
- draft / under evaluation.

As implementation advances, this document should be adjusted and updated while preserving historical traceability.

## Phase 1 — Subsequent Implemented / Approved Progress

The following Phase 1 capabilities advanced after the earlier roadmap snapshot.

### Collections / ArtworkSeries

Implemented / Approved / Canonical for the current Phase 1 experience:

- `/collections` editorial discovery index;
- `ArtworkSeries` as the canonical body-of-work model;
- `/series/[slug]` as the detailed curatorial Series experience;
- responsive Collection Heroes;
- independent media orientation and content position by breakpoint;
- portrait and landscape Hero media;
- desktop Works Preview;
- mobile-specific Collections behavior;
- Collection Hero motion;
- Series gallery;
- artwork-derived Series atmosphere;
- Statement + supporting description hierarchy;
- Continue Exploring navigation.

Visitor-facing `Collection` remains valid editorial terminology.

It does not create a parallel canonical `Collection` persistence model.

The current Phase 1 relationship remains optional `Artwork.seriesId`.

Future many-to-many Artwork ↔ ArtworkSeries evolution remains available when a real curatorial requirement justifies it.

The existing `coverArtworkId` should be evaluated first for representative-artwork responsibility before introducing another identifier.

### Shared KineticCarousel

Implemented / Approved / Canonical for the current Phase 1 interaction system.

Canonical shared location:

`src/shared/ui/kinetic-carousel/`

Canonical files:

- `KineticCarousel.tsx`
- `useKineticCarousel.ts`
- `index.ts`

Collections Works Preview preserves its one-to-four artwork editorial composition and uses the shared KineticCarousel for five or more works.

Series Gallery reuses the shared KineticCarousel when the artwork set exceeds its standard gallery capacity.

This shared implementation does not prevent later roadmap phases from extending the interaction system when new requirements appear.

### Contextual Artwork Lightbox

Implemented / Approved / Canonical for the current Phase 1 experience.

One shared Artwork Lightbox adapts to visitor context.

Series context supports:

- close back to the Series experience;
- dots;
- previous / next within the current Series;
- contemplative artwork information;
- `Explore in detail`;
- preservation of Series context into Artwork Detail.

Independent Artwork/archive context uses the applicable broader artwork sequence.

The lightbox uses a document-level portal to avoid clipping by ancestor transform/layout contexts.

### Artwork Detail Kinetic Experience

Implemented / Approved / Canonical for the current Phase 1 Artwork Detail experience.

`/artworks/[slug]` supports whole-scene horizontal navigation using physically coexisting previous/current/next scenes when neighbors exist.

Navigation context is preserved:

- Series entry → Series-aware Artwork navigation;
- independent/archive entry → applicable broader Artwork navigation.

Supported interaction:

- horizontal trackpad gesture;
- pointer drag / touch swipe;
- keyboard left/right arrows.

Vertical scrolling remains natural.

Fullscreen viewing remains isolated from scene navigation.

The Back action and persistent interaction hint remain fixed relative to the horizontally moving scene track.

The governing interaction principle is:

`The artwork must feel as though it has weight.`

Current approved physics include:

- direct gesture response;
- separate wheel and pointer input ownership;
- momentum / trajectory continuity;
- one-navigation-per-trackpad-gesture protection;
- symmetrical first / last artwork edge resistance;
- no reinterpretation of invalid edge gestures.

These rules define the approved current implementation. Future experiential phases may extend or supersede them through an explicit approved decision.

### Artwork Detail Onboarding

Implemented / Approved for the current experience.

Interaction onboarding is learned for the current browser document after a real horizontal interaction.

Client-side Artwork navigation does not reset the learned state.

A browser refresh begins a new document session.

This current implementation does not require persistent browser storage.

## Journal Documentation Reconciliation

Journal implementation has advanced beyond the documentation state represented in the supplied documentation package.

The package currently lacks a dedicated canonical Journal specification / implementation document.

This is a documentation reconciliation gap.

It does not mean Journal has been removed from the roadmap, nor does it imply that every future Journal / Content Platform capability is already complete.

The broader future Journal / Content Platform roadmap remains intact.

## Current Phase 1 Focus

The immediate documentation focus is source-of-truth reconciliation.

This does not replace the remaining Phase 1 delivery work.

Remaining Phase 1 release responsibilities continue to include, where not yet completed or verified:

- responsive and cross-experience validation;
- accessibility / interaction QA;
- performance validation;
- SEO work;
- production deployment and Production QA;
- public-domain configuration;
- newsletter production sender / DNS / delivery validation;
- final About film or approved poster/fallback state.

Completion must be verified rather than inferred from documentation age.

## Future Roadmap Preservation

All future phases and ecosystem directions already defined in the original Roadmap remain preserved.

This includes future commerce, collector, marketplace, museum, academy, community, immersive, internationalization, content, administration and other planned capabilities described above.

Current Phase 1 implementation must not be used as justification to remove later phases.

Likewise, implementing sophisticated kinetic interaction during Phase 1 does not mean a later Virtual Museum or immersive-experience phase has already been delivered.

Future modules may reuse, extend or supersede current interaction systems when their requirements become concrete.

## Canonical Stability and Evolution

The following are stable/canonical for the current Phase 1 implementation:

- responsive Collection Hero behavior;
- Collections Works Preview;
- shared KineticCarousel core;
- Series Gallery kinetic integration;
- contextual Artwork Lightbox;
- Artwork Detail three-scene kinetic navigation;
- Artwork Detail wheel / pointer ownership and edge semantics.

Stable/canonical does not mean permanent for all future phases.

It means current work should build on these approved systems rather than repeatedly redesigning them without justification.

A future roadmap phase may evolve them through an explicit approved decision.

## Audit Note

This v1.7 update uses the conservative documentation method.

The complete supplied v1.6 Roadmap body is preserved above, apart from the version and Last Updated metadata.

No existing future phase, planned capability or architectural direction has been deleted because it is not implemented today.

The Roadmap Evolution Update records subsequent implementation and documentation state while preserving the original future trajectory of Del Carmen Digital Experience.
