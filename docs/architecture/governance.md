Version:
1.1

Document ID:
DOC-GOV

Project:
Del Carmen Digital Experience

Parent Brand:
Rō Visual

Document Type:
Governance

Authority Level:
High

Status:
🟢 Approved

Owner:
Del Carmen Digital Experience

Last Updated:
2026-10-05

---

# Project Governance

## Purpose

This document defines the governance rules for implementing Del Carmen Digital Experience.

Its objective is to maintain architectural consistency, code quality, documentation integrity and long-term maintainability throughout the project's evolution.

This document complements the architectural documentation and establishes the conventions that every implementation must follow.

---

# General Principles

Every implementation must follow these principles:

• Simplicity before complexity.
• Consistency before convenience.
• Reuse before duplication.
• Architecture before implementation.
• Business drives technology.
• Documentation evolves together with the project.

---

# Architectural Governance

The approved architecture is considered the project's source of truth.

Implementation should adapt to the architecture.

The architecture should not be modified without technical justification.

Whenever an architectural decision affects approved documentation, the corresponding document must be updated before considering the implementation complete.

---

# Repository Governance

Before creating:

• a new folder
• a new domain
• a new shared module
• a new architectural layer

always verify:

1. Does an appropriate location already exist?
2. Does this solve a current problem?
3. Is this consistent with the approved Repository Structure?

Future hypothetical needs should never justify new architecture.

---

# Documentation Governance

Whenever implementation changes:

• Repository Structure
• Domain Model
• System Architecture
• Folder responsibilities
• Naming conventions

the corresponding documentation must be updated during the same implementation cycle.

Documentation should never lag behind the codebase.

---

# Naming Conventions

## Folders

Always use lowercase.

Examples:

home
artworks
shared
layout
container
button
services
model
data
hooks
utils

---

## React Components

Always use PascalCase.

Examples:

Hero.tsx
ArtworkHero.tsx
Container.tsx
ArtworkFrame.tsx

---

## TypeScript Types

Use PascalCase.

Examples:

Artwork
ArtworkImage
ArtworkDimensions

---

## Interfaces

Use PascalCase.

Examples:

ArtworkProps
ButtonProps
ContainerProps

---

## Utility Files

Always use lowercase.

Examples:

index.ts
types.ts
constants.ts
helpers.ts
utils.ts

---

# Component Organization

Each reusable component should follow the same structure.

Example:

button/

Button.tsx
types.ts
index.ts

This convention applies to both shared and domain components whenever appropriate.

---

# Decision Process

Before introducing a new abstraction, ask:

• Is this solving a real problem today?
• Does an equivalent solution already exist?
• Will this reduce complexity?
• Does this preserve architectural consistency?

If the answer is "no", the abstraction should not be introduced.

---

# Evolution Policy

The platform is expected to evolve continuously.

New functionality should extend the existing architecture rather than replace it.

Large structural refactors should be exceptional events supported by clear technical justification.

---

# Final Statement

Good architecture is not measured by the number of folders or abstractions.

It is measured by clarity, consistency, maintainability and the ability to evolve without unnecessary complexity.

Del Carmen Digital Experience grows through disciplined evolution, not architectural accumulation.


---

# Governance Evolution Clarification — 2026-10-05

## Purpose

This section clarifies the application of the existing governance rules after the project advanced through additional Phase 1 implementation.

It does not replace the governance principles above.

The original v1.0 governance remains preserved as the approved foundation.

---

# Planned Architecture vs Speculative Architecture

The rule:

> Future hypothetical needs should never justify new architecture.

remains valid.

Its purpose is to prevent premature implementation of folders, abstractions, layers, services or systems that do not solve a current requirement.

It must not be interpreted as a requirement to delete, weaken or forget future architecture that has already been deliberately documented as part of the project's approved or planned direction.

Therefore:

• Do not create empty architecture solely because a future feature might exist.
• Do preserve approved/planned future architecture in documentation.
• Materialize that architecture when the relevant Roadmap phase creates a real implementation requirement.
• If future requirements change, update or supersede the documented direction explicitly rather than silently removing it.

Examples of documented future direction may include database persistence, authentication, storage, CMS, Marketplace, Collector capabilities, Virtual Museum, Academy, Community and other roadmap modules.

Their implementation timing and detailed technical design may evolve.

Their absence from the current physical codebase does not by itself cancel them.

---

# Documentation as Living Source of Truth

The rule:

> Documentation evolves together with the project.

means that documentation represents both:

• the current approved implementation; and
• the approved/planned direction that guides future implementation.

These states must be distinguishable.

Recommended status language includes:

• Approved / Implemented / Canonical
• Approved / Planned — Not Yet Implemented
• Future Direction
• Draft / Under Evaluation
• Superseded

A later approved decision may supersede an earlier decision.

When that happens, preserve enough historical traceability to understand the evolution rather than silently deleting the earlier intent.

---

# Canonical Does Not Mean Permanently Immutable

The existing Freeze Policy and approval workflow remain valid.

A module marked canonical is stable for its current approved phase.

Current work should not redesign it without a verified bug, accessibility issue, new requirement or explicit approved experience/architecture decision.

However, later Roadmap phases may legitimately extend or supersede a canonical Phase 1 system.

This is disciplined evolution, not a violation of the Freeze Policy.

---

# Current Shared Architecture Example

The shared KineticCarousel is an example of governance operating as intended.

A shared abstraction was introduced only after genuine reuse existed across Collections and Series.

Canonical location:

`src/shared/ui/kinetic-carousel/`

The shared module owns reusable kinetic mechanics.

Collections and Series retain their own editorial composition rules.

This follows:

• Reuse before duplication.
• Simplicity before complexity.
• Business drives technology.
• No premature abstraction.

---

# Domain Governance Clarification

Visitor-facing terminology and presentation context must not create duplicate business entities without a genuine domain requirement.

Current example:

• `ArtworkSeries` is the canonical body-of-work domain model.
• `/collections` is an editorial discovery experience.
• `/series/[slug]` is the detailed Series experience.
• `Collection` may remain visitor-facing editorial terminology.
• `?series=` preserves navigation context and does not create another persistence relationship.

Future domain evolution remains possible when real requirements justify it.

---

# Audit Integrity Rule

Documentation audits must use conservative preservation.

The default operations are:

PRESERVE

Retain existing content, including future-facing architecture and roadmap intent.

EXTEND

Add newly approved implementation, architecture or experience decisions.

UPDATE

Reconcile information when the project has genuinely evolved.

SUPERSEDE

Mark an earlier decision as replaced when a later approved decision explicitly changes it, while preserving traceability.

REMOVE

Use only for objective documentation artifacts such as temporary files, operating-system metadata, proven accidental duplication, or content explicitly cancelled by an approved decision.

A feature or technology must not be removed merely because it is not implemented yet.

---

# Current Documentation Hygiene

Generated documentation packages should exclude non-project artifacts such as:

• `.DS_Store`
• `__MACOSX`
• temporary editor files such as `~$...`

Removing these files is documentation hygiene and does not constitute architectural deletion.

---

# Final Clarification

Del Carmen Digital Experience should continue to grow through disciplined evolution.

Governance must protect both sides of that principle:

• avoid speculative implementation before requirements exist; and
• preserve the project's deliberate future direction until an approved decision evolves it.

---

Audit Note

Version 1.1 uses the conservative documentation method.

The complete supplied v1.0 Governance body is preserved above, apart from Version and Last Updated metadata.

No original governance principle has been deleted or rewritten.

This clarification resolves how future-facing documentation should coexist with the existing prohibition against premature architectural implementation.
