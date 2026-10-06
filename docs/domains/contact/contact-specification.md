# Contact Specification

Version: 1.1

Document ID: DOC-CON-SPEC

Project: Del Carmen Digital Experience

Parent Brand: Rō Visual

Document Type: Experience Specification

Authority Level: High

Status: 🟢 Approved / Frozen

Owner: Del Carmen Digital Experience

Last Updated: 2026-09-07

---

## Purpose

Define the canonical Phase 1 Contact experience for Del Carmen Digital Experience. Contact is a private conversation channel, not a newsletter subscription, corporate directory or customer-support portal.

## Public Route

`/contact`

## Experience Principle

The page should feel like an invitation to begin a considered conversation. It remains concise, editorial and visually subordinate to the broader Del Carmen experience.

## Canonical Content

Eyebrow: `CONTACT`

Primary heading: `Begin a conversation.`

Supporting copy: `Whether you are interested in an artwork, a collaboration, or simply wish to connect, you are welcome to write.`

Direct correspondence label: `For direct correspondence`

Provisional public address: `rolando@delcarmen.art`

The provisional address is display-only until final email infrastructure exists.

## Form Fields

All four visitor-facing fields are required:

- Name
- Email
- I’m writing about
- Message

Subject categories:

- Artworks — Questions about original works, availability, collecting or commissions.
- Collaboration — Exhibitions, creative partnerships, editorial projects or professional proposals.
- General — Questions or messages that do not fit the categories above.

The contextual subject explanation is an inline microinteraction. No modal is used.

## Interaction States

The form supports:

- idle
- submitting
- success
- error
- rateLimited

Success is temporary and returns to idle after the approved feedback interval. Editing after success, error or rate-limited feedback immediately restores the normal state.

## Submission Action

The primary commit action uses the shared Button `outline` variant. Bordered controls are reserved for important commit actions; editorial navigation continues to use restrained typographic/underline treatments.

## Accessibility

Inputs use explicit labels and appropriate autocomplete for name and email. Subject feedback uses an accessible live region. Reduced-motion behavior is mandatory. The honeypot is excluded from normal keyboard interaction.

## Motion

GSAP provides a restrained initial editorial entrance:

Contact → Begin a → conversation. → supporting invitation → form.

The form is treated as one functional unit rather than animating each field individually. Motion must not delay required functionality or depend on elapsed time while the visitor is elsewhere.

## Newsletter Boundary

Submitting Contact does not subscribe a visitor to marketing or editorial updates. Newsletter is a separate permission-based Phase 1 experience.

## Status

Contact v1.0 is complete, approved and frozen.


---

# Conservative Audit Addendum — 2026-10-05

This addendum preserves the complete Contact Specification v1.0 above.

Contact remains **Approved / Complete / Frozen** at the project level.

## Canonical Experience

Public route:

`/contact`

The experience remains one restrained editorial Contact scene followed by the shared Footer.

The four required visitor-facing fields remain:

- Name
- Email
- I’m writing about
- Message

Canonical subject categories remain:

- Artworks
- Collaboration
- General

The contextual subject explanation remains inline and does not become a modal or secondary navigation system.

## Interaction States

The canonical states remain:

- `idle`
- `submitting`
- `success`
- `error`
- `rateLimited`

Editing after success, error or rate-limited feedback returns the form to its normal state.

## Contact / Newsletter Boundary

Contact remains a private conversation channel.

A Contact submission must not implicitly subscribe the visitor to Newsletter or any future marketing/editorial communication.

Newsletter remains a separate permission-based experience.

Future account, collector, commerce or CRM capabilities must preserve this consent boundary unless a later approved specification explicitly changes the model.

## Public Correspondence Address

The displayed address remains provisionally:

`rolando@delcarmen.art`

The supplied v1.0 specification states that it is display-only until final email infrastructure exists.

This audit does not promote it to an active `mailto:` destination.

Final domain and mailbox activation remain Production QA responsibilities.

## Motion and Accessibility

The form remains one functional unit for entrance motion.

Motion must not delay required functionality or depend on elapsed time while the visitor is elsewhere.

Explicit labels, autocomplete behavior, accessible subject feedback, honeypot keyboard exclusion and reduced-motion behavior remain part of the approved experience.

## Freeze Governance

Contact should not be redesigned during Phase 1 unless a verified bug, accessibility defect, production issue or explicitly approved experience revision requires a change.

Frozen protects the approved experience but does not cancel deferred production work or future explicitly approved evolution.

## Audit Note

Version 1.1 uses the conservative documentation method.

The complete supplied v1.0 specification is preserved above apart from Version metadata.

No approved field, subject category, state, accessibility requirement, consent boundary or deferred production responsibility has been removed.
