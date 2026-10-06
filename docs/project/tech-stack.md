# Tech Stack

Version: 1.0

Document ID:
DOC-TS

Project:
Del Carmen Digital Experience

Parent Brand:
Rō Visual

Document Type:
Technical / Technology Baseline

Authority Level:
High

Status:
🟢 Approved — Reconstructed Canonical Baseline

Owner:
Del Carmen Digital Experience

Last Updated:
2026-10-05

---

# Reconstruction Notice

This document is a formally reconstructed Tech Stack document.

The original file named `tech-stack.md` in the supplied documentation archive is not a valid Tech Stack source. Its content identifies itself as `Project Roadmap`, `DOC-RM`.

This v1.0 reconstruction therefore does **not** claim to reproduce the lost original wording.

It establishes a new canonical Tech Stack baseline from surviving authoritative project documentation and verified implementation records.

Primary reconstruction sources:

- Project Memory
- System Architecture
- Folder Architecture
- Repository Structure
- Implementation Roadmap
- approved implementation documents
- surviving project handoff documentation

Where a technology is planned but not currently implemented, that distinction is explicit.

---

# Purpose

This document defines the technology baseline for Del Carmen Digital Experience.

It separates:

1. technologies currently implemented and canonical;
2. Phase 1 infrastructure currently used by specific completed modules;
3. approved/planned architectural technologies for future phases;
4. technologies that remain conditional and should not be materialized prematurely.

The stack must support the artistic experience without becoming the experience itself.

---

# TS-01 Technology Governance

- Current implementation and future architecture are different statuses.
- `Not yet implemented` does not mean `removed`.
- A planned technology must not be described as current production infrastructure.
- A current technology must not become permanently immutable merely because it is canonical today.
- New infrastructure should be introduced when a demonstrated requirement exists.
- Existing approved modules should not be redesigned merely to adopt a newer technology.
- Shared abstractions should emerge from genuine reuse.
- Technology remains subordinate to artwork, accessibility, performance and maintainability.

Canonical principle:

> Visitors should remember the artwork, not the software.

---

# TS-02 Current Application Baseline

Status:
🟢 Implemented / Canonical

Core application stack:

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- App Router
- Node.js runtime
- ESLint
- `src/`-based architecture
- `@/*` path alias
- Git
- Vercel deployment target

Current project records specifically verify Next.js 16.2.12 and React 19.2.4 in the Phase 1 development baseline.

Build command:

`next build --webpack`

The project uses a modular, domain-oriented architecture rather than a page-only organization.

---

# TS-03 Rendering and Application Architecture

Status:
🟢 Current + 🟡 Planned Extension

Current Next.js responsibilities include:

- App Router routing
- layouts
- page composition
- React Server Components where appropriate
- client components where browser interaction is required
- API Routes for server endpoints
- static prerendering where appropriate

Planned application architecture also preserves:

- Server Actions where appropriate
- application/service orchestration
- repository boundaries when persistence requires them
- separation between presentation, domain, infrastructure and persistence responsibilities

The UI must not become directly coupled to future database infrastructure.

---

# TS-04 Styling and Design System

Status:
🟢 Implemented / Canonical

Primary styling technology:

- Tailwind CSS

Canonical visual authority remains:

`globals.css`

Current shared layout includes:

`src/shared/layout/container/Container.tsx`

Scene-specific artistic composition values remain local when they are not genuine global design tokens.

---

# TS-05 Motion and Interaction

Status:
🟢 Implemented / Canonical where used

Primary advanced motion technology:

- GSAP

Current Phase 1 also contains custom React/browser interaction architecture, including:

`src/shared/ui/kinetic-carousel/`

with:

- `KineticCarousel.tsx`
- `useKineticCarousel.ts`
- `index.ts`

Artwork Detail uses custom pointer, wheel/trackpad, keyboard and momentum behavior.

These systems do not justify adding another animation framework without demonstrated need.

Canonical physical interaction principle:

`The artwork must feel as though it has weight.`

Reduced-motion accessibility remains mandatory.

---

# TS-06 Current Phase 1 Service Infrastructure

Status:
🟢 Implemented for specific Phase 1 domains

## Resend

Current use:

- Contact email delivery
- Newsletter email/confirmation flows where documented

Contact uses the visitor email as `replyTo`.

The development sender `Del Carmen <onboarding@resend.dev>` is temporary and is not the final production sender.

## Upstash Redis

Current use includes:

- Contact rate limiting
- Newsletter rate limiting
- Newsletter v1.0 persistence/source-of-truth responsibilities

Newsletter preserves double opt-in semantics, hashed confirmation-token lookup, expiration, unsubscribe and resubscription lifecycle.

These Phase 1 provider choices may evolve through an explicitly approved migration.

---

# TS-07 Database and ORM

Status:
🟡 Planned / Future Architecture — Not Yet General Platform Baseline

Planned relational database:

- PostgreSQL

Planned ORM:

- Prisma

These technologies remain part of the documented architecture for future persistence-backed platform capabilities.

They are **not** described as the current general persistence layer for the public Phase 1 experience.

Future persistence-backed flows may include:

```text
Application / Service
        ↓
Repository
        ↓
Prisma
        ↓
PostgreSQL
```

Implementation should occur when real domain requirements justify it.

---

# TS-08 Authentication

Status:
🟡 Planned / Future Architecture

Planned authentication technology:

- Auth.js / NextAuth

Authentication is intended for future capabilities that require identity, authorization or account ownership, potentially including Collector, Marketplace, Community, Academy, administration and account-oriented experiences.

It should not be materialized before those requirements become real.

---

# TS-09 Media and Storage

Status:
🟡 Planned / Evolving Architecture

Documented future artwork-oriented media storage:

- Cloudinary

The broader architecture preserves future storage/CDN responsibilities where appropriate for documents, generated assets and public media.

Current local/public asset workflows remain valid until an approved migration occurs.

Cloudinary must not be described as current production storage merely because it is part of planned architecture.

---

# TS-10 Deployment and Version Control

Status:
🟢 Canonical Direction

Deployment platform:

- Vercel

Version control:

- Git
- GitHub

The architecture preserves automatic deployment / CI-CD direction.

Environment-specific secrets remain outside the repository.

---

# TS-11 Security

Status:
🟢 Current Principle / Evolving Implementation

Security responsibilities include:

- environment-variable protection
- input validation
- rate limiting
- secure server endpoints
- authentication and authorization when account systems arrive
- database protection when persistence is introduced
- media/storage security
- dependency review
- appropriate production DNS/email authentication

Current Contact and Newsletter implementations already establish server-side validation and abuse-protection patterns.

---

# TS-12 Observability

Status:
🟡 Future / Planned

The architecture preserves future observability responsibilities for:

- errors
- performance
- user behavior
- server health
- security events

Potential categories include analytics, logging, monitoring and error tracking.

No specific observability vendor is made canonical by this reconstruction because the surviving authoritative sources do not establish one.

---

# TS-13 CMS and Administration

Status:
🟡 Planned / Future Architecture

The architecture preserves:

- custom Admin Panel as the initial planned administration direction;
- future Headless CMS if demonstrated requirements justify it.

This does not mean a CMS must be implemented during Phase 1.

---

# TS-14 Future Platform Capabilities

Status:
🟡 Planned / Roadmap-Dependent

The technology architecture must remain capable of supporting future Del Carmen ecosystem modules, including:

- Marketplace
- Virtual Museum
- Academy
- Community
- Collector experiences / Collector Circle
- immersive experiences
- digital exhibitions
- artist residency capabilities
- licensing
- archive
- richer CMS/Admin workflows

Their existence does not require all supporting infrastructure to be installed today.

Technology choices may be refined when their roadmap phase begins.

---

# TS-15 Technology Status Matrix

| Technology / Capability | Current Status | Role |
|---|---|---|
| Next.js 16 | Implemented / Canonical | Application framework |
| React 19 | Implemented / Canonical | UI runtime |
| TypeScript | Implemented / Canonical | Type system |
| Tailwind CSS | Implemented / Canonical | Styling |
| App Router | Implemented / Canonical | Routing/application composition |
| Node.js | Implemented / Canonical runtime direction | Server/runtime |
| ESLint | Implemented / Canonical | Code quality |
| GSAP | Implemented where approved | Advanced artistic motion |
| Custom kinetic interaction | Implemented / Canonical where approved | Direct artwork navigation |
| Resend | Implemented Phase 1 | Contact/Newsletter email |
| Upstash Redis | Implemented Phase 1 | Rate limiting + Newsletter v1.0 persistence |
| Vercel | Canonical deployment target | Deployment |
| Git / GitHub | Canonical | Version control |
| PostgreSQL | Planned | Future relational persistence |
| Prisma | Planned | Future ORM |
| Auth.js / NextAuth | Planned | Future authentication |
| Cloudinary | Planned | Future artwork-oriented media storage |
| Custom Admin | Planned | Future administration |
| Headless CMS | Conditional future | Possible later content infrastructure |
| Observability stack | Planned / provider undecided | Monitoring and analytics |

---

# TS-16 Relationship to Other Documents

This document defines **which technologies belong to the current or planned stack and their status**.

`system-architecture.md` defines how system responsibilities collaborate.

`repository-structure.md` and `folder-architecture.md` define where responsibilities belong.

`domain-model.md` defines canonical business concepts.

`implementation-roadmap.md` and `roadmap.md` define sequencing.

`project-memory.md` records canonical decisions and project evolution.

When these documents evolve, Tech Stack should be updated rather than silently allowing implementation and documentation to diverge.

---

# TS-17 Reconstruction Governance

This document is a **new canonical reconstruction**, not a recovered historical original.

The invalid archive file previously named `tech-stack.md` remains a source-integrity record until the final cleaned documentation package is assembled.

For the cleaned package:

- this reconstructed document becomes canonical `project/tech-stack.md`;
- the misnamed DOC-RM duplicate must not overwrite it;
- the source-integrity audit may be retained in an audit/history area if historical traceability is desired.

Future changes should increment this document normally from v1.0.

---

# Final Principle

Technology exists to preserve, reveal and extend the artistic experience.

The stack should be powerful enough to support the long-term Del Carmen ecosystem while remaining quiet enough for the artwork to remain the protagonist.

---

Del Carmen Digital Experience

Painting the Eternal Essence Within
