# Journal Wireframe

Version: 1.0

Document ID:
DOC-JOURNAL-WF

Project:
Del Carmen Digital Experience

Parent Brand:
Rō Visual

Document Type:
Experience / Wireframe

Authority Level:
High

Status:
🟢 Approved — Reconstructed from Current Implementation

Owner:
Del Carmen Digital Experience

Last Updated:
2026-10-05

---

# Purpose

This document records the implemented spatial and interaction structure of the Journal Index and Journal Entry experiences.

It is reconstructed from the supplied current Journal code.

It describes hierarchy and responsive composition rather than replacing the implementation with a new design proposal.

---

# Route Map

```text
/journal
    ↓
Journal Index
    ↓
/journal/[slug]
    ↓
Journal Entry Experience
    ↓
Journal Collection
    ↓
another /journal/[slug] or /journal
```

---

# WF-01 Journal Index

```text
┌────────────────────────────────────────────────────────────┐
│ GLOBAL NAVIGATION / APP SHELL                              │
├────────────────────────────────────────────────────────────┤
│                                                            │
│ JOURNAL                                                    │
│                                                            │
│ Thoughts, stories                                          │
│ and quiet observations.                                    │
│                                                            │
│ Reflections on art, memory, creation...                    │
│                                                            │
├────────────────────────────────────────────────────────────┤
│ ENTRY 01                                                   │
│ ┌──────────────────────┬─────────────────────────────────┐ │
│ │                      │ Category — Year          01 / NN │ │
│ │      MEDIA           │                                 │ │
│ │                      │ Entry Title                     │ │
│ │                      │                                 │ │
│ │                      │ Excerpt                         │ │
│ │                      │                                 │ │
│ │                      │ Explore →                       │ │
│ └──────────────────────┴─────────────────────────────────┘ │
├────────────────────────────────────────────────────────────┤
│ ENTRY 02                                                   │
│ ┌──────────────────────┬─────────────────────────────────┐ │
│ │ Category — Year      │                                 │ │
│ │                      │             MEDIA               │ │
│ │ Entry Title          │                                 │ │
│ │ Excerpt              │                                 │ │
│ │ Explore →            │                                 │ │
│ └──────────────────────┴─────────────────────────────────┘ │
├────────────────────────────────────────────────────────────┤
│ alternating catalogue continues...                         │
├────────────────────────────────────────────────────────────┤
│ SHARED FOOTER                                              │
└────────────────────────────────────────────────────────────┘
```

Desktop alternates media left/right.

Mobile and smaller layouts stack media and editorial content while preserving entry order.

The index is vertically expansive; entries are not compressed into cards.

---

# WF-02 Index Motion

The introductory copy reveals once on mount when reduced motion is not requested.

Each Journal Index media surface contains an oversized image plane.

Its vertical parallax position is calculated from the media window's current distance from viewport center.

Canonical characteristics:

```text
current viewport geometry
        ↓
direct offset calculation
        ↓
image-plane transform
```

No accumulated scroll delta.

No interpolation engine.

No scroll hijacking.

---

# WF-03 Journal Entry Hero

```text
┌────────────────────────────────────────────────────────────┐
│                                                            │
│ Journal — Category — Year                                  │
│                                                            │
│ ENTRY TITLE                                                │
│                                                            │
│ Entry excerpt                                              │
│                                                            │
│ Scroll to explore ↓                                        │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

The Hero is editorial and primarily typographic.

Temporal reveal order:

```text
context
   ↓
title
   ↓
thought / excerpt
   ↓
invitation to scroll
```

The physical Hero composition remains stable while its children reveal.

---

# WF-04 Centered Story Scene

```text
┌────────────────────────────────────────────────────────────┐
│                 FULL ATMOSPHERIC MEDIA                     │
│                                                            │
│                  I — EYEBROW   01                          │
│                                                            │
│                  Scene title                               │
│                                                            │
│                  Scene text                                │
│                                                            │
│              soft luminous atmosphere                      │
└────────────────────────────────────────────────────────────┘
```

Media functions as atmosphere.

Dark overlays preserve text hierarchy.

Copy remains centered.

---

# WF-05 Split Story Scene

Desktop:

```text
┌────────────────────────────┬───────────────────────────────┐
│                            │                               │
│          MEDIA             │ Eyebrow — 02                  │
│                            │                               │
│    contained luminous      │ Scene title                   │
│       atmosphere           │                               │
│                            │ Scene text                    │
│                            │                               │
└────────────────────────────┴───────────────────────────────┘
```

`split-right` mirrors the desktop order.

On smaller screens the composition becomes sequential rather than forcing the two-column geometry.

---

# WF-06 Immersive Story Scene

```text
┌────────────────────────────────────────────────────────────┐
│                                                            │
│                 FULL ATMOSPHERIC MEDIA                     │
│                                                            │
│                                                            │
│ Eyebrow — 03                                               │
│ Scene title                                                │
│ Scene text                                                 │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

Copy is anchored toward the lower portion.

The media and luminous atmosphere dominate the scene without displacing readability.

---

# WF-07 Scene Continuity

Adjacent scenes are connected atmospherically.

As the current scene leaves:

```text
copy softens / rises
media subtly expands
light diminishes
```

Before the next scene fully arrives:

```text
next atmosphere begins to exist
light appears
media establishes presence
copy remains unrevealed
```

The next copy is deliberately not exposed early.

Normal vertical document scroll remains authoritative.

---

# WF-08 Journal Collection

```text
┌────────────────────────────────────────────────────────────┐
│ gold divider ───────────────────────────────────────────── │
│                                                            │
│ JOURNAL             │ Drag or swipe to explore ↔           │
│ Journal             │                                      │
│ Collection          │ ┌────────────┐ ┌────────────┐ ...    │
│                     │ │            │ │            │         │
│ Continue through    │ │   IMAGE    │ │   IMAGE    │         │
│ remaining           │ │            │ │            │         │
│ reflections.        │ └────────────┘ └────────────┘         │
│                     │ Category      Category                │
│ Journal Index →     │ Title         Title                   │
└────────────────────────────────────────────────────────────┘
```

The current Journal entry is excluded.

Remaining entries use the shared `KineticCarousel`.

The collection enters visually from right toward its settled position, but the shared carousel track itself remains owned by KineticCarousel.

Journal animation must not interfere with drag, wheel or momentum mechanics.

---

# WF-09 Footer

Journal Index and Journal Entry both conclude with the shared Footer.

Footer remains outside Journal-specific storytelling responsibilities.

---

# WF-10 Responsive Principles

Responsive adaptation preserves:

- editorial hierarchy;
- readable line lengths;
- media prominence;
- natural vertical scroll;
- scene order;
- direct access to Journal navigation;
- kinetic exploration where the shared carousel remains appropriate.

Desktop composition may alternate or split.

Mobile recomposes sequentially.

Responsive behavior should preserve the narrative rather than reproduce desktop geometry literally.

---

# WF-11 Reduced Motion

When reduced motion is requested:

- content remains visible;
- transforms/reveal states do not become prerequisites for comprehension;
- Journal remains navigable;
- normal document flow remains intact.

---

# Canonical Experience Sequence

Journal Index:

```text
Introduction
→ Editorial Catalogue
→ Footer
```

Journal Entry:

```text
Editorial Hero
→ Story Scene 01
→ Story Scene 02
→ ...
→ Journal Collection
→ Footer
```

---

Del Carmen Digital Experience

Painting the Eternal Essence Within
