# Del Carmen Digital Experience --- Home Specification

Version: 1.3

Document ID: DOC-HS

Project: Del Carmen Digital Experience

Parent Brand: Rō Visual

Document Type: Specification

Authority Level: High

Status: 🟢 Approved

Owner: Del Carmen Digital Experience

Last Updated: 2026-08-17

------------------------------------------------------------------------

# 1. Objective

The Home page is not designed to sell paintings immediately.

Its purpose is to make visitors slow down.

The experience should feel calm, editorial, refined and timeless.

The visitor should feel that they have entered an art institution rather
than an online store.

Every interaction must reinforce contemplation.

The artwork is always the protagonist.

The interface should almost disappear.

------------------------------------------------------------------------

# 2. Overall Experience

The page behaves like walking through an exhibition.

Every section has generous breathing room.

Nothing appears rushed.

Scrolling feels slow and elegant.

The visitor should naturally continue scrolling because curiosity grows.

The experience must feel:

• Human

• Silent

• Editorial

• Warm

• Timeless

• Emotional

Never:

• Commercial

• Aggressive

• Busy

• Loud

• Flashy

------------------------------------------------------------------------

## Implementation Status Language

This specification distinguishes between two states:

**Implemented / Canonical**

A decision already represented in the current Home implementation and
approved as part of the living system.

**Approved Direction / Planned**

A decision approved conceptually but not yet required to exist in the
current implementation.

Planned behavior must not be treated as already implemented.

This distinction is especially important for advanced motion,
ParticleField behavior, future navigation states and later platform
modules.

------------------------------------------------------------------------

# 3. Layout Structure

The homepage is composed of seven sequential scenes.

Instead of sections, every block is called a Scene.

Scene 01

Arrival

↓

Scene 02

Featured Artwork

↓

Scene 03

Artist Statement

↓

Scene 04

Collection

↓

Scene 05

Journal

↓

Scene 06

Invitation

↓

Footer

------------------------------------------------------------------------

# 4. Scene 01 --- Arrival (Hero)

Height

Desktop / Tablet

Immersive viewport-scale composition using a minimum screen-height
treatment.

Mobile

The Hero may extend naturally beyond the viewport when required by the
single-column composition.

The artwork and narrative must never be compressed merely to force an
exact 100vh height.

------------------------------------------------------------------------

## Composition

Desktop

Left side

Editorial content

Right side

Artwork

Artwork occupies approximately 58--62% of the screen.

Content occupies approximately 38--42%.

------------------------------------------------------------------------

## Responsive Composition

Desktop

Editorial composition.

Tablet

Artwork remains visually dominant and the information block adapts to
the available horizontal space.

Mobile

Single-column composition.

Artwork appears before the artwork information.

Nothing should feel compressed.

------------------------------------------------------------------------

## Content Hierarchy

Brand

↓

Tagline

↓

Primary CTA

↓

Scroll Indicator

Artwork-specific information remains visually associated with the
artwork rather than the primary brand block.

------------------------------------------------------------------------

## Brand

DEL CARMEN

Painting the Eternal Essence Within

Rō Visual remains the parent brand at the platform and governance level,
but the current Hero does not require the visible phrase "by Rō Visual".

The Del Carmen identity may be represented through approved brand
imagery where appropriate.

The artist signature is treated as visual artwork/identity rather than
ordinary body text.

------------------------------------------------------------------------

## Featured Artwork Information

The artwork information belongs visually to the artwork rather than the
primary brand block.

Content includes:

Featured artwork title

Quote

Technique

Year

Dimensions

The quote is associated directly with the featured artwork.

Example:

"She wears no veil, only silence."

------------------------------------------------------------------------

## CTA

Primary CTA:

Explore Collection

The Hero CTA is an exploration action. It leads toward the broader Collection / Artworks experience rather than the detail page of the Hero artwork.

The artwork presented in the Hero is selected curatorially and is not required to be the same artwork selected for Scene 02 --- Featured Artwork.

A Hero artwork may use a context-specific visual representation optimized for the composition, including portrait or landscape Hero imagery, while remaining the same canonical Artwork entity.

CTA uses the shared LinkButton system and follows the established
minimal underline language.

------------------------------------------------------------------------

# 5. Hero Behaviour

Current canonical behavior:

No sliders.

No carousel.

No autoplay.

No background video.

The artwork remains the visual anchor.

Motion must remain subordinate to the artwork.

HeroAtmosphere and HeroLighting currently remain available as
scene-specific layers and may be intentionally minimal or inactive until
the approved motion pass.

Future GSAP or atmospheric motion may be introduced only when it
reinforces contemplation and preserves artwork dominance.

------------------------------------------------------------------------

# 6. Scroll Behaviour

Scroll remains natural and user-controlled.

Nothing should jump.

No forced scrolling.

No mandatory scroll snap.

Approved motion direction may include gentle scene reveals using opacity
and small vertical displacement.

Such reveal behavior is planned motion language and must not be treated
as mandatory until implemented.

Canonical motion tokens are:

Fast

300ms

Medium

500ms

Slow

700ms

Animation must respect reduced-motion preferences.

------------------------------------------------------------------------

# 7. Navigation

Navigation is integrated with the Hero and follows the dark
institutional visual language.

Current implementation should remain visually restrained and preserve
artwork dominance.

Transparent or near-transparent treatment over the Hero is preferred
where composition permits.

A future scrolled state may introduce subtle background separation and
blur if usability requires it.

Do not introduce a light Smoke Ivory navigation state by default.

Exact navigation height may remain component-specific unless promoted to
a shared layout token.

Navigation:

Footer navigation uses simple typographic links without decorative
underline treatments.

Artworks

Collections

About

Journal

Contact

Language

EN

------------------------------------------------------------------------

## Desktop / Tablet Navigation

Navigation links remain visible.

The navigation uses the shared visual language of restrained typography,
spacing and muted color.

------------------------------------------------------------------------

## Mobile Navigation

Desktop navigation is replaced by a three-line menu trigger.

The Mobile Menu opens as a solid immersive navigation layer.

The background must not reveal the page underneath.

The menu uses a dark smoke / near-black visual environment.

Navigation items remain highly legible.

Selected / hovered items use a restrained gold treatment.

------------------------------------------------------------------------

## Mobile Particle Interaction --- Approved Direction / Planned

The approved Mobile Menu direction may contain a reusable ParticleField
visual system.

ParticleField must not be treated as already implemented solely because
it is specified here.

Particles:

• Gold

• Silver / Platinum

Particles float subtly throughout the background.

When a navigation item is selected or hovered, particles may converge
toward the item's perimeter.

When the interaction ends, the particles gradually return to their
previous floating state.

Particles may shimmer or glow softly.

The effect must remain atmospheric and refined.

It must never become cosmic, flashy or visually dominant.

The particles are a supporting interaction layer, not the primary visual
element.

------------------------------------------------------------------------

# 8. Typography

Headings

Cormorant Garamond

Elegant editorial serif

High contrast

Expressive but restrained

Body / Interface

Geist

Modern sans serif

Neutral

Readable

Quiet

------------------------------------------------------------------------

## Hierarchy

Typography is responsive and composition-aware rather than governed by
one rigid universal pixel scale.

Display / Hero

Large responsive Cormorant Garamond typography

Section headings

Approximately 36--60px depending on viewport and composition

Editorial subheadings

Approximately 24--36px

Body

Approximately 14--20px depending on context

Labels / Metadata / Interface

Approximately 10--14px

Navigation

Geist

Uppercase where appropriate

Canonical navigation tracking

0.12em

Repeated typographic behavior should consume the canonical Design Tokens
defined in DOC-DT.

------------------------------------------------------------------------

# 9. Colors

The current Home is a dark institutional experience.

Primary Background

#0B0B0B

Deep Surface

#090908

Primary Text

#F5F5F5

Muted Text

#A1A1AA

Muted Bronze

#A27B48

Primary Gold

#C9A35A

Smoke Ivory

#F4F1EC

Smoke Ivory remains available for future light editorial contexts but is
not the primary Home background.

The artwork remains the most colorful element.

Primary Gold identifies selected visual focal points.

Muted Bronze primarily supports interaction and secondary emphasis.

Gold and silver/platinum particles remain reserved for approved
atmospheric interaction.

Canonical color authority is DOC-DT and the implementation in
src/app/globals.css.

------------------------------------------------------------------------

# 10. White Space

This is one of the core principles.

Every scene breathes, but breathing room must be intentional rather than
excessive.

Canonical semantic vertical rhythm:

Compact

64px

Default

96px

Generous

96px mobile

112px tablet

128px desktop

Canonical responsive page gutters:

Mobile

24px

Tablet

40px

Desktop

64px

Large Desktop

80px

These values are controlled globally through DOC-DT and
src/app/globals.css.

Scene-specific spacing may remain local when required by an approved
composition.

The experience must never feel compressed, but excessive empty space
should not interrupt narrative continuity.

------------------------------------------------------------------------

# 11. Images

Always large.

Never inside generic cards when presenting primary artwork.

Never rounded corners for primary artwork presentation.

No unnecessary shadows.

Museum presentation.

Images should preserve their intended composition.

Photography used in editorial sections such as Journal may retain its
native aspect ratio when appropriate.

Images must never be cropped merely to force an arbitrary aspect ratio
when doing so damages the composition.

Each canonical Artwork owns its visual representations. Context-specific image assets do not create duplicate Artwork entities.

Approved image roles may include:

Primary

Hero Portrait

Hero Landscape

Thumbnail

Primary is the canonical artwork representation and should be reused whenever a specialized representation is unnecessary.

Hero Portrait and Hero Landscape exist only when the Hero composition requires a distinct crop, negative space, atmospheric integration or responsive treatment. A missing specialized Hero representation falls back to Primary.

Every artwork image representation requires appropriate alt text.

------------------------------------------------------------------------

# 12. Buttons and Links

The project uses the shared LinkButton component.

Primary visual language:

Minimal.

Underline-based.

Muted Bronze / Brand Gold accent.

Gradient underline may transition from the accent color toward
transparency.

Hover interaction may increase:

• opacity

• line intensity

• line thickness

• visual presence

without becoming aggressive.

No heavy button backgrounds unless specifically required by a future
component.

------------------------------------------------------------------------

# 13. Animation Principles

Animation exists to reinforce silence.

Never to impress.

Allowed:

Fade

Parallax

Opacity

Scale 1.00 → 1.02

Subtle glow

Soft particle movement

Particle convergence

Particle return

Not allowed:

Bounce

Elastic

Rotation

3D flips

Floating effects that compete with artwork

Typing animation

Excessive particle effects

Animation must always remain subordinate to contemplation.

------------------------------------------------------------------------

# 14. Responsive Behaviour

Desktop

Editorial layout.

Tablet

Artwork first when necessary.

Content may stack below or reposition according to available space.

Mobile

Single column.

Large artwork.

Comfortable typography.

Mobile navigation replaces desktop navigation.

Nothing should feel compressed.

No horizontal scrolling.

------------------------------------------------------------------------

# 15. Accessibility

Contrast:

AA minimum

Keyboard navigation:

Required

Animations:

Reduced motion supported

Alt text:

Required

Interactive navigation must expose appropriate accessible labels and
states.

------------------------------------------------------------------------

# 16. Scene 02 --- Featured Artwork

Purpose:

Allow the visitor to contemplate one artwork before seeing the
collection.

Composition:

Artwork

Title

Story excerpt

Read / Discover action

Artwork occupies approximately 70% of section height.

No secondary artworks.

Primary artwork presentation remains dominant.

No prices are required in this scene.

Featured Artwork is a curatorial selection of one individual Artwork. It is not a collection or series preview.

The Featured Artwork is not required to be the same Artwork used in the Hero. Repetition is permitted only when curatorially intentional.

Its Discover action leads to the detail experience for that specific Artwork, rather than to the general Collection landing page.

The scene normally uses the Artwork Primary image representation. A Hero-specific representation must not be reused here merely because the same Artwork appears in the Hero.

------------------------------------------------------------------------

# 17. Scene 03 --- Artist Statement

Two-column composition.

Portrait / Image

↓

Artist Statement

↓

Signature

↓

Read More

Layout:

40% Image

60% Text

------------------------------------------------------------------------

## Current Artist Statement

Title:

El arte como memoria eterna

Body:

"My works are born from a vow to the sky, to portray the beauties that
the soul recognizes, but the world has forgotten."

"I paint to awaken consciousness, to remind us that what is essential
cannot be seen, but can be felt."

Signature:

Rolando Del Carmen

The artist signature may be represented using the approved signature
image asset.

CTA:

Know My Story

The current implementation uses the approved artist image asset and
approved signature image asset.

The Artist Statement precedes the Collection in the canonical Home
narrative.

------------------------------------------------------------------------

# 18. Scene 04 --- Collection

Purpose:

Expand from the artist's philosophy into the broader pictorial universe.

Current composition:

Editorial introduction

↓

Artwork preview grid

The editorial heading is:

Works that speak in silence

Responsive heading behavior:

Desktop

Two intentional lines:

Works that speak in silence

Tablet / Mobile

Single line when available space permits.

Current artwork preview grid:

Mobile

2 columns

Tablet and above

4 columns

The collection preview may expose artwork metadata through the
CollectionArtwork component according to the approved component design.

The Home Collection is a curated preview of the broader Del Carmen pictorial universe. It is not required to reproduce the complete artwork inventory.

A Collection entry may represent either:

• an individual Artwork

• an ArtworkSeries

An ArtworkSeries is a curatorial body of related individual artworks sharing a coherent thematic, conceptual or visual relationship. Examples may include Yasemi or Ninfas.

When a Collection entry represents an individual Artwork, interaction may open or navigate to that Artwork's individual viewing/detail experience.

When a Collection entry represents an ArtworkSeries, interaction leads to the Series experience, where the visitor can discover the works belonging to that Series and then inspect each Artwork individually.

A Series preview uses a curatorially selected cover Artwork or cover image and must not require every work in the Series to appear directly on the Home page.

Technique alone does not define an ArtworkSeries. Oil, graphite, charcoal and other media remain artwork metadata and may later support Collection filtering or discovery.

Original authorial works, academic studies and master studies may coexist in the broader artwork system but must remain clearly identified by canonical artwork metadata.

No prices are required in the Home collection preview.

Primary CTA:

View the collection →

The Collection uses the Deep Surface token to create subtle scene
differentiation without breaking the dark institutional environment.

------------------------------------------------------------------------

# 19. Scene 05 --- Journal

Editorial style.

Three articles maximum.

Large images.

Minimal metadata.

Photography should preserve its native composition when possible.

Editorial links use the shared LinkButton system.

Journal entries alternate editorial image/text composition on large
screens.

The Journal uses the canonical generous section rhythm.

Editorial links use the shared LinkButton system with the approved
underline language.

Interaction remains subtle and subordinate to the content.

------------------------------------------------------------------------

# 20. Scene 06 --- Invitation

Purpose:

Create an emotional closing and invite the visitor to continue the
relationship with the artist.

Primary closing statement:

Painting the Eternal Essence Within

Supporting statement:

Let's continue the journey.

------------------------------------------------------------------------

## Newsletter

Label:

Newsletter

Description:

"Receive occasional news about upcoming artworks, exhibitions, and the
evolving world of Rolando Del Carmen's art."

Primary action:

Subscribe

The wording "Subscribe" is intentional.

It refers to receiving editorial/newsletter communication and must not
be confused with account registration.

------------------------------------------------------------------------

## Contact

Secondary action:

Contact

Subscribe and Contact appear side by side on the Invitation scene.

Both use the shared LinkButton visual system.

The Invitation uses the Primary Background and canonical generous
section rhythm.

------------------------------------------------------------------------

# 21. Footer

The Footer is the final, quiet closing element of the Home experience.

It must have minimal visual weight.

The Footer uses the Primary Background and retains footer-specific
internal spacing rather than inheriting the generic scene rhythm.

------------------------------------------------------------------------

## Desktop Composition

Left side:

Del Carmen

by Rō Visual

Navigation:

Artworks

Collections

About

Journal

Contact

Right side:

Rolando Del Carmen

Costa Rica

Social media icons

Language

EN

Privacy

Terms

------------------------------------------------------------------------

## Footer Bottom

The copyright line is centered horizontally across the page.

Copyright:

© 2026 Del Carmen --- Rō Visual

All rights reserved.

The phrase is written naturally as:

All rights reserved.

------------------------------------------------------------------------

## Footer Social Media

Social media icons are monochromatic and implemented as inline SVG so
their geometry can inherit the interface color correctly.

They should not use the native colors of each social platform.

Default state uses a restrained white / gray treatment.

Hover state may transition subtly toward Brand Gold and may include a
restrained glow.

The original SVG geometry may be filled when that is intrinsic to the
icon design; "minimal" does not require every icon to be stroke-only.

Initial social platforms may include:

Instagram

Facebook

YouTube

Additional platforms may be added later.

------------------------------------------------------------------------

## Footer Legal

Privacy

Terms

Additional legal policies may be introduced when future functionality
requires them.

Do not add unnecessary legal links before they are required.

------------------------------------------------------------------------

## Footer Location

Public artist location:

Costa Rica

A full physical address is not displayed in the Home Footer.

------------------------------------------------------------------------

## Mobile Footer

The Footer becomes a vertical composition.

Order:

Identity

Navigation

Social

Language

Artist / Location

Privacy / Terms

Copyright

The Footer must preserve generous spacing and remain visually quiet.

------------------------------------------------------------------------

# 22. Components and Systems

The following list contains both current canonical components and
approved future systems.

A component's presence in this list does not by itself mean it is
already implemented.

Current / Canonical:

Hero

Navigation

Navigation

Footer

CTA / LinkButton

ArtworkImage

ArtworkFrame

Social Links

Typography System

Spacing System

Approved Direction / Planned as required:

Mobile Menu

ParticleField

Section Title

Artwork Card

Quote Block

Language Selector

------------------------------------------------------------------------

# 23. Future Ready

This homepage must support future modules without redesign.

Virtual Museum

Artist Platform

Marketplace

Online Academy

Collector Dashboard

Private Collections

Artwork Series

Artwork Detail Experiences

Curatorial Home Configuration

Because of this, every section should be built as an independent
component.

------------------------------------------------------------------------

# 24. Architecture Principle

Every approved Home scene must remain modular and independently
maintainable.

Approved sections must not be redesigned without an explicit reason or
request.

Shared UI components should be reused whenever an established visual
behavior already exists.

Global layout behavior should use the shared Container primitive.

Repeated visual values should consume the canonical Design Tokens.

Scene-specific composition may retain local values when those values are
deliberate and not globally reusable.

Artwork identity and Home placement are separate concerns. Artwork data defines what an artwork is; Home curation defines where selected artworks or series appear in the current Home experience.

Hero selection, Featured Artwork selection and Featured Collection selection must therefore be treated as curatorial configuration rather than permanent intrinsic properties of an Artwork whenever the architecture supports that separation.

An Artwork remains a single canonical entity even when multiple image representations are required for different presentation contexts.

Examples:

LinkButton

ArtworkImage

ArtworkFrame

ParticleField

------------------------------------------------------------------------

# 25. Current Home Surface Strategy

Hero

Scene-specific immersive background treatment

↓

Featured Artwork

Primary Background

↓

Artist Statement

Inherits Primary Background

↓

Collection

Deep Surface

↓

Journal

Primary Background

Generous Section Rhythm

↓

Invitation / Newsletter

Primary Background

Generous Section Rhythm

↓

Footer

Primary Background

Footer-specific internal rhythm

------------------------------------------------------------------------

# 26. Golden Rule

**\*\*If any new feature competes with the artwork, the artwork always
wins.\*\***

------------------------------------------------------------------------

# 27. Canonical Status

All decisions contained in this document represent the approved Home
experience as of Version 1.3.

The canonical Home order is:

01 --- Hero / Arrival

02 --- Featured Artwork

03 --- Artist Statement

04 --- Collection

05 --- Journal

06 --- Invitation / Newsletter

07 --- Footer

Implemented behavior and approved future direction must remain
distinguishable.

Future modifications must be explicitly approved before becoming
canonical.

**\*\*Del Carmen Digital Experience --- Every approved decision becomes
part of the living system.\*\***
