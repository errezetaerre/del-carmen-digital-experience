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
