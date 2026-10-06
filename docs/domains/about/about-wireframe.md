# About Wireframe

Version: 1.1

Document ID: DOC-AW

Project: Del Carmen Digital Experience

Parent Brand: Rō Visual

Document Type: Experience Wireframe

Authority Level: High

Status: 🟢 Approved / Complete / Frozen

Owner: Del Carmen Digital Experience

Last Updated: 2026-09-07

---

# Purpose

This document records the canonical spatial and narrative wireframe of the About Page.

Route:

`/about`

---

# Page Structure

```text
ABOUT
│
├── 01 Hero / The Encounter
│   ├── Full-bleed poster / future film
│   ├── ABOUT eyebrow
│   ├── “Where art meets experience.”
│   ├── concise institutional statement
│   └── independent circular Play control
│
├── 02 Essence
│   ├── editorial divider / eyebrow
│   ├── primary philosophical statement
│   └── supporting statement
│
├── 03 Ecosystem
│   ├── “One philosophy. Distinct expressions.”
│   ├── Rō Visual parent identity
│   ├── connector architecture
│   ├── Del Carmen
│   └── Rō Visual Lab
│
├── 04 Continue
│   ├── “The encounter continues.”
│   ├── 01 Discover the Artist → /artist
│   └── 02 Explore the Artworks → /artworks
│
└── 05 Shared Footer
```

---

# 01 Hero / The Encounter

## Desktop / Tablet / Landscape

```text
┌─────────────────────────────────────────────────────────────┐
│                     FULL-BLEED MEDIA                        │
│                                                             │
│   ABOUT                                      ○ PLAY         │
│                                                             │
│   Where art meets                                            │
│   experience.                                                │
│                                                             │
│   Concise institutional copy                                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

The media occupies the full scene.

Copy remains left-aligned within the editorial grid.

Play is positioned independently toward the visual field and must not collide with copy.

Protective gradients may be used to maintain text legibility without visually flattening the poster.

## Mobile Portrait

The same elements remain present, but the reading order becomes explicitly sequential.

The composition prioritizes:

Media → identity → headline → statement → Play.

---

# 02 Essence

```text
┌─────────────────────────────────────────────────────────────┐
│  subtle rule / ESSENCE                                      │
│                                                             │
│                         Art invites us to slow down...       │
│                                                             │
│                         Supporting statement                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

The scene is deliberately typographic.

No decorative image is required.

The statement is the visual focal point.

---

# 03 Ecosystem

## Wide Composition

```text
THE ECOSYSTEM

One philosophy.
Distinct expressions.

                     Rō Visual
                         │
                  ───────┴───────
                  │             │
             Del Carmen    Rō Visual Lab
              Fine Art     Digital Innovation
```

Supporting descriptions sit with the two child identities.

The diagram is editorial, not corporate.

Connector lines are visual hierarchy, not decorative ornament.

On narrower layouts, hierarchy may stack while preserving the semantic parent → children relationship.

---

# 04 Continue

## Desktop / Tablet

```text
CONTINUE

The encounter
continues.

┌──────────────────────────┬──────────────────────────┐
│ 01                       │ 02                       │
│ Discover the Artist      │ Explore the Artworks     │
│ Supporting copy          │ Supporting copy          │
│ →                        │ →                        │
└──────────────────────────┴──────────────────────────┘
```

## Mobile Portrait

```text
CONTINUE

The encounter
continues.

01
Discover the Artist
Supporting copy
→

02
Explore the Artworks
Supporting copy
→
```

The mobile portrait reveal is narrative:

Heading → complete Path 01 → complete Path 02.

---

# 05 Footer

The existing shared Footer closes the experience.

It is composed locally by About but remains owned by shared layout infrastructure.

---

# Spatial Rules

- standard editorial alignment uses the shared Container
- Hero media intentionally escapes the Container
- section spacing follows the canonical semantic rhythm
- no arbitrary oversized whitespace
- typography and media must never compete
- no additional About scenes may be inserted without an approved experience revision

---

# Canonical Status

This wireframe describes the completed About v1.0 experience and is frozen together with the implementation.


---

# Conservative Audit Addendum — 2026-10-05

This addendum preserves the complete approved About Wireframe v1.0 above.

The wireframe remains **Approved / Complete / Frozen**.

## Canonical Spatial Sequence

The approved sequence remains:

```text
Hero / The Encounter
→ Essence
→ Ecosystem
→ Continue
→ Shared Footer
```

No scene is added, removed, merged or reordered by this audit.

## Hero / The Encounter

The Hero remains the spatial owner of The Encounter media.

The poster is the current implemented fallback.

The future final film replaces the media layer rather than becoming a new standalone section.

The wireframe therefore remains valid before and after final-film integration.

## Responsive Preservation

The approved mobile portrait experience retains sequential Hero disclosure and the complete Continue semantic sequence:

```text
Heading
→ Discover the Artist
→ Explore the Artworks
```

Tablet, desktop and landscape retain their approved cinematic/editorial compositions.

Responsive adaptation may change geometry without changing narrative ownership.

## About / Artist Boundary

The About wireframe remains institutional.

It must not absorb the Artist biography simply because `/artist` may share a navigation state with About.

`/artist` remains the dedicated Artist experience.

## Freeze Governance

The spatial architecture is protected during Phase 1.

Changes require a verified defect, accessibility correction, production constraint or explicitly approved About experience revision.

Integration of the already-planned final The Encounter film is not, by itself, a reason to redesign the wireframe.

## Audit Note

Version 1.1 uses the conservative documentation method.

The complete supplied v1.0 wireframe is preserved above apart from Version metadata.

The planned audiovisual master remains part of the approved direction and is not treated as obsolete merely because the poster is currently implemented.
