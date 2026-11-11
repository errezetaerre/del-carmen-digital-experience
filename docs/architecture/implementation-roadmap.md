# Del Carmen Digital Experience --- architecture/implementation-roadmap.md
Version: 1.21
Document ID: DOC-IR
Project: Del Carmen Digital Experience
Parent Brand: Rō Visual
Document Type: Technical
Authority Level: High
Status: 🟡 In Progress
Owner: Del Carmen Digital Experience
Last Updated: 2026-10-24
 
Current increment — 2026-10-24

SEO and Input Gestures v2 remain published in main `cd98843`. The owner approved Accessibility Security v1 and created a local commit on `fix/accessibility-security-baseline`, confirmed in GitHub Desktop on 2026-10-24; branch publication and PR are deliberately deferred. The current related increment prepares configurable mail senders/origins, lazy service setup, safe Newsletter GET/POST action pages and reproducible configuration/lifecycle checks on that same work branch. It is an incremental patch after Accessibility Security v1, pending owner review. No email, provider configuration, push, PR or deployment is performed here. Domain/sender verification, real delivery, language/legal release and physical-device/global QA remain separate checks.

1. Objective
This document defines the official implementation sequence of the Del Carmen Digital Experience platform.
Its purpose is to transform the approved documentation into a modular, scalable and maintainable software system.
Every sprint must produce working software that can be reviewed, tested and approved before continuing.
 
2. Development Philosophy
The platform will be developed incrementally.
Each module must be:
•	Independent 
•	Functional 
•	Reusable 
•	Documented 
•	Tested 
•	Approved 
Only approved modules become part of the permanent codebase.
 
3. Development Principles
3.1 Modular Architecture
Every feature is developed independently.
Examples:
•	Home 
•	Gallery 
•	Artwork 
•	Museum 
•	Marketplace 
•	Academy 
•	Community 
•	Collectors 
•	Admin 
 
3.2 Freeze Policy
Once a module is approved:
•	No redesign without justification. 
•	No unnecessary refactoring. 
•	Improvements are versioned. 
 
3.3 Definition of Done
A module is complete only if:
•	Functional. 
•	Responsive. 
•	Accessible. 
•	Performance optimized. 
•	Integrated. 
•	Approved. 
 
4. Technical Architecture
Frontend
•	Next.js (App Router) 
•	React 
•	TypeScript 
•	Tailwind CSS 
•	Feature-Based Architecture 
 
Backend
•	Node.js 
•	MVC 
•	Service Layer 
•	Repository Pattern 
•	REST API (initially) 
•	Prepared for future GraphQL integration 
 
Database
Prepared for future implementation.
Initial abstraction:
Repository

↓

Database Provider

↓

Database Engine
This allows changing the database engine without affecting business logic.
 
5. Domain Architecture
The system is organized around business domains rather than pages.
Artwork

ArtworkSeries

Gallery

Collectors

Marketplace

Museum

Academy

Community

Administration

Authentication
Each domain owns:
•	Components 
•	Business Logic 
•	Services 
•	Types 
•	API 
•	State 
•	Tests 
 
6. Implementation Phases

Phase 1 — Foundation and Public Art Experience

Status
🟢 Active / substantially implemented

Completed and approved foundations include:

• Next.js App Router foundation
• React / TypeScript / Tailwind CSS
• ESLint
• Repository structure
• Path aliases
• Global design tokens
• Shared layout / Container system
• Global typography
• Navigation
• Responsive behavior
• Core motion language

Home

Implemented and approved:

• Hero
• Featured Artwork
• Artist Statement
• Featured Collection
• Selected Works
• Journal Preview
• Invitation / Newsletter
• Footer
• Data-driven Home curation
• Dynamic Hero artwork-to-Series routing

Collections / ArtworkSeries

Implemented and approved:

• `/collections` editorial discovery index
• Collections Intro
• Responsive Collection Heroes
• Independent media orientation and content position per breakpoint
• Portrait and landscape Hero media
• Desktop Works Preview
• Carousel behavior for larger artwork sets
• Mobile-specific Collections behavior
• Collection Hero motion
• `/series/[slug]` detail route
• Series gallery
• Contextual Artwork Lightbox behavior
• Series-aware Artwork detail navigation
• Continue Exploring navigation

Current refinement:

• Series Detail visual presentation
• Artwork-derived Series atmosphere
• Expanded Series metadata presentation
• Statement + supporting description hierarchy

Artwork

Implemented public foundations include:

• Artwork data and domain types
• Artwork detail routing
• Artwork media representations
• Context-aware navigation
• Lightbox integration

Phase 1 remaining work should be driven by the current approved specifications and visual QA rather than by the original sprint numbering.

Phase 2 — Public Experience Expansion

Planned capabilities may include:

• Broader Artwork archive / gallery refinement
• Search
• Filtering
• Exhibition presentation
• Additional editorial experiences
• Global SEO pass

Phase 3 — Commerce and Collector Infrastructure

Planned:

• Marketplace
• Collector accounts
• Authentication
• Administration
• Database persistence
• Products / editions / prints
• Orders
• Payments
• Collector notifications

Phase 4 — Extended Del Carmen Ecosystem

Future:

• Virtual Museum
• Immersive Experiences
• Digital Exhibitions
• Academy
• Community
• Expanded mobile experiences

7. Dependency Flow

Implementation follows approved architectural dependencies rather than a rigid page-by-page chain.

Canonical direction:

Platform Foundation
↓
Domain
↓
Application / Services
↓
Presentation
↓
Routes and Experiences

Artwork and ArtworkSeries provide canonical art-domain data.

Home, `/collections`, `/series/[slug]` and Artwork detail consume those domain sources through their appropriate presentation and service boundaries.

A public route or UI scene must not create a duplicate business entity merely because it presents domain data differently.

Future commerce, collector, authentication, museum, academy and community capabilities should extend the existing architecture when their requirements become real.

Every implementation cycle should depend on already approved foundations and should preserve frozen behavior unless a justified change is approved.

8. Approval Workflow
Every sprint follows the same cycle.
Planning

↓

Development

↓

Integration

↓

Testing

↓

Review

↓

Approval

↓

Freeze

↓

Next Sprint
 
9. Technology Evolution
The architecture must allow future incorporation of:
•	AI Services 
•	AR Experiences 
•	VR Museum 
•	Native Mobile Apps 
•	Digital Archive 
•	Multi-language Support 
•	Analytics 
•	CMS 
•	Collector Dashboard 
without redesigning the platform.
 
10. Success Criteria
The project will be considered successful when:
•	Every module is independently functional. 
•	The platform remains maintainable. 
•	New domains can be added without restructuring the project. 
•	The philosophy defined in the Brand Philosophy is faithfully reflected in the software. 
•	The user experience remains coherent across the entire ecosystem. 
 
End of Document

------------------------------------------------------------------------

11. Implementation Evolution Update — 2026-10-05

This section extends the supplied v1.1 Implementation Roadmap without deleting, compressing or replacing its existing implementation sequence, technical direction or future phases.

The original v1.1 body above remains preserved as the implementation plan recorded on 2026-09-19.

11.1 Interpretation Rule

Implementation status and architectural intent are separate.

A technology, domain or module may belong to the planned architecture even when its implementation is scheduled for a later phase.

The future backend, persistence, authentication, commerce, museum, academy, community, CMS, AI, AR, VR, mobile, archive, multilingual, analytics and collector capabilities documented above remain part of the project direction.

They must not be removed merely because the current public Phase 1 experience does not yet require their production implementation.

11.2 Phase 1 — Subsequent Approved Progress

Collections / ArtworkSeries

The following current Phase 1 behavior is now approved / implemented:

• `ArtworkSeries` remains the canonical body-of-work domain model.
• `/collections` is the editorial discovery experience for ArtworkSeries.
• `/series/[slug]` is the detailed curatorial Series experience.
• Visitor-facing `Collection` remains editorial terminology rather than a parallel canonical persistence model.
• Responsive Collection Hero behavior is approved.
• Desktop Works Preview is approved.
• Series Gallery is approved.
• Artwork-derived Series atmosphere is implemented with one current atmosphere image per Series.
• Statement + supporting description hierarchy is approved.
• Continue Exploring navigation is approved.

The current optional `Artwork.seriesId` relationship remains Phase 1 architecture.

Future many-to-many Artwork ↔ ArtworkSeries evolution remains available when a real curatorial requirement justifies it.

11.3 Shared KineticCarousel

Status:
Approved / Implemented / Canonical for current Phase 1

Canonical shared location:

`src/shared/ui/kinetic-carousel/`

Files:

• `KineticCarousel.tsx`
• `useKineticCarousel.ts`
• `index.ts`

Collections Works Preview preserves its one-to-four artwork editorial composition.

Five or more works use the shared KineticCarousel.

Series Gallery reuses the same shared kinetic primitive when its artwork set exceeds the standard gallery capacity.

Thumbnail click behavior remains protected by delaying drag ownership until the movement threshold is crossed.

11.4 Contextual Artwork Lightbox

Status:
Approved / Implemented / Canonical for current Phase 1

One shared Artwork Lightbox adapts to navigation context.

Series context supports:

• close back to the Series experience;
• dots;
• previous / next within the current Series;
• contemplative artwork information;
• `Explore in detail`;
• preservation of Series context into Artwork Detail.

Independent Artwork/archive context uses the applicable broader artwork sequence.

The lightbox uses a document-level portal to avoid clipping by ancestor transform/layout contexts.

11.5 Artwork Detail Kinetic Experience

Status:
Approved / Implemented / Canonical for current Phase 1

`/artworks/[slug]` now uses whole-scene horizontal kinetic navigation.

Previous, current and next scenes physically coexist in the navigation track when their corresponding neighbors exist.

Navigation preserves the visitor's context:

• Series entry → current ArtworkSeries sequence;
• independent/archive entry → applicable broader Artwork sequence.

Supported interaction:

• horizontal trackpad gesture;
• pointer drag / touch swipe;
• keyboard left/right arrows.

Vertical scrolling remains natural.

Fullscreen artwork viewing remains isolated from kinetic scene navigation.

Back navigation and persistent interaction guidance remain outside the horizontally animated scene track.

The governing physical principle is:

`The artwork must feel as though it has weight.`

Approved current behavior includes:

• direct gesture response;
• separate wheel and pointer input ownership;
• continuous release trajectory / momentum;
• one navigation maximum per physical trackpad burst;
• symmetric first / last artwork edge resistance;
• no reinterpretation of invalid edge gestures.

11.6 Artwork Detail Interaction Onboarding

Status:
Approved / Implemented for current Phase 1

The horizontal interaction reminder is onboarding rather than artwork-specific content.

After a real horizontal interaction, the behavior is considered learned for the current browser document.

Client-side Artwork navigation does not reset it.

A real browser refresh begins a new document session.

The current implementation does not require persistent browser storage.

11.7 Journal Documentation Reconciliation

Journal implementation has progressed beyond the documentation represented by this architecture package.

A dedicated canonical Journal specification / implementation document is not currently present in the supplied documentation set.

This is a documentation gap, not evidence that Journal has been removed or cancelled.

Future Journal / Content Platform evolution remains governed by the broader project roadmap and later approved specifications.

11.8 Current Phase 1 Remaining Verification

Phase 1 is active and substantially implemented, but should not be declared complete solely from document age or partial implementation.

Where not yet verified, remaining release work includes:

• responsive / cross-experience QA;
• accessibility and interaction QA;
• performance validation;
• SEO work;
• production deployment and Production QA;
• public-domain configuration;
• newsletter production sender / DNS / delivery validation;
• final About film or approved poster/fallback state.

11.9 Canonical Stability and Later Evolution

The following systems are stable/canonical for the current Phase 1 implementation:

• responsive Collection Hero behavior;
• Collections Works Preview;
• shared KineticCarousel core;
• Series Gallery kinetic integration;
• contextual Artwork Lightbox;
• Artwork Detail three-scene kinetic navigation;
• Artwork Detail trackpad / pointer ownership and approved edge semantics.

The Freeze Policy applies to unnecessary redesign during the current approved implementation.

It does not prohibit future roadmap phases from extending or superseding a current system when a real new requirement is approved.

11.10 Audit Note

Version 1.2 uses the conservative documentation method.

The complete supplied v1.1 Implementation Roadmap body is preserved above, apart from Version and Last Updated metadata.

No planned backend, database, GraphQL, Marketplace, Collector, Authentication, Admin, Museum, Academy, Community, AI, AR, VR, mobile, archive, multilingual, analytics, CMS or Collector Dashboard direction has been removed because it is not implemented today.

The new section records subsequent Phase 1 implementation while preserving the longer-term technical trajectory.


12. Phase 1 QA — Current Increment

The owner approved the Artwork/Glass Artbook presentation and the complete glass-perimeter comet/fairy-dust treatment in the v14 source on 2026-10-17 (Costa Rica). This approval records the supplied experience; it does not replace the remaining release checks listed in section 11.8.

The next bounded accessibility increment is implemented for review: MobileMenu gains initial focus, Tab containment, Escape closing and return focus; ArtworkLightbox and the fullscreen ArtworkDetailViewer share focus containment/restoration while keeping their existing key and pointer owners. No approved visual or motion system is redesigned. Local compiled-source and event-fixture verification is recorded in the canonical Artwork Implementation and Repository Structure documents. Real browser/assistive-technology and complete-project checks remain open.

Remaining global responsive, accessibility, performance, SEO, production and domain/sender verification remains active. EN/ES, persistent database-backed canonical data, original/print/edition offers and prices, shopping cart/checkout and the downloadable sales catalogue remain requested future increments. They must keep Artwork identity, ArtworkSeries grouping, editorial curation and commerce configuration separate. The language controls currently show EN; this keyboard-access increment does not deliver translation.


13. Current Continuity and Requested Backlog — 2026-10-17 (Costa Rica)

13.1 Current increments

The owner approved the glass presentation, insignias, full-panel warm comet/fairy dust and the modal keyboard-focus increment. The current source adopts the latest owner catalogue exactly: Yasemi I is planned/unavailable; Yasemi II is completed/available. The catalogue remains 45 works, 38 completed and seven planned.

The next implemented increment is the page-metadata foundation, ready for owner review: static titles/descriptions for Home, About, Artist, Artworks, Collections, Contact and Journal; canonical dynamic metadata for artwork, series and published journal detail routes; shared Open Graph/Twitter text. It does not redesign the approved visual/interaction systems or fabricate a public origin. It is not a declaration that global QA or SEO is complete.

13.2 Outstanding work

1. Public-experience release QA: remaining cross-page responsive/device checks, keyboard/screen-reader review, performance and full-project build verification. Complete technical SEO after the metadata foundation: canonical public origin/URLs, sitemap/robots, real social preview images, structured data where justified and production/crawler review.
2. EN/ES: functional language selection and translation of navigation, page content, forms, feedback, legal/editorial copy and metadata through one coherent language architecture. The current public copy remains English.
3. Persistent canonical data: introduce the planned database/repository integration and seed real, owner-confirmed Artwork, ArtworkSeries, recognition and curation records. Preserve their domain boundaries and the latest supplied catalogue; choose the production connection and operational setup explicitly.
4. Sales and cart: review the visual experience first, then distinguish the available physical painting (including hand-painted copies/studies) from prints/editions, confirm prices/currency/stock and connect cart, order/payment and delivery behavior. Existing Artwork availability/price alone does not authorize checkout.
5. Downloadable sales PDF: catalogue design and generation from confirmed artworks/offers, prices and availability for direct purchase enquiries.
6. Production: acquire/configure the public domain and email service, complete sender/DNS/delivery checks, deploy and perform production QA. The current public contact email remains the approved provisional one until changed by the owner.
7. Remaining editorial assets/content: final About film or approved poster/fallback and completion of intentionally unpublished Journal entries. The supplied catalogue has two renderable published entries and five awaiting story content; they remain hidden until renderable. These are content decisions, not broken public links.
8. Later visual enrichment: subtle animated atmospheres and the proposed Houdini/3D background, after the core public site is finished and those visual studies are approved.
9. Glass ArtBook for `/artworks` — added to the requested backlog on 2026-11-10. Prepare a functional prototype using the real shared filtered/sorted catalogue after the current data-unification work. Preserve the approved Standard archive, EN/ES, filters, newest/oldest/title ordering, original titles and navigation context. Reuse the approved rigid-glass identity, global mode preference and bounded current/adjacent-page loading. Page density/composition require prototype review before integration; no new gallery UI or persistence field is implemented by adding this item.
10. Private catalogue administration — owner-approved direction on 2026-11-10, after unification/release checks. Prototype an owner-only interface for Artwork facts/date/creation status/availability/price, Series/categories, original titles, EN/ES editorial/image alternatives, image uploads and recognitions (kind/event/year). Cover/Featured remain Home curation, not duplicated Artwork flags. Plan original retention plus WebP/responsive variants in separate file storage with references/metadata in Neon and previews using the approved Standard/Glass components. Validate the real-field UX/access/storage design before enabling writes. This item creates no admin routes, auth, upload service, fields, credentials, data edits or deployment now.

These items preserve the requested cart, distinctions, planned-work differentiation, prices, original/print choice, bilingual experience, database and PDF catalogue. Insignias, featured/recognition treatment and Coming soon differentiation are already implemented; remaining work must not reopen them without a concrete defect or a new approved requirement. The next major functional block after metadata review is EN/ES.


14. EN/ES — Shared Foundation and First Editorial Pilot — 2026-10-18

The owner approved shared EN/ES routing, English by default, manual selection, shared media/code, original artwork titles and stored/reviewed translations. The current implementation is based on the actual approved upstream commit `f2cf5b1` and is prepared on an isolated local review branch.

Implemented for review: one `[locale]` public route tree; unchanged English URLs plus `/es`; typed common messages; localized navigation/footer/selector; Home hero and Epifanía Nupcial editorial pilot; technical/creation-state/distinction controls in the viewers and Glass engine; preserved selected-work/query/view context; localized Standard snapshot destinations; explicit language boundaries for English content that is not yet translated. The native touch/physics/material/dust contracts and owner catalogue remain intact.

This does not complete the Spanish edition. The first pilot was positively reviewed by the owner, including Standard and Glass, on 2026-10-18. The next Artwork block is implemented for review: translated archive/filter/result states and shared cards, plus stored quote/description/alt translations for all 45 current works, shared by the viewers. The owner catalogue and approved movement/layout remain intact.

The owner approved/pushed the foundation and complete Artwork block as `d56b772` on `feat/i18n-en-es`. The Home/Collections increment is now implemented for review: remaining Home editorial sections and both published Journal teasers, Collections, four full series' copy/metadata and their shared controls. A direct selected-artwork Series SSR error is corrected by mounting the existing portal viewer only in the browser; approved movement/selection/geometry stay intact.

The owner subsequently approved Home/Collections. About/Artist is now implemented for review over that v3 content: both pages' editorial/accessibility copy and metadata, six existing Artist scenes, five milestones, Journey navigation/process alternatives and both philosophy reading modes. Canonical dates/recognitions, names and approved motion/layout remain intact. Build/TypeScript, 11 content checks and 12 real-server checks pass. English About/Artist and the approved Spanish Home remain visibly equivalent. Focused lint confirms the existing JourneyNavigator refs error against the approved v3 baseline without a new finding.

About/Artist was subsequently approved by the owner, who requested its commit together with Home/Collections. Journal is now implemented for review: translated index, two published articles/seven narrative scenes, related-entry ribbon and metadata. The five catalogue records without stories remain unpublished/not-found. A named accessible label is added to previously unnamed index image links; scene geometry, assets/playback and motion/carousel/input source remain exact. Build/TypeScript, 11 content checks and 11 HTTP checks (21 GET requests) pass. English Journal and approved Spanish Home/About/Artist visible copy remains exact. Focused Journal lint has no errors/new findings and retains three existing image warnings.

Those remaining forms/legal translations are now implemented for review in the following addendum, including correct language/version records. The translated newsletter form now retains its existing Suspense boundary without an English wrapper. Review new Spanish wording and both-language responsive/keyboard/touch behavior. Spanish remains noindex and language alternates remain off until the complete content/domain review. A controlled update for inherited dependency security findings and baseline lint debt remains part of release QA. The owner is using Vercel Preview on the feature branch; production follows its actual configured branch/promotion workflow, not translation completion alone. No production deployment or merge is performed here. See DOC-I18N for scope, installation and verification.

The real project passes its production build and TypeScript; 60 focused content/URL/continuity/HTTP checks and focused i18n lint pass. The build/server use placeholder email/Redis credentials without submitting forms. Physical devices, rendered browser/screen-reader review, real provider delivery and production indexing remain open. Earlier source-only limitations are historical; root config, package lock and compiler are available for this increment.

Next: review forms/legal and actual configured email delivery, then complete bilingual responsive/accessibility/editorial/SEO and inherited security/lint verification. Database, confirmed offers/prices, sales/cart, catalogue PDF, domain/email/deployment and later visual atmospheres retain their place in section 13. Marketing can be planned as its own workstream with actual campaign/content/measurement requirements; this increment adds no marketing tracking or public marketing section.

### Forms/legal localization after Journal approval — 2026-10-18

Journal was approved. Contact/newsletter, all validation/feedback, shared privacy notices/checkboxes, confirmation mail and both legal drafts are now prepared in Spanish. English wording stays exact. Spanish acceptance uses its own revision and a language-bound checkbox; APIs validate the registered pair and derive recorded statements/purposes. Old English forms/links remain compatible without historical consent rewrites. Transaction scripts, retention, rate/honeypot and all approved visual/input code stay intact.

Build/TypeScript and 30 source/component/server groups pass. The existing NewsletterForm effect lint finding is confirmed against v5 with no new finding. Current remaining release work is review of this block, actual configured email delivery, complete bilingual editorial/responsive/accessibility/SEO review, inherited dependency/security update and baseline lint fixes. Spanish remains noindex; legal drafts remain drafts/noindex. Database, commerce/cart and PDF catalogue follow their existing sequence. No production promotion, merge or push is performed here. DOC-I18N owns installation and detailed limits.


### Portrait Glass Artbook experiment after bilingual form approval — 2026-10-18

The owner approved the Journal/forms/legal block and reports its push in progress. At the owner's request, a bounded portrait-only Glass Artbook experiment precedes the remaining global release review. Mobile/tablet portrait turns the complete editorial surface around its vertical centre: A-right on the front, B-left on the reverse, and B-right underneath. Fixed navigation, the existing Standard fallback and desktop/landscape engines retain their owners. The approved shared bronze material, catalogue, translations and Series/filter identity are retained. Only adjacent artwork pages are mounted/decoded; an inert full-width split avoids reflow or a content swap on landing.

Production build/TypeScript, focused lint, source/markup invariants and headless Chromium touch/viewport/continuity checks are performed for this increment. The owner must review its actual visual feel on phone/tablet portrait and physical Safari/Android/iPad, including vertical reading, slow media, cancellation, return to Standard, orientation changes and reduced motion. This experiment is not approval to change desktop/landscape or the Home/Series lightbox.

After portrait review, resume configured-provider delivery and the remaining complete EN/ES editorial/responsive/accessibility/SEO, inherited dependency security and baseline lint verification. Spanish remains noindex and legal drafts remain drafts/noindex. Database, confirmed commerce offers/cart and the sales PDF retain their sequence. No production promotion, merge, commit or upstream push is performed by this increment.

### Pre-merge engineering review after portrait approval — 2026-10-18

The owner approved the portrait follow-up and pushed `6cb8e49` on `feat/i18n-en-es`; PR #1 targets `main`. The next integration increment pins Next.js and eslint-config-next to 16.4.2 and refreshes compatible vulnerable transitive dependencies. The production dependency audit reports zero known vulnerabilities. The full audit retains five development-only findings in the ESLint/fast-glob/micromatch/braces chain; braces 3.0.3 has no patched release at this review. Do not use the suggested forced downgrade to a Next 14 lint configuration. Track that upstream developer-tool advisory separately from the deployed runtime.

Full-repository lint changes from 34 errors/16 warnings to zero errors/14 warnings. React state derived from route/selection props is reconciled before commit; browser-only readiness is hydration-safe; committed refs remain in event/effect owners. The remaining warnings are native-image optimization recommendations, the typed alt forwarding wrapper, existing unused declarations and the documented native-touch subscription dependency warning. The zoom modal also opts out of the parent kinetic gesture: a browser comparison reproduced pointer-capture theft on the approved baseline, caused by React portal event bubbling. No rule is globally disabled. Next production build, TypeScript and 123 static pages pass.

The portrait and landscape motion engines, touch adapters, geometry/material/CSS, canonical catalogue, assets, translations, legal/consent definitions and API handlers remain unchanged. Browser regressions cover the complete portrait interaction, native history/orientation, Standard/Glass zoom ownership, Home/Series selection, menu focus and localized newsletter feedback. The delivery README records the exact executed checks and limitations.

Apply and commit this increment on the existing feature branch so PR #1 updates; check its new Vercel build before merging. Local verification does not prove configured email delivery, physical-device/screen-reader behavior or legal sufficiency. Spanish indexing remains gated and legal drafts remain drafts. Database, confirmed offers/cart, sales PDF and later immersive Home/Series work retain their sequence. This review does not itself merge or publish production.

## Shared gallery experiences — 2026-10-20

Base: production main `5f7e34e` (PR #2, approved artwork guidance). This increment is prepared on `feat/shared-artwork-experience`, without committing, pushing or publishing. Home Selected Works and Series gallery dialogs gain Standard and Glass modes; Collections previews inherit the Series viewer. Phone/tablet entries default to Glass, desktop to Standard; an explicit mode survives turns, reload and orientation changes.

The existing portrait and 11B-23 landscape engines remain responsible for motion/materials. A shared host owns only gallery selection, native URL state, modal focus, source context and compact editorial rendering. Existing detail routes retain their behavior. Owner visual/physical-device review follows the checked patch; visitor book, site-wide immersive entry, database, commerce, PDF catalogue and remaining language/release tasks remain separate.

## Shared gallery review refinement — 2026-10-20

The owner's v1 review adds fixed Standard glass boundaries with internal reading, landscape dots outside the frame, mouse/trackpad navigation, one expanded-copy surface, matching Standard/book responsive layouts, immediate mode-switch loading feedback, working Halo pause and readiness-bound portrait arrival light. Prepared as an incremental patch over v1; no commit, remote write or production publication is implied. Physical-device and owner visual approval remain the next gate. Database, commerce, PDF catalogue, visitor book and site-wide immersion remain separate work.

## Shared viewer portrait refinement — 2026-10-21

Incremental v3 is based on the owner's v2 review: animate one existing paragraph into a reversible reading surface without shifting the painting or its scroll position; retain approximately 60/40 landscape columns and switch both modes to portrait when compact; give Standard and portrait Artbook identical frame/image/caption measurements; carry each Standard border with its artwork during horizontal navigation. Immediate loading feedback and landscape dots outside the frame remain approved. This supersedes v2's content-only horizontal motion; vertical reading still occurs inside a stationary frame.

The canonical Artwork Implementation document records module ownership and lifecycle. Production build/TypeScript, lint and emulated browser checks precede delivery. No catalogue or dependency edits, commit, push or production promotion are included. Physical-device and owner visual review remain next; database, commerce, PDF catalogue, visitor book, site-wide immersion and Academy learning stay separate future blocks.

## Match Standard detail and gallery movement — 2026-10-20

The owner merged PR #3 into main (`efa532c`) and approved the shared gallery composition. The next requested correction shares the approved `/artworks/[slug]` Standard kinetic calculations with the Home/Series gallery rather than maintaining a second fixed-duration slide. Collections inherits the Series viewer. A three-page framed window reveals its neighbour during the grip; only current and adjacent work data are rendered, with inactive slots inaccessible to input and assistive technology.

Prepared on `fix/standard-artwork-kinetics`, as an incremental patch against that merge. Frame/image dimensions, centred expanded reading, responsive selection, current artwork/locale/query continuity and both Glass variants retain their approved presentation. This block does not publish production. Build, lint, equation-preservation checks and emulated pointer/touch/trackpad/keyboard/layout review precede delivery; actual Safari/iPhone, Android and iPad review remains with the owner. Commerce, database, PDF catalogue, visitor book, global immersion and Academy coursework stay separate.


## Approved artwork archive — 2026-10-21

Archive visual prototype v5 is approved. The real route now implements the left search/filter rail and right artwork gallery, actual facet counts, title search, All works / Featured, Archive order/newest/oldest/title sorting, removable filters, a mobile/tablet modal filter drawer and progressive groups of 12 cards. The approved existing rollover/reveal and frame remain the owners; the optional archive presentation adds two 22px gold corners, stable thumbnail insignias and the reviewed separator treatments. Search/order context continues into detail Previous / Next and Back to Artworks.

The code is prepared as a checked patch against `49ed968`, without committing, pushing, merging or publishing. Owner review in the local application and its new Vercel Preview is next. Existing real-device, provider delivery, full bilingual/accessibility/SEO/security release verification remains active; source-only and static browser fixtures do not close those gates.

Database/repository integration, owner-confirmed offers/prices and original/print distinctions, cart/checkout, the downloadable sales PDF, visitor book, site-wide immersive entry and Academy coursework keep their existing sequence. Artist/brand/domain naming remains an owner decision; this implementation keeps the current Del Carmen identity and does not acquire or configure domains.

## Actual branch and domain review — 2026-10-25

Reviewed the owner's actual fix/accessibility-security-baseline snapshot: 374 file hashes match, local HEAD dee21f91 and origin/main cd98843; no env credentials are included. Preserve its committed accessibility baseline and uncommitted mail increment. Incremental corrections name bare senders Rolando Del Carmen, localize all three Contact enquiry subjects, reject header-bound name line breaks and align the shared fallback with the verified official domain.

Build/TypeScript, 95 offline regressions, lint (zero errors/twelve inherited warnings), full dependency audit (zero known vulnerabilities) and safe API HTTP/SEO output checks pass. The prior loopback English redirect remains a Preview check before merge. DOC-MAIL-OPS consolidates the exact owner handoff and remaining release work rather than adding another task list.

Next: install/review this increment locally; inventory Vercel Production/Preview and all existing del-carmen-contact consumers; coordinate the credential rotation/deployment window; then prepare the approved commit, push, Preview and PR. Do not reset credentials now or assume saved Vercel variables updated existing deployments. Preserve real data, current Gmail receiver, old Onboarding key until consumer review, EN/ES and all approved visuals. Production delivery/persistence/unsubscribe verification and editorial Spanish/legal release remain open.

## DAT-02 — Series lifecycles, artwork dates and sorting — 2026-11-09

### Approved source and boundary

Source branch: `refactor/series-lifecycle-and-artwork-sorting`, synchronized from GitHub at `1e6ed39b91021b86008aeffa1c4679ece8dec369` (`wip: prepare artwork series lifecycle changes`). This branch, including the owner's recent series corrections and partial types, is the baseline for this increment; the former `main` snapshot is not the application target.

Authority: owner request and `docs/domains/collection/collection-specification.md` v1.18. That specification remains unchanged. `ArtworkSeries` stays canonical; `/collections` remains its editorial presentation. No PostgreSQL, ORM, physical schema, media migration, new Collection entity or commerce work is included.

### Decision log

| ID | Decision and reason | Implementation / state |
| --- | --- | --- |
| DAT-02-A | Separate artistic progress from publication. Preserve the owner's `ArtworkSeriesStatus` (`upcoming`, `ongoing`, `completed`) and `ArtworkSeriesPublicationStatus` (`draft`, `published`, `archived`) type names. | Approved; interface now requires `artisticStatus` and `publicationStatus`. Both types are exported from the series and artwork barrels. The ambiguous record field `status` is removed. |
| DAT-02-A / data | Copy every existing artistic value unchanged and mark all four current records `published`. Retain chronology, resources, texts, IDs and membership. | Implemented; full before/after comparison checks every field. Yasemi remains ongoing from 2025 with no yearEnd. |
| DAT-02-A / public services | Select `published` series in public list, ID and slug services, independently of artistic status. Keep the canonical array complete and the membership service unchanged. | Implemented; all existing series remain visible. Draft/archived fixtures are excluded from public selection without changing their artistic states or deleting records. This is editorial selection, not an authentication boundary. |
| DAT-02-A / presentation | Home Standard/Glass, Collection Hero and Series Standard/Glass read `artisticStatus`. `formatSeriesStatus` retains its existing public function name and formats only the artistic lifecycle. EN/ES localization preserves both canonical states. | Implemented; add the missing upcoming label, preserve ongoing/completed wording, and remove the obsolete public archived label. No editorial-state badge, CSS, layout or animation change. |
| DAT-02-B | Remove only the `archive` ordering choice from `/artworks`. `newest` is the default and reset; `oldest` and `title` remain. | Implemented in the existing shared archive/detail selection contract. Archive presentation, other filters and their counts retain their owners. |
| DAT-02-B / deterministic order | Newest: year descending → localized title ascending → stable ID ascending. Oldest: year ascending → localized title ascending → stable ID ascending. Title: localized title ascending → stable ID ascending. | Implemented and tested in EN/ES with accent/case-equivalent and numeric titles and reversed input arrays. The catalogue is never sorted in place. |
| DAT-02-B / URL and navigation | Missing, legacy `archive` and invalid sort queries normalize to newest. Omit the default from serialized queries; retain non-default orders and existing search/filter context. | Implemented; round-trips and the shared selection are tested. Detail Previous/Next consumes that same function; existing Series-context precedence, gestures and Standard/Glass routing remain unchanged. |
| DAT-02-B / gallery visibility refinement | After local review, the owner requested that unfinished works no longer lead or appear in `/artworks`. Show only `creationStatus: "completed"` there; do not infer completion from the year or remove records from the catalogue. | Implemented in the archive selector and facet options. Current selection: 38 completed works; seven planned records remain available elsewhere. Counters, search, pagination and archive-context Previous/Next share this selection. Home, Collections, Series membership and direct detail access retain the full catalogue. No separate Coming Soon section or visual redesign is introduced. |
| DAT-02-B / explicit creation-state filter | The owner subsequently approved offering Completed, In progress and Coming soon in the left menu, with completed as the initial selection. Reuse Artwork.creationStatus (`completed`, `in-progress`, `planned`), independently of ArtworkSeries artistic/publication states. | Implemented in the shared sidebar/mobile drawer with EN/ES labels and contextual counts. An explicit `creationStatus` query selects unfinished works; missing/invalid values and Reset select completed. The default is omitted from the URL. Non-default status is retained in detail, Back and mode navigation. Facet vocabulary spans all states so other filters are preserved; counts/results use the chosen state. This supersedes the earlier unconditional gallery exclusion while retaining its completed-only initial view. |
| DAT-02 / Artwork.date | On 2026-11-09 the owner approved replacing numeric Artwork.year with a single date string: YYYY or a documented real YYYY-MM-DD. Preserve every current year at year precision and keep creationStatus independent. | Implemented as ArtworkDate and a shared model helper. All 45 records migrate to the same YYYY; every other record field is compared unchanged. Calendar validation includes Gregorian leap years and century exceptions, and runs at catalogue load. Rendering/filtering use getArtworkYear; no persisted year alias remains. |
| DAT-02 / mixed date precision | Use full dates for chronological precision while never assuming an unknown month/day. Keep newest default, oldest and title, original-title/ID ties and all existing filters/navigation. | Implemented: compare year in the chosen direction; within a year, known days in that chronology, then the separate year-only group in both directions. Date ties use original title then ID; title ordering ignores date. This documented editorial group does not claim unknown chronological positions. Physical database order is not a requirement; no database is created. |

### Preserved branch records

| ID | Artistic value after migration | yearStart | yearEnd | Publication |
| --- | --- | --- | --- | --- |
| yasemi | ongoing | 2025 | absent | published |
| epifanias | ongoing | 2027 | absent | published |
| the_inner_treasury | completed | 2024 | 2024 | published |
| the_discipline_of_seeing | completed | 2023 | 2023 | published |

These values are copied from the synchronized branch, not inferred from dates or older examples. The existing tracked `src.zip` is preserved unchanged; it is not part of this completion patch. Artwork records, image paths and roles, years, curatorial references, recognition data and translated editorial content are not rewritten.

The subsequent Artwork.date increment changes only each artwork's former year attribute to the identical YYYY string. Series chronology above, creation states, IDs, slugs, original titles, image references, translations and all other facts remain intact. Existing Journal/recognition year fields and Series yearStart/yearEnd are independent and are not migrated.

### Migration, recovery and publication state

This is a TypeScript catalogue migration, not a database migration. The completion is prepared as a context-checked patch against the identified branch. No reset, stash, owner-file checkout, staging or commit is part of applying it. Conflicting newer local edits must stop the application for review rather than being forced over.

If a reversal is needed, check the exact patch with `git apply --reverse --check` and review it before an approved inverse application. Never reset the whole working tree or revert the owner's earlier WIP commit to undo this increment.

Implementation and local verification do not mean PR, merge or Production deployment. Those remain pending review of the results and owner approval.

### Verification

Verified on the synchronized branch, using Node 24.22.1, Next 16.4.2 and TypeScript 5.9.3:

- `next typegen` and `tsc --noEmit`: passed, including artistic/publication separation, ArtworkDate strings, the typed year getter and removal of Artwork.year.
- Focused DAT-02 and Home/Series/preference/Analytics regressions: 81 tests passed after the Artwork.date migration. Coverage retains the owner's Yasemi correction, all four published series, independent draft/archived selection, EN/ES controls, every ordering mode, tie-breaks, immutability and query continuity. Added date checks cover strict formats, invalid months/days, leap/century years, timestamp/whitespace rejection, mixed precision in both chronological modes, original-title/ID ties, year filtering, unchanged creation states and the actual detail page's date-ordered Standard/Glass data and neighbours. Existing status/filter and Series-membership regressions continue to pass.
- `npm run lint`: zero errors and ten warnings in unchanged code. No lint rule was disabled.
- `npm run build`: passed with the real Next 16.4.2 configuration and fonts; 125 pages generated. No font or configuration substitution was used.
- Full before/after series comparison: all fields are equal after mapping the original status to artisticStatus and excluding the new publicationStatus.
- Delivery checks use disposable Git indexes: exact application/reversal passed; a non-overlapping local catalogue edit was preserved; an overlapping edit was refused without changes. The actual working index remains unstaged.
- Before/after comparison confirms that all 45 former years become the identical YYYY date and every other artwork field remains equal, including state, IDs/slugs, original title, images, dimensions, copy and price. All EN/ES presentation and SEO outputs remain equal for the existing catalogue.
- Byte checks preserve collection specification v1.18, all series corrections, translations, existing src.zip, package.json, package-lock.json, styles and material modules. The only Glass-runtime change is its helper import and year fallback; physics and shader code remain intact. No asset or API change is included.

The application target is the owner's existing refactor branch, not main. Delivery preflight checks that branch and its reviewed baseline and performs `git apply --check` before any application. Non-overlapping pending changes remain in place; an overlap stops for review. The assistant has not modified the owner's Mac or performed a commit, push, PR, merge or deployment. Final visual/device review and application to the local checkout remain with the owner; these checks do not claim an interactive browser audit.

The date-only increment targets the latest approved local state with the creation-status filter already integrated. It is incremental over those pending changes; it does not reapply or replace the preceding DAT-02 deliveries. No exact date is newly assigned to a real work, PostgreSQL is not created, and publication remains pending owner review.

## Cropped-thumbnail pan — approved next visual block — 2026-11-09

DAT-02 was committed as `3ced06a`, merged by PR #16 into main `a2e8ea7`, and verified in Vercel Production READY. The earlier WIP `1e6ed39` is part of that ancestry. The owner approved addressing cropped thumbnails next, separately from the completed lifecycle/date/filter migration.

Prepared on `feat/artwork-thumbnail-pan` from that reviewed main. Completed thumbnail images pan gently along their actual crop axis: hover/focus for fine pointers, visible-viewport activation for touch. The existing frame, hover zoom, badges, navigation and optimized/lazy image source remain in place. A shared controller pauses offscreen, in hidden tabs, on inert/turning sheets and for reduced motion; it tears down its own observers/tweens on unmount. Inline object-position preserves the live image crop in existing page clones without editing either book engine. Planned/in-progress previews remain their existing fog treatment.

Seven focused motion tests and all 81 existing pertinent regressions pass. TypeScript and lint pass, with zero lint errors and the same ten inherited warnings; the Next 16.4.2 production build generates all 125 pages. Local Next served `/es/artworks` with HTTP 200. Browser visual QA was attempted but Chromium was blocked before opening a page by workspace socket permissions; actual device/motion approval remains with the owner. This is a local implementation for review, not a commit, push, merge or deployment. No new database, canonical datum, asset or dependency is introduced.


## DAT-02 — PostgreSQL catalogue foundation — 2026-11-09

The approved thumbnail pan was merged by PR #17 into main `eb23294`, verified Production READY. The owner then authorized starting catalogue persistence while explicitly preserving the current model and all approved presentation behavior. Work is isolated on `feat/catalogue-postgres`; the previous panning worktree remains untouched.

The owner created Neon `del-carmen-catalogue` (Washington/iad1, Free, Auth/Realtime off) and connected it to Preview. Inspection confirms its database variables are sensitive and scoped to Preview. Existing Production Redis/mail variable scope is preserved. No SQL has been executed against Neon here and no Production database integration is activated.

| Decision | State / evidence |
| --- | --- |
| Use current main, Artwork model v1.8 and Collection specification v1.18. Preserve date precision, separate series lifecycles, Yasemi 2025/ongoing/no yearEnd, availability and original titles. | Implemented for review in the typed mapping and versioned SQL. The seed reads the current local source, not an older copied fixture. |
| Normalize membership, categories, media roles, recognitions, translation rows and existing Home curation; keep responsive Series metadata structured. No Collection duplicate, binary media, artwork year/count/member-array/sort-order column. | Data dictionary and physical mapping in `docs/architecture/catalogue-database.md`; existing code/data/UI files remain unchanged. |
| Extensible locale-keyed copy and media alts; retain English/Spanish originals and fallback semantics. | Full round-trip and actual EN/ES output comparison pass; a third-locale PostgreSQL fixture needs no DDL change. Adding UI languages remains separately reviewed. |
| Version/checksum migrations, transactional import, safe reruns and no overwriting a nonempty differing target. | Local PostgreSQL tests pass, including rollback, foreign keys, invalid dates/states, metadata constraints, parameterization and history protection. |
| Preview first; separate local development branch/credentials; keep Redis/Contact/Newsletter isolated. | Environment scope inspected; real development/Preview connectivity, persistence and endpoint isolation remain pending. Local CLI writes require a development target and refuse Vercel/Production execution. |
| Preserve /artworks sorting and filters, both book engines and all approved visual behavior. | Existing source/service/presentation modules are not swapped. Archive equivalence is verified against the existing selector; public repository/caching/navigation integration remains a later gated increment. |

This increment prepares local schema/import tooling and the dictionary for review. It does not mean the data has been migrated to Neon, that the public application reads PostgreSQL, or that PR/commit/merge/deployment is approved. See the canonical dictionary for exact commands, local verification and the remaining activation gates.


## DAT-02 — JSONB driver correction v1.1 — 2026-11-10

Owner verification: local database tests/lint/build passed; real Neon development-branch `db:check` succeeded and migration 0001 was applied. The first real seed returned SQLSTATE 23514. No Production connection was activated.

Reproduction through actual Postgres.js 4.1.0 and the PostgreSQL wire protocol identifies `catalogue.artwork_series.artwork_series_visuals_check`: the importer pre-stringified JSON, then the type-aware driver encoded that string again. JSONB received a string instead of an object. The failed reproduction left zero catalogue rows after transaction rollback. The original direct PGlite tests did not exercise that driver serialization path.

Correction: pass native parameter objects to the driver, preserving the approved schema, facts, private credentials and transaction boundaries. Migration 0001 remains byte-identical to the already-applied file; no drop/reset/DDL workaround is used. Add a development-only PGlite socket bridge and regression through the same operational driver adapter, including a close/reopen persisted read. Constraint diagnostics expose only allowlisted catalogue schema object names, never row data, URLs, passwords or query parameters.

The owner subsequently confirmed successful real re-import/equivalence as recorded below. The seven reported moderate npm issues belonged to the development ESLint/minimatch chain and were handled in the following read-preparation increment. No automatic dependency audit fix, Redis change, commit, push, PR, merge or deployment was included in v1.1.

## DAT-02 — development persisted verification and read preparation v1.2 — 2026-11-10

The owner applied v1.1 on the existing uncommitted `feat/catalogue-postgres` branch. Its 18 database tests passed. Real Neon development `db:seed` returned imported; a separate `db:verify` confirmed **45 artworks, 4 series, 1 recognition** with the same SHA-256 `187a3603ffa43e279d010a10e0ec5292e7d051c06eca7ee966c4d08eeefe1084`. The development migration/import/persistence gate is complete. Do not recreate the branch, rerun the failed workaround, edit migration 0001 or repeat a reset/seed unnecessarily.

Continue on that branch with an incremental server-only read repository and a read-only `db:read` exercise. It preserves the domain model, original titles, EN/ES values, Home curation and publication separation. One reader instance shares concurrent loads and briefly caches its consistent read-only transaction; outputs are detached and failures have no silent file/stale fallback. Tests include actual database-edited editorial copy through Postgres.js, not only a direct SQL test adapter. No public page/service is switched in this increment; Series-context order, static localization consumers and curation/badge consumers remain explicit page-integration review points.

Resolve the seven moderate dev advisories by pinning only `@typescript-eslint/typescript-estree`'s minimatch to 11.0.1. All runtime versions, the existing root minimatch and TypeScript-ESLint versions retain the installed baseline. Full npm audit: zero vulnerabilities. Local validation: 25 database/read tests, 183 existing offline regressions, TypeScript and the 125-page build pass; lint has zero errors and the same ten inherited warnings.

Owner checkpoint completed: db:read returned `Catalogue read repository: OK (45 artworks, 4 published series, EN/ES)`, complete catalogue equivalence and the same recorded fingerprint. No new SQL migration was required. Actual Preview endpoint isolation and staged page wiring remain pending, followed by separate least-privilege Production planning and approval. No credential/Redis/mail action, commit, push, PR, merge, deployment or Production read activation was authorized by this checkpoint.

## DAT-02 — first page connection: Artworks opt-in v1.3 — 2026-11-10

The owner authorized connecting pages in stages and asked when the tables were created: db:migrate already created the private catalogue schema/tables; db:seed populated them; subsequent verify/read confirmed persistence and equivalence. Continue on the same pending feat/catalogue-postgres branch. Do not recreate those resources or edit applied migration 0001.

The archive server page now selects files by default or PostgreSQL with the private CATALOGUE_ARTWORKS_SOURCE=postgres opt-in in local/Preview. Vercel Production is hard-gated to files regardless of that flag. Existing Suspense, client filters/newest sorting, pagination, thumbnail styling/pan, detail query navigation, EN/ES and Standard/Glass engines are preserved. All other pages remain file-backed. The temporary full-parity gate prevents divergent data while their migration is unfinished; independent database edits are not enabled in this stage.

Schema history/columns and snapshot reads share a repeatable read-only transaction; the bounded reader/pool is reused at the server boundary, with no per-gesture/per-thumbnail polling or silent fallback. Next connection() defers work until an incoming request and its prerender signal is not caught as a database failure. Provider failures are sanitized. Successful cache refreshes emit only a fixed verification message. Source mapping and driver code now have one server-owned implementation with compatible operator imports. No new dependency, SQL write/migration, credential or Redis change is included.

Local validation: 33 database/integration tests plus 183 existing offline regressions pass. TypeScript, lint (zero errors, ten inherited warnings) and both source-mode builds pass. The Production-guard build preserves static archive pages even with an invalid database URL; opt-in renders the archive dynamically without connecting during build. HTTP checks cover Spanish/default behavior and sanitized opted-in failure without file fallback; the earlier raw-local English as-needed redirect remains outside this increment, with routing untouched. Full normal-browser EN/ES/device review against the owner's actual development branch remains the next checkpoint. No new private/driver markers occur in browser chunks; approved models/data/media/styles and migration 0001 remain unchanged.

Apply the increment, run local tests/build and temporarily launch with CATALOGUE_ARTWORKS_SOURCE=postgres npm run dev. Open the gallery in both languages and confirm the fixed PostgreSQL verification log plus existing filters/detail continuity. Record that result before proceeding to the next page. Preview's actual isolated schema/data must be verified before its opt-in is set; automatic Preview branching may still inherit an empty main database. No automatic build migration or Production URL substitution is permitted. No commit, push, PR, merge, provider setting change or deployment has been performed.

## DAT-02 — gallery verified and artwork-detail connection v1.4 — 2026-11-10

Owner evidence completes the Stage 1 request checkpoint: local /artworks and /es/artworks return 200 with Catalogue /artworks: PostgreSQL verified; recorded detail, category-context, language and Standard/Glass requests also return 200. Detail was still file-backed in that output. The raw-local English redirect noted earlier is not reproduced in the owner's normal environment; no routing change is part of this work.

Continue the authorized staged connection on the same pending feat/catalogue-postgres branch. Stage 2 uses the existing private opt-in for the artwork detail page and its SEO metadata. The existing scenes/book engines, slugs, dates, original titles, translations, filters and link construction remain intact. A typed server projection restores the approved Series sequence using supplied DB records and the existing current-file order under the parity gate; no ordering column, member array/count or schema change is introduced.

The shared reader/pool/cache is reused within each module/server instance and coalesces concurrent metadata/page reads. It is not distributed across route functions/workers. The existing archive verification message remains; the fixed detail message is Catalogue /artworks/[slug]: PostgreSQL verified. Next's request/prerender boundary and source guard remain explicit; Production always selects files. Provider failures are sanitized with no silent file/stale fallback. Static slug generation never reads the database.

Local checks: 40 database/integration tests and 183 prior regressions pass. TypeScript, both source-mode builds and lint pass, with zero lint errors and the same ten inherited warnings. Actual page/metadata comparisons cover EN/ES, sorting/filter contexts, every existing Series sequence, direct planned detail, both mode inputs, neighbouring scenes, missing-resource handling and static params. The actual PostgreSQL driver test exercises the projection of persisted data. HTTP checks cover the real Spanish default/Production detail in Standard/Glass and opted-in sanitized failure; missing streamed responses may carry 200 with not-found/noindex according to Next's framework contract. Owner successful Neon detail-page and visual/device checks are the next review point.

New observed pending item, separate from persistence: Next/Image warns about width/height CSS for el_misionero.webp. Preserve the owner's approved proportions. The primary viewer already declares automatic dimensions and responsive overrides also apply; the exact affected DOM instance is not identified by that message. Inspect the real rendered image before a separate correction; do not suppress the warning or change image dimensions here. All image data, resources and styles are unchanged in this increment.

No SQL migration/seed/write, new dependency, credential change, Redis/Contact/Newsletter action, env-file overwrite, commit, push, PR, merge, Vercel setting or deployment has occurred. Preview still requires its own verified isolated schema/catalogue before opt-in, and Production remains separately gated.

## DAT-02 — detail verified; Collections/Series connection v1.5 — 2026-11-10

Owner Stage 2 evidence: gallery and artwork-detail PostgreSQL verification messages, with HTTP 200 across recorded EN/ES, category and Standard/Glass routes. The detail request checkpoint is complete; the supplied development timings are not an isolated database benchmark. Continue the authorized staged work on the same pending feat/catalogue-postgres branch, preserving all existing changes.

Stage 3 connects Collections and Series server pages/metadata using the same opt-in, parity check, read-only snapshot and per-instance reader/cache. Fixed scope messages identify /collections and /series/[slug]. The new Series projection composes the existing detail projection and preserves published selection, Series cycle, member order and responsive media. Collections retains its own descending yearStart ordering, extracted into one shared pure builder; original service evaluation remains identical and public APIs/type exports stay compatible. No redundant Collection entity or persisted order/count/member array is added.

Verification: 49 database/integration tests plus 183 previous regressions pass; TypeScript, lint (zero errors, ten inherited warnings) and both builds pass. Tests compare actual EN/ES page and metadata data, every current Series, both modes, selected-artwork query handling, publication selection, missing resources and static params, including the real PostgreSQL protocol. HTTP checks verify forced-files Production content despite an invalid DB URL and sanitized opted-in failure without fallback. Canonical data, media, components/styles, translation files, SQL and dependency lock remain unchanged. The existing runtime image-sizing warning stays pending separate DOM inspection.

Next owner checkpoint: apply Stage 3 and use the same temporary local opt-in; confirm both new read messages and browser layout/navigation through Collections → Series → artwork detail. Home remains the next file-backed catalogue consumer. No commit/push/PR/merge, provider setting, DB write/migration/seed, credential/Redis/mail action or deployment is performed. Preview still requires an isolated and equivalent catalogue before activation; Production continues with files.


## DAT-02 — Collections/Series verified; Home connection v1.6 — 2026-11-10

Owner Stage 3 evidence: PostgreSQL verification messages for Collections and Series with recorded EN/ES HTTP 200 requests, Series Glass and linked artwork detail. This completes the request/read checkpoint, while complete visual/device review remains the owner's local checkpoint. Development timings are not an isolated database benchmark.

Continue on the same pending feat/catalogue-postgres branch. Stage 4 connects Home/SEO using the existing explicit source policy and full-equivalence reader. A public typed HomeCatalogue selection resolves the supplied catalogue and existing curated IDs; the server sends that same selection to the current Standard sections and lazy Home Glass ArtBook. The book no longer rebuilds its selection from static Home services. Approved composition, images, copy/locales, chapters, Journal/Newsletter, gestures, preferences and book engines remain unchanged. Counts remain derived; SQL and dependency versions are unchanged.

Verification: 58 database/integration tests and 183 previous offline regressions pass, including actual Home page/SEO data, supplied curation, file-service parity, EN/ES book output and real Postgres.js persisted projection. TypeScript, lint (zero errors, ten inherited warnings), both actual source-mode builds and HTTP/client-boundary checks are part of the final delivery verification. Production remains obligatorily file-backed; metadata/page share the existing per-instance cache. The fixed Home success message is Catalogue /: PostgreSQL verified. Failed reads are sanitized without stale/file fallback.

Runtime warnings observed during the owner's prior navigation are recorded for a separate focused correction: Hero responsive sizes, Artist fill without sizes, CollectionHeroMedia's unpositioned picture parent, and HomeExperience's bootstrap script on client navigation. Existing el_misionero image-size investigation remains pending. Preserve all approved proportions and inspect actual rendered elements before changing them; none of these warnings is silenced in this persistence increment.

Next owner checkpoint: apply over Stage 3, temporarily opt in locally, verify Home EN/ES in Standard/Glass, all chapters and outgoing/return navigation, and share the Home success message and checks. Full parity remains in place until remaining independent static consumers are reviewed; do not independently edit DB records. Preview isolation/equivalence and Production activation are still separately gated. No SQL write, env rewrite, credential/Redis/mail change, commit, push, PR, merge or deployment occurs here.


## DAT-02 — Home verified; startup script lifecycle v1.7 — 2026-11-10

Owner evidence confirms Home PostgreSQL reads in EN/ES and HTTP 200 for Home, recorded credits navigation and Artworks. The Home database request checkpoint is complete; browser/device approval remains distinct. Preserve all pending changes on feat/catalogue-postgres.

The ES-navigation React warning is traced to HomeExperience inserting its initial bootstrap script on a client mount. A stable server/initial-hydration snapshot now includes that existing script only when it can serve its startup purpose; subsequent client rendering uses the current experience preference and does not insert a new script. There is no warning suppression, preference-policy/storage change, new global/layout script, timer, dependency, visual modification or catalogue change. The original bootstrap body remains intact.

Verification retains the existing startup, Home/Glass/Series/gesture, catalogue and source/Production guards; TypeScript, lint, the build and focused browser lifecycle checks are recorded with actual results/limits in the delivery README. The owner should retest EN → ES → EN in Standard and Glass, including a fresh Glass entry and return to Home before considering commit.

New observed performance item: Next/Image identifies captura_de_jesucristo.webp as a possible above-fold LCP image. Review its real visible entry before a selective eager-loading decision. This joins the existing responsive sizes/containing-block/image-CSS tasks; no blanket thumbnail loading or aspect-ratio change is made. Redis, mail, SQL data, private settings and Production are untouched; no commit/push/PR/merge/deploy occurs.


## DAT-02 — editorial read consumption v1.8 — 2026-11-10

The owner confirms the v1.7 script fix and successful EN/ES Home, gallery/detail and Standard/Glass requests. Add Glass ArtBook for /artworks to the existing requested backlog (item 13.2.9); prototype/integration follows data unification, preserving Standard, filters/order, EN/ES and navigation. No gallery presentation is changed now.

Stage 5 connects the catalogue's editorial consumers through typed detached read DTOs from the existing repository. Canonical Artwork/ArtworkSeries remain unchanged. The transient catalogueEditorial payload contains requested language copy and media alternatives with English fallback; it is rejected by canonical import validation and is never stored in a column. All staged source boundaries use that read representation; default/enforced-Production files use the same projection. UI localization consumes supplied catalogue copy first and does not replace it with static Spanish values. Plain-record compatibility and UI dictionaries remain with their current adapters.

The approved components/styles/materials/gestures, original titles, IDs, dates/states, assets and all records are preserved. Tests include actual EN/ES output equality, DB-edited text through the real Postgres.js protocol and existing client helper, JSON round-trips, language reversal, missing/third-language copy, all media alternatives, detached values, no extra queries and refusal to import UI metadata. 66 database/integration tests plus 183 previous regressions pass; TypeScript, lint and both source-mode builds are checked. Browser/HTTP coverage and its limitations are recorded in the final delivery README.

Next checkpoint: owner reviews this increment locally on feat/catalogue-postgres, using the same opt-in and verification messages, in all five catalogue page families and Standard/Glass. Recognition/cover/Featured curation/filtering, sitemap and transitional ordering/reference policies remain following work; complete parity still blocks independent Neon edits. No migration/seed, credential/Redis/mail action, commit/push/PR/merge or deployment occurs. Preview isolation/equivalence and Production activation stay separately gated.


## DAT-02 — curatorial presentation and sitemap consumption v1.9 — 2026-11-10

The owner validates v1.8 locally: five catalogue page families, EN/ES and Standard/Glass return HTTP 200 and look correct. Proceed with data unification. Glass ArtBook for /artworks remains the already-recorded future prototype, not part of this increment. Image sizes/containing-block advisories retain their separate existing tasks.

Stage 6 supplies derived cover/Featured roles and per-artwork recognition history in typed public read metadata from the same catalogue snapshot. Shared badges, Featured filtering, Home/Collections/Series markers and the existing Series-glow eligibility use the supplied records. False/empty values do not fall back to files. Existing UI labels and rendering/motion remain approved; the event-name EN/ES adapter only translates an unchanged known event, so it cannot overwrite a new stored name. No persistent boolean, year, membership/count or ordering column is added.

The sitemap now consumes the shared repository through its own guarded source boundary. The current URL set, original slugs, domain, Spanish/legal indexing gates and all artwork states are retained; only unpublished Series are excluded. Lexical catalogue path ordering is independent of SQL row order. Non-indexable Preview/development stays empty without reading a database. Forced-Production file behavior and request-time error sanitization remain active.

78 catalogue/integration tests and 183 previous regressions pass, including actual Postgres.js changes, EN/ES/component SSR, JSON, filters, immutable/import-safe data and sitemap gates. TypeScript, lint, build and HTTP results/limits belong to the final delivery README. No schema/seed or live data change is needed.

Next owner checkpoint: apply incrementally over v1.8 on feat/catalogue-postgres, test the same routes/modes plus badges/Featured and sitemap expectations. Keep the complete equivalence gate. Static params, transitional Series/detail sequence/reference policies and real Preview isolation/data equivalence require explicit review before Production activation. No commit, push, PR, merge, deployment, credentials or Redis/mail infrastructure changes occur in this step.


## DAT-02 — explicit contextual navigation and read verification v1.10 — 2026-11-10

The owner validates v1.9 locally and approves proceeding with unification/verifications before the private catalogue administration prototype. Record that prototype alongside the existing /artworks Glass pending item in 13.2, without implementing either UI.

Retain all current navigation: newest/oldest/title still owns /artworks and independent detail; Series keeps its editorial cycle and member sequence. Move the existing four-Series/17-member position preferences into a pure presentation policy, with supplied FK/publication deciding membership and stable append behavior for future records. No Artwork/Series order column, member-array model, copied entity facts or new SQL table is introduced. Factories and source boundaries stop requiring file-backed entity reference arrays/counts. Canonical/schema/equivalence validation still protects completeness; duplicate record IDs/slugs are rejected.

Default/forced-Production static params remain unchanged. PostgreSQL opt-in returns no build-time slugs and resolves catalogue paths on request, including supplied future slugs, without a file enumeration or database connection during build. Actual EN/ES page/metadata and both experiences retain their content/query/navigation contracts.

Expand the existing db:read command to check application read DTOs/editorial/presentation/curation/contextual ordering/filter sorts/sitemap over the same schema/parity-verified read-only transaction. No new operator command or live data mutation is required. 86 catalogue/integration tests plus 183 prior regressions pass; TypeScript, lint and build/HTTP evidence/limits are recorded in the increment README. Source records, SQL, images/proportions, DOM/styles, gestures/material and credentials are preserved.

Next owner checkpoint: same feat/catalogue-postgres branch, incremental local apply, tests/build/db:read and visual/gesture review. Keep complete equality and file-backed Production. Actual Preview isolation/environment/schema/data/route verification and controlled activation are separate remaining checkpoints; no commit/push/PR/merge/deployment or provider configuration occurs now.
