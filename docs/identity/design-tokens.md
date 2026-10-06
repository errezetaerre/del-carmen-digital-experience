# Design Tokens

Version: 1.3

Document ID:
DOC-DT

Project:
Del Carmen Digital Experience

Parent Brand:
Rō Visual

Document Type:
Foundational

Authority Level:
High

Status:
🟢 Approved

Owner:
Del Carmen Digital Experience

Last Updated:
2026-10-05

---

# Purpose

This document defines the canonical visual token system of Del Carmen Digital Experience.

Every interface element, shared component, domain and future module must inherit from this system whenever a visual decision is global or repeated.

The goal is to maintain visual consistency while preserving the compositional freedom required by individual artistic scenes.

Global and repeated visual decisions belong to the design system.

Scene-specific composition may remain local when it serves a deliberate artistic or responsive purpose.

No component should create an independent visual identity.

---

# Design System Principle

The system follows three levels of responsibility:

Global Design Tokens

↓

Shared UI and Layout Primitives

↓

Scene-Specific Composition

Global tokens define recurring visual decisions.

Shared primitives consume those decisions.

Individual scenes retain control over composition-specific values such as artwork scale, asymmetric grids, intentional offsets and unique spatial relationships.

Not every numeric value must become a token.

A value should be promoted to the design system when it represents a recurring or global visual rule.

Avoid both arbitrary values and premature abstraction.

---

# Brand Personality

Elegant

Human

Quiet

Editorial

Timeless

Museum Quality

Warm

Contemplative

Universal

Never:

Corporate

Cold

Tech-looking

Busy

Flashy

Minimal for the sake of minimalism

Luxury for the sake of luxury

---

# Color Philosophy

The artwork is always the most visually expressive and colorful element on the screen.

Interface colors exist to create atmosphere, hierarchy and orientation without competing with the artwork.

The current digital experience is primarily built around deep neutral surfaces.

Light surfaces remain available for future editorial or contextual experiences.

---

# Core Background

Deep Black

HEX

#0B0B0B

Token

--background

Tailwind

bg-background

Usage

Primary application background

Primary dark scenes

Continuous institutional environment

---

# Primary Surface

Dark Surface

HEX

#111111

Token

--surface-primary

Tailwind

bg-surface

Usage

Panels

Elevated dark surfaces

Contextual interface regions

Use only when visual separation from the primary background is necessary.

---

# Deep Surface

Editorial Black

HEX

#090908

Token

--surface-deep

Tailwind

bg-surface-deep

Usage

Subtle scene differentiation

Editorial sections

Collection environments

The difference from the primary background should remain restrained.

---

# Ivory Surface

Smoke Ivory

HEX

#F4F1EC

Token

--surface-ivory

Tailwind

bg-surface-ivory

Usage

Future light editorial experiences

Selected contextual surfaces

Light-mode artistic compositions when intentionally required

It is not the primary background of the current Home experience.

---

# Primary Text

Soft White

HEX

#F5F5F5

Token

--text-primary

Primary foreground

--foreground

Usage

Primary typography

Important interface information

Headings

---

# Muted Text

Soft Gray

HEX

#A1A1AA

Token

--text-muted

Usage

Secondary information

Metadata

Supporting copy

Low-emphasis interface content

---

# Charcoal Text

Smoke Charcoal

HEX

#2F2E2C

Token

--text-charcoal

Usage

Typography on light surfaces

Future ivory editorial environments

---

# Muted Bronze

HEX

#A27B48

Token

--brand-bronze

Tailwind

text-brand-bronze

Usage

Interactive accents

Editorial CTA treatments

Secondary intentional emphasis

Never for large areas.

---

# Primary Gold

HEX

#C9A35A

Token

--brand-gold

Tailwind

text-brand-gold

Usage

Brand tagline

Section labels

Selected artwork information

Navigation states

Important visual accents

Intentional hover states

Subtle glow treatments

Never for large areas.

Never as a generic border.

Gold identifies visual focal points.

Bronze primarily supports interaction and secondary emphasis.

Neither should compete with the artwork.

---

# Border

Subtle Light Border

RGBA

rgba(255, 255, 255, 0.08)

Token

--border-subtle

Tailwind

border-border

Usage

Structural separation when necessary

Never decorative by default.

---

# Success

Olive Sage

HEX

#6B7B5B

Token

--success

---

# Error

Burnt Clay

HEX

#A25A45

Token

--error

---

# Typography Philosophy

Typography combines classical artistic character with contemporary digital clarity.

Display typography carries emotion and institutional presence.

Interface typography remains restrained, precise and highly legible.

---

# Display Typeface

Cormorant Garamond

CSS Variable

--font-cormorant

Tailwind / Utility

font-display

Usage

H1

H2

H3

Editorial statements

Artwork titles

Poetic language

Selected italic expressions

Character

Classical

Editorial

Museum-like

Expressive

---

# Interface and Body Typeface

Geist

CSS Variable

--font-geist-sans

Tailwind

font-sans

Usage

Body copy

Navigation

Buttons

Labels

Metadata

Legal information

Interface controls

Character

Neutral

Contemporary

Precise

Digital

---

# Monospace Typeface

Geist Mono

CSS Variable

--font-geist-mono

Tailwind

font-mono

Usage

Technical contexts only when required.

It is not part of the primary artistic language.

---

# Typographic Hierarchy

Typography should be responsive rather than dependent on a rigid universal pixel scale.

Current implementation commonly uses:

Display / Hero

Large responsive Cormorant Garamond typography

Section Headings

Approximately 36–60px depending on viewport and composition

Editorial Subheadings

Approximately 24–36px

Body

Approximately 14–20px depending on context

Labels / Metadata / Interface

Approximately 10–14px

Exact sizes may remain scene-specific when required by composition.

Typography must preserve hierarchy across breakpoints rather than enforce identical numerical scales everywhere.

---

# Line Height

Display

Approximately 1.00–1.15

Editorial Titles

Approximately 1.05–1.15

Body

Approximately 1.70–1.80

Line height may be adjusted locally when required by the composition.

---

# Letter Spacing Tokens

Heading

0.01em

Token

--tracking-heading

---

Navigation

0.12em

Token

--tracking-navigation

---

Label

0.30em

Token

--tracking-label

---

Brand

0.25em

Token

--tracking-brand

---

Button

0.28em

Token

--tracking-button

---

Tracking values may be adjusted locally when a specific composition requires a deliberate editorial treatment.

Repeated patterns should use the canonical tokens.

---

# Layout System

The global horizontal layout is controlled through the shared Container primitive.

Canonical component:

src/shared/layout/container/Container.tsx

Sections should not independently recreate global max-width and responsive gutter behavior.

---

# Content Width

Default Content Width

80rem

Token

--content-width

Approximately

1280px

---

Wide Content Width

90rem

Token

--content-width-wide

Approximately

1440px

---

# Container Variants

default

Standard editorial content width.

---

wide

Expanded compositions such as artwork collections.

---

full

Unrestricted width for exceptional immersive compositions.

---

# Responsive Page Gutters

Mobile

1.5rem

24px

---

Tablet

2.5rem

40px

Breakpoint

768px+

---

Desktop

4rem

64px

Breakpoint

1024px+

---

Large Desktop

5rem

80px

Breakpoint

1280px+

---

Token

--page-gutter

The responsive gutter is globally controlled.

Components should not duplicate these values unless a composition intentionally breaks outside the Container.

---

# Grid Philosophy

Desktop compositions may use 12-column logic.

Tablet compositions may use 8-column logic.

Mobile compositions may use 4-column logic.

These are compositional guides rather than mandatory rigid grids.

Individual artistic scenes may use asymmetric fractional layouts when required.

Examples include:

40 / 60

34 / 66

38 / 62

Such ratios remain local when they belong specifically to the composition.

---

# Vertical Rhythm

Vertical rhythm is semantic and responsive.

The system defines three canonical levels.

---

## Compact

Token

--section-space-compact

Value

4rem

64px

Usage

Closely related content

Internal transitions

Compact institutional regions

---

## Default

Token

--section-space-default

Value

6rem

96px

Usage

Standard editorial rhythm

General section spacing

---

## Generous

Token

--section-space-generous

Mobile

6rem

96px

Tablet

7rem

112px

Desktop

8rem

128px

Usage

Contemplative scenes

Journal

Invitation

Other experiences requiring deliberate breathing room

---

# Spacing Principle

Use the established Tailwind spacing scale for local composition.

Use semantic section tokens for recurring global vertical rhythm.

Avoid arbitrary spacing when an existing system value expresses the same intention.

However, scene-specific spacing may remain local when it is necessary to preserve an approved composition.

No arbitrary abstraction.

No tokenization for its own sake.

---

# Body Content Width

Token

--body-max-width

Value

42rem

Usage

Long-form readable text

Editorial body content

Narrative passages

---

# Border Radius

Artwork

0px

Cards

0px by default

Buttons

0px by default

Inputs

Minimal radius only when usability requires it

The visual language is architectural.

Rounded geometry is exceptional rather than habitual.

---

# Artwork Shadow

Token

--shadow-artwork

Value

0 40px 100px rgba(0, 0, 0, 0.7)

Usage

Artwork presentation when depth is required.

Shadows must remain atmospheric rather than card-like.

Never neumorphism.

Never floating application panels.

---

# Borders

Borders should be subtle and structural.

Default

1px when necessary

Color

--border-subtle

Gold borders are reserved for intentional artistic focal points.

Never use gold as a generic interface border.

---

# Motion Philosophy

Motion should feel atmospheric, slow and intentional.

It must never distract from the artwork.

---

# Motion Durations

Fast

300ms

Token

--duration-fast

Usage

Simple interface feedback

---

Medium

500ms

Token

--duration-medium

Usage

Standard visual transitions

---

Slow

700ms

Token

--duration-slow

Usage

Editorial transitions

Atmospheric interface behavior

---

# Motion Behavior

Preferred easing

ease-out

Motion may use more specialized easing when required by an approved artistic animation.

Hover behavior may include:

Opacity transitions

Underline illumination

Subtle color transitions

Small-scale transformations

Controlled gold glow

Nothing dramatic.

---

# Reduced Motion

The interface must respect:

prefers-reduced-motion: reduce

When active:

Animations become effectively immediate.

Repeated animation is suppressed.

Transitions become effectively immediate.

Forced smooth scrolling must not interfere with accessibility.

---

# Scroll

The experience should feel continuous and contemplative.

No forced scroll.

No mandatory snap.

No interaction should prevent natural user control.

---

# Images

Artwork integrity is mandatory.

Never crop artwork aggressively.

Preserve original composition whenever possible.

No rounded artwork.

No decorative UI frames that compete with the painting.

Artwork presentation should feel institutional and museum-like.

Responsive image behavior may differ by scene when necessary to preserve composition.

---

# Icons

Icons must remain visually restrained.

Default appearance:

Soft white or gray

Low emphasis

Minimal

Editorial

Social icons may use filled SVG geometry when required by the original icon design.

Icons may transition toward Primary Gold on interaction.

Subtle gold glow is permitted for selected social interaction states.

Icons should never dominate the interface.

---

# Buttons and Links

Interactive language is primarily typographic.

---

## Editorial CTA

Shared components

Button

LinkButton

Primary treatments

Bronze Underline

Gold Underline

Gradient Underline

Usage

Editorial calls to action

Artwork discovery

Collection navigation

Subscription

Contact

---

## Navigation Links

Navigation links should generally remain clean and without decorative underlines unless an active or contextual state requires one.

---

## Legal Links

Simple typographic links.

No decorative CTA underline.

---

## Social Links

Icon based.

Muted by default.

Gold interaction state permitted.

---

# Forms

Minimal

Editorial

Generous breathing room

Clear focus state

No heavy borders

Accessibility is mandatory.

---

# Accessibility

WCAG AA contrast target

Keyboard Navigation

Visible Focus

Reduced Motion

Screen Reader Friendly

Semantic HTML

Descriptive image alternatives where appropriate

Mandatory

---

# Responsive Philosophy

Desktop

Immersive

Expansive

Compositional

---

Tablet

Balanced

Editorial

Never treated as reduced desktop

---

Mobile

Comfortable

Direct

Artwork-conscious

Never compressed

---

Responsive behavior should preserve artistic hierarchy rather than merely scale dimensions down.

---

# Implementation Authority

The canonical implementation of these tokens currently lives primarily in:

src/app/globals.css

Shared layout behavior lives in:

src/shared/layout/container/

Components should consume the global system rather than reproduce it locally.

If implementation and this document diverge, the discrepancy must be reviewed and resolved rather than allowed to persist.

---

# Current Home Surface Strategy

The current Home experience uses the following surface hierarchy:

Hero

Scene-specific immersive background treatment

---

Featured Artwork

Primary Background

---

Artist Statement

Inherits Primary Background

---

Collection

Deep Surface

---

Journal

Primary Background

Generous Section Rhythm

---

Invitation / Newsletter

Primary Background

Generous Section Rhythm

---

Footer

Primary Background

Footer-specific internal rhythm

---

# Design Principle

Everything unnecessary disappears.

The artwork remains.

Hierarchy is intentional.

Typography supports contemplation.

Spacing creates rhythm rather than emptiness.

Gold identifies selected visual focal points.

Bronze supports interaction and secondary emphasis.

The interface should feel designed but never over-designed.

---

# Golden Rule

Every design decision must reinforce contemplation.

If an element competes with the artwork, remove it.

If a repeated visual decision exists, systematize it.

If a value belongs only to a deliberate composition, allow it to remain local.

---

Del Carmen Digital Experience

Painting the Eternal Essence Within


---

# Design Token Evolution Update — 2026-10-05

This section extends the supplied v1.2 Design Tokens without deleting, compressing or replacing its canonical token system.

The original v1.2 body remains preserved above as the approved visual-system foundation.

---

# Global Tokens vs Local Interaction Physics

The existing three-level responsibility model remains authoritative:

Global Design Tokens

↓

Shared UI and Layout Primitives

↓

Scene-Specific Composition

Subsequent Phase 1 kinetic work reinforces rather than changes this model.

A value should become a global token only when it represents a recurring visual or interaction rule whose meaning is genuinely shared across the platform.

A value should remain local when it exists to tune the physical behavior, composition or responsive needs of one approved experience.

Therefore, current kinetic implementation values such as:

• drag activation thresholds
• wheel ownership thresholds
• velocity multipliers
• momentum coefficients
• resistance factors
• scene travel distances
• snap/settle calculations
• fixed carousel item width
• gesture-session timing
• edge-physics constants

must not automatically become global Design Tokens.

They may remain local to the relevant shared primitive or experience implementation.

If a later cross-platform pattern demonstrates that one of these values has stable global semantic meaning, it may then be promoted through an explicit design-system decision.

---

# Shared Primitive Does Not Automatically Mean Global Token

A reusable component may contain implementation-specific values without every value becoming part of the global token system.

Current example:

`src/shared/ui/kinetic-carousel/`

is a shared UI primitive.

Its reusable mechanics are shared.

Its internal physical constants remain implementation details unless they acquire broader design-system meaning.

This distinction prevents token proliferation while preserving genuine reuse.

---

# KineticCarousel Current Phase 1 Note

The current KineticCarousel uses an approved fixed artwork item width of `186px` in the relevant composition to prevent unintended partial/sliver visibility.

That value is canonical for the current implementation.

It is not promoted to a global Design Token by this document.

Its scope remains local to the KineticCarousel implementation unless a later repeated global requirement justifies systematization.

---

# Motion Tokens and Direct Manipulation

The existing global motion durations remain valid for conventional interface feedback and atmospheric transitions:

• `--duration-fast`
• `--duration-medium`
• `--duration-slow`

Direct manipulation is a different class of interaction.

While a visitor is actively dragging, swiping or using a horizontal trackpad gesture, motion may follow input continuously rather than being governed by a fixed duration token.

Release momentum and physically coherent settling may also require local calculations rather than one of the global duration tokens.

This does not invalidate the existing Motion Durations.

It clarifies their scope.

---

# Specialized Easing and Physical Continuity

The existing preferred global easing remains `ease-out`.

The original rule already permits specialized easing for approved artistic animation.

Current kinetic experiences may therefore use gesture-derived movement, momentum or specialized settling behavior when necessary to preserve physical continuity.

Such behavior should not be converted into a new global easing token until it demonstrates stable reuse and semantic value across multiple independent experiences.

---

# Scroll Clarification

The existing Scroll principles remain authoritative:

• continuous and contemplative experience
• no forced scroll
• no mandatory snap
• no interaction should prevent natural user control

Horizontal artwork exploration does not replace natural vertical scrolling.

A kinetic experience may temporarily interpret a deliberate horizontal gesture while preserving ordinary vertical page movement.

The interface should avoid accidental gesture capture that makes normal scrolling feel blocked.

---

# Reduced Motion Clarification

The existing reduced-motion requirement remains mandatory.

Kinetic or immersive interactions must preserve navigation and orientation when motion is reduced.

Reduced-motion behavior may replace continuous kinetic travel with effectively immediate or substantially reduced transitions while retaining the same destination and contextual meaning.

No kinetic experience may require full motion in order to remain usable.

---

# Artwork Integrity in Kinetic Experiences

The existing Artwork Integrity rules remain authoritative.

Kinetic presentation must not justify:

• aggressive artwork cropping
• rounded artwork treatment
• decorative frames that compete with the work
• distortion of original proportions

Movement changes how the visitor navigates the artwork.

It does not change the requirement to respect the artwork itself.

---

# Responsive Composition Remains Local Where Appropriate

The current responsive Collections, Series and Artwork Detail experiences include breakpoint-specific artistic composition.

Their exact artwork scales, offsets, hero media positions, overlay geometry and spatial relationships may remain local when they are unique to that scene.

The global `Container`, page gutters, typography, color and semantic spacing system should still be consumed whenever those global rules apply.

A deliberate immersive composition may use the `full` Container strategy or intentionally break outside the standard Container when the approved experience requires it.

---

# Current Shared Implementation Authority

The original implementation authority remains:

`src/app/globals.css`

for canonical global visual tokens, and:

`src/shared/layout/container/`

for shared layout behavior.

Subsequent shared UI infrastructure includes:

`src/shared/ui/kinetic-carousel/`

This location owns reusable kinetic-carousel behavior, not global brand tokens.

A local value should not be moved into `globals.css` merely because it appears in a shared component.

Promotion into the global token layer requires semantic justification.

---

# Future Design-System Evolution

Future modules such as Virtual Museum, Marketplace, Academy, Community, Collector experiences, immersive exhibitions and mobile experiences must inherit the global visual system where its decisions remain relevant.

They may also introduce new local compositional or interaction requirements.

New tokens should be introduced when those requirements reveal genuinely recurring global semantics.

The current Phase 1 token set must not be treated as permanently exhaustive.

Likewise, future requirements must not be used to create speculative tokens before a real recurring pattern exists.

---

# Audit Note

Version 1.3 uses the conservative documentation method.

The complete supplied v1.2 Design Tokens body is preserved above, apart from Version and Last Updated metadata.

No existing color, typography, layout, spacing, motion, accessibility, responsive or future-light-surface rule has been removed.

No local kinetic constant has been promoted to the global token system merely because it is part of an approved interaction.

This update clarifies scope and preserves the original principle:

`If a repeated visual decision exists, systematize it.`

`If a value belongs only to a deliberate composition, allow it to remain local.`

---

Del Carmen Digital Experience

Painting the Eternal Essence Within
