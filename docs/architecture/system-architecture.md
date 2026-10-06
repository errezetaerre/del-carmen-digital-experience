# System Architecture

Version: 1.3

Document ID:
DOC-SA

Project:
Del Carmen Digital Experience

Parent Brand:
Rō Visual

Document Type:
Technical

Authority Level:
Highest

Status:
⚪ Draft

Owner:
Del Carmen Digital Experience

Last Updated:
2026-10-05

---

# Purpose

This document defines the high-level architecture of Del Carmen Digital Experience.

It describes how the platform is organized from a software engineering perspective, establishes the responsibilities of each layer, and provides the structural foundation for every future module.

This document complements `folder-architecture.md`.

While Folder Architecture defines where files live, System Architecture defines how the entire system works.

---

# Table of Contents

SA-01 Architecture Principles

SA-02 Technology Stack

SA-03 High-Level System

SA-04 Application Layers

SA-05 Domain Architecture

SA-06 Request Flow

SA-07 Data Flow

SA-08 Authentication

SA-09 Database Architecture

SA-10 File Storage

SA-11 CMS Strategy

SA-12 Marketplace Architecture

SA-13 Future Modules

SA-14 Deployment

SA-15 Scalability

SA-16 Security

SA-17 Observability

SA-18 Final Principle

---

# SA-01 Architecture Principles

Status:
⚪ Draft

The platform follows these principles:

• Separation of Concerns

• Single Responsibility

• Modular Design

• Clean Architecture

• MVC Pattern

• Reusable Components

• Performance First

• Accessibility by Default

• Progressive Enhancement

• Scalable by Design

The architecture must remain understandable after many years.

---

# SA-02 Technology Stack

Status:
⚪ Draft

Frontend Framework

• Next.js
• React
• TypeScript
• Tailwind CSS

Application Runtime

• Node.js

Backend Architecture

• Next.js Server Components
• Server Actions
• API Routes when required

Database

• PostgreSQL

ORM

• Prisma

Authentication

• NextAuth (Auth.js)

Storage

• Cloudinary (artworks)

Deployment

• Vercel

Version Control

• GitHub

---

# SA-03 High-Level System

Status:
⚪ Draft

```text
Visitor
        │
        ▼
Next.js Application
        │
        ▼
Application Layer
        │
        ▼
Business Logic
        │
        ▼
Prisma ORM
        │
        ▼
PostgreSQL Database
```

Every request follows this structure.

The UI never communicates directly with the database.

---

# SA-04 Application Layers

Status:
⚪ Draft

Presentation Layer

↓

Application Layer

↓

Domain Layer

↓

Infrastructure Layer

↓

Persistence Layer

Each layer has a single responsibility.

Dependencies always point inward.

The architecture follows Clean Architecture principles adapted to Next.js.

Framework dependencies must never control business decisions.

The Domain Layer remains independent from UI and infrastructure.

---

# SA-05 Domain Architecture

Status:
⚪ Draft

The platform is organized by domains.

Examples:

Artwork

ArtworkSeries

Artist

Journal

Marketplace

Orders

Collectors

Authentication

Settings

Each domain owns:

Components

Services

Controllers

Models

Validation

Types

Hooks

Artwork is the central domain entity.

Unlike traditional ecommerce systems, artworks contain:

• Artistic metadata
• Story
• Inspiration
• Creation process
• Authentication
• Ownership history
• Exhibition history
• Media assets

Artwork identity and presentation context are separate concerns.

The Artwork entity describes the work itself. It must not become coupled to a specific Home scene, viewport, card, campaign or commercial presentation.

Canonical artwork classification is multidimensional. Terms such as authorship, context, medium, category and series are not interchangeable.

Artwork classification may include:

• Authorship — the relationship between the artist and the work, such as original authorship, master copy or study after another work
• Context — the circumstance in which the work was created, such as independent practice, academic study or commission
• Medium — the material or technique used, such as oil, graphite or charcoal
• Categories — thematic, formal or genre classifications such as portrait, still life or figurative work
• Series — an optional relationship to a coherent body of works

An artwork may therefore be both original in authorship and academic in context. These properties must remain independent.

Master studies and master copies must be explicitly distinguishable from the artist's original authored corpus without removing their value as artworks or records of artistic formation.

ArtworkSeries is the canonical curatorial entity for coherent bodies of work.

An ArtworkSeries groups Artwork entities that belong to a coherent artistic body, narrative, exhibition concept or thematic investigation.

Visitor-facing language may use “Collection”, and `/collections` is the editorial discovery route for ArtworkSeries. This terminology does not create a parallel Collection domain or persistence model.

The detailed curatorial route remains `/series/[slug]`.

Example:

Yasemi
├── Yasemi I
├── Yasemi II
├── Yasemi III
├── Yasemi IV
└── Yasemi V

The series does not replace its artworks. Each Artwork remains independently addressable and may have its own metadata, media, detail view and commercial status.

A series may define:

• Title
• Slug
• Description
• Cover artwork
• Ordered artwork membership
• Curatorial metadata

The current Phase 1 implementation expresses optional Series membership through `Artwork.seriesId`.

This relationship may evolve toward many-to-many membership only when a real curatorial requirement justifies it. No migration is required merely for conceptual purity.

Artwork media must support multiple visual representations of the same Artwork without duplicating the Artwork entity.

Canonical visual roles may include:

• Primary
• Hero Portrait
• Hero Landscape
• Thumbnail

Each visual representation must carry its own accessibility metadata, including alt text.

Primary is the canonical public representation of the artwork.

Hero Portrait and Hero Landscape are optional editorial derivatives used when the Home composition requires a different crop, negative space, atmospheric integration or framing.

If a specialized Hero representation does not exist, the presentation layer should fall back to Primary.

Thumbnail is an optional optimized derivative for compact collection or navigation contexts.

Original protected high-resolution artwork files remain governed by SA-10 File Storage and are not equivalent to public visual representations.

Home curation is separate from Artwork identity.

The Home determines which Artwork or ArtworkSeries appears in Hero, Featured Artwork and Collection through a dedicated curation/configuration concern rather than by redefining the Artwork itself.

Conceptually:

HomeCuration
├── Hero → Artwork
├── Featured Artwork → Artwork
└── Featured Collection → ArtworkSeries

This allows the same Artwork to be reused intentionally in different contexts without duplicate database records while also allowing Home curation to change independently of artwork metadata.

The canonical domain distinction between Artwork and ArtworkSeries is approved. Persistence may continue to evolve without introducing duplicate domain concepts merely to mirror presentation terminology.

---

# SA-05A Collections and Series Presentation Boundary

Status:
🟢 Approved

The Collections and Series experiences are presentation contexts over the canonical Artwork and ArtworkSeries domain model.

`/collections`

• Editorial discovery index for ArtworkSeries
• Uses Collection Heroes
• Uses responsive media/content composition
• May expose desktop artwork previews
• Does not duplicate the full Series statement or detailed gallery

`/series/[slug]`

• Detailed curatorial ArtworkSeries experience
• Owns Series-level contemplation, statement, description and gallery presentation
• May use artwork-derived atmospheric media belonging to the current Series
• Preserves contextual artwork navigation when entering Artwork detail

Hero layout, responsive composition, Lightbox state, carousel behavior and atmospheric transitions are presentation concerns. They must not become duplicate domain entities or persistence fields unless a durable business requirement exists.

The shared Artwork Lightbox may adapt its navigation and information behavior to Series or Artwork/archive context while remaining one shared interaction system.

---

# SA-06 Request Flow

Status:
⚪ Draft

Browser

↓

Page

↓

Component

↓

Action

↓

Service

↓

Repository

↓

Prisma

↓

Database

No component accesses the database directly.

---

# SA-07 Data Flow

Status:
⚪ Draft

Database

↓

Repository

↓

Service

↓

Server Component

↓

Client Component

↓

Visitor

Data always flows in one direction.

---

# SA-08 Authentication

Status:
⚪ Draft

Public Area

Visitors

Collectors

Protected Area

Administrator

Future:

Artist Dashboard

Collector Dashboard

Academy

---

# SA-09 Database Architecture

Status:
⚪ Draft

Core entities

Artworks

Artwork Series

Artwork Media

Categories

Journal

Users

Collectors

Orders

Messages

Settings

Media

Art Domain

Artwork
ArtworkSeries
ArtworkMedia
Exhibition
JournalEntry
ArtistStatement

Artwork is the canonical record of an individual work.

ArtworkSeries represents a coherent body of artworks and maintains curatorial relationships to its member Artwork records.

`Collection` is currently editorial/public terminology for ArtworkSeries discovery and must not be introduced as a duplicate persistence entity.

The current Phase 1 implementation uses optional `Artwork.seriesId`. A future relationship entity may support many-to-many membership, ordering or Series-specific featured state when an actual requirement emerges.

ArtworkMedia represents public or protected media associated with an Artwork. It must support multiple presentation roles without duplicating the Artwork record.

Conceptual media roles include:

• Primary
• Hero Portrait
• Hero Landscape
• Thumbnail

Every public artwork image representation requires accessibility metadata, including alt text.

Home curation is an application/editorial concern that references existing Artwork and ArtworkSeries entities.

It may conceptually determine:

• Hero artwork
• Featured artwork
• Featured collection

The Featured Collection references an existing ArtworkSeries.

The database must not treat Hero placement, Featured Artwork placement or Home Collection placement as intrinsic artistic properties of an Artwork.

The persistence model for Home curation may later be implemented through configuration, database entities or CMS-managed editorial data. That implementation is not yet canonical.

Commerce Domain

Product
Order
Payment
Transaction
Invoice

Artwork and Product are separate concepts.

Artwork describes the artistic work.

Product describes something that can be transacted.

Future prints, editions, reproductions and other purchasable manifestations must therefore be modeled through the commerce layer rather than being treated as artwork classification values.

One Artwork may eventually relate to zero, one or multiple Products.

The exact Print and Edition model is deferred to the commerce architecture phase.

Identity Domain

User
Role
CollectorProfile

The database must be extensible.

Domain concepts must be finalized before persistence details.

Database tables must express approved domain relationships rather than define the domain through implementation convenience.

---

# SA-10 File Storage

Status:
⚪ Draft

Images

Cloudinary

Documents

Local / Future S3

Generated Assets

CDN

Original artwork files are never modified.

Artwork preservation rule:

Original high-resolution files must never be publicly exposed.

Public images are optimized derivatives generated from protected originals.

A public derivative may serve a specific presentation role such as Primary, Hero Portrait, Hero Landscape or Thumbnail.

Multiple derivatives do not represent multiple artworks.

They remain media representations associated with one canonical Artwork entity.

Accessibility metadata must travel with each public image representation.

Presentation-specific derivatives may differ in crop, framing, negative space, atmospheric integration or optimization while preserving the visual integrity of the artwork.

---

# SA-11 CMS Strategy

Status:
⚪ Draft

Version 1

Custom Admin Panel

Future

Headless CMS if needed

The CMS must remain invisible to visitors.

---

# SA-12 Marketplace Architecture

Status:
⚪ Draft

Artwork

↓

Cart

↓

Checkout

↓

Payment

↓

Order

↓

Collector

↓

Invoice

Marketplace remains independent from the gallery experience.

The marketplace is commerce infrastructure, not the identity of the platform.

Artwork identity must remain independent from Product identity.

Prints, editions and reproductions belong to the commerce model and may reference an Artwork without changing the Artwork's artistic classification.

The emotional experience happens before the transaction.

---

# SA-13 Future Modules

Status:
⚪ Draft

Virtual Museum

Online Academy

Community

Collector Circle

Immersive Experiences

Digital Exhibitions

Artist Residency

Licensing

Archive

Each future module plugs into the existing architecture.

No redesign should be necessary.

---

# SA-14 Deployment

Status:
⚪ Draft

Development

↓

GitHub

↓

Vercel Preview

↓

Testing

↓

Production

CI/CD must remain automatic.

---

# SA-15 Scalability

Status:
⚪ Draft

Every module must be replaceable.

Every component reusable.

Every service independent.

Future growth should require extension rather than rewriting.

---

# SA-16 Security

Status:
⚪ Draft

Authentication

Authorization

Environment Variables

Secure APIs

Input Validation

Rate Limiting

Database Protection

Image Optimization

Security is part of the architecture.

Not an afterthought.

---
# SA-17 Observability
Status:
⚪ Draft

The platform must provide visibility into:

• Errors
• Performance
• User behavior
• Server health
• Security events

Tools:

Future:
• Analytics
• Logging
• Monitoring
• Error Tracking
# SA-18 Final Principle

Status:
⚪ Reviewed

The technology should never become the experience.

Visitors should remember the artwork, not the software.

Technology exists only to protect, preserve and reveal beauty.

---

Del Carmen Digital Experience

Painting the Eternal Essence Within


---

# SA-19 Architecture Evolution Update

Status:
🟡 Audited Extension — approval state follows the individual decisions it records

Date:
2026-10-05

This section extends the supplied v1.2 System Architecture without deleting, compressing or replacing its existing current or future architecture.

The architecture above remains preserved, including its planned technology and infrastructure direction.

Implementation status must not be confused with architectural intent.

A technology may be part of the approved/planned architecture even when its implementation belongs to a later phase.

---

# SA-19A Future Architecture Preservation

The following architecture already documented above remains part of the project's planned evolution:

Frontend / Runtime

• Next.js  
• React  
• TypeScript  
• Tailwind CSS  
• Node.js  

Backend / Application Architecture

• Next.js Server Components  
• Server Actions  
• API Routes when required  
• Service Layer / application orchestration  
• Repository boundaries where persistence requires them  

Database / Persistence

• PostgreSQL  
• Prisma  

Authentication

• NextAuth / Auth.js  

Storage

• Cloudinary for artwork-oriented storage as currently documented  
• Local / future S3 document-storage direction as currently documented  
• CDN-backed generated/public assets as currently documented  

Deployment / Version Control

• Vercel  
• GitHub  

CMS / Administration

• Custom Admin Panel in the initial planned architecture  
• Future Headless CMS if needed  

Future Modules

• Virtual Museum  
• Online Academy  
• Community  
• Collector Circle  
• Immersive Experiences  
• Digital Exhibitions  
• Artist Residency  
• Licensing  
• Archive  

The fact that some of these systems are not yet implemented does not remove them from System Architecture.

Their implementation details may be adjusted when their roadmap phase is reached.

A future architectural change should update this document rather than silently erasing the earlier direction.

---

# SA-19B Current Phase 1 Shared Interaction Architecture

Status:
🟢 Approved / Implemented / Canonical for current Phase 1

The current public art experience now includes reusable interaction architecture that was not yet documented in v1.2.

## Shared KineticCarousel

Canonical location:

`src/shared/ui/kinetic-carousel/`

Canonical files:

• `KineticCarousel.tsx`  
• `useKineticCarousel.ts`  
• `index.ts`  

The shared primitive owns reusable horizontal kinetic interaction.

Collections and Series retain their own editorial composition rules.

Collections Works Preview:

• one to four artworks use the approved restrained editorial composition;  
• five or more artworks use the shared KineticCarousel.  

Series Gallery reuses the shared KineticCarousel when the artwork set exceeds its standard gallery capacity.

This current shared primitive may evolve in future phases when new requirements justify changes.

---

# SA-19C Contextual Artwork Lightbox

Status:
🟢 Approved / Implemented / Canonical for current Phase 1

Del Carmen uses one shared Artwork Lightbox whose navigation behavior adapts to context.

Series context supports:

• close back to the Series experience;  
• dots representing the current Series;  
• previous / next within the current Series;  
• contemplative artwork information;  
• `Explore in detail`;  
• preservation of Series context into Artwork Detail.  

Independent Artwork/archive context uses the applicable broader Artwork navigation set.

Series context may be preserved through:

`/artworks/[slug]?series=[series-slug]`

This query context is presentation/navigation state and does not redefine Artwork identity or persistence.

The shared lightbox uses a document-level portal so its interaction layer is not clipped by ancestor layout or transform contexts.

---

# SA-19D Artwork Detail Kinetic Navigation

Status:
🟢 Approved / Implemented / Canonical for current Phase 1

`/artworks/[slug]` uses whole-scene horizontal kinetic navigation.

Previous, current and next Artwork Detail scenes physically coexist in a three-panel track when the corresponding neighbors exist.

Navigation context determines the sequence:

• Series context → current ArtworkSeries;  
• independent/archive context → applicable broader Artwork set.  

Supported inputs:

• horizontal trackpad gesture;  
• pointer drag / touch swipe;  
• keyboard left/right arrows.  

Vertical page scrolling remains natural.

Fullscreen artwork viewing remains isolated from kinetic scene navigation.

Back navigation and persistent interaction guidance remain outside the horizontally animated track.

The Back action reuses the existing shared `LinkButton` `goldUnderline` treatment.

---

# SA-19E Input Ownership and Physical Motion

Status:
🟢 Approved / Implemented / Canonical for current Phase 1

The governing interaction principle is:

`The artwork must feel as though it has weight.`

Pointer drag and trackpad wheel operate as separate input sessions and must not compete for ownership.

During horizontal trackpad interaction, the rendered track follows the visitor's gesture directly.

Release behavior preserves trajectory and momentum.

The interaction must avoid an artificial stop, pause or second acceleration before landing on the neighboring artwork.

One physical trackpad burst may navigate at most one artwork.

Its inertial tail must not trigger a second route transition after the next Artwork Detail scene becomes current.

Edge behavior is symmetrical:

• first artwork + backward gesture → resistance → settle to first;  
• last artwork + forward gesture → resistance → settle to last;  
• intermediate artwork → navigation available in both valid directions.  

An invalid edge gesture must not be reinterpreted as movement toward the only available neighbor.

These rules define the approved current implementation.

Future immersive or museum phases may extend or supersede this interaction architecture through an explicit later decision.

---

# SA-19F Artwork Detail Interaction Onboarding

Status:
🟢 Approved / Implemented for current Phase 1

`SWIPE TO EXPLORE` / `SWIPE / DRAG TO EXPLORE` is interaction onboarding rather than Artwork content.

Before horizontal interaction is learned, the transient reminder may recur.

After a real horizontal interaction through trackpad, drag/swipe or keyboard navigation, onboarding is learned for the current browser document.

Client-side Artwork navigation does not reset it.

A real browser refresh begins a new document session and may present the onboarding again.

The current implementation does not require `localStorage` or `sessionStorage`.

Future onboarding behavior may evolve when future experience phases introduce materially different interaction models.

---

# SA-19G Current Canonical Stability and Future Evolution

Status:
🟢 Approved principle for current Phase 1

The following interaction systems are stable/canonical for the current Phase 1 implementation:

• responsive Collection Hero behavior;  
• Collections Works Preview;  
• shared KineticCarousel core;  
• Series Gallery kinetic integration;  
• contextual Artwork Lightbox;  
• Artwork Detail three-scene kinetic navigation;  
• Artwork Detail trackpad / pointer ownership and approved edge semantics.  

Stable/canonical means current work should build upon these approved systems rather than repeatedly redesigning them without justification.

It does not mean they are permanently frozen for every future roadmap phase.

Future Marketplace, Museum, immersive, mobile, CMS, Collector, Academy, Community or other phases may introduce new requirements.

When that occurs, System Architecture should evolve through an explicit documented decision.

---

# Audit Note — 2026-10-05

Version 1.3 uses the conservative documentation method.

The complete supplied v1.2 System Architecture body is preserved above, apart from version and Last Updated metadata.

This audit does not remove PostgreSQL, Prisma, NextAuth/Auth.js, Cloudinary, CMS direction, Marketplace architecture, Virtual Museum, Academy, Community or any other future-facing architecture because it is not implemented today.

Instead, the new SA-19 section records the interaction architecture subsequently implemented during Phase 1 while preserving the long-term system direction.

The original document-level Draft status also remains preserved. This audit does not silently promote the entire System Architecture to Approved.

Individual subsections retain or receive their own status according to the decisions already made.

---

Del Carmen Digital Experience

Painting the Eternal Essence Within
