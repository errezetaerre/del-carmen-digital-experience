# Newsletter Wireframe
Version: 1.1
Document ID: DOC-NEWS-WF
Project: Del Carmen Digital Experience
Parent Brand: Rō Visual
Document Type: Experience / Wireframe
Authority Level: High
Status: 🟢 Approved / Frozen
Owner: Del Carmen Digital Experience
Last Updated: 2026-09-08

---

# Canonical Composition
Home
└── Invitation / Newsletter
    ├── Del Carmen brand label
    ├── Primary closing statement
    ├── Journey statement
    ├── Newsletter
    │   ├── Label
    │   ├── Supporting description
    │   ├── Email input
    │   ├── Subscribe action
    │   └── Status / explanatory message
    └── Contact action

# Editorial Hierarchy
Brand → Painting the Eternal Essence Within → Let's continue the journey. → Newsletter invitation → Email + Subscribe → Status/support copy → Contact.

Newsletter must not transform the closing scene into a conventional marketing signup panel.

# Responsive Composition
Desktop/wide: restrained centered form; email occupies the flexible region and Subscribe remains compact.

Mobile: Email → Subscribe → status/support copy. No modal, drawer or separate Newsletter route.

# States
Idle: field, action and explanatory copy.
Submitting: progress state; action disabled.
Pending: check-inbox message.
Confirmed: success message.
Unsubscribed: success message.
Already subscribed: Primary Gold informational message.
Invalid confirmation / invalid unsubscribe / rate limited / error: restrained error messaging.

# Interaction and Motion
Typing after applicable feedback restores normal form state. Subscribe uses shared `outline` Button. Contact retains its approved editorial LinkButton treatment.

Newsletter owns no independent entrance animation. Existing Invitation motion reveals the Newsletter region as one compositional unit and preserves reduced-motion behavior.

# Accessibility
Explicit Email label, email semantics/autocomplete, `aria-live="polite"` feedback, and honeypot outside normal keyboard interaction.

# Return Context
Confirmation and unsubscribe flows return to `/#invitation` with Newsletter result state so the visitor returns to the same editorial context.

# Status
Canonical Newsletter v1.0 wireframe — Approved / Frozen.


---

# Conservative Audit Addendum — 2026-10-05

This addendum preserves the complete Newsletter Wireframe v1.0 above.

The wireframe remains **Approved / Frozen**.

## Canonical Placement

Newsletter remains part of the Home closing experience:

```text
Home
└── Invitation / Newsletter
```

It does not become a standalone page in v1.0.

The form remains visually integrated into the Invitation scene rather than creating a second design or motion system.

## Interaction Meaning

The email field and Subscribe action represent an explicit permission request.

The visual compactness of the form must not obscure that consent meaning.

Contact and Newsletter remain separate visitor intents.

## States and Feedback

The existing wireframe remains responsible for presenting the documented Newsletter feedback states without replacing the Home Invitation with a dashboard-like subscription interface.

Confirmation and unsubscribe responses may be handled by their documented server flows while the public subscription surface remains Home.

## Responsive Behavior

The Newsletter experience remains usable in natural document flow across responsive layouts.

It should inherit the approved Home Invitation hierarchy rather than forcing a separate newsletter-specific page composition.

## Shared Design System

The Subscribe action continues to reuse the shared Button system with the approved `outline` treatment.

Newsletter does not establish a duplicate component, typography, token or motion system.

## Future Evolution

Future subscriber preferences, account settings, Collector integration, community communication or editorial segmentation may require new experiences.

Those possibilities are not cancelled by v1.0.

They also must not be inferred as already approved from this wireframe.

Any future expansion must preserve explicit consent and be documented when requirements exist.

## Audit Note

Version 1.1 uses the conservative documentation method.

The complete supplied v1.0 wireframe is preserved above apart from Version metadata.

No approved placement, interaction, responsive behavior or future possibility has been removed.
