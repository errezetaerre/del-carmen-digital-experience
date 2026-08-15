# Del Carmen Digital Experience --- Home Wireframe

Version: 1.2

Document ID:

DOC-HW

Project:

Del Carmen Digital Experience

Parent Brand:

Rō Visual

Document Type:

Specification

Authority Level:

High

Status:

🟢 Approved

Owner:

Del Carmen Digital Experience

Last Updated:

2026-08-09

------------------------------------------------------------------------

# Purpose

This document defines the architectural composition of the Home page.

It does not define aesthetics.

It defines spatial relationships, proportions, visual hierarchy and user
flow.

Every section is designed as an independent React component.

------------------------------------------------------------------------

# Global Grid

The Home uses the shared Container primitive as the canonical horizontal
layout system.

Default Content Width:

1280px / 80rem

Wide Content Width:

1440px / 90rem

Responsive Page Gutters:

Mobile

24px

Tablet --- 768px+

40px

Desktop --- 1024px+

64px

Large Desktop --- 1280px+

80px

Grid logic remains compositional:

Desktop

12-column reference

Tablet

8-column reference

Mobile

4-column reference

These column counts are guides rather than rigid templates.

Approved scenes may use asymmetric fractional compositions such as 34/66
or 38/62 when the artwork or editorial hierarchy requires it.

  ------------
  \# Vertical
  Rhythm
  ------------
  \# HOME
  STRUCTURE

  \`\`\`text

  NAVIGATION

  │

  ├── Scene 01
  --- Arrival

  │

  ├── Scene 02
  --- Featured
  Artwork

  │

  ├── Scene 03
  --- Artist
  Statement

  │

  ├── Scene 04
  ---
  Collection

  │

  ├── Scene 05
  --- Journal

  │

  ├── Scene 06
  ---
  Invitation

  │

  └── FOOTER
  ------------

Scene 01

Arrival

Height:

100vh

------------------------------------------------------------------------

Composition

Desktop:

┌──────────────────────────────────────────────┐

Navigation

───────────────────────────────────────────────

      Left 40%              Right 60%

DEL CARMEN

by Rō Visual

Painting the

Eternal Essence

Within

                         Painting



                         Painting



                         Painting



              Artwork Information



              Scroll Indicator

└──────────────────────────────────────────────┘

Rules:

Artwork occupies visual dominance.

Text block remains vertically centered.

Nothing touches screen edges.

Large negative space.

------------------------------------------------------------------------

Mobile

┌──────────────────────────────┐

        ☰ Navigation

──────────────────────────────

        DEL CARMEN



        by Rō Visual



        Painting the

        Eternal Essence

        Within

          Artwork

          Artwork

      Artwork Information

          CTA



          ↓

└──────────────────────────────┘

Artwork appears before the artwork information.

------------------------------------------------------------------------

Navigation

Desktop / Tablet

DEL CARMEN

by Rō Visual

Artworks Collections About Journal Contact

EN

Navigation remains sticky.

Initial:

Transparent.

After scroll:

Smoke Ivory background.

Subtle blur.

72px height.

------------------------------------------------------------------------

Mobile

Desktop navigation is replaced by:

☰

Opening the menu produces a solid immersive navigation layer.

┌──────────────────────────────┐

DEL CARMEN ×

Artworks

Collections

About

Journal

Contact

EN

└──────────────────────────────┘

The page underneath must not remain visually exposed.

------------------------------------------------------------------------

Mobile Particle System --- Approved Direction / Planned

ParticleField is an approved future reusable visual layer.

Its presence in this wireframe does not mean it is currently
implemented.

Particles:

Gold

Silver / Platinum

Default behavior:

Particles float gently throughout the background.

Interaction:

Floating particles

       ↓

Navigation item selected

       ↓

Particles converge toward item

       ↓

Soft glow / shimmer

       ↓

Interaction ends

       ↓

Particles gradually return

       ↓

Normal floating state

Particles must remain subtle.

------------------------------------------------------------------------

Scene 02

Featured Artwork

Purpose:

Allow the visitor to contemplate one artwork before seeing the
collection.

──────────────────────────────────

Featured Work

Artwork Title

        Artwork

Technique · Year

Story excerpt

Discover the work →

──────────────────────────────────

Artwork occupies approximately 70% of section height.

No secondary artworks.

------------------------------------------------------------------------

Scene 03

Artist Statement

Two-column editorial composition on tablet / desktop.

Desktop reference:

┌──────────────────────────────────────────────┐ │ │ │ Artist Portrait
Artist Statement │ │ El arte como │ │ memoria eterna │ │ Body copy │ │
Signature │ │ Conoce mi historia → │ │ │
└──────────────────────────────────────────────┘

Current grid:

Tablet

3 / 5 columns within an 8-column composition

Desktop

5 / 7 columns within a 12-column composition

The current implementation uses the approved artist portrait asset.

The approved signature is represented using the signature image asset.

The Artist Statement appears before the Collection in the canonical Home
narrative.

Mobile:

Single-column composition.

Portrait and statement stack vertically.

  ------------------------------------------
  Scene 04
  ------------------------------------------
  Scene 05

  Journal

  Editorial composition.

  Maximum:

  3 articles.

  Current large-screen composition
  alternates image and editorial text
  placement between entries.

  The section uses the canonical Generous
  vertical rhythm.

  ────────────────────────────────────────

  Journal

  ────────────────────────────────────────

  Image

  Article Title

  Minimal metadata

  Read Journal →

  ────────────────────────────────────────

  Image

  Article Title

  Minimal metadata

  Read Journal →

  ────────────────────────────────────────

  Image

  Article Title

  Minimal metadata

  Read Journal →

  ────────────────────────────────────────
  ------------------------------------------

Image Behaviour

Journal photography preserves its native aspect ratio when possible.

Images must not be cropped simply to force a fixed horizontal aspect
ratio.

The current editorial image set includes photography with different
native proportions.

------------------------------------------------------------------------

Link Behaviour

Journal links use the shared LinkButton component.

Primary behavior:

Shared LinkButton editorial underline language.

Hover:

Subtle increase in emphasis only.

------------------------------------------------------------------------

Scene 06

Invitation

Large breathing space.

────────────────────────────────────────

        Del Carmen

        Painting the Eternal

        Essence Within

        Let's continue

        the journey.

        Newsletter



        Receive occasional news about

        upcoming artworks, exhibitions,

        and the evolving world of

        Rolando Del Carmen's art.

        Subscribe        Contact

────────────────────────────────────────

Subscribe and Contact appear side by side.

The section uses the Primary Background and canonical Generous vertical
rhythm.

------------------------------------------------------------------------

Scene 07

Footer

The Footer closes the Home experience quietly.

It uses the Primary Background and footer-specific internal spacing.

------------------------------------------------------------------------

Desktop

────────────────────────────────────────────────────────────

DEL CARMEN Rolando Del Carmen

by Rō Visual Costa Rica

Artworks Instagram

Collections Facebook

About YouTube

Journal

Contact EN

                                                 Privacy

                                                 Terms

© 2026 Del Carmen --- Rō Visual

All rights reserved.

────────────────────────────────────────────────────────────

------------------------------------------------------------------------

Footer Structure

Left:

Identity

Navigation

Right:

Artist

Location

Social

Language

Legal

Bottom:

Centered copyright / rights line

------------------------------------------------------------------------

Footer Mobile

──────────────────────────────

DEL CARMEN

by Rō Visual

Artworks

Collections

About

Journal

Contact

Instagram Facebook YouTube

EN

Rolando Del Carmen

Costa Rica

Privacy Terms

© 2026 Del Carmen --- Rō Visual

All rights reserved.

──────────────────────────────

------------------------------------------------------------------------

Footer Rules

No full physical address.

Public location:

Costa Rica

Social icons:

Inline SVG.

Monochromatic soft white / gray by default.

Hover:

Brand Gold with restrained glow permitted.

No native social media colors.

Footer navigation:

Simple typographic links without decorative underline treatments.

Footer should have minimal visual weight.

------------------------------------------------------------------------

Navigation Behaviour

Current:

Integrated with the dark Hero environment.

Visually restrained.

Transparent or near-transparent treatment where composition permits.

Approved future behavior:

A subtle dark background / blur may be introduced after scrolling if
usability requires it.

No light Smoke Ivory state is canonical.

Sticky behavior should be retained only when it supports navigation
without competing with the artwork.

------------------------------------------------------------------------

Scroll Flow

Current:

Natural user-controlled scrolling.

No forced scrolling.

No automatic scene transitions.

No mandatory snap.

Approved motion direction:

Gentle fade / small vertical reveal may be introduced during the motion
pass.

Canonical motion durations:

Fast

300ms

Medium

500ms

Slow

700ms

No aggressive movement.

Reduced-motion preferences are mandatory.

------------------------------------------------------------------------

Responsive Rules

Desktop:

Immersive and editorial.

Asymmetric compositions are permitted.

Tablet:

Balanced composition.

Do not treat tablet merely as a reduced desktop.

Stack only when necessary.

Mobile:

Comfortable single-column narrative where appropriate.

Artwork integrity remains dominant.

No horizontal scrolling.

Responsive behavior must preserve hierarchy rather than simply shrink
dimensions.

------------------------------------------------------------------------

Component Tree

Home

├── Navigation │ ├── Hero │ ├── FeaturedArtwork │ ├── ArtistStatement │
├── Collection │ ├── JournalPreview │ ├── Invitation │ └── Footer

The canonical Home order is fixed unless explicitly revised.

------------------------------------------------------------------------

Shared UI Dependencies

The Home reuses established shared UI and layout primitives.

shared/layout/

└── container/ └── Container

shared/ui/

├── artwork/ │ ├── ArtworkFrame │ └── ArtworkImage │ └── button/ ├──
Button └── LinkButton

ParticleField remains an approved future system and must not be treated
as an implemented dependency until it exists.

Shared components must remain independent of Home-specific domain
models.

Repeated global visual behavior should consume the canonical Design
Tokens.

Scene-specific composition may remain local when it is intentionally
unique.

------------------------------------------------------------------------

React Folder Mapping

src/

└── domains/ └── home/ ├── index.tsx │ └── sections/ ├── hero/ │ ├──
featured-artwork/ │ ├── artist-statement/ │ ├── collection/ │ ├──
journal/ │ ├── invitation/ │ └── footer/

Folder names follow the project rule of lowercase naming.

Exact existing folder names should not be renamed solely to satisfy this
diagram unless such a refactor is explicitly approved.

Each section owns its composition and scene-specific behavior.

Global layout behavior belongs to shared layout primitives.

------------------------------------------------------------------------

Future Compatibility

The wireframe is intentionally modular.

Future versions may insert:

Virtual Museum

Collector Dashboard

Marketplace

Academy

Artist Platform

without changing the fundamental Home architecture.

------------------------------------------------------------------------

Golden Rule

The visitor must always remember the artwork before remembering the
interface.

------------------------------------------------------------------------

Canonical Status

This document represents the approved spatial and structural
architecture of the Home page as of Version 1.2.

Every approved decision becomes part of the living system.

Future modifications must be explicitly approved before becoming
canonical.

**Del Carmen Digital Experience --- Every approved decision becomes part
of the living system.**
