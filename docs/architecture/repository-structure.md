Version: 1.6

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
2026-10-15

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
