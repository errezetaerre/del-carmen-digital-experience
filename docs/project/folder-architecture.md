# Folder Architecture

Version: 1.1

Document ID:
DOC-FA

Project:
Del Carmen Digital Experience

Parent Brand:
Rō Visual

Document Type:
Technical

Authority Level:
High

Status:
🟢 Approved

Owner:
Del Carmen Digital Experience

Last Updated:
2026-07-08

---

# Purpose

This document defines the official repository architecture.

The project must remain understandable after many years of development.

Folders represent responsibilities.

Responsibilities never overlap.

---

# Root Structure

```

del-carmen-digital-experience/

├── src/
├── public/
├── prisma/
├── docs/
├── tests/
├── scripts/
├── .github/
├── package.json
├── tsconfig.json
├── next.config.ts
├── tailwind.config.ts
└── README.md

```

---

# src/

The src folder contains the entire application.

```

src/

├── app/
├── domains/
├── shared/
├── infrastructure/
├── application/
├── hooks/
├── lib/
├── config/
├── constants/
├── types/
├── styles/

```

---

# app/

Contains Next.js routing.

```

app/

layout.tsx

page.tsx

artworks/

about/

journal/

contact/

api/

```

No business logic.

Only routing.

Server Components are the default.

Client Components must be explicitly declared.

---

# domains/

This is the heart of the project.

Every business capability becomes its own domain.

```

domains/

artworks/

artist/

collections/

journal/

contact/

newsletter/

users/

authentication/

orders/

dashboard/

```

Future

```

museum/

academy/

marketplace/

community/

```
Domains represent business capabilities, not database tables.

A domain may contain multiple entities.

---

# Domain Structure

Example

```

artworks/

components/

pages/

services/

repositories/

controllers/

models/

hooks/

types/

validators/

constants/

animations/

tests/

```

Everything related to Artworks stays together.

---

# shared/

Reusable components.

```

shared/

components/

Button/

Navigation/

Footer/

SectionTitle/

Quote/

Container/

Divider/

Loader/

EmptyState/

```

Never include business logic.

Shared components must be reusable by multiple domains.

A component used by only one domain belongs inside that domain.

---

# application/

Application use cases.

```

application/

services/

commands/

queries/

events/

```

Coordinates the system.

---

# infrastructure/

Everything external.

```

infrastructure/

database/

storage/

email/

payments/

auth/

cache/

logging/

```

Example

```

database/

prisma/

seed/

migrations/

```

---

# lib/

Utility libraries.

```

lib/

motion/

images/

seo/

markdown/

date/

```

---

# hooks/

Global hooks.

```

useScroll()

useWindowSize()

useIntersection()

useReducedMotion()

```

---

# config/

Configuration.

```

config/

theme.ts

navigation.ts

seo.ts

site.ts

env.ts

```

---

# constants/

Project constants.

```

ROUTES

COLORS

BREAKPOINTS

SOCIAL LINKS

```

---

# styles/

```

globals.css

typography.css

animations.css

```

Only global styles.

Everything else belongs to components.

---

# types/

Global shared types.

```

ApiResponse

Pagination

SEO

Metadata

```

---

# public/

```

images/

artworks/

icons/

fonts/

textures/

videos/

```

Future

```

museum/

```

---

# prisma/

```

schema.prisma

migrations/

seed.ts

```

Database only.

---

# docs/

Official documentation.

```

identity/

project/

architecture/

pages/

components/

prompts/

```

Exactly the documents we are producing.

---

# tests/

```

unit/

integration/

e2e/

```

---

# Naming Convention

Folders

kebab-case

Files

kebab-case

React Components

PascalCase

Types

PascalCase

Hooks

camelCase

Services

camelCase

Repositories

camelCase

Controllers

camelCase

---

# Component Rules

Every component owns

Component

Styles

Tests

Animations

Types

Documentation

Example

```

ArtworkCard/

ArtworkCard.tsx

ArtworkCard.types.ts

ArtworkCard.test.tsx

ArtworkCard.motion.ts

ArtworkCard.styles.ts (only when component-specific styling is required)

README.md

```

Self-contained.

---

# Domain Independence

Domains never import each other's internal files.

Communication happens through public interfaces.

---

# Dependency Flow

```

Presentation

↓

Application

↓

Domain

↓

Infrastructure

```

Never the opposite.

---

# Assets Strategy

Original paintings

```

private storage:

artworks/originals/

public:

public/images/artworks/web/
public/images/artworks/thumbs/
```

Optimized

```

public/images/artworks/web/

```

Thumbnails

```

public/images/artworks/thumbs/

```

---

# Future Expansion

The architecture already supports

Virtual Museum

Artist Community

Marketplace

Collector Dashboard

Learning Platform

without structural changes.

---

# Golden Rule

The repository should feel as calm and organized as the experience presented to the visitor.

A developer should experience the same clarity that a visitor feels when exploring the artworks.

---

Del Carmen Digital Experience

Painting the Eternal Essence Within


---

# Folder Architecture Evolution Update — 2026-10-05

This section extends the complete approved Folder Architecture v1.0 above.

DOC-FA remains **High Authority / Approved**.

## Architectural Intent vs Physical Materialization

The original folder tree expresses intended responsibility boundaries and long-term architecture.

Not every documented directory must already exist physically in the current Phase 1 repository.

A planned folder is not obsolete merely because its corresponding infrastructure has not yet been materialized.

Conversely, a folder should not be created only to make the repository resemble this document before a real responsibility exists.

## Current Confirmed Shared Structure

Current approved implementation includes shared UI/layout responsibilities such as:

`src/shared/layout/container/Container.tsx`

and:

```text
src/shared/ui/kinetic-carousel/
├── KineticCarousel.tsx
├── useKineticCarousel.ts
└── index.ts
```

KineticCarousel is shared because genuine cross-domain reuse exists.

Its extraction does not imply that all interaction mechanics should become shared systems.

## Collections / ArtworkSeries Boundary

`src/domains/collections/` may own the visitor-facing discovery/presentation experience for ArtworkSeries.

It does not establish a parallel `Collection` persistence domain.

Canonical domain model:

`ArtworkSeries`

Canonical public routes:

`/collections`

`/series/[slug]`

`/artworks/[slug]`

The route and presentation vocabulary may differ from persistence vocabulary without duplicating the business model.

## Future Directories — Preserved

The original future domains remain architectural direction:

- museum;
- academy;
- marketplace;
- community.

Likewise, users, authentication, orders, dashboard, application services and infrastructure responsibilities remain valid future/planned responsibilities where supported by the broader roadmap.

They must not be deleted from documentation merely because Phase 1 has not materialized them.

## Infrastructure and Application Layers

The documented `infrastructure/` and `application/` responsibilities remain long-term architecture.

They should materialize when actual external providers, persistence, use cases or orchestration responsibilities justify them.

This preserves both principles:

`future architecture is not cancelled`

and

`speculative folders are not created prematurely`.

## Domain Structure Examples

The original full domain subfolder example remains a capability template, not a requirement that every domain contain every folder.

A domain should materialize only the responsibilities it actually owns.

For example, a presentation-only domain need not invent repositories, controllers or validators simply to match the example tree.

## Shared Governance

A component belongs in `shared/` when genuine reuse and business neutrality are demonstrated.

A component used by one domain remains local unless a real reuse requirement emerges.

This is consistent with the original rule and current governance against premature abstraction.

## Current Presentation State

Query parameters, lightbox context, kinetic navigation state and onboarding state are presentation/navigation concerns.

Their existence does not create new business domains or persistence models.

## Future Evolution

Folder Architecture may evolve as the ecosystem grows.

Future PostgreSQL/Prisma persistence, authentication, storage, CMS/Admin, Marketplace, Virtual Museum, Academy, Community and other planned capabilities may materialize the responsibilities already anticipated here.

Structural evolution should extend the architecture before replacing it and preserve traceability when an approved change supersedes an earlier folder decision.

## Audit Note

Version 1.1 uses the conservative documentation method.

The complete supplied v1.0 Folder Architecture is preserved above apart from Version metadata.

No future domain or infrastructure responsibility is removed because it is not currently materialized.

No unneeded folder is declared mandatory merely because it appears in the long-term architecture.
