# About Specification

Version: 1.1

Document ID: DOC-AS

Project: Del Carmen Digital Experience

Parent Brand: Rō Visual

Document Type: Experience Specification

Authority Level: High

Status: 🟢 Approved / Complete / Frozen

Owner: Del Carmen Digital Experience

Last Updated: 2026-09-07

---

# Purpose

This document defines the canonical About Page experience for Del Carmen Digital Experience.

The About Page is institutional rather than biographical. It explains why Del Carmen exists, how art and technology coexist within the experience, and how Del Carmen relates to the parent creative identity Rō Visual.

The Artist biography and artistic journey remain owned by `/artist`.

---

# Public Route

`/about`

---

# Experience Objective

The About Page must communicate the identity of Del Carmen quickly, visually and with minimal text.

It is not a conventional corporate About page.

It must avoid:

- Mission / Vision / Values blocks
- résumé-style biography
- duplicated Artist Page narrative
- excessive institutional copy
- technology-first language
- presenting future platform capabilities as already available

The visitor should understand that Del Carmen is a contemplative digital space in which painting, memory and technology meet without competing for attention.

---

# Canonical Narrative

The canonical About experience contains four principal scenes followed by the shared Footer:

01 --- Hero / The Encounter

02 --- Essence

03 --- Ecosystem

04 --- Continue

05 --- Shared Footer

Narrative progression:

Encounter → Meaning → Identity Architecture → Continued Exploration

---

# Scene 01 --- Hero / The Encounter

The Hero is the primary audiovisual encounter.

Canonical copy:

**ABOUT**

**Where art meets**  
**experience.**

“Del Carmen is a contemplative space where painting, memory and technology meet without competing for attention.”

The Hero uses full-bleed media behind the editorial copy.

Current canonical media:

`public/about/film/the_encounter_poster.png`

The poster is a production fallback and current visual representation of the future film.

A circular Play control remains part of the interface and is positioned independently from the poster artwork.

The Play control is UI and must not be baked into the media asset.

The Hero may later replace the poster with the final film without redesigning the scene.

## Motion

Desktop, tablet and landscape use restrained overlapping cinematic reveals.

Mobile portrait uses sequential narrative disclosure:

Poster → Eyebrow → Headline → Copy → Play → Atmospheric Light

Reduced-motion users receive the static visible composition.

The Hero content must remain visible by default and must not depend on a hydration-hidden parent class.

---

# Scene 02 --- Essence

Canonical statement:

“Art invites us to slow down, to observe, and to discover what remains when everything unnecessary disappears.”

Supporting copy:

“Del Carmen creates encounters between physical painting and digital experience while preserving the silence, humanity and intimacy of the original work.”

The scene is typographic and contains no required imagery.

Its motion progressively illuminates the statement word by word after the visitor physically reaches the scene.

Motion is:

- GSAP-based
- non-scrubbed
- `once: true`
- triggered by physical scroll position
- reduced-motion safe

---

# Scene 03 --- Ecosystem

Canonical eyebrow:

**The Ecosystem**

Canonical heading:

**One philosophy.**  
**Distinct expressions.**

The scene communicates the approved brand architecture:

Parent Creative Identity  
→ Rō Visual

Fine Art  
→ Del Carmen

Digital Innovation  
→ Rō Visual Lab

Canonical supporting descriptions:

Del Carmen:

“Painting, artistic practice and contemplative experiences centered on the artwork.”

Rō Visual Lab:

“Technology and experimentation extending how creative work can be experienced.”

The architecture is constructed visually through restrained connector-line motion.

The scene must not imply that future products or services already exist beyond their approved identity role.

---

# Scene 04 --- Continue

Canonical eyebrow:

**Continue**

Canonical heading:

**The encounter**  
**continues.**

Two canonical paths close the About experience:

01 --- Discover the Artist  
“The life and practice behind the work.”  
Route: `/artist`

02 --- Explore the Artworks  
“Paintings, collections and their stories.”  
Route: `/artworks`

## Mobile Portrait Motion

Mobile portrait uses complete narrative sequencing:

Heading → Artist Path → Artworks Path

Each path is revealed as a coherent unit before the next path begins.

## Desktop / Tablet / Landscape Motion

The approved parallel editorial composition is preserved.

The trigger is tied to `.about-continue-pathways` so the animation does not complete before the visitor reaches the pathways.

---

# Shared Footer

The About Page composes the existing shared Footer from:

`src/shared/layout/footer/`

The Footer remains shared infrastructure and is not owned by the About domain.

---

# Visual Language

About inherits the canonical Del Carmen Design System:

- predominantly dark institutional environment
- soft white primary typography
- muted secondary typography
- Primary Gold / Muted Bronze for restrained emphasis
- Cormorant Garamond for display language
- Geist for interface and body language
- shared Container for standard editorial alignment
- intentional spacing rather than arbitrary large whitespace

Media and motion remain subordinate to the artistic experience.

---

# Responsive Behavior

The experience has been reviewed across responsive layouts.

Canonical principles:

- desktop preserves cinematic spatial composition
- tablet preserves editorial hierarchy
- mobile portrait prioritizes sequential reading
- mobile landscape preserves the cinematic composition where appropriate
- poster cropping may adapt responsively without altering the underlying artwork asset
- Play remains independently positionable from the media
- no horizontal overflow is permitted

---

# Accessibility

Required behavior:

- `prefers-reduced-motion` must be respected
- essential meaning cannot exist only inside video
- the poster remains a valid static fallback
- background poster media may use empty alt text when the visible copy carries the meaning
- interactive Play behavior must expose an accessible label
- the final film must provide an accessible text alternative / transcript when introduced
- sound must not be required to understand the page

---

# Canonical Status

About Page v1.0 is Approved / Complete / Frozen.

Future changes require one of:

- verified bug
- accessibility defect
- production issue
- explicitly approved experience revision

The final audiovisual master for The Encounter remains a planned media replacement and does not reopen the approved About page architecture.


---

# Conservative Audit Addendum — 2026-10-05

This addendum preserves the complete approved About Specification v1.0 above.

About remains **Approved / Complete / Frozen**.

## Canonical Experience

The canonical route remains:

`/about`

The institutional narrative remains:

```text
01 Hero / The Encounter
02 Essence
03 Ecosystem
04 Continue
05 Shared Footer
```

About remains institutional rather than biographical.

The Artist biography remains owned by:

`/artist`

## The Encounter Media Boundary

The Encounter belongs inside the Hero as the audiovisual layer of the existing About architecture.

The current canonical implemented fallback remains:

`public/about/film/the_encounter_poster.png`

The final audiovisual master remains planned.

Replacing the poster with the approved final film does not require redesigning the About information architecture.

The media layer may evolve while the scene responsibility remains stable.

## Ecosystem Relationship

The approved relationship remains:

`Rō Visual → Del Carmen / Rō Visual Lab`

This audit does not expand, rename or reinterpret those entities beyond the supplied About documentation.

## Continue

The Continue scene retains two canonical paths:

`/artist`

and

`/artworks`

The approved mobile portrait semantic order remains:

```text
Heading
→ Discover the Artist path
→ Explore the Artworks path
```

## Motion and Accessibility

About motion remains scene-specific.

Required narrative disclosure is driven by initial scene presentation or physical scroll position rather than elapsed time while the visitor is elsewhere.

Ordinary scroll reveals remain non-scrubbed and run once.

Reduced-motion accessibility remains mandatory.

Tablet, desktop and landscape preserve their approved cinematic/editorial compositions.

## Freeze Governance

About should not be redesigned during Phase 1 unless a verified bug, accessibility defect, production issue or explicitly approved experience revision requires a change.

Frozen protects the approved experience.

It does not cancel the planned final audiovisual master or prohibit later explicitly approved evolution.

## Audit Note

Version 1.1 uses the conservative documentation method.

The complete supplied v1.0 specification is preserved above apart from Version metadata.

No approved scene, route, ecosystem relationship, responsive behavior or planned media direction has been removed.
