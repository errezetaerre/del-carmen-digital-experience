architecture/domain-model.md
Version: 1.2
Document ID: DOC-DM
Project: Del Carmen Digital Experience
Parent Brand: Rō Visual
Document Type: Technical
Authority Level: Highest
Status: 🟢 Approved
Owner: Del Carmen Digital Experience
Last Updated: 2026-10-05
 
1. Objective
This document defines the business domains of Del Carmen Digital Experience.
Its purpose is to establish a common language between design, development, database architecture and future AI systems.
Every feature implemented in the platform belongs to one or more domains defined here.
 
2. Domain Philosophy
The platform is not organized around pages.
It is organized around business capabilities.
Each domain represents a real concept within the Del Carmen ecosystem.
Domains own their data, behavior and relationships while collaborating through well-defined interfaces.
 
3. Core Domains
Artwork
Represents an original artistic creation.
Responsibilities
•	Artwork information 
•	Images 
•	Medium 
•	Dimensions 
•	Year 
•	Story 
•	Availability 
•	Pricing 
•	Editions 
•	Metadata 
Future Features
•	Audio narration 
•	Process images 
•	Restoration history 
•	Provenance 
•	Exhibition history 
 
ArtworkSeries
Represents a coherent body of artworks connected by a shared artistic narrative, investigation, exhibition concept or thematic identity.

Responsibilities
• Series identity
• Slug
• Title
• Description
• Curatorial statement
• Artistic lifecycle
• Artistic chronology
• Cover / representative artwork
• Artwork membership
• Curatorial ordering
• Series-specific presentation context

Current Phase 1 relationship
One ArtworkSeries
↓
Many Artworks

The current implementation expresses membership through an optional `Artwork.seriesId`.

This Phase 1 relationship must not be migrated solely for conceptual purity.

Future evolution may support many-to-many membership when a real curatorial requirement justifies it.

Public terminology may use “Collection” in discovery experiences such as `/collections`, but Collection is not a parallel canonical domain entity or duplicate persistence model.

`/collections` is the editorial discovery experience for ArtworkSeries.

`/series/[slug]` is the detailed curatorial experience for an ArtworkSeries.

Artist
Represents the creator.
Initial implementation
One Artist
Future
Multiple artists.
Responsibilities
Biography
Artist statement
Achievements
Timeline
Social links
 
Gallery
Represents curated visual experiences.
Types
Permanent
Temporary
Featured
Virtual
 
Exhibition
Represents an organized artistic event.
Future capabilities
Opening date
Closing date
Venue
Virtual exhibition
Curator
Featured artworks
 
Collector
Represents people who collect or follow the work.
Future capabilities
Favorites
Collection history
Wishlist
Certificates
Private gallery
 
Marketplace
Handles commercial transactions.
Responsibilities
Originals
Prints
Digital works
Orders
Payments
Shipping
Taxes
Invoices
 
Community
Represents social interaction.
Future capabilities
Comments
Discussions
Events
Membership
Announcements
 
Academy
Educational platform.
Future capabilities
Courses
Lessons
Downloads
Certificates
Student Progress
 
Museum
Immersive experiences.
Future capabilities
3D Spaces
VR
AR
Interactive Tours
Audio Guides
 
User
Authentication entity.
Possible Roles
Guest
Collector
Student
Administrator
Curator
 
Administration
Platform management.
Responsibilities
Users
Content
Media
Analytics
Configuration
Security
 
4. Canonical Art-Domain Distinctions

Artwork
Represents the individual artistic work and remains the canonical source for its artistic identity and metadata.

ArtworkSeries
Represents a coherent curatorial body of artworks.

Artwork media
Represents visual manifestations of an Artwork. Multiple media representations do not create duplicate Artwork records.

Canonical public visual roles may include:
• Primary
• Hero Portrait
• Hero Landscape
• Thumbnail

HomeCuration
Represents editorial selection for Home experiences. It references existing Artwork and ArtworkSeries entities and does not redefine them.

Collection
Is currently visitor-facing editorial terminology and the name of the `/collections` discovery experience. It is not a separate canonical persistence entity.

Product
Represents a transactable manifestation in the commerce domain. Artwork and Product are separate concepts.

Publication state and artistic lifecycle
Are conceptually separate concerns. An ArtworkSeries may be published while remaining artistically ongoing.

Representative artwork
Is the artwork used to represent a Series externally. The existing `coverArtworkId` should remain the first source evaluated for this responsibility before introducing another identifier.

Artwork membership
Currently uses optional `Artwork.seriesId` in Phase 1. A future relationship entity may support many-to-many membership, curatorial ordering and Series-specific featured state when required.

5. Relationships

Artist
│
├── ArtworkSeries
│      │
│      └── Artworks
│               │
│               ├── Gallery
│               ├── Exhibition
│               ├── Marketplace
│               └── Museum
│
└── Artworks

Collector
│
├── Orders
├── Favorites
├── Wishlist
└── Certificates

User
│
├── Community
├── Academy
└── Administration

Artwork remains independently addressable regardless of Series membership.

An Artwork may exist without an ArtworkSeries.

ArtworkSeries does not replace Artwork identity; it provides a curatorial relationship and narrative context.

Exhibition history is independent from the artistic lifecycle of an ArtworkSeries.

Commercial manifestations such as originals offered for sale, prints and editions belong to commerce concerns and must not redefine artistic classification.

6. Domain Dependencies

Artwork is a central artistic entity.

ArtworkSeries references and organizes Artwork without owning or redefining Artwork identity.

Conceptually:

ArtworkSeries
↓
Artwork

Artwork may also participate in:

• Artist
• Gallery
• Exhibition
• Marketplace
• Museum

Collector
↓
Marketplace
↓
Orders
↓
Certificates

Domains should communicate through services or explicit domain interfaces.

Direct dependencies should be minimized.

Presentation concerns such as Home Hero, Featured Artwork, Featured Collection, `/collections` Heroes, Series galleries and Lightboxes must consume domain data rather than become domain entities themselves.

Home curation is an editorial/application concern that references existing Artwork and ArtworkSeries records.

7. Design Principles
Every domain should be:
•	Independent 
•	Testable 
•	Reusable 
•	Extensible 
•	Documented 
No domain should depend on UI implementation.
 
8. Future Evolution
The architecture is prepared to support:
•	Multiple artists 
•	Multiple languages 
•	AI-assisted curation 
•	Collector portal 
•	International shipping 
•	Museum expansion 
•	Mobile applications 
•	Public API 
•	CMS integration 
without changing the domain model.
 
9. Naming Convention

Canonical domain concepts use singular conceptual names.

Examples

✅ Artwork
✅ ArtworkSeries
✅ Artist
✅ Collector

Public route or editorial terminology does not have to duplicate the canonical domain name.

Examples:

`/collections` → editorial discovery route for ArtworkSeries

`/series/[slug]` → detailed ArtworkSeries route

Visitor-facing “Collection” → acceptable editorial language

Technical `ArtworkSeries` → canonical domain/model terminology

A second `Collection` domain or persistence model must not be introduced merely to mirror visitor-facing terminology.

Repository folder naming remains governed separately by Repository Structure and Governance documentation.

10. Development Rule
Every new feature must belong to an existing domain.
If no suitable domain exists:
1.	Evaluate whether the feature extends an existing domain. 
2.	Only create a new domain if it represents a new business capability. 
This prevents unnecessary fragmentation of the platform.
 
11. Success Criteria
The Domain Model is considered successful when:
•	Every business capability has a clear owner. 
•	Relationships are well defined. 
•	New modules can be added without restructuring the platform. 
•	The domain language remains consistent across documentation, code and database. 
•	Developers, designers and AI systems share the same vocabulary. 
 
End of Document



------------------------------------------------------------------------

# Domain Model Evolution Update — 2026-10-05

This section extends the supplied v1.1 Domain Model without deleting, compressing or replacing its existing domain definitions or future evolution.

The original domain model above remains preserved as the architectural foundation recorded on 2026-09-19.

## Current Phase 1 Clarifications

The following distinctions are now implemented and approved:

- `Artwork` remains the canonical individual artistic work.
- `ArtworkSeries` remains the canonical coherent body-of-work model.
- `/collections` is the editorial discovery experience for ArtworkSeries.
- `/series/[slug]` is the detailed curatorial experience for an ArtworkSeries.
- visitor-facing `Collection` remains editorial terminology and does not create a parallel canonical persistence model.
- optional `Artwork.seriesId` remains the current Phase 1 relationship.
- `coverArtworkId` remains the first representative-artwork mechanism to evaluate before another identifier is introduced.
- artistic lifecycle and publication lifecycle remain conceptually separate.

The future possibility of many-to-many Artwork ↔ ArtworkSeries membership remains preserved and should be introduced when a real curatorial requirement justifies it.

## Home Curation Clarification

For the current approved Home architecture:

- Hero references Artwork.
- Featured Artwork references Artwork.
- Featured Collection references ArtworkSeries.
- Selected Works presents individual Artwork records.

This clarification does not remove the broader HomeCuration concept or prevent future curation capabilities from evolving.

## Navigation Context Is Not Domain Identity

Series-aware Artwork navigation now preserves the visitor's curatorial context into Artwork Detail.

Example:

`/artworks/[slug]?series=[series-slug]`

The `series` query parameter represents navigation/presentation context.

It does not create another Artwork entity, another ArtworkSeries entity or another persistence relationship.

Likewise, the following current interaction states remain presentation concerns rather than business-domain entities:

- contextual lightbox mode;
- carousel position;
- kinetic scene position;
- trackpad / pointer interaction state;
- interaction onboarding state;
- responsive hero composition;
- atmospheric presentation state.

## Shared Interaction Systems Are Not New Business Domains

The current implementation includes shared interaction infrastructure such as:

`src/shared/ui/kinetic-carousel/`

with:

- `KineticCarousel.tsx`
- `useKineticCarousel.ts`
- `index.ts`

KineticCarousel is a reusable UI primitive. It does not create a `Carousel` business domain.

The contextual Artwork Lightbox and Artwork Detail kinetic navigation likewise consume canonical Artwork / ArtworkSeries data without creating duplicate business entities.

## Future Evolution Preservation

The future evolution already defined in this Domain Model remains valid.

Multiple artists, multiple languages, AI-assisted curation, Collector portal, international shipping, Museum expansion, mobile applications, Public API, CMS integration and other future capabilities are not removed because they are not part of the current Phase 1 implementation.

Future requirements may extend schemas, relationships, services and implementation details while preserving the canonical domain language.

The purpose of domain stability is to avoid unnecessary conceptual duplication, not to prohibit justified future evolution.

## Audit Note

This v1.2 update uses the conservative documentation method.

The complete supplied v1.1 Domain Model body is preserved above, apart from version and Last Updated metadata.

No existing domain, future capability or future architectural evolution has been deleted.

The appended update records subsequent Phase 1 decisions while preserving the original long-term domain direction.
