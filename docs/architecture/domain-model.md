architecture/domain-model.md
Version: 1.1
Document ID: DOC-DM
Project: Del Carmen Digital Experience
Parent Brand: Rō Visual
Document Type: Technical
Authority Level: Highest
Status: 🟢 Approved
Owner: Del Carmen Digital Experience
Last Updated: 2026-09-19
 
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

