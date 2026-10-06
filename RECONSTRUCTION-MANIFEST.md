# Reconstruction Manifest — Del Carmen Digital Experience

Version: 1.0

Document ID:
DOC-RECON-MANIFEST

Project:
Del Carmen Digital Experience

Parent Brand:
Rō Visual

Document Type:
Technical / Reconstruction Manifest

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

This manifest defines the package required to reconstruct the current Del Carmen Digital Experience application with an AI coding system, developer or future technical team.

It complements `README-AI.md`.

`README-AI.md` explains how to reason about the project.

This document explains what the reconstruction package should contain, what each package area means, what must not be included, and how reconstruction should be verified.

---

# Recommended Reconstruction Package

```text
del-carmen-digital-experience/
│
├── README-AI.md
├── RECONSTRUCTION-MANIFEST.md
│
├── docs/
│   ├── DOCUMENTATION-REVIEW.md
│   ├── architecture/
│   ├── domains/
│   ├── experience/
│   ├── identity/
│   ├── pages/
│   └── project/
│
├── src/
├── public/
│
├── package.json
├── package-lock.json
├── tsconfig.json
├── next.config.ts
├── eslint.config.*
├── postcss.config.*
├── .gitignore
├── .env.example
└── README.md                 # if the repository already contains one
```

Include other genuine root configuration files used by the current repository when present.

Do not manufacture missing configuration solely to match this example tree.

---

# Package Layers

## 1. Documentation Layer

Required:

`docs/`

Purpose:

- project philosophy;
- governance;
- domain model;
- architecture;
- current canonical decisions;
- future direction;
- specifications;
- wireframes;
- implementation records;
- design system;
- experience principles.

Documentation explains why the system exists and how decisions should be interpreted.

## 2. Source Layer

Required for implementation-faithful reconstruction:

`src/`

Purpose:

- current application behavior;
- route implementation;
- components;
- domains;
- shared primitives;
- motion;
- local data;
- runtime integrations.

For already implemented features, source code is the strongest evidence of exact current mechanics when documentation is intentionally higher-level.

## 3. Asset Layer

Required for visual fidelity:

`public/`

and any other genuine source asset directory used by the repository.

Purpose:

- artworks;
- photography;
- video;
- posters;
- textures;
- icons;
- logos;
- editorial media.

Missing assets must be reported.

Do not substitute generated imagery without explicit authorization.

## 4. Runtime / Build Contract

Required:

- `package.json`;
- lockfile used by the project;
- TypeScript configuration;
- Next.js configuration;
- ESLint configuration;
- PostCSS/Tailwind-related configuration when present;
- environment-variable example/contract.

These files determine how the application is installed, compiled and validated.

---

# Canonical Documentation Set

The current reconciled documentation package contains the project's canonical architecture and experience record.

Important entry documents include:

```text
docs/DOCUMENTATION-REVIEW.md
docs/project/project-memory.md
docs/project/master-index.md
docs/project/project-manifesto.md
docs/project/project-overview.md
docs/project/roadmap.md
docs/project/tech-stack.md
docs/project/folder-architecture.md
```

Architecture:

```text
docs/architecture/domain-model.md
docs/architecture/governance.md
docs/architecture/implementation-roadmap.md
docs/architecture/repository-structure.md
docs/architecture/system-architecture.md
```

Identity:

```text
docs/identity/brand-philosophy.md
docs/identity/brand-lexicon.md
docs/identity/design-tokens.md
docs/identity/visual-language.md
```

Experience:

```text
docs/experience/experience-principles.md
docs/experience/hero-blueprint.md
```

The package also contains page/domain documentation for the implemented experiences, including Home, Artist, About, Artworks, Collections, Contact, Newsletter and Journal.

Use `docs/project/master-index.md` for the authoritative current documentation map.

---

# Current Route Expectations

The reconciled documentation establishes or references current public experiences including:

```text
/
 /artist
 /about
 /artworks
 /artworks/[slug]
 /collections
 /series/[slug]
 /journal
 /journal/[slug]
 /contact
```

Newsletter is integrated into the current public experience rather than requiring a standalone `/newsletter` page.

Service/API routes documented for implemented Phase 1 flows include Contact and Newsletter endpoints.

The exact current route tree must ultimately be verified against `src/app/` in the reconstruction package.

If source code and this manifest differ, do not invent a route merely to satisfy the manifest; reconcile against Project Memory, documentation and source.

---

# Current Major Experience Contracts

## Home

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

## Collections / Series

```text
/collections
→ ArtworkSeries discovery
→ /series/[slug]
→ contextual artwork exploration
```

## Artwork Detail

```text
previous scene
↔ current artwork
↔ next scene
```

with natural vertical scrolling and isolated fullscreen behavior.

## Journal

```text
/journal
→ Journal Index
→ /journal/[slug]
→ Hero
→ ordered Story Scenes
→ Journal Collection
→ Footer
```

These contracts should be validated against current source rather than recreated from generic UI patterns.

---

# Shared Infrastructure to Preserve

Known current shared responsibilities include:

```text
src/shared/layout/container/
src/shared/layout/footer/
src/shared/ui/kinetic-carousel/
```

Current KineticCarousel canonical files:

```text
KineticCarousel.tsx
useKineticCarousel.ts
index.ts
```

Do not create local replacements for a shared responsibility without a demonstrated incompatibility.

Shared does not mean that every domain must use the primitive.

Reuse must remain purposeful.

---

# Domain Rules to Verify

## ArtworkSeries

Canonical body-of-work model.

Do not introduce a competing persistent `Collection` model simply because the visitor-facing term Collection is used.

## Artwork

Current Phase 1 may relate to one optional ArtworkSeries through:

`seriesId?: string`

Future many-to-many architecture may be introduced later if justified.

## Journal

Current implementation separates:

- Journal Entry metadata;
- Journal Story scene data.

Detail availability depends on the current source implementation and content completeness.

## Contact

Contact is a private conversation flow.

It does not imply Newsletter consent.

## Newsletter

Newsletter is permission-based and separate from Contact.

Current documented lifecycle includes double opt-in behavior.

---

# Current Technology Verification

Do not hardcode technology versions from this manifest when package files provide more precise current versions.

Verify:

`package.json`

and:

`docs/project/tech-stack.md`

The reconciled documentation currently records the Next.js / React / TypeScript / Tailwind baseline and approved supporting Phase 1 infrastructure.

Planned future technologies remain distinct from current dependencies.

---

# Environment Variables

The reconstruction package should contain:

`.env.example`

with variable names and safe explanatory placeholders.

It must not contain real production secrets.

Likely required variables must be determined from the actual source and `.env.example`.

Do not infer secret values from documentation.

If environment configuration is incomplete:

1. report the missing variable;
2. preserve the integration;
3. allow non-dependent portions of the project to reconstruct where possible;
4. do not fabricate credentials.

---

# Excluded Material

Do not include in a reconstruction package:

```text
node_modules/
.next/
.env.local
.env.production
real secrets
API tokens
private credentials
.DS_Store
__MACOSX/
~$*
temporary editor files
build caches
```

Avoid including obsolete duplicate documentation that competes with canonical paths.

The historical misnamed Tech Stack source containing Roadmap content must not replace the reconstructed canonical `docs/project/tech-stack.md`.

---

# Installation Procedure

Use the package manager implied by the repository lockfile.

For the current documented npm-based baseline, a typical reconstruction sequence is:

```text
npm install
```

or the repository's preferred clean-install command when appropriate.

Then use the scripts defined by the actual `package.json`.

Do not invent script names.

The documented project has used a webpack Next.js production build path.

The exact build command must be taken from current `package.json` before execution.

---

# Reconstruction Procedure

Recommended sequence:

## Phase A — Inventory

Inspect:

- package root;
- documentation;
- `src/app`;
- `src/domains`;
- `src/shared`;
- assets;
- environment contract.

Record missing files before modifying anything.

## Phase B — Authority Resolution

Read `README-AI.md`.

Read Project Memory and Master Index.

Identify:

- implemented/current;
- approved/frozen;
- planned/future;
- superseded;
- draft/in-progress.

## Phase C — Dependency Restoration

Install the repository dependencies from its package contract.

Do not upgrade dependencies during reconstruction unless required for compatibility and explicitly justified.

Reconstruction and modernization are different tasks.

## Phase D — Environment Setup

Create a local environment file from `.env.example` only when necessary.

Use user-supplied legitimate credentials for external services.

Do not fabricate them.

## Phase E — Baseline Run

Attempt the existing development/build workflow before rewriting source.

Record:

- compile errors;
- missing imports;
- missing assets;
- environment failures;
- type errors;
- lint failures;
- runtime failures.

A broken baseline is evidence.

Do not erase it by immediately refactoring the application.

## Phase F — Reconstruction

Restore only what is demonstrably missing or broken.

Prefer:

1. existing source;
2. existing shared primitives;
3. documented current behavior;
4. approved architectural patterns.

Avoid speculative rewrites.

## Phase G — Validation

Run the project's available checks.

Validate canonical routes and interaction contracts.

Document unresolved external-service or content dependencies.

---

# Validation Matrix

A faithful reconstruction should verify the following.

## Build

- dependency installation succeeds or failures are explained;
- TypeScript compilation succeeds;
- Next.js build succeeds;
- lint/static checks defined by the project succeed or failures are documented.

## Routes

Verify the current `src/app` route tree.

At minimum, compare it with the documented public experience map.

## Home

Verify canonical scene order.

## Artist

Verify approved/frozen experience remains intact.

## About

Verify current poster/fallback versus planned final audiovisual master distinction.

## Collections / Series

Verify:

- `/collections`;
- `/series/[slug]`;
- ArtworkSeries domain source;
- responsive Hero behavior;
- Works Preview;
- shared KineticCarousel where appropriate;
- contextual Artwork Lightbox.

## Artworks

Verify:

- archive/catalog experience;
- Artwork Detail;
- context preservation;
- three-scene kinetic navigation;
- edge behavior;
- fullscreen isolation;
- interaction onboarding.

## Journal

Verify:

- Journal Index;
- Journal detail;
- story scene layouts;
- reduced motion;
- Journal Collection;
- complete Entry/Story data for any route expected to be public.

## Contact

Verify:

- form validation;
- API route;
- anti-spam/rate-limit behavior;
- Resend integration configuration;
- production sender configuration separately from development fallback.

## Newsletter

Verify:

- subscription;
- pending state;
- confirmation;
- activation;
- unsubscribe;
- resubscribe;
- double opt-in;
- rate limiting;
- current persistence behavior.

---

# Visual Validation

Code compilation is not sufficient.

Compare reconstructed pages against the supplied implementation and assets.

Check:

- artwork aspect ratio;
- cropping;
- image quality;
- typography;
- global spacing;
- scene hierarchy;
- dark/light surfaces;
- responsive composition;
- hover/focus states;
- motion timing;
- interaction ownership;
- visual clipping;
- portal-based overlays/fullscreen controls.

Do not declare visual fidelity based solely on route availability.

---

# Interaction Validation

For kinetic experiences test appropriate combinations of:

- mouse;
- pointer drag;
- trackpad;
- touch/swipe;
- keyboard;
- reduced motion.

Verify vertical page scrolling is not accidentally captured by horizontal experiences.

Verify a normal click remains a click where drag ownership uses a movement threshold.

Verify invalid edge gestures do not navigate in the opposite direction.

---

# Content Validation

Report rather than silently rewrite:

- placeholder copy;
- missing Journal stories;
- missing images;
- provisional media;
- spelling/casing issues in source content;
- unavailable final About audiovisual media;
- unresolved production email/domain configuration.

Content QA and architectural reconstruction are separate responsibilities.

---

# Future Architecture Rule

Do not implement future platform systems simply to make the reconstruction package appear “complete”.

Future areas may include:

```text
PostgreSQL
Prisma
Auth.js / NextAuth
Cloudinary
CMS / Admin
Marketplace
Collector experiences
Virtual Museum
Academy
Community
immersive environments
digital exhibitions
licensing
archive
expanded content platform
```

Preserve their documentation.

Implement them only when their phase and requirements become concrete and approved.

---

# Completion Report

An AI or developer completing reconstruction should produce a concise report containing:

```text
Reconstruction status
Build status
Routes verified
Assets missing
Environment variables missing
External services requiring credentials
Known content gaps
Known interaction/visual deviations
Documentation conflicts discovered
Changes made
Changes intentionally not made
Future/planned systems left untouched
```

Never report “fully reconstructed” when critical assets, routes, interactions or external dependencies remain unverified.

---

# Reconstruction Acceptance Standard

The project is acceptably reconstructed when the supplied current application can be built and operated with its legitimate environment configuration while preserving:

- domain boundaries;
- current approved experience;
- visual hierarchy;
- artwork integrity;
- interaction behavior;
- accessibility;
- responsive composition;
- shared infrastructure;
- documented future direction.

A reconstruction is not accepted merely because all routes render generic content.

---

# Relationship to Documentation

This manifest does not supersede Project Memory, Master Index, architecture documents, domain specifications or implementation documents.

It orchestrates them.

If this manifest becomes stale, update it rather than forcing the project to conform to obsolete reconstruction instructions.

---

Del Carmen Digital Experience

Painting the Eternal Essence Within
