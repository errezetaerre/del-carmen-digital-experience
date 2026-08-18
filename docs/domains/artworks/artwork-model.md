# Artwork Model

Version: 1.0

Document ID:
DOC-AM

Project:
Del Carmen Digital Experience

Parent Brand:
Rō Visual

Document Type:
Domain Model

Authority Level:
High

Status:
🟢 Approved

Owner:
Del Carmen Digital Experience

Last Updated:
2026-08-18

---

# Purpose

This document defines the canonical artwork domain model for Del Carmen Digital Experience.

Its purpose is to establish a stable vocabulary and conceptual contract for artworks, artwork series, artwork images and Home curation before those concepts are implemented in application code, persistence or commerce infrastructure.

This document governs the meaning of artwork-domain concepts.

Implementation details may evolve.

The domain meaning defined here should remain stable unless an explicit architectural decision revises it.

---

# Core Principle

Artwork describes the artwork itself.

It does not describe where the artwork appears on the Home page, whether it is used as a featured editorial selection, whether prints exist, or how future commerce experiences sell reproductions or editions.

Artwork identity, editorial curation and commerce are separate concerns.

Conceptually:

Artwork
→ the artistic work

ArtworkSeries
→ a coherent artistic body containing related artworks

ArtworkImage
→ a visual representation of an artwork

HomeCuration
→ which artworks or series are presented in specific Home scenes

Product
→ a future commercial manifestation associated with an artwork

---

# Artwork

Artwork is the canonical entity representing one individual artistic work.

Canonical structure:

```text
Artwork
│
├── id
├── slug
├── title
├── year
│
├── authorship
├── context
├── medium
├── support
├── categories[]
├── seriesId?
│
├── dimensions
│   ├── width
│   ├── height
│   └── unit
│
├── images
│   ├── primary
│   ├── heroPortrait?
│   ├── heroLandscape?
│   └── thumbnail?
│
├── quote?
├── description?
│
├── availability
│
└── price?
    ├── amount
    └── currency
```

The model is intentionally extensible.

New fields should be introduced only when a real domain requirement exists.

---

# Identity

## id

Stable internal identifier for the artwork.

The ID should not depend on presentation context or Home placement.

Example:

```text
epifania_nupcial
yasemi_i
el_misionero
```

---

## slug

Stable URL-safe identifier used for public routing.

Example:

```text
epifania-nupcial
yasemi-i
el-misionero
```

Possible future routes:

```text
/artworks/epifania-nupcial
/artworks/yasemi-i
```

---

## title

Canonical public title of the artwork.

Examples:

```text
Epifanía Nupcial
Yasemi I
El Misionero
```

---

## year

Year associated with completion of the artwork.

Initial implementation uses a single year value.

More complex date ranges may be introduced later if a real requirement appears.

---

# Classification Model

Artwork classification is multidimensional.

The following concepts are intentionally separate:

```text
AUTHORSHIP
What is Del Carmen's authorship relationship to the work?

CONTEXT
In what context was the work created?

MEDIUM
With what artistic material or technique was it created?

SUPPORT
On what physical support was it created?

CATEGORIES
What genre, subject or conceptual territory describes it?

SERIES
Does it belong to a specific coherent artistic body?
```

These concepts must not be treated as synonyms.

---

# Authorship

`authorship` describes Del Carmen's authorship relationship to the work.

Initial canonical values:

```text
original
master-copy
study-after
```

## original

The work belongs to Del Carmen's authored artistic corpus.

An artwork may be original even when created in an academic context.

Example:

```text
authorship: original
context: academic-study
```

A still life painted from direct observation during formal training can therefore be both original and academic.

## master-copy

A deliberate close study or reproduction of an existing work by another artist.

This classification must remain visibly distinguishable from Del Carmen's original authored corpus.

## study-after

A study derived from another artist or artwork without necessarily attempting a complete faithful reproduction.

It may investigate composition, anatomy, lighting, color, gesture or another specific artistic problem.

---

# Context

`context` describes the circumstance or purpose in which the artwork was created.

Initial canonical values:

```text
independent
academic-study
commission
```

## independent

Created within Del Carmen's independent artistic practice.

## academic-study

Created as part of artistic training, formal study, technical investigation or academic exercise.

Academic context does not imply non-original authorship.

## commission

Created in response to a specific commission.

Exhibition participation is not a creation context.

Exhibitions belong to artwork history and editorial/content relationships.

---

# Medium

`medium` describes the principal artistic material or technique.

Initial vocabulary may include:

```text
oil
graphite
charcoal
mixed-media
```

The vocabulary is extensible when a real artwork requires another medium.

Medium must not include the support.

For example:

```text
medium: oil
support: canvas
```

is preferred over treating `oil-on-canvas` as a single medium value.

---

# Support

`support` describes the physical surface or support on which the artwork was created.

Initial vocabulary may include:

```text
canvas
paper
```

The vocabulary is extensible when required by the inventory.

---

# Categories

`categories` is a multi-value classification for artistic genre, subject and conceptual territory.

Examples may include:

```text
portrait
self-portrait
still-life
figurative
landscape
spiritual
mythological
symbolic
```

A single artwork may belong to multiple categories.

Example:

```text
categories:
- portrait
- spiritual
- symbolic
```

Avoid obvious semantic redundancy when a more specific category already communicates the broader concept.

For example, `self-portrait` does not necessarily require an additional `portrait` value.

Categories do not replace authorship, context, medium, support or series membership.

A named artistic series such as Yasemi must not be represented as a category.

---

# Series Membership

`seriesId` is an optional relationship from Artwork to ArtworkSeries.

Example:

```text
seriesId: yasemi
```

An artwork that does not belong to a series does not require this value.

Series membership must not be inferred from category names.

---

# Dimensions

Canonical initial structure:

```text
dimensions
├── width
├── height
└── unit
```

Example:

```text
95 × 113 cm
```

`depth` is intentionally deferred.

It may be introduced later if the inventory requires dimensional depth.

---

# ArtworkImage

ArtworkImage represents one visual representation of an Artwork.

Multiple images do not represent multiple artworks.

Canonical image structure:

```text
ArtworkImage
├── src
├── alt
├── width?
└── height?
```

`src` and `alt` are required.

`width` and `height` are optional metadata that may support image optimization, layout stability and future media infrastructure.

---

# Artwork Image Roles

Each Artwork contains an `images` structure with defined presentation roles.

```text
images
├── primary
├── heroPortrait?
├── heroLandscape?
└── thumbnail?
```

## primary

Required.

Primary is the canonical public representation of the artwork.

It is the default representation for the artwork itself and should preserve the work faithfully.

Primary is used by default for:

• Featured Work
• Artwork Lightbox
• Artwork Detail

It is also the fallback for other presentation roles when specialized derivatives do not exist.

## heroPortrait

Optional.

Editorial representation specifically prepared for portrait Hero compositions.

It may include composition, crop, negative space or atmospheric integration appropriate to the Hero while preserving the identity and integrity of the artwork.

## heroLandscape

Optional.

Editorial representation specifically prepared for landscape Hero compositions.

Hero Landscape is independent from Hero Portrait.

If the Primary representation already works correctly in landscape, a separate Hero Landscape asset is not required.

## thumbnail

Optional.

Optimized representation for compact gallery or collection contexts.

Initially, Featured Collection may use Primary when no Thumbnail exists.

A dedicated Thumbnail may be introduced later when a specific artwork requires a different crop, framing or optimization.

---

# Image Fallback Rules

Canonical presentation behavior:

```text
Hero Portrait
→ heroPortrait if available
→ otherwise primary

Hero Landscape
→ heroLandscape if available
→ otherwise primary

Featured Work
→ primary

Featured Collection
→ thumbnail if available
→ otherwise primary

Artwork Lightbox
→ primary

Artwork Detail
→ primary
```

Only Primary is mandatory.

Specialized image roles are optional extensions of the same Artwork.

---

# Image Accessibility

Every stored public image representation requires its own `alt` value.

Alt text should describe the represented artwork appropriately for the context and should not be omitted merely because another representation of the same artwork already contains alt text.

When two representations communicate essentially the same visual information, their alt text may remain semantically similar.

---

# Quote

`quote` is optional editorial language associated with an artwork.

It may be used in presentation contexts where a concise poetic or conceptual line supports the work.

Quote is not a classification value.

---

# Description

`description` is optional descriptive or interpretive text associated with the artwork.

The initial model uses one description field.

Short descriptions, long-form stories or richer editorial structures may be introduced later only if required.

---

# Availability

`availability` describes the commercial availability of the original physical artwork.

Initial canonical values:

```text
available
reserved
sold
```

Availability applies to the original artwork, not to future prints, reproductions or editions.

---

# Price

`price` is optional and represents the price associated with the original physical artwork.

Canonical structure:

```text
price
├── amount
└── currency
```

Initial currencies:

```text
USD
CRC
```

The price is preserved when an artwork becomes sold.

Therefore `availability` and `price` are independent concepts.

Example:

```text
availability: sold
price:
  amount: 6000
  currency: USD
```

The preserved price forms part of the artwork's commercial record.

Print prices, edition prices, reproductions, shipping, discounts and auction mechanics do not belong to Artwork.price.

They belong to future commerce entities.

---

# ArtworkSeries

ArtworkSeries is a separate entity representing a coherent artistic body, thematic investigation or intentionally related group of artworks.

A series does not replace its individual Artwork entities.

Each Artwork remains independently identifiable and may have its own metadata, media, availability and future commercial relationships.

Canonical structure:

```text
ArtworkSeries
│
├── id
├── slug
├── title
├── description?
├── statement?
├── coverArtworkId
├── status
├── yearStart?
└── yearEnd?
```

---

# ArtworkSeries Identity

## id

Stable internal identifier for the series.

Examples:

```text
yasemi
ninfas
```

## slug

URL-safe public identifier.

Possible future routes:

```text
/series/yasemi
/series/ninfas
```

## title

Canonical public title of the series.

---

# ArtworkSeries Description

`description` is optional concise editorial language suitable for previews, cards and introductory contexts.

---

# ArtworkSeries Statement

`statement` is optional long-form curatorial or conceptual writing explaining the artistic body in greater depth.

Description and statement are intentionally distinct because they serve different editorial depths.

---

# ArtworkSeries Cover

`coverArtworkId` references the Artwork used to visually represent the series.

The series does not require a duplicate cover image by default.

The cover may use the selected Artwork's appropriate public image representation.

Dedicated series-specific media may be introduced later if a real curatorial requirement appears.

---

# ArtworkSeries Membership

ArtworkSeries does not initially store a duplicated `artworkIds[]` list.

Membership is derived from each Artwork's `seriesId`.

Conceptually:

```text
Artwork.seriesId = yasemi
```

allows the system to retrieve all artworks belonging to Yasemi.

This avoids maintaining the same relationship manually in two places.

If a future series requires an explicit curatorial ordering that cannot be derived naturally, an ordering mechanism may be introduced then.

---

# ArtworkSeries Status

Initial canonical values:

```text
ongoing
completed
archived
```

Status describes the lifecycle of the artistic series.

It does not describe whether individual artworks are available for purchase.

---

# ArtworkSeries Years

`yearStart` and `yearEnd` are optional.

They may be used when a series has a meaningful chronological span.

They are not mandatory because individual Artwork records already contain their own year values.

---

# Series Example

Conceptually:

```text
ArtworkSeries
Yasemi

coverArtworkId:
yasemi_i

status:
ongoing
```

Individual works:

```text
Yasemi I
seriesId: yasemi

Yasemi II
seriesId: yasemi

Yasemi III
seriesId: yasemi

Yasemi IV
seriesId: yasemi

Yasemi V
seriesId: yasemi
```

The system derives the membership of Yasemi from those Artwork relationships.

---

# Series vs Category

Series and category are not interchangeable.

Example:

```text
Yasemi
→ ArtworkSeries

portrait
→ category

spiritual
→ category
```

A series is a named coherent artistic body.

A category is reusable classification vocabulary that may apply to unrelated artworks and multiple series.

---

# Series vs Curatorial Collection

ArtworkSeries is also distinct from a general curatorial collection.

For example:

```text
Yasemi
```

may be an ArtworkSeries because the works were conceived as one coherent artistic body.

A future selection such as:

```text
Selected Works 2026
```

could combine unrelated artworks from multiple series and therefore represent a different curatorial concept.

That broader collection model is deferred until required.

---

# HomeCuration

HomeCuration describes what the Home page presents and where it presents it.

It must remain separate from Artwork identity.

Canonical conceptual structure:

```text
HomeCuration
│
├── hero
│   └── artworkId
│
├── featuredWork
│   └── artworkId
│
└── featuredCollection[]
    ├── Artwork reference
    └── ArtworkSeries reference
```

---

# Hero Curation

Hero references one individual Artwork.

Example:

```text
hero:
  artworkId: epifania_nupcial
```

HomeCuration does not store Hero image paths.

The presentation layer resolves the appropriate representation from the Artwork:

```text
Portrait
→ heroPortrait if available
→ otherwise primary

Landscape
→ heroLandscape if available
→ otherwise primary
```

---

# Featured Work Curation

Featured Work references one individual Artwork.

Example:

```text
featuredWork:
  artworkId: sendero_del_sol
```

Featured Work uses the Artwork's Primary representation.

Hero and Featured Work may reference different artworks to avoid unnecessary repetition.

The architecture does not prohibit intentional reuse of the same artwork when curatorial intent requires it.

---

# Featured Collection Curation

Featured Collection is an ordered editorial selection.

Each entry may reference either:

• an individual Artwork
• an ArtworkSeries

Conceptual example:

```text
featuredCollection:
- type: series
  id: yasemi

- type: artwork
  id: el_misionero

- type: series
  id: ninfas
```

The array order defines presentation order.

Additional numeric ordering metadata is not required initially.

---

# Featured Collection Artwork Entries

When an entry references an Artwork:

```text
type: artwork
```

presentation uses:

```text
thumbnail if available
otherwise primary
```

The artwork metadata is resolved from the canonical Artwork record.

HomeCuration must not duplicate title, image, year or other artwork metadata.

---

# Featured Collection Series Entries

When an entry references an ArtworkSeries:

```text
type: series
```

presentation resolves the ArtworkSeries and its `coverArtworkId`.

The system may then use the cover Artwork's appropriate public image representation.

Series metadata must be resolved from ArtworkSeries rather than duplicated in HomeCuration.

---

# HomeCuration Principle

HomeCuration stores references, not duplicated artwork content.

Avoid structures such as:

```text
isHero
isFeatured
isHome
isCollectionFeatured
```

inside Artwork.

Home placement is editorial state, not an intrinsic property of an artwork.

This allows Home curation to change without modifying canonical Artwork records.

---

# Artwork vs Commerce

Artwork and Product are separate concepts.

Artwork describes the artistic work.

Product describes something that can be transacted.

Future commercial entities may include:

• Original artwork product relationships
• Prints
• Limited editions
• Reproductions
• Product variants
• Auction participation

These must reference Artwork without redefining its artistic classification.

One Artwork may exist without any Product.

One Artwork may eventually relate to multiple Products.

Print and Edition persistence models are intentionally deferred to the commerce phase.

---

# Artwork vs Editorial Content

Artwork is also distinct from editorial and historical content.

Future entities such as:

• Exhibition
• Award
• JournalEntry
• Creative Process Story
• Interview

may reference Artwork or ArtworkSeries.

They must not be represented as artwork categories merely because an artwork participated in them.

For example, exhibition participation belongs to exhibition history, not `context`.

---

# Deferred Extensions

The following concepts are intentionally not part of the initial canonical Artwork model:

• depth
• inventoryCode
• signature metadata
• physical location
• provenance structure
• ownership history structure
• exhibition history structure
• conservation metadata
• focal point / crop metadata
• photographer / image credit metadata
• dedicated series media
• print configuration
• edition configuration
• auction configuration

These may be introduced later when a concrete requirement exists.

Their absence from Version 1.0 is intentional and does not prohibit future extension.

---

# Canonical Examples

## Original Independent Artwork

```text
Epifanía Nupcial

authorship: original
context: independent
medium: oil
support: canvas
categories:
- portrait
- spiritual
- symbolic
seriesId: none
year: 2025
dimensions: 95 × 113 cm
availability: available
```

---

## Original Academic Artwork

```text
Bodegón de estudio

authorship: original
context: academic-study
medium: oil
support: canvas
categories:
- still-life
```

This demonstrates that original authorship and academic context can coexist.

---

## Master Copy

```text
Study after Bouguereau

authorship: master-copy
context: academic-study
medium: oil
support: canvas
categories:
- figurative
```

The presentation layer should clearly distinguish this work from Del Carmen's original authored corpus.

---

## Series Artwork

```text
Yasemi III

authorship: original
context: independent
medium: oil
support: canvas
categories:
- portrait
- symbolic
seriesId: yasemi
```

---

# Data Integrity Rules

The following rules are canonical:

1. Every Artwork has one stable `id`.
2. Every Artwork has one stable `slug`.
3. Every Artwork has one canonical `title`.
4. Authorship and creation context remain separate.
5. Medium and support remain separate.
6. Categories are multi-value and reusable.
7. Series membership is optional.
8. Series membership is derived from `Artwork.seriesId` rather than duplicated through an initial `artworkIds[]` field.
9. Every Artwork has a Primary image.
10. Every stored public image representation has alt text.
11. Hero Portrait, Hero Landscape and Thumbnail are optional.
12. Specialized image representations fall back to Primary according to the approved fallback rules.
13. Price refers to the original artwork and is preserved after sale.
14. Availability and price remain independent.
15. Home placement is controlled by HomeCuration, not Artwork booleans.
16. Featured Collection may reference Artwork or ArtworkSeries.
17. HomeCuration stores references rather than duplicated artwork metadata.
18. Prints and editions belong to future commerce entities, not Artwork classification.
19. Exhibitions, awards and editorial stories reference artworks but do not become artwork categories by default.
20. New fields and vocabulary values are added only when a real domain requirement exists.

---

# Implementation Boundary

This document defines the canonical domain model.

It does not yet define:

• the final TypeScript interface implementation
• Prisma schema
• database table names
• API contracts
• CMS schemas
• persistence strategy
• migration strategy

Implementation must follow this model rather than redefining it for convenience.

The next implementation step is to align the current artwork TypeScript model and `src/domains/artworks/data/artworks.ts` with this approved contract.

---

# Final Principle

The artwork is the source of truth for its artistic identity.

The series provides artistic context.

The image provides a visual representation.

Home curation determines editorial placement.

Commerce determines transaction.

These responsibilities must remain separate so Del Carmen Digital Experience can grow without compromising the integrity of the artwork domain.
