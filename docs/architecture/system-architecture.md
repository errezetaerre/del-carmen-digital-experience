# System Architecture

Version: 1.1

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
2026-08-17

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

Artist

Collection

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

ArtworkSeries is a separate curatorial entity.

An ArtworkSeries groups multiple Artwork entities that belong to a coherent artistic body, narrative, exhibition concept or thematic investigation.

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
└── Featured Collection → Artwork | ArtworkSeries

This allows the same Artwork to be reused intentionally in different contexts without duplicate database records while also allowing Home curation to change independently of artwork metadata.

The exact persistence schema, field names and database implementation for Artwork, ArtworkSeries, ArtworkImage and HomeCuration are intentionally deferred until the canonical domain model is approved.

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

Collections / Curatorial Selections

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
Collection
Exhibition
JournalEntry
ArtistStatement

Artwork is the canonical record of an individual work.

ArtworkSeries represents a coherent body of multiple artworks and maintains relationships to its member Artwork records.

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
• Featured collection entries

Featured collection entries may reference either an individual Artwork or an ArtworkSeries.

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
