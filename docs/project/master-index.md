Del Carmen Digital Experience

Version: 1.7

Document ID: DOC-MI

Project: Del Carmen Digital Experience

Parent Brand: Rō Visual

Document Type: Governance

Authority Level: High

Status: 🟢 Approved

Owner: Del Carmen Digital Experience

Last Updated: 2026-10-05

--

Documentation Index

Identity

✅ brand-philosophy.md

✅ brand-lexicon.md

✅ design-tokens.md

✅ visual-language.md

Experience

✅ experience-principles.md

✅ hero-blueprint.md

Project

✅ project-manifesto.md

✅ project-memory.md

✅ roadmap.md

Architecture / Technical

✅ repository-structure.md

✅ folder-architecture.md

◻ system-architecture.md --- Draft

◻ domain-model.md --- In Progress

◻ implementation-roadmap.md --- In Progress

✅ artwork-model.md

Home

✅ home-specification.md

✅ home-wireframe.md

◻ home-art-direction.md --- Draft

◻ home-moodboard.md --- Draft

Artist

✅ artist-specification.md --- v1.2 --- Approved / Frozen

✅ artist-wireframe.md --- v1.2 --- Approved / Frozen

✅ artist-implementation.md --- v1.1 --- Approved / Complete / Frozen

About

✅ about-specification.md --- v1.0 --- Approved / Frozen

✅ about-wireframe.md --- v1.0 --- Approved / Frozen

✅ about-implementation.md --- v1.0 --- Approved / Complete / Frozen

✅ about-film-treatment.md --- v1.0 --- Approved Direction / Planned Media Master

Contact

✅ contact-specification.md --- v1.0 --- Approved / Frozen

✅ contact-wireframe.md --- v1.0 --- Approved / Frozen

✅ contact-implementation.md --- v1.0 --- Approved / Complete / Frozen

Newsletter

✅ newsletter-specification.md --- v1.0 --- Approved / Frozen

✅ newsletter-wireframe.md --- v1.0 --- Approved / Frozen

✅ newsletter-implementation.md --- v1.0 --- Approved / Complete / Frozen

Frozen Documentation

🔒 DOC-RS 🔒 DOC-SA 🔒 DOC-GOV

Current Phase

Phase 1 --- MVP

Current Focus

Responsive QA --- global Phase 1 validation

Status

Contact --- ✅ COMPLETE / APPROVED / FROZEN

Newsletter --- ✅ COMPLETE / APPROVED / FROZEN

Documentation Rules

✅ Documents marked as Frozen require technical justification before
modification.

✅ Approved modules become the canonical implementation.

✅ Development follows incremental sprint approvals.


--

Documentation Evolution Update — 2026-10-05

This section extends the approved v1.5 index without deleting or rewriting its earlier project-state record.

The original index above remains preserved as the historical state recorded on 2026-09-08. The entries below record documentation and implementation that advanced after that date.

Documentation Status Updates

Architecture / Technical

✅ domain-model.md --- v1.1 --- Approved

◻ system-architecture.md --- v1.2 --- Draft, with approved Collections / Series presentation boundary

◻ implementation-roadmap.md --- v1.1 --- In Progress

Collections / Artwork Series

✅ collection-specification.md --- v1.0 --- Approved

Canonical domain / route relationship:

`ArtworkSeries` --- canonical body-of-work model

`/collections` --- editorial discovery experience for ArtworkSeries

`/series/[slug]` --- detailed ArtworkSeries experience

Visitor-facing `Collection` remains editorial terminology and does not introduce a parallel canonical persistence model.

Implemented / Approved Phase 1 Experience Advances

The following systems were implemented and approved after the earlier v1.5 project-state snapshot:

✅ Responsive Collection Hero behavior

✅ Collections Works Preview

✅ Shared KineticCarousel

Canonical shared location:

`src/shared/ui/kinetic-carousel/`

Canonical files:

- `KineticCarousel.tsx`
- `useKineticCarousel.ts`
- `index.ts`

✅ Series Gallery kinetic integration

✅ Contextual Artwork Lightbox

✅ Series-aware Artwork Detail navigation

✅ Artwork Detail three-scene kinetic navigation

✅ Artwork Detail trackpad / pointer input ownership

✅ Symmetric first / last artwork edge resistance

✅ One-navigation-per-trackpad-gesture protection

✅ Direct gesture response with momentum / trajectory continuity

Current Artwork Detail interaction principle:

`The artwork must feel as though it has weight.`

Journal

Journal implementation has progressed beyond the documentation state represented in the supplied documentation package.

A dedicated canonical Journal specification / implementation document is not present in this package.

The absence of that document must not be interpreted as removal, cancellation or nonexistence of Journal functionality.

It remains a documentation reconciliation item.

Current Phase

Phase 1 --- MVP

Current Documentation Focus

Documentation reconciliation and source-of-truth audit.

This documentation focus does not replace or cancel remaining Phase 1 implementation, QA, deployment or future roadmap work.

Current Audit Sequence

1. Project Memory
2. Master Index
3. Roadmap
4. Architecture
5. Domain / Experience documentation
6. Remaining page / identity reconciliation
7. Documentation cleanup and consolidated package

Documentation Interpretation Rules

✅ The documentation records both the current implementation and the approved/planned direction of the project.

✅ A feature or technology is not removed merely because it has not yet been implemented.

✅ `Implemented`, `Approved / Planned`, `Future Direction` and `Draft / Under Evaluation` describe different dimensions of project maturity and must not be treated as synonyms.

✅ Existing future-facing architecture remains part of the project until an explicit later decision updates or supersedes it.

✅ New implementation decisions extend the documentation while preserving prior intent and historical traceability.

✅ When a later approved decision changes an earlier decision, the earlier decision should be treated as superseded or historically contextualized rather than silently erased.

Canonical Stability — Current Phase

The following systems are considered stable/canonical for the current Phase 1 implementation unless a verified bug, accessibility defect or explicitly approved experience revision requires change:

- responsive Collection Hero behavior
- Collections Works Preview
- shared KineticCarousel core
- Series Gallery kinetic integration
- contextual Artwork Lightbox flow
- Artwork Detail three-scene kinetic navigation
- Artwork Detail trackpad / pointer ownership and approved edge semantics

`Stable / canonical` applies to the current approved phase. It does not prohibit future roadmap phases from extending or superseding these systems through an explicit approved decision.

Audit Note

This v1.6 update follows a conservative documentation method.

The complete supplied v1.5 body is preserved above, apart from the document version and Last Updated metadata.

No future-facing capability, technology or architectural direction from v1.5 has been removed because it is not yet implemented.

The new section records subsequent documentation and implementation state while preserving the earlier snapshot for traceability.
---

# Master Index Evolution Update — 2026-10-05

This section extends the complete conservative v1.6 Master Index above.

The earlier index state is preserved as audit history. This update records documents formally reconstructed after that audit pass.

## Project / Technology

### `project/tech-stack.md`

- Document ID: `DOC-TS`
- Version: `1.0`
- Status: 🟢 Approved — Reconstructed Canonical Baseline
- Authority: High

The canonical Tech Stack was formally reconstructed after the archived file named `tech-stack.md` was verified to contain Project Roadmap / `DOC-RM` content rather than a valid Tech Stack document.

The reconstructed DOC-TS is now the canonical `project/tech-stack.md`.

The misnamed historical duplicate must not overwrite it.

The document explicitly separates:

- current / implemented technology;
- approved / planned future technology.

Future architecture remains preserved rather than being removed because it is not yet implemented.

## Journal

A dedicated Journal documentation block now exists.

### `domains/journal/journal-specification.md`

- Document ID: `DOC-JOURNAL-SPEC`
- Version: `1.0`
- Status: 🟢 Approved — Reconstructed from Current Implementation
- Authority: High

Defines the current Phase 1 Journal domain and experience, including:

- `/journal`;
- `/journal/[slug]`;
- `JournalEntry`;
- `JournalStory`;
- scene-driven editorial architecture;
- Journal Index;
- Journal Entry;
- Journal Collection;
- shared KineticCarousel reuse;
- GSAP / ScrollTrigger motion responsibilities;
- reduced-motion behavior;
- current local TypeScript data source;
- future content-platform evolution boundary.

### `domains/journal/journal-wireframe.md`

- Document ID: `DOC-JOURNAL-WF`
- Version: `1.0`
- Status: 🟢 Approved — Reconstructed from Current Implementation
- Authority: High

Records the implemented spatial hierarchy for:

- Journal Index;
- Entry Hero;
- centered scenes;
- split-left scenes;
- split-right scenes;
- immersive scenes;
- atmospheric scene continuity;
- Journal Collection;
- responsive recomposition;
- reduced-motion behavior.

### `domains/journal/journal-implementation.md`

- Document ID: `DOC-JOURNAL-IMPL`
- Version: `1.0`
- Status: 🟢 Approved — Current Implementation Reconstructed
- Authority: High

Records the supplied current Journal implementation across:

```text
src/domains/journal/
src/app/journal/
```

The implementation documentation preserves the boundary between Journal-specific composition and shared platform infrastructure.

Current source inspection records a content/data QA item: the supplied catalogue contains multiple Journal entries while the supplied Journal Story data currently provides a complete scene story for `the-art-of-remembering`.

This does not cancel the remaining Journal catalogue or the future Journal / Content Platform roadmap.

## Documentation Review

### `DOCUMENTATION-REVIEW.md`

Current review evolution:

`2026-10-05 — Conservative Documentation Reconciliation`

The review now records:

- the preservation methodology;
- the complete audit scope;
- Tech Stack reconstruction;
- Journal reconstruction;
- current Phase 1 architecture alignment;
- completed / frozen areas;
- Home alignment;
- future architecture preservation;
- source-integrity cleanup rules;
- remaining production verification.

The original 2026-08-26 review remains preserved as historical audit evidence.

## Current Documentation Gap Status

Confirmed gap status after reconciliation:

```text
Tech Stack source gap        → RESOLVED
Journal documentation gap    → RESOLVED
```

No additional current Phase 1 documentation gap has been identified that justifies creating another canonical document at this review stage.

Future documents should be introduced when a real domain, infrastructure responsibility or approved experience becomes substantial enough to require an independent source of truth.

## Canonical Package Rule

For the final cleaned documentation package:

- use the reconstructed DOC-TS as `project/tech-stack.md`;
- include the three Journal documents under `domains/journal/`;
- include the evolved `DOCUMENTATION-REVIEW.md`;
- exclude `.DS_Store`;
- exclude `__MACOSX`;
- exclude temporary Office files such as `~$...`;
- exclude proven duplicate canonical copies;
- do not allow the historical misnamed Roadmap duplicate to occupy `project/tech-stack.md`.

Historical material may be retained in an explicit audit/history area when useful, but it must not compete with canonical paths.

## Current Documentation State

The documentation system now represents:

```text
historical decisions
+
current canonical implementation
+
approved future direction
+
explicit evolution and supersession
```

This distinction is fundamental.

`Not implemented` does not mean `removed`.

`Planned` does not mean `implemented`.

`Canonical for Phase 1` does not mean `immutable for all future phases`.

---

Del Carmen Digital Experience

Painting the Eternal Essence Within
