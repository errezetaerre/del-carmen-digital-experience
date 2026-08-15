# Folder Architecture

Version: 1.0

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
