# Del Carmen Digital Experience --- architecture/implementation-roadmap.md
Version: 1.2
Document ID: DOC-IR
Project: Del Carmen Digital Experience
Parent Brand: Rō Visual
Document Type: Technical
Authority Level: High
Status: 🟡 In Progress
Owner: Del Carmen Digital Experience
Last Updated: 2026-10-05
 
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
