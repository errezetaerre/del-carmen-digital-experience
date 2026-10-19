Version: 1.38

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
2026-10-18

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

The Glass Artbook uses two stable insignia portals with separate reveal windows. The runtime reparents each whole window into its owning physical artwork face, so the painting and insignia share native 3D perspective. It prepares source/adjacent destination content through `onHighlightArtwork` and synchronises local vertical displacement with the live pointer/spring angle. Page-local clipping hides the departing insignia at its own lower edge; stable host transfer preserves React content at completion/cancellation. Alignment uses untransformed local image bounds, and interaction locks remain independent of visual opacity. Route/history commitment stays at turn completion. This presentation layer does not clip or resize the rigid leaf or change shader/turn physics. The complete seven-file book module remains the integration unit. The approved Coming Soon and Halo presentation remains unchanged; subsequent entry/loading behaviour is described below.


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

The Glass module reports preparation kind alongside status and artwork ID. Entrance/direct-selection waits remain blocking; an incoming turn retains the ready spread with a compact notice. Native construction establishes the gate before paint. Shader, geometry, page-bound Halo portals and physical interaction remain owned by the existing engine. The complete seven-file book module remains the installation unit.

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

ArtworkDetailViewer supplies a local photo-aspect custom property from existing image metadata. ArtworkDetailScene.module.css uses it only in tablet portrait to fit a Standard photo to the smaller of the available width and the approved 64svh height limit, independently of its source-pixel size. Object-contain, portrait breathing room and the stacked sheet remain intact. Photo resolution, catalogue data, planned previews and zoom retain their current source. The landscape and native-input refinements below retain the seven-file Glass installation unit. Canonical artwork implementation records image-quality and full-project/device verification limits.


### Glass Input, Collections Reveal and Shared Dust — 2026-10-17

Bounded Standard tablet landscape gives its completed photo the available stage dimensions with object-contain. The local scene stylesheet owns this sizing while portrait fit, technical-sheet anchors, native reading and compact phone/other desktop layouts retain their existing owners.

The native Glass viewer owns retained-target delivery in `glass-artbook/glassTouchNavigation.ts`; Standard keeps its original shared `artworkTouchNavigation.ts`. The private Glass adapter preserves the approved target retention/deduplication/cleanup body across face replacement. Its six-pixel intent, glyph/scrollbar/insignia ownership, readiness continuation, rigid geometry and mouse physics remain owned by the existing runtime. Standard chooses Pointer/native Touch delivery from the actual active stream, preserving a Pointer gesture when native touchstart adopts it. Duplicate Pointer delivery is ignored only during an owned native stream; a capability property no longer disables Pointer-only drag. Native termination, route reset and blur release ownership. Height-only resize observations cannot reset a live drag or incomplete Wheel preview. The move/release calculations, thresholds, velocity averaging, durations/easing and all presentation/route logic retain their approved owners. The complete seven-file book module includes the private adapter; its only shared input dependency is the ArtworkDragInput type.

`src/domains/collections/components/CollectionPreviewWorks.module.css` owns the collapsed/expanded strip heights and hover/focus-within transition for the existing grid and KineticCarousel. CollectionPreviewArtwork supplies full-height, zero-minimum-height links and corresponding focus metadata reveal. CollectionHeroMotion, arbitrary Series datasets, centred singleton, bottom anchoring, mobile suppression and scoped single-link navigation retain their established implementation.

`src/shared/ui/particle-field/dust.ts` owns the approved warm menu renderer, independent 24-mote/1050ms ribbon burst and finite mirrored comet accent. Real current ribbon/book/leaf geometry gates the landing. One book-local canvas and clock synchronise top/exterior/bottom/full-inner-ascent/full-spine-descent phases across unequal-width leaves. The 720ms path has a tiny moving warm head, 50ms fine bright core and 160ms graded tail that clears by 880ms. Each leaf emits bounded motes; 24 extra motes emit along the moving centre of the gap during the final descent. The spread is finite at 1620ms. Unborn/faded motes and zero-alpha core strokes are skipped; native geometry, 32px margins and pointer-transparent drawing preserve layout/hit areas. The approved cleanup/hidden/reduced/disconnected/unsupported guards and non-null context bindings remain. Material, menu controls, copy, image fitting and data remain unchanged. Canonical artwork implementation records exact scope, regression evidence and full-project/browser/device limits.

### Shared Artwork Arrival Accent — 2026-10-17

`src/shared/ui/artwork/ArtworkArrivalEffect.tsx` and `artworkArrivalLifecycle.ts` own the shared decorative layer and its readiness/lifetime adapter with distinct implementation names on case-insensitive filesystems. The domain's installed `ArtworkStandardPortraitAccent.tsx` and `standardPortraitAccent.ts` entry points are forwarding modules, so Standard and Home/Series do not maintain duplicate implementations. Current imports use the distinct names directly. The former `ArtworkArrivalAccent.tsx` and `artworkArrivalAccent.ts` files expose identical compatibility exports and can be safely overwritten during a ZIP merge. The layer mounts only for the selected completed work with a real Cover/Featured/recognition Halo. Standard uses portrait plus tablet-landscape eligibility, including size-based emulators and shorter tablet viewports. ArtworkLightbox opts into its own modal scope across layouts and keys the layer by the selected Artwork ID.

The adapter measures the complete `[data-lightbox-panel]` or Standard `[data-artwork-detail-layout]` after decode/fonts/Halo readiness and actual view reveal. The image rectangle only gates visible arrival; the full panel owns the rounded comet perimeter. The panel receives the canvas directly, outside the image mask, while the existing band still owns badge particles. Standard adds only a relative positioning context to its transparent spread. Standard excludes adjacent/sliding panels; lightbox permits its own dialog while excluding other modals, zoom and expanded reading. Passive input observation and cleanup preserve the existing navigation, drag, wheel, zoom, reading, selection and close owners. The existing lightbox handlers and responsive styles retain their exact source; only the optional layer and passive DOM markers are inserted. Body/media/image/resize observers, pending callbacks and current decoration are released on interruption/disposal.

The shared `dust.ts` retains its approved two-page Glass Artbook and mobile-menu renderers. The arrival-only path now follows all four edges and the measured glass corner radius, with a warm graded comet and 48–104 outward fairy-dust motes plus the existing 16 badge motes. The canvas sits above the persistent rim and clears after its single finite sequence. Its 24px margins, capped DPR and pointer-transparent layer preserve image/layout/hit areas. Existing Halo, Catalogue, Series membership, archive filter context, kinetic physics, Standard trackpad correction and seven-file Glass installation unit retain their owners. Canonical artwork implementation records exact scope, validation and actual build/browser/device review requirements.


### Dialog keyboard focus

`src/shared/hooks/useDialogFocus.ts` owns reusable modal focus behavior for MobileMenu, ArtworkLightbox and the fullscreen ArtworkDetailViewer. It exports the client hook and a DOM binding used for event-level verification. Opening focuses the preferred close control or first available control; Tab/Shift+Tab remain inside the current dialog; closing returns focus to the connected, visible prior control. A per-document stack gives only the most recently opened bound dialog ownership of focus and Tab. Dynamic controls, hidden/disabled/inert ancestors, empty dialogs, missing return targets, repeated cleanup and callback updates retain explicit handling.

MobileMenu delegates Escape to its current close callback. Artwork viewers retain their existing Escape, expanded-reading, arrow, zoom and pan handlers. The integrations add only refs/imports/hook calls; the existing classes, JSX composition, content, swipe/selection handlers and scroll locks retain their source. No new dependency or environment setting is introduced. This is one bounded accessibility correction within Phase 1 QA; it does not declare global keyboard, screen-reader, responsive or production verification complete.


### Server-rendered page metadata

`src/shared/lib/metadata.ts` formats one complete page title, a whitespace-normalized description and matching Open Graph/Twitter text through the existing Next Metadata API. The helper depends only on the existing site configuration and Next types; it introduces no request headers, cookies, fetch, environment variable, package or client runtime. Home and the six main static routes export static metadata. Artwork, Series and published Journal detail routes export `generateMetadata` using their existing canonical slug selectors and not-found boundaries. Filter/experience query state does not redefine artwork metadata.

Artwork-specific realisation/authorship wording belongs to `src/domains/artworks/presentation/getArtworkMetadata.ts`. Planned and in-progress works receive explicit labels; the year and stored price cannot assert completion or a purchase offer. Journal detail uses the article Open Graph type without inventing a full publication date. Root layout, legal metadata, route rendering, navigation and interaction code retain their source. No canonical URL, public origin, social preview image, sitemap, robots policy or structured commercial data is fabricated before those configurations/content are ready.

The current metadata increment is a foundation rather than a complete technical SEO audit. Canonical origin/URLs, sitemap/robots, real preview images, indexing, performance and production/crawler review remain in the implementation roadmap. EN/ES, persistence and commerce remain separate requested increments.

### EN/ES shared routes and first editorial pilot

The owner-approved language architecture is implemented as a pilot from upstream commit `f2cf5b1`. Public layouts/pages now live once under `src/app/[locale]/`; `src/app/api/`, global CSS/favicon and all public assets remain global. English keeps the existing unprefixed URLs; Spanish adds `/es` with unchanged slugs. There is one canonical Artwork/ArtworkSeries catalogue, not an English and a Spanish duplicate. The catalogue and media files are not part of the migration patch.

`src/i18n/` owns typed locales, `next-intl` routing/navigation/request configuration, shared message namespaces, the language selector and language boundaries for untranslated English. `content/artworks.es.json` holds quote/description and existing image-variant alt translations for all 45 current works by canonical ID; `artworkCopy.ts` joins that copy immutably with the single owner catalogue. `src/proxy.ts` excludes APIs/framework files/assets. The exact new dependency is `next-intl@4.14.9`; the existing Next.js/React versions remain pinned. Language follows the URL; browser negotiation and the locale cookie are disabled. No runtime AI translation service is called.

Navigation, Home hero and Epifanía Nupcial form the owner-reviewed first pilot. The subsequent Artwork block translates archive introduction/metadata, filters/result/empty states and shared thumbnail labels, plus all 45 works' editorial/alt copy in the viewers. Native Glass labels and history, Standard route continuity and shared viewers use the same locale. Facts, original artwork titles, asset paths and the approved motion/material/input contracts remain canonical. Stored policy/consent/API/subscriber text remains unchanged. Remaining Home/Series/editorial/form/legal copy is English with explicit language boundaries until its Spanish translation is reviewed. Spanish stays noindex and language alternates remain disabled before the complete content/domain review.

The actual repository and dependencies are now available: `npm run build` passes TypeScript and generates 123 static pages. The first pilot passed 60 content/context/continuity/HTTP checks and focused i18n lint. The Artwork block passes 29 additional content/actual-component checks, nine production-server checks across 96 requests and focused lint with no errors (the existing native-thumbnail image warning remains). Its package files are byte-identical to the pilot. Browser installation was unavailable; rendered device gestures, visual fit, screen readers and production providers/crawlers are still unverified. Earlier source-snapshot test limitations above describe those earlier increments, not the current build environment. Inherited dependency security findings require a controlled update before public release, as recorded in DOC-I18N.

Canonical decisions, scope, exact patch installation and release gates are in `docs/architecture/internationalization.md`. Apply the Git migration patch rather than merging a partial route folder over the existing tree. The separate review branch retains the approved upstream recovery point.

The owner approved/pushed the foundation and Artwork block as `d56b772`. The subsequent Home/Collections patch adds `src/i18n/seriesCopy.ts` / `content/series.es.json` and `journalCopy.ts` / `content/journal.es.json`. These localize four series' editorial/alt copy and the two published Home teasers; original names, canonical data and shared media remain intact. Home editorial sections, Collections and Series pages/controls/metadata are translated. At this v3 stage, the newsletter form retained a local English boundary and About/Artist, full Journal, forms and legal were still pending. SeriesGallery mounts the existing document-body portal client-side for direct selected-work requests, preserving its native viewer and selection/Close handlers. Build/TypeScript, 21 new content checks, 12 HTTP checks (21 requests) and the 29 Artwork checks pass. All six English Home/Collections/Series responses retain the approved normalized visible copy/metadata. Focused lint retains exactly the existing one error/three warnings, with no new finding. Actual browser hydration, device fit and assistive-technology review remain open.

The subsequent About/Artist increment adds no domain, route tree or media folder. `About` and `Artist` namespaces in the same dictionaries hold 157 additional values (367 keys total). Existing scene components resolve local text through `useTranslations`; the two routes activate their locale and generate localized metadata. Their route-level English boundaries are removed. Artist milestone records, navigator labels and image alternatives remain local to Artist, without general timeline/content infrastructure. Motion files, scene geometry, catalogue, form/consent and package files retain the approved v3 bytes. Build/TypeScript, 11 content checks and 12 HTTP checks pass, with exact English visible copy/metadata and unchanged Spanish Home. Focused lint retains the verified existing JourneyNavigator refs error without a new finding. See DOC-I18N and the domain addenda for scope and review limits. The owner approved Home/Collections and About/Artist before the subsequent Journal block. Forms/legal and production checks remain pending.

The Journal increment following owner-approved About/Artist adds `src/i18n/content/journalStories.es.json` and `journalStoryCopy.ts`. The stored translations cover the two published stories' seven scenes by canonical IDs. The immutable helper overlays only existing editorial fields, preserving media/layout/order and English identity; incomplete/unknown scenes stay English with explicit language marking. Existing `journalCopy.ts` / `content/journal.es.json` continue to supply the same approved titles/categories/excerpts to Home, index, article headers and related entries. No translated asset or duplicate domain tree is introduced.

Journal index/detail metadata and interface copy now follow the route locale through 17 new `Journal` messages (384 keys total). Index image links gain accessible names; their original geometry, destination and empty decorative-image alternatives remain. Five records without stories remain unpublished. The approved motion/input, canonical data, dependency and form/consent files are unchanged. Build/TypeScript, 11 content checks and 11 HTTP checks across 21 requests pass; all three English Journal responses and approved Spanish Home/About/Artist visible responses remain exact. Focused lint retains three native-image warnings, with no errors or new finding. Contact/newsletter forms, feedback, legal/consent, browser/device/accessibility and inherited security/lint release work remain open.

### EN/ES forms, consent copies and confirmation mail — v6

New local copy helpers/data: `src/i18n/formPrivacyCopy.ts` / `content/formPrivacy.es.json` and `legalCopy.ts` / `content/legalContact.es.json`. English source registries retain their bytes; Spanish notices/addresses derive the same approved purposes/operator facts with a distinct Spanish notice revision. Existing form components use typed Contact/Newsletter/FormPrivacy messages and preserve their design, subjects and field names. Error keys resolve in the current language; checkbox acceptance is bound to language/version.

`src/domains/newsletter/server/confirmationEmail.ts` owns the extracted existing email design and translated/escaped confirmation copy. The existing POST routes validate locale/version and derive consent records on the server. Existing confirm/unsubscribe GET routes localize result redirects while retaining status/query/hash semantics. The language parameter is presentation context, not authority to alter consent. The subscriber helper gains an optional locale argument defaulting to English; all Lua scripts/TTLs/keys and minimal unsubscribe records remain exact.

Contact metadata, both legal page/layout copies and shared notices follow locale; their temporary English boundaries are removed. The Home newsletter keeps Suspense. No route/domain/asset duplication, dependency, cookie, provider or production write is introduced. Build/TypeScript and 30 source/component/server groups pass; English visible copy and prior Spanish sections remain exact. Existing NewsletterForm lint debt, physical/browser/provider and final legal/commercial/security review remain open. DOC-I18N defines delivery/recovery.


### Portrait Glass Artbook — 2026-10-18

`domains/artworks/components/portrait-artbook/` owns only the new mobile/tablet portrait editorial turn. `ArtworkPortraitEntry.tsx` selects and lazy-loads the portrait variant, retaining the existing desktop/landscape children and the selected artwork when native history and device rotation meet. `portraitArtbookViewport.ts` owns its established portrait media policy. `ArtworkPortraitArtbook.tsx` composes stable current/adjacent full-width editorial pages, localized fixed controls, loading/retry and the shared glass/dust material. `portraitArtbookMotion.ts` owns native-touch/mouse/Wheel/keyboard input, decoded inert face copies, rigid central-hinge occlusion and the landing handoff. `ArtworkPortraitArtbook.module.css` owns only this frame, clipping, perspective and responsive presentation.

ArtworkDetailScene supplies an opt-in editorial-only view of the existing artwork presentation; its default preserves Standard. ArtworkPage wraps default/Glass entry with the portrait selector, while explicit Standard bypasses it. The portrait Standard Open Artbook action is visible for comparison and return. Global navigation remains outside all turn surfaces. The original seven-file landscape/desktop glass module, both existing input adapters, Standard kinetic controller, shared Home/Series lightbox, approved Bronze accent helpers, dust renderer, canonical catalogue, translation dictionaries, assets and environment/dependencies remain in their existing owners. Collections still uses canonical ArtworkSeries and no parallel grouping/domain is created.

DOC-ART-IMP records the plane construction, readiness, history, validation and physical-device review limits. This is an incremental portrait experiment over approved bilingual Forms/Legal v6; it does not replace prior packages or promote production.
