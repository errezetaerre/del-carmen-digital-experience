# Newsletter Wireframe
Version: 1.0
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
