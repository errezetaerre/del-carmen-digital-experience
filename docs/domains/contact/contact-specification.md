# Contact Specification

Version: 1.0

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
