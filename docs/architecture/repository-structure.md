Version: 1.22

Document ID:
DOC-RS

Project:
Del Carmen Digital Experience

Parent Brand:
Rō Visual

Document Type:
Architecture

Authority Level:
Highest

Status:
🟢 Approved

Owner:
Del Carmen Digital Experience

Last Updated:
2026-10-17

---

Repository Structure
Purpose
This document defines the official repository structure of Del Carmen Digital Experience.
Its purpose is to provide a stable, scalable and maintainable organization for the entire codebase.
The repository structure is considered part of the project's architecture and should remain stable throughout the life of the platform.
Business requirements may evolve.
Technologies may evolve.
The repository structure should change only under exceptional architectural decisions.
 
Architectural Principles
The repository is organized according to the following principles:
•	Business-oriented organization. 
•	Clear separation of responsibilities. 
•	High cohesion. 
•	Low coupling. 
•	Reusable shared resources. 
•	Progressive scalability. 
•	Simplicity before complexity. 
The architecture is designed to support future growth without requiring structural redesign.
 
Root Structure
del-carmen-digital-experience/

├── docs/
├── public/
├── src/
├── .env.local
├── .env.example
├── .gitignore
├── eslint.config.js
├── next.config.ts
├── package.json
├── README.md
└── tsconfig.json
 
Source Structure
src/

├── app/
├── assets/
├── config/
├── domains/
├── services/
├── shared/
├── styles/ 
Responsibilities
app/
Contains the Next.js App Router.
Responsibilities:
•	layouts 
•	pages 
•	routing 
•	metadata 
•	global providers 
No business logic should live here.
 
domains/
Contains the business implementation.
Each domain owns its own components, services, hooks, schemas, types and internal logic.
Domains should remain isolated whenever possible.
No domain should directly depend on another unless explicitly defined by the Domain Model.
 
shared/

├── components/
├── hooks/
├── layout/
├── lib/
├── types/
├── ui/
└── utils/
Shared contains reusable building blocks that are independent from any business domain. Everything placed here should be reusable across multiple domains whenever possible.
Examples:
•	UI components 
•	Icons 
•	Typography 
•	Utilities 
•	Hooks 
•	Helpers 
•	Constants 
Everything inside shared must be framework-independent whenever possible.
 
infrastructure/
Contains external integrations.
Examples:
•	Database 
•	API clients 
•	Authentication 
•	Storage 
•	Email 
•	Analytics 
•	External services 
Business rules must never be implemented here.
 
styles/
Contains global styling resources.
Examples:
•	Global CSS 
•	Tailwind layers 
•	Design Tokens 
•	Typography configuration 
No component-specific styles belong here.
 
config/
Contains global application configuration.
Examples:
•	Environment configuration 
•	Feature flags 
•	Constants 
•	Runtime configuration 
 
types/
Contains global shared TypeScript types.
Domain-specific types belong inside their respective domain.
 
assets/
Contains source assets used during development and bundled with the application.
Examples:
•	SVG 
•	Logos
•	Icons 
•	textures
•	Local images 
•	Fonts 
•	Illustrations 
Public assets remain inside /public.
 services/
Contains services responsible for communication with external systems or application-level operations.
Examples:
•	API services 
•	CMS services 
•	Payment services 
•	Search services 
•	Email services 
Services should coordinate operations but should not contain business domain logic.

 
Folder	Responsibility
app	Next.js routing and composition
domains	Business implementation
shared	Reusable resources
services	Application services
config	Global configuration
assets	Source assets
styles	Global styles

 
Domain Strategy
The Domain Model (DOC-DM) defines the complete business universe.
The repository only implements the domains required by the current product version.
New domains will be introduced according to the official Roadmap.
No empty domain folders should be created in anticipation of future features.
 
Evolution Policy
The repository structure is considered stable.
Future evolution may include:
•	Adding new domains. 
•	Adding new shared resources. 
•	Adding infrastructure integrations. 
Structural reorganization should be avoided once implementation begins.
 
Repository Governance
Every new file added to the repository must have a clear architectural justification.
When in doubt:
•	Reuse existing structures. 
•	Prefer consistency over convenience. 
•	Avoid duplication. 
•	Preserve architectural simplicity. 
 
Documentation Structure
docs/

├── architecture/
├── components/
├── database/
├── identity/
├── pages/
├── project/
└── prompts/
Purpose
All project documentation is centralized under the docs/ directory.
This separation keeps implementation and documentation independent while maintaining a single source of truth for the project.
 
Final Statement
The repository structure exists to support the product, not to dictate it.
Del Carmen Digital Experience grows by extending its domains, not by reorganizing its foundation.



------------------------------------------------------------------------

Repository Structure Evolution Update — 2026-10-05

Purpose

This section extends the approved v1.1 Repository Structure without deleting, compressing or replacing its architectural foundation.

The original structure above remains the Highest-authority approved repository organization.

This update records repository patterns that became concrete during subsequent Phase 1 implementation and clarifies how planned structure relates to folders that physically exist today.

Architectural Structure vs Physical Materialization

The repository documentation defines the intended architectural organization of the platform.

Not every documented folder must physically exist before its responsibility is required.

This is consistent with the existing Domain Strategy:

• The Domain Model defines the broader business universe.
• The repository implements only the domains required by the current product version.
• New domains are introduced according to the Roadmap.
• Empty folders should not be created merely in anticipation of future functionality.

Therefore:

• a documented future responsibility is not removed because its folder is not yet materialized;
• a planned integration remains part of the architecture until an approved decision changes it;
• implementation should create a folder or layer when a real current requirement activates that responsibility.

Current Phase 1 Confirmed Structure

The current implementation has confirmed the following architectural patterns:

src/app/

Owns Next.js App Router route composition.

Current public route responsibilities include experiences such as:

• Home
• `/collections`
• `/series/[slug]`
• `/artworks/[slug]`
• other approved public routes as implemented

Route files compose domain and shared modules.

Business identity must remain outside route-specific duplication.

src/domains/

Business-oriented implementation remains organized by domain.

Current canonical art-domain language includes:

• Artwork
• ArtworkSeries

The visitor-facing Collections experience may have presentation/discovery implementation under:

`src/domains/collections/`

This does not create a parallel `Collection` business entity.

`ArtworkSeries` remains the canonical body-of-work domain model.

src/shared/

The shared layer remains reserved for reusable resources independent of a single business domain.

Current confirmed shared structures include:

`src/shared/layout/container/Container.tsx`

and:

`src/shared/ui/kinetic-carousel/`

with:

• `KineticCarousel.tsx`
• `useKineticCarousel.ts`
• `index.ts`

KineticCarousel belongs in `shared/ui` because it is reused across Collections and Series experiences.

Its presence does not create a business domain.

Shared Interaction Ownership

Reusable interaction mechanics may live in `shared` when they are genuinely used by multiple experiences.

Domain-specific editorial composition remains owned by the corresponding domain/presentation layer.

For example:

• Collections decides when and how Works Preview appears.
• Series decides how its gallery is composed.
• KineticCarousel owns the reusable horizontal kinetic mechanics.

This preserves reuse without moving business-specific presentation rules into generic shared infrastructure.

Contextual Navigation State

Series-aware Artwork navigation, lightbox mode, carousel position, kinetic track state, pointer/wheel ownership and onboarding state are presentation/interaction concerns.

They do not justify new business domains or persistence entities.

A route query such as:

`/artworks/[slug]?series=[series-slug]`

preserves visitor context without changing Artwork identity.

Future Infrastructure Preservation

The original `infrastructure/` responsibility remains part of the approved repository architecture even when some integrations are not yet physically implemented.

Its documented responsibilities continue to include:

• Database
• API clients
• Authentication
• Storage
• Email
• Analytics
• External services

These responsibilities align with the future System Architecture and Roadmap.

They should be materialized when their implementation phase requires them rather than created as empty speculative folders.

Future Services Preservation

The original `services/` responsibility also remains valid.

Future API, CMS, payment, search, email and other application-level services remain part of the architectural direction.

Their absence from the current Phase 1 physical tree does not cancel those responsibilities.

Documentation Structure Evolution

The original documentation structure remains preserved.

As the project has evolved, documentation has also gained domain- and experience-oriented material beyond the earlier high-level directory example.

This should be treated as additive evolution of `docs/`, not as a reason to invalidate the original documentation categories.

Documentation should continue to be organized according to clear responsibility and discoverability while preserving the single-source-of-truth principle.

Current Stability

The following current structures should be treated as stable unless a justified architectural decision requires change:

• `src/app/` for route composition
• `src/domains/` for business-oriented implementation
• `src/shared/` for genuinely reusable resources
• `src/shared/layout/` for shared layout primitives
• `src/shared/ui/` for reusable UI/interaction primitives
• `src/shared/ui/kinetic-carousel/` for the shared KineticCarousel
• existing `config`, `assets`, `styles`, `services` and future `infrastructure` responsibilities defined by this document

Stable does not mean permanently immutable.

The existing Evolution Policy remains authoritative: new domains, shared resources and infrastructure integrations may be added as the Roadmap activates them, while unnecessary structural reorganization should be avoided.

Audit Note — 2026-10-05

Version 1.2 uses the conservative documentation method.

The complete supplied v1.1 Repository Structure body is preserved above, apart from Version and Last Updated metadata.

No planned folder responsibility, future integration layer or architectural growth path has been removed because it is not physically present today.

The update records current Phase 1 structures and the shared KineticCarousel while preserving the approved long-term repository architecture.

End of Evolution Update


------------------------------------------------------------------------

Legal Information Routes — 2026-10-15

Status: route implementation and draft copy prepared for review. This addition does not establish final legal approval or production readiness of the notices.

The existing Footer links `/privacy` and `/terms` now have corresponding informational pages. Their shared page composition lives in one App Router route group:

```text
src/app/(legal)/
├── layout.tsx
├── privacy/
│   └── page.tsx
└── terms/
    └── page.tsx
```

The route-group name is not part of the public URL. There is no competing `src/app/privacy/page.tsx` or `src/app/terms/page.tsx` in the supplied source.

The group layout reuses the existing Container and Footer and inherits the global Navigation from the root layout. It owns the shared reading measure, typography, navigation links and draft search-engine metadata. Both pages remain Server Components with static editorial copy and page-specific titles/descriptions.

This is route composition, not a new business domain, shared framework or persistence model. The draft privacy notice describes the observed Contact/Newsletter flows; Terms concerns browsing, enquiries and permission requests. No API, form submission, consent capture, subscriber persistence or commerce behavior changes in this patch.

Both pages visibly identify themselves as drafts. The group requests `noindex` while review is pending; this is not access control and the pages remain reachable through the Footer and direct URLs. Remove that draft state only after operator details, data-handling decisions and legal text are confirmed.

Before finalising the notices, confirm at least:

• the responsible person's or entity's legal identity and notification address;
• an operational public contact channel;
• retention and deletion arrangements for enquiries, subscribers, security data and service-provider copies;
• actual hosting, processing regions and any integrations outside the supplied `src`;
• presentation of privacy information and the appropriate consent procedure before form submission;
• sale, commission, reproduction, shipping and return conditions when purchasing is implemented.

The applicable personal-data framework should be checked against Costa Rica's Law 8968, especially its prior-information and consent requirements. Reference text consulted: [Ley 8968, Poder Judicial](https://cij.poder-judicial.go.cr/index.php/component/phocadownload/category/5-proteccion-de-datos?download=21%3Aley-8968-proteccin-de-la-persona-frente-al-tratamiento-de-sus-datos-personales). This technical delivery does not certify legal compliance or replace legal review.

Provider references consulted for the draft's review record:

• [Resend Privacy Policy](https://resend.com/legal/privacy-policy)
• [Resend Data Processing Addendum](https://resend.com/legal/dpa)
• [Upstash Privacy Policy](https://upstash.com/trust/privacy.pdf)

The source shows an important retention distinction: confirmation links expire after 24 hours, but subscriber records have no corresponding automatic expiry. Unsubscribe removes the active-set membership and stores the updated subscriber status; it does not delete the subscriber record. The draft therefore makes no automatic-erasure promise.

Validation evaluates the actual Footer links, legal layout/page JSX, heading/description associations, internal routes, draft metadata and source-file preservation. Full Next.js compilation, Tailwind rendering, responsive visual review, assistive-technology behavior, deployed services and final legal wording remain to be checked in the complete project.


Public Responsible-Person Details — 2026-10-15

Rolando authorised use of his current notification address and `errezetaerre@gmail.com` as the temporary public email. The notices identify Rolando Rojas Zapata as an individual; Del Carmen and Rō Visual remain the artistic/commercial identities and do not become a newly registered company through this change.

The public details are centralised in `src/config/legal.ts`, exported as `legalContact`. Privacy, Terms and the direct-correspondence link in Contact consume that configuration. Brand naming continues to come from `src/config/brand.ts`. The supplied notification address is stored once in the legal configuration, so a move or email migration can be reflected across the consumers by updating that file.

This configuration contains public contact information, not credentials or delivery secrets. The Contact API continues to require `CONTACT_EMAIL_TO` in its runtime environment; displaying an address in the website does not change that environment variable. Sender-domain verification remains a separate email-service configuration task.

The previously listed identity/address/public-contact items are now populated in the draft notices. Retention, deletion arrangements, actual processing regions, informed-consent procedures and final legal review remain pending. The draft labels and `noindex` metadata therefore remain in place.

The update adds one configuration file and modifies three existing source files: both legal pages and the ContactForm public email display/link. Relative to the first legal-page working snapshot, the other 207 existing source files remain byte-identical. No Contact/Newsletter API behavior or Glass Artbook, Journal, Series or About behavior changes.

------------------------------------------------------------------------

Approved Retention Lifecycle — 2026-10-15

The existing Newsletter API routes retain HTTP ownership and delegate state transitions to:

`src/domains/newsletter/server/subscriberLifecycle.ts`

This small server-only-by-usage module belongs to the existing Newsletter domain. It coordinates the existing subscriber keys, token lookups and active set with atomic Lua operations through the existing Redis SDK. Pending records and current confirmation lookups expire after 24 hours; a minimal unsubscribe record expires after 30 days; active records and their valid unsubscribe lookups remain persistent until an explicit lifecycle action. No new business domain, client API, scheduler, Redis namespace or dependency is added.

The shared operational guide is:

`docs/architecture/data-retention-operations.md`

It records the approved Contact inbox procedure (12 months), active-subscription annual review, targeted personal-data requests, historical-data inventory requirements and staging verification. The patch does not connect to personal email or production persistence, migrate historical records, send campaigns or replace a full-project build. The existing legal route group retains draft labels and `noindex`; Privacy copy now reflects the approved policy for final review after enforcement and the remaining production/consent checks.

------------------------------------------------------------------------

Form Privacy and Consent — 2026-10-15

`src/config/formPrivacy.ts` owns the public notice revision, form-specific purpose/wording and handling summaries. It contains no secrets. The existing `legal.ts` remains the single source of responsible identity, notification address and public email; brand naming remains in `brand.ts`.

Two small shared presentation components serve the existing Contact and Newsletter forms:

- `src/shared/ui/forms/FormPrivacyNotice.tsx`: prior information, Privacy link and native expandable detail.
- `src/shared/ui/forms/PrivacyConsentField.tsx`: required checkbox, label, notice association and inline error.

The forms retain ownership of state and submission. Each existing API validates explicit consent and the current revision independently. Contact keeps the declaration with its delivered message. The existing Newsletter server helper keeps it in pending/active records, with the approved lifecycle and expiry rules. No new business domain, persistence service, global modal, cookie manager or framework is introduced.

The revision archive, compatibility behavior and production limits are recorded in `docs/architecture/form-privacy-consent.md`. The existing retention operations guide is updated for consent evidence. Legal notices retain draft labels and `noindex` while installation, historical-data handling, provider checks and final review are pending.


------------------------------------------------------------------------

Artwork State and Distinctions — 2026-10-16

The existing Artwork model gains required `creationStatus` (`planned`, `in-progress`, `completed`) and the availability vocabulary adds `unavailable`. The initial catalogue extension identified four confirmed future works; the latest owner-supplied update identifies seven planned works as recorded in the current catalogue-authority section below. Year, authorship, dimensions, price and realization remain separate concepts.

Artwork recognition references live in:

- `src/domains/artworks/model/artworkRecognition.ts`;
- `src/domains/artworks/data/artworkRecognitions.ts`.

They reference existing Artwork IDs and distinguish an award, an honourable mention and a selection. The only seeded recognition comes from the approved Artist Journey narrative; that narrative retains its original source and factual changes should be reviewed in both places.

`src/domains/artworks/presentation/getArtworkPresentation.ts` is a pure derived presentation query. It combines artwork state, recognition references and the existing HomeCuration Featured reference. It does not persist a duplicate Home selection in Artwork or introduce another Collection domain. Its Home dependency is the reference-only curation data file, which has no runtime dependency back on Artwork presentation/components.

`src/shared/ui/artwork/ArtworkBadges.tsx` provides the shared label list. Current Home/Archive/Series cards, Featured Work, the shared lightbox and standard detail use the same query/labels. The Glass Artbook wrapper passes the query to its runtime through `GlassArtbookOptions.getPresentation`; the runtime changes only its information markup. No imports or display rules are injected into the rigid-leaf/shader/input engine.

The canonical implementation record is `docs/domains/artworks/artwork-implementation.md`. The two root integration-review READMEs intentionally removed by Rolando remain removed; this patch does not recreate them or add new review-note documents to the repository.

Existing HomeCuration, ArtworkSeries covers, responsive/standard/glass entry rules, queue/navigation, CSS geometry, reflection/corners and legal/Contact/Newsletter implementation remain unchanged. The earlier successful full-project build reported by Rolando covers the preceding baseline; this new source patch still needs its own complete build and browser/device validation after installation.


---

## Approved Artwork Halo Resources — 2026-10-16

The current shared artwork presentation extends the existing `src/shared/ui/artwork/` folder with:

- `ArtworkBadges.tsx` / `ArtworkBadges.module.css`: interactive below-image ribbons and compact thumbnail rails;
- `artworkHaloSymbols.ts`: dependency-free shared symbol markup;
- `ArtworkComingSoon.tsx` / `ArtworkComingSoon.module.css` and `artworkPreviewMarkup.ts`: one frosted-preview treatment for React and the book;
- `ArtworkImageHighlights.tsx` / `ArtworkImageHighlights.module.css`: painted-image alignment and measured lightbox clearance.

This replaces the earlier outlined label-list appearance. It does not create a new domain, global style system, icon dependency or persistence model. The existing domain presentation query owns badge semantics and the derived Featured check; shared UI owns rendering and local interaction.

The Archive and its detail route retain the Featured filter in URL navigation context. The Glass wrapper supplies `getPresentation` and `renderPreview` callbacks and mounts the shared ribbon in a stable portal. The runtime's image/info markup and Halo-specific input guards adapt presentation; shader/rigid-leaf/navigation physics stay preserved. See `docs/domains/artworks/artwork-implementation.md` for the current file list and verification boundaries.


### Shared Featured Series Identity

`src/shared/ui/artwork/FeaturedSeriesBadge.tsx` reuses the Halo vectors and local badge styles as a descriptive inline marker. `isFeaturedArtworkSeries()` in the existing artwork presentation query reads the HomeCuration Series reference. Home Collection, Collections hero content and Series detail compose this marker without adding another Collection domain or persistence field.

The Glass Artbook uses two stable insignia portals with separate reveal windows. The runtime reparents each whole window into its owning physical artwork face, so the painting and insignia share native 3D perspective. It prepares source/adjacent destination content through `onHighlightArtwork` and synchronises local vertical displacement with the live pointer/spring angle. Page-local clipping hides the departing insignia at its own lower edge; stable host transfer preserves React content at completion/cancellation. Alignment uses untransformed local image bounds, and interaction locks remain independent of visual opacity. Route/history commitment stays at turn completion. This presentation layer does not clip or resize the rigid leaf or change shader/turn physics. The complete six-file book module remains the integration unit. The approved Coming Soon and Halo presentation remains unchanged; subsequent entry/loading behaviour is described below.


### Artwork Entry and Navigation Feedback — 2026-10-17

The artwork presentation folder now includes `artworkExperience.ts`, a pure mode-URL helper and phone/tablet-landscape entry query. `ArtworkDetailResponsiveEntry` owns the one-time client viewport check, repeated on a fresh reload. It no longer caps tablet height or requires a coarse primary pointer for viewport widths through 1366px; larger touch tablets use `any-pointer: coarse`. The same query controls first-paint loading and the landscape scrollport. The detail route owns explicit Standard mode on all Standard navigation; the Glass wrapper uses the same URL helper for Exit and fallback. This is navigation state, not another Artwork field or persistence model.

`ArtworkLoading.tsx`, `ArtworkLinkFeedback.tsx` and `ArtworkNavigationFeedback.module.css` extend shared artwork UI with accessible, local waiting feedback. CollectionGallery owns pending state for programmatic detail navigation; linked surfaces use Next Link status. Lightbox selection stays immediate. The detail route's `loading.tsx` owns its route fallback. These resources do not introduce a global navigation service, new domain, dependency or delayed/fake progress. `GlassArtbookOptions.onLoadStateChange` connects local resource preparation to the wrapper loading/error panel. The runtime verifies primary/displayed image load and decoding plus font readiness before opening, independently preloads adjacent works, and waits for an unloaded incoming image before beginning its turn. Recoverable failure/timeout, retry and stale-continuation cleanup belong to the book module; Exit remains outside its interaction lock. Shader, leaf geometry, native insignia ownership and turn physics retain their approved implementation. This adds no global readiness service or dependency.


### Standard Artwork Detail Tablet Layout — 2026-10-17

`src/domains/artworks/components/ArtworkDetailScene.module.css` is the local owner of the Standard tablet-landscape sheet. ArtworkDetailScene separates its existing header, middle information and previous/next footer; ArtworkDetailKineticExperience shares only the local viewport/toolbar classes and reading-gesture ownership. The header/footer stay outside the bounded native reading scrollport. The pane is keyed by Artwork ID, while transparent wrappers retain existing flow outside eligible tablet-sized landscape viewports.

This is presentation layout, not a new Artwork field, domain, global layout service or book material. The image/detail divider lives in the existing column gap; unchanged shared artwork UI still owns the painting, zoom and Halo. The complete Glass Artbook, entry/loading policy, catalogue and shared artwork UI retain their approved bytes. Installation and validation limits are recorded in the canonical artwork implementation document.


### Catalogue Authority, Series Viewer and Thumbnail Action — 2026-10-17

`src/domains/artworks/data/artworks.ts` adopts the latest complete owner-supplied file. The current catalogue has 45 works: 38 completed and seven planned. Yasemi II–IV are planned/unavailable with their supplied 2026 year; this state is explicit and independent of date or stored price. Data/model/implementation documents remain the canonical reference; no separate inventory list or Collection domain is added.

`SeriesGallery` selects the existing shared ArtworkLightbox glass presentation used by Home, retaining its own Series dataset and route context. `CollectionArtwork` owns one main button covering the painting and descriptive thumbnail insignia. `ArtworkBadges` extends only its passive thumbnail expansion marker and corresponding underline; interactive Ribbon ownership remains separate and unchanged. No new component, navigation service, dependency, book engine or Standard layout is introduced by this update.


### Artwork UX, Cover Identity and Route Continuity — 2026-10-17

`src/domains/home/sections/hero/CoverArtworkBadge.tsx` derives the Home cover marker from the existing HomeCuration reference. Hero ArtworkInfo mounts it once above its responsive title variants. The shared `artworkHaloSymbols.ts` adds an open-book presentation symbol; it is not an Artwork recognition kind or Featured flag. Existing badge styles own the warm Halo palette and compact type.

`ArtworkDetailScene.module.css` extends the bounded Standard sheet to desktop as well as tablet landscape. The middle information scrolls independently of the header/footer, the information column retains its 28rem maximum and the one-pixel bronze divider lives in the column gap. Its temporary drag-selection rule belongs only to active kinetic scene gestures.

`src/domains/artworks/presentation/artworkNavigationContinuity.ts` owns a temporary inert DOM view during a Standard route handoff. ArtworkDetailKineticExperience captures the already-visible scene before route dispatch and resets new geometry before paint. The detail route fallback reads this local navigation state to show compact waiting feedback. Displayed-image/font settlement and departure/timeout cleanup remove the visual copy. It does not become a parallel viewer, global application navigation service, domain datum or persistence layer.

The Glass module reports preparation kind alongside status and artwork ID. Entrance/direct-selection waits remain blocking; an incoming turn retains the ready spread with a compact notice. Native construction establishes the gate before paint. Shader, geometry, page-bound Halo portals and physical interaction remain owned by the existing engine. The complete six-file book module remains the installation unit.

The catalogue, Home/Series shared lightbox, Coming Soon, actual recognition records, mode-entry policy and future commerce/EN–ES/database responsibilities retain their established authority. Build and browser/device verification limits are recorded in the canonical artwork implementation document.


### Shared Cover Marker and Tablet Gesture Ownership — 2026-10-17

`getArtworkPresentation.ts` now owns the derived `cover` descriptor and `isCoverArtwork()` query over the existing HomeCuration hero reference. The Hero marker, shared thumbnail rails, Collections previews, lightboxes, Standard and native Glass ribbons consume that same identity. ArtworkRecognition and persisted Artwork/Series data retain their current models.

Standard separates vertical reading from horizontal exploration. The kinetic viewport recognises native portrait scrolling in tablet-sized fine-pointer emulation as well as touch; portrait layout stacks the image and technical sheet. Its horizontal reading-pane gestures retain the existing slide/release animation. Shared `ArtworkLightbox.module.css` owns the wider tablet image/caption frame while the viewer interaction engine remains unchanged.

The native Glass runtime owns a temporary text-selection lock during its page gesture/opening/settling. It restores resting reading behavior and leaves material, geometry, spring physics and native page-bound insignia rendering intact. Existing resource gates and route-continuity feedback remain installed. Current implementation and validation limits live in the canonical artwork implementation document.


### Native Touch Delivery and Book Reading Ownership — 2026-10-17

`src/domains/artworks/components/artworkTouchNavigation.ts` is a local event adapter, installed by ArtworkDetailKineticExperience in a layout effect and reused by the native Glass viewer. Native Touch Events and mouse/pointer fallback feed the same ArtworkDragInput movement/release handlers. It owns only horizontal touch input, isolates native pointer cancellation from its live touch stream, preserves vertical reading/taps and disposes cancelled/multitouch sessions. It adds no duplicate animation engine, domain state, dependency or device-specific timing.

Standard tablet portrait adds 32px above its already-approved large painting. Its stacked information and native vertical scroll remain in the existing scene CSS; desktop header/footer positioning remains intact. The photo-fit refinement below preserves that top spacing and height cap.

The Glass runtime gives resting info text native selection ownership and clears book-intersecting selections when a turn starts. Existing gesture locks protect the moving faces. Native Halo alignment now reserves side and bottom corner clearance and includes the bottom offset in its off-page exit distance, while preserving page-local windows, perspective, live-angle reveal and source/destination portal ownership. Material, rigid geometry and spring/turn physics retain their current implementation. Validation scope and pending full-project/device confirmation belong to the canonical artwork implementation document.

### Standard Footer Motion and Tablet Photo Fit — 2026-10-17

ArtworkDetailScene marks only Previous/Next links for the existing kinetic viewport. Current-panel ordinary activation uses that viewport's neighbour slide and post-landing route handoff. Native hrefs, modified-click behaviour, Standard/Series/filter context and adjacent-only prefetch remain in their existing owners. Busy/offscreen footer activations cannot dispatch additional routes; Back and Open Artbook keep their separate actions. There is no second animation engine or navigation service.

ArtworkDetailViewer supplies a local photo-aspect custom property from existing image metadata. ArtworkDetailScene.module.css uses it only in tablet portrait to fit a Standard photo to the smaller of the available width and the approved 64svh height limit, independently of its source-pixel size. Object-contain, portrait breathing room and the stacked sheet remain intact. Photo resolution, catalogue data, planned previews and zoom retain their current source. The landscape and native-input refinements below retain the six-file Glass installation unit. Canonical artwork implementation records image-quality and full-project/device verification limits.


### Glass Input, Collections Reveal and Shared Dust — 2026-10-17

Bounded Standard tablet landscape gives its completed photo the available stage dimensions with object-contain. The local scene stylesheet owns this sizing while portrait fit, technical-sheet anchors, native reading and compact phone/other desktop layouts retain their existing owners.

The native Glass viewer reuses artworkTouchNavigation rather than creating another touch-delivery engine. Its own six-pixel horizontal intent starts the existing page physics from either side. A local DOM Range glyph hit test gives visible info text native selection while leaving padding, line gaps and blank paragraph space available for a turn; the overflowing pane’s scrollbar and the Halo band own their interactions, native Pointer Events cannot cancel an adapter-owned touch stream, and document movement/capture fallback keep pending mouse grabs usable near the scene boundary. Temporary selection locks end on rejection or the existing release/settle/cancellation lifecycle.

`src/domains/collections/components/CollectionPreviewWorks.module.css` owns the collapsed/expanded strip heights and hover/focus-within transition for the existing grid and KineticCarousel. CollectionPreviewArtwork supplies full-height, zero-minimum-height links and corresponding focus metadata reveal. CollectionHeroMotion, arbitrary Series datasets, centred singleton, bottom anchoring, mobile suppression and scoped single-link navigation retain their established implementation.

`src/shared/ui/particle-field/dust.ts` owns warm mote/glint drawing shared by ParticleField and a small, finite book landing burst. The book schedules decoration only after a labelled artwork lands and its actual page-bound React ribbon is ready. The book selects a bounded 48–96-mote/1250ms perimeter canvas anchored to the resting artwork leaf, covering all four edges with a soft 32px margin. A 24-mote/1050ms ribbon variant remains the helper default. Native, untransformed leaf geometry continues to own sizing/position/perspective; the actual current ribbon remains the readiness/eligibility gate. Missing 2D contexts return without scheduling a frame, and a checked, explicitly non-null CanvasRenderingContext2D binding supports deferred drawing. ParticleField keeps the menu's existing attraction/controls and adds visibility/reduced-motion suspension and resize reseeding. No recognition fields, global motion service, persistent particle loop for the book or dependency is added. Canonical artwork implementation records exact scope and full-project/device validation limits.
