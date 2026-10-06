# Documentation Review — 2026-08-26

This package contains the 21 documents supplied for review. Existing content was preserved unless a current approved implementation decision required alignment.

## Updated
- roadmap.md → v1.2
- artwork-model.md → v1.1
- home-specification.md → v1.4
- home-wireframe.md → v1.4
- project-memory.md → v1.2
- master-index.md → v1.1

## Preserved without content changes
The remaining supplied documents were retained as provided because the current implementation did not require a safe canonical change to their content in this review cycle. Draft / In Progress documents remain Draft / In Progress rather than being promoted without a dedicated approval pass.

## Key alignment decisions
1. Home Featured Collection and Selected Works are distinct scenes.
2. Artwork `primary`, `collection`, and `thumbnail` have distinct presentation responsibilities.
3. ArtworkSeries may own `images.featured` editorial media without altering member Artwork media.
4. COLLECTION / Series discovery is explicitly represented in Phase 1.
5. Journal in Phase 1 is the foundation / preview; the full content platform remains Phase 3.
6. Phase 6 records immersive collection and spatial interaction intent without prematurely fixing the rendering technology.


---

# Documentation Review Evolution Update — 2026-10-05

This section extends the complete 2026-08-26 review above.

The earlier review is preserved as historical audit evidence. Its statements describe the documentation state at that review cycle and must not be read as the current complete inventory.

## Review Methodology

The current audit uses a conservative preservation model.

Documentation may contain both:

- current approved / implemented architecture;
- approved or planned future direction.

A capability is not removed merely because it has not yet been implemented.

The audit operations are:

- **PRESERVE** — retain valid existing information, including future direction.
- **EXTEND** — add later approved or implemented information.
- **UPDATE** — revise when the project has genuinely evolved.
- **SUPERSEDE** — explicitly replace an earlier decision while preserving traceability.
- **REMOVE** — reserved for objective junk, proven duplicates, corruption, or information explicitly superseded where preservation adds no legitimate historical value.

Decision status and implementation status are separate concerns.

A technology or module may be:

`Approved / Future — Not Yet Implemented`

without ceasing to belong to the project.

---

## Documentation Reconciled in the 2026-10-05 Audit

The current audit reviewed and conservatively evolved the principal documentation set across:

### Project / Governance

- `project/project-memory.md`
- `project/master-index.md`
- `project/roadmap.md`
- `project/project-overview.md`
- `project/project-manifesto.md`
- `project/folder-architecture.md`
- `project/tech-stack.md`

### Architecture

- `architecture/domain-model.md`
- `architecture/system-architecture.md`
- `architecture/implementation-roadmap.md`
- `architecture/repository-structure.md`
- `architecture/governance.md`

### Identity

- `identity/brand-philosophy.md`
- `identity/brand-lexicon.md`
- `identity/design-tokens.md`
- `identity/visual-language.md`

### Experience

- `experience/experience-principles.md`
- `experience/hero-blueprint.md`

### Home

- `pages/home/home-specification.md`
- `pages/home/home-wireframe.md`
- `pages/home/home-art-direction.md`
- `pages/home/home-moodboard.md`

### Artist

- `pages/artist/artist-specification.md`
- `pages/artist/artist-wireframe.md`
- `pages/artist/artist-implementation.md`

### About

- `domains/about/about-specification.md`
- `domains/about/about-wireframe.md`
- `domains/about/about-implementation.md`
- `domains/about/about-film-treatment.md`

### Artworks / Collections

- `domains/artworks/artwork-model.md`
- `domains/collection/collection-specification.md`

### Contact

- `domains/contact/contact-specification.md`
- `domains/contact/contact-wireframe.md`
- `domains/contact/contact-implementation.md`

### Newsletter

- `domains/newsletter/newsletter-specification.md`
- `domains/newsletter/newsletter-wireframe.md`
- `domains/newsletter/newsletter-implementation.md`

The audit preserved source-document status where appropriate rather than silently promoting Draft or In Progress material to Approved.

---

## New Canonical Documentation Created

The audit identified genuine documentation gaps that could not be solved safely by pretending an older source existed.

### Reconstructed Tech Stack

A new canonical Tech Stack was formally reconstructed as:

`project/tech-stack.md`

Reconstruction baseline:

`DOC-TS — v1.0 — Approved — Reconstructed Canonical Baseline`

The reconstruction distinguishes current implementation from planned architecture.

Current / implemented technology includes the Phase 1 application baseline such as:

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- App Router
- Node.js runtime direction
- ESLint
- GSAP where approved
- Resend for current Contact / Newsletter email flows
- Upstash Redis for current Phase 1 rate limiting and Newsletter persistence responsibilities
- Vercel deployment direction
- Git / GitHub version control

Planned / future architecture remains preserved, including:

- PostgreSQL
- Prisma
- Auth.js / NextAuth
- Cloudinary
- Custom Admin
- possible future Headless CMS
- observability infrastructure

The original archive file named `tech-stack.md` was found to contain `Project Roadmap / DOC-RM` content rather than a Tech Stack.

That source is therefore treated as a misnamed duplicate / source-integrity issue and must not overwrite the reconstructed canonical DOC-TS.

---

## Journal Documentation Reconstruction

The previous review stated that Journal in Phase 1 was the foundation / preview while the broader content platform remained later roadmap work.

That historical statement remains preserved.

Since then, Journal implementation advanced beyond the documentation package.

The 2026-10-05 audit inspected the supplied current Journal domain and App Router implementation and reconstructed three canonical documents:

- `domains/journal/journal-specification.md`
- `domains/journal/journal-wireframe.md`
- `domains/journal/journal-implementation.md`

These documents record the implemented Phase 1 Journal experience without claiming that the future full content platform has already been delivered.

Current Journal implementation includes:

- `/journal`
- `/journal/[slug]`
- editorial Journal Index
- Journal Entry Hero
- scene-driven Journal Story architecture
- `centered`
- `split-left`
- `split-right`
- `immersive`
- GSAP / ScrollTrigger editorial and atmospheric motion
- reduced-motion handling
- natural vertical document scrolling
- Journal Collection
- reuse of the shared KineticCarousel

Current source inspection also identified a content/data reconciliation item:

the supplied catalogue contains multiple Journal entries, while the supplied Journal Story data currently provides a complete scene story for `the-art-of-remembering`.

The detail route requires both a Journal Entry and a Journal Story.

This is recorded as a content / production QA item rather than being silently repaired through documentation.

The future Journal / Content Platform roadmap remains preserved.

---

## Current Canonical Phase 1 Architecture Alignment

### Artwork Series / Collections

`ArtworkSeries` is the canonical body-of-work domain model.

`/collections` is the editorial discovery experience.

`/series/[slug]` is the detailed Artwork Series experience.

Visitor-facing `Collection` remains valid editorial terminology.

No parallel `Collection` persistence model should be introduced without a demonstrated and approved requirement.

Current Phase 1 retains the optional `Artwork.seriesId` relationship.

A future many-to-many relationship remains possible when justified.

### Shared Kinetic Carousel

The reusable horizontal kinetic primitive is owned by:

`src/shared/ui/kinetic-carousel/`

Current canonical files:

- `KineticCarousel.tsx`
- `useKineticCarousel.ts`
- `index.ts`

Collections, Series and Journal may compose the shared primitive while retaining their own editorial responsibilities.

The existence of the shared primitive does not make every local presentation or motion rule global.

### Contextual Artwork Lightbox

One shared Artwork Lightbox supports contextual behavior.

Series context preserves Series navigation and can continue into Artwork Detail while retaining originating context.

Catalog / Artwork context may use the global artwork navigation model.

### Artwork Detail Kinetic Experience

Artwork Detail currently supports a three-scene kinetic navigation model with previous, current and next artwork spatial continuity.

Approved interaction behavior includes:

- horizontal trackpad interaction;
- pointer drag / touch behavior;
- keyboard navigation;
- direct gesture response;
- momentum continuity;
- one-navigation-per-trackpad-gesture protection;
- symmetric edge resistance;
- natural vertical scrolling;
- isolated fullscreen behavior.

Governing physical principle:

`The artwork must feel as though it has weight.`

Current Artwork Detail onboarding is learned within the current browser document after real horizontal interaction and does not require persistent browser storage.

These mechanics are canonical for the current Phase 1 experience.

They are not mandatory mechanics for every future Del Carmen module.

---

## Completed / Frozen Phase 1 Areas

The current documentation records the following areas as completed / frozen for their approved Phase 1 scope:

- Artist
- About architecture
- Contact
- Newsletter

Frozen means they should not be casually redesigned.

It does not prohibit:

- verified bug fixes;
- accessibility corrections;
- production requirements;
- explicitly approved experience revisions.

About retains a planned media distinction:

- current Hero poster / fallback is implemented;
- the final audiovisual master remains planned according to the approved film direction.

---

## Home Alignment

The current canonical Home sequence is:

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

Current curation relationship:

- Hero → Artwork
- Featured Artwork → Artwork
- Featured Collection → ArtworkSeries
- Selected Works → curated Artwork records
- Journal Preview → Journal editorial discovery / reflection
- Invitation → continued relationship / Newsletter

Older source wording that allowed Featured Collection to reference either Artwork or ArtworkSeries is preserved historically but superseded for the current Home architecture by:

`Featured Collection → ArtworkSeries`

---

## Future Architecture Preservation

The current audit does not cancel future architecture merely because Phase 1 does not yet implement it.

The long-term platform direction remains capable of evolving toward areas already documented across the project, including:

- PostgreSQL / Prisma persistence;
- authentication;
- media/storage infrastructure;
- CMS / Admin;
- Marketplace;
- Collector experiences;
- Virtual Museum;
- Academy;
- Community;
- immersive experiences;
- digital exhibitions;
- licensing;
- archive;
- broader Journal / Content Platform capabilities;
- other future ecosystem modules already preserved by the Roadmap and architecture.

Implementation details may evolve when those phases become concrete.

Future evolution should update documentation explicitly rather than silently erase prior approved direction.

---

## Documentation Gaps After Reconciliation

The previously confirmed Tech Stack source gap has been resolved through formal reconstruction.

The previously confirmed Journal documentation gap has been resolved through implementation-based reconstruction.

No additional current Phase 1 documentation gap has been identified that justifies creating a new canonical document at this review stage.

This does not mean no future documents will ever be needed.

New documents should be created when a real domain, infrastructure responsibility or approved experience becomes substantial enough to require its own source of truth.

Examples may eventually include dedicated persistence, authentication, CMS/Admin, Marketplace, Museum, Academy or other module documentation when those phases enter concrete design or implementation.

They should not be created prematurely merely to populate the documentation tree.

---

## Source Integrity / Cleanup

The final canonical documentation package should exclude objective filesystem noise such as:

- `.DS_Store`
- `__MACOSX`
- temporary Office files such as `~$...`

Proven technical duplicates should not occupy competing canonical paths.

The misnamed historical `tech-stack.md` containing Project Roadmap content must not replace the reconstructed DOC-TS.

If historical audit evidence is retained, it should live outside the canonical document path or in an explicit audit/history area.

---

## Remaining Release / Production Verification

Documentation reconciliation does not imply that all production work is complete.

Remaining or recurring verification may include, where applicable:

- responsive QA;
- accessibility QA;
- interaction QA;
- performance validation;
- SEO;
- production deployment;
- public-domain configuration;
- Contact / Newsletter production email configuration;
- sender-domain verification;
- SPF / DKIM / DMARC;
- production delivery validation;
- final About audiovisual master or approved fallback state;
- Journal content/story completeness;
- Journal media validation;
- cross-browser / device verification.

These are delivery and production responsibilities, not reasons to remove future architecture from the documentation.

---

## Final Documentation Principle

The Del Carmen documentation set is a living architectural record.

It contains:

```text
historical decisions
+
current canonical implementation
+
approved future direction
+
explicitly tracked evolution
```

It should not be reduced to a snapshot of only what happens to be implemented today.

At the same time, planned architecture must never be misrepresented as already implemented.

The documentation must preserve both continuity and truth.

---

Del Carmen Digital Experience

Painting the Eternal Essence Within
