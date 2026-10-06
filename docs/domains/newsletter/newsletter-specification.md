# Newsletter Specification
Version: 1.1
Document ID: DOC-NEWS-SPEC
Project: Del Carmen Digital Experience
Parent Brand: Rō Visual
Document Type: Domain Specification
Authority Level: High
Status: 🟢 Approved / Frozen
Owner: Del Carmen Digital Experience
Last Updated: 2026-09-08

---

# Purpose
Newsletter is the canonical permission-based subscription experience. It is separate from Contact: Contact initiates a private conversation; Newsletter establishes explicit permission for occasional ongoing communication.

Newsletter v1.0 is integrated into Home → Invitation / Newsletter and has no standalone `/newsletter` page. Email is the only required public field.

# Canonical Flow
Subscribe → pending → confirmation email → double opt-in confirmation → active → `newsletter:subscribers` → unsubscribe → unsubscribed.

An unsubscribed address may resubscribe and repeat double opt-in. A superseded pending confirmation token is invalidated. Confirmation tokens expire after 24 hours.

# States
Persistence: `pending`, `active`, `unsubscribed`.

Interface: `idle`, `submitting`, `pendingConfirmation`, `confirmed`, `unsubscribed`, `invalidConfirmation`, `invalidUnsubscribe`, `error`, `alreadySubscribed`, `rateLimited`.

# Form and Experience
The Invitation scene remains visual owner. Newsletter owns functional subscription behavior. The form uses the shared `Button` with `variant="outline"` and semantic Del Carmen color tokens. Contact remains a separate editorial action.

# Persistence and Delivery
Upstash Redis is the v1.0 source of truth.

Keys:
- `newsletter:subscriber:<email>`
- `newsletter:subscribers`
- `newsletter:confirmation:<tokenHash>`
- `newsletter:unsubscribe:<tokenHash>`

Resend transports confirmation email. Final sender-domain verification, DNS authentication and production delivery validation are deferred to Production QA.

# Protection
Server validation, email normalization, honeypot, Upstash sliding-window rate limiting (5 requests / 10 minutes / resolved client IP), cryptographically random tokens, SHA-256 token lookup, 24-hour confirmation expiry and superseded pending-token invalidation are implemented.

# Accessibility
The email field has an explicit label and email autocomplete semantics. Feedback uses an `aria-live="polite"` region. Reduced motion remains governed by the approved Invitation motion.

# Production Status
Validated: new subscription, pending persistence, confirmation delivery, double opt-in, active persistence, duplicate-active detection, honeypot, rate limiting, unsubscribe, repeated-unsubscribe invalidation, resubscription, and old pending-token invalidation.

Production build: Next.js 16.2.12 / webpack; compilation and TypeScript successful; 54/54 static pages generated. Home remained static and Newsletter API routes dynamic.

# Status
Newsletter v1.0 is Approved / Complete / Frozen. Reopen only for a verified bug, accessibility defect, production issue or explicitly approved experience revision.


---

# Conservative Audit Addendum — 2026-10-05

This addendum preserves the complete Newsletter Specification v1.0 above.

Newsletter remains **Approved / Complete / Frozen** at the project level.

## Canonical Public Surface

Newsletter remains integrated into:

`Home → Invitation / Newsletter`

Newsletter does not introduce a standalone `/newsletter` page in v1.0.

Email remains the only required public subscriber field.

## Consent Boundary

Newsletter is the canonical permission-based subscription experience.

It remains distinct from Contact.

A Contact submission must never subscribe a visitor implicitly.

Future Collector, account, marketplace, CRM, community or other platform capabilities must preserve explicit subscription consent unless a later approved specification deliberately changes the model.

## Double Opt-In

Double opt-in remains mandatory.

The approved lifecycle begins with a pending subscription request and requires confirmation before the subscriber becomes active.

Confirmation tokens:

- expire after 24 hours;
- use hashed lookup storage;
- are invalidated when superseded by a newer pending confirmation token.

## Subscriber Lifecycle

The validated lifecycle remains:

```text
Subscribe
→ Pending
→ Confirm
→ Active
→ Unsubscribe
→ Unsubscribed
→ Resubscribe
→ Pending
→ Confirm
→ Active
```

Unsubscribe and later resubscription are therefore intentional parts of the domain rather than exceptional failure states.

## Canonical Endpoints

The canonical server endpoints remain:

`POST /api/newsletter`

`GET /api/newsletter/confirm`

`GET /api/newsletter/unsubscribe`

## Source of Truth

Upstash Redis remains the canonical v1.0 source of truth.

Active subscribers remain represented by subscriber records and membership in:

`newsletter:subscribers`

This Phase 1 implementation choice does not prohibit a later approved persistence migration.

A future migration must preserve consent state and lifecycle semantics.

## Protection

Newsletter continues to require:

- server-side validation;
- email normalization;
- honeypot protection;
- rate limiting.

The canonical rate limit remains five requests per ten minutes per resolved client IP.

## Freeze Governance

Newsletter should not be redesigned during Phase 1 unless a verified bug, accessibility defect, production issue or explicitly approved experience revision requires a change.

Frozen does not cancel Production QA responsibilities or prohibit a later explicitly approved infrastructure migration.

## Audit Note

Version 1.1 uses the conservative documentation method.

The complete supplied v1.0 specification is preserved above apart from Version metadata.

No consent rule, lifecycle state, endpoint, source-of-truth decision, protection requirement or future possibility has been removed.
