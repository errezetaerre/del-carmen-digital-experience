# Newsletter Implementation
Version: 1.1
Document ID: DOC-NEWS-IMP
Project: Del Carmen Digital Experience
Parent Brand: Rō Visual
Document Type: Technical Implementation
Authority Level: High
Status: 🟢 Approved / Complete / Frozen
Owner: Del Carmen Digital Experience
Last Updated: 2026-09-08

---

# Architecture
Client domain:
- `src/domains/newsletter/index.ts`
- `src/domains/newsletter/NewsletterForm.tsx`

Server:
- `src/app/api/newsletter/route.ts`
- `src/app/api/newsletter/confirm/route.ts`
- `src/app/api/newsletter/unsubscribe/route.ts`

Newsletter integrates into Home Invitation. There is intentionally no `src/app/newsletter/page.tsx` and no standalone `/newsletter` route.

`NewsletterForm` owns email/honeypot state, submission state, feedback and Newsletter query-result interpretation. It uses `useSearchParams`; Invitation wraps it in React Suspense while Home remains static.

# POST /api/newsletter
Resolves IP → rate limits → parses request → normalizes → honeypot → validates → reads existing subscriber → rejects active duplicate → generates random confirmation token → hashes token → creates pending subscriber → invalidates prior pending token when applicable → persists subscriber and 24-hour confirmation lookup → sends Resend confirmation → cleans unusable pending state if delivery fails → returns pending success.

# Subscriber Model
Fields: `email`, `requestedAt`, `confirmedAt`, `unsubscribedAt`, `source`, `status`, `confirmationTokenHash`, `unsubscribeTokenHash`.

Status: `pending | active | unsubscribed`.

# Confirmation
`GET /api/newsletter/confirm?token=<token>` validates and hashes the token, resolves pending state, activates the subscriber, records confirmation, establishes unsubscribe-token lookup, adds the email to `newsletter:subscribers`, consumes confirmation lookup, and redirects to Home Invitation.

# Unsubscribe
`GET /api/newsletter/unsubscribe?token=<token>` validates and hashes the token, resolves the subscriber, marks it unsubscribed, records `unsubscribedAt`, removes it from the active set, consumes the unsubscribe lookup, and redirects to Home Invitation. A consumed unsubscribe token is invalid. An unsubscribed address may subscribe again.

# Persistence
- `newsletter:subscriber:<email>`
- `newsletter:subscribers`
- `newsletter:confirmation:<confirmationTokenHash>`
- `newsletter:unsubscribe:<unsubscribeTokenHash>`

Upstash Redis is canonical persistence. Resend is confirmation transport.

# Protection
Honeypot, server validation, normalization, Upstash sliding-window rate limiting (5/10m/IP), random tokens, SHA-256 token hashes, expiring confirmation lookup and superseded-token invalidation.

# Validated Lifecycle
New → pending → email → confirm → active → active Set → unsubscribe → unsubscribed → removed from Set → repeated unsubscribe invalid → resubscribe → pending → confirm → active → restored to Set.

Honeypot and rate-limit behavior were also validated.

# Production Build
Next.js 16.2.12 / webpack:
- Compiled successfully
- TypeScript successful
- Static generation 54/54
- `○ /`
- `ƒ /api/newsletter`
- `ƒ /api/newsletter/confirm`
- `ƒ /api/newsletter/unsubscribe`

# Deferred Production Infrastructure
Final public domain, sender address, sender-domain verification, DNS authentication, production deliverability and production environment verification belong to Production QA.

# Status
Newsletter v1.0 is Approved / Complete / Frozen. Next Phase 1 focus: Responsive QA global.


---

# Conservative Audit Addendum — 2026-10-05

This addendum preserves the complete Newsletter Implementation v1.0 above.

The module remains **Approved / Complete / Frozen**.

## Canonical Runtime Architecture

Client domain remains under:

`src/domains/newsletter/`

Canonical server routes remain:

`src/app/api/newsletter/route.ts`

`src/app/api/newsletter/confirm/route.ts`

`src/app/api/newsletter/unsubscribe/route.ts`

Public API contract:

`POST /api/newsletter`

`GET /api/newsletter/confirm`

`GET /api/newsletter/unsubscribe`

## Consent and Persistence

Double opt-in remains mandatory.

Upstash Redis remains the canonical v1.0 source of truth.

Confirmation tokens continue to expire after 24 hours and use hashed lookup.

Superseded pending confirmation tokens remain invalidated.

Active membership continues to be represented through the documented subscriber record and `newsletter:subscribers` membership.

## Lifecycle Integrity

The implementation must preserve the validated lifecycle:

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

A future persistence/provider migration must preserve these semantics rather than flattening all email addresses into an undifferentiated mailing list.

## Abuse Protection

The canonical v1.0 protection remains:

- server-side validation;
- normalized email;
- honeypot;
- Upstash Redis rate limiting.

Canonical limit:

five requests per ten minutes per resolved client IP.

## Production Validation Record

The project completion decision records a successful production build with:

- Next.js 16.2.12 using webpack;
- successful compilation;
- successful TypeScript validation;
- 54 of 54 static pages generated;
- Home remaining statically prerendered;
- all three Newsletter API endpoints remaining dynamic server routes.

This is a historical validation record, not a guarantee about every future build.

## Production QA — Preserved

Final public domain configuration, sender-domain verification, DNS authentication and production delivery validation remain Production QA responsibilities.

These tasks do not reopen the approved Newsletter experience.

They must not be deleted merely because Newsletter v1.0 is complete.

## Provider and Infrastructure Evolution

The current v1.0 implementation establishes the canonical Phase 1 architecture.

Future approved infrastructure may migrate persistence, email delivery or subscriber-management responsibilities if a demonstrated requirement justifies it.

Such a migration must preserve:

- explicit consent;
- pending versus active distinction;
- confirmation security;
- unsubscribe;
- resubscription;
- abuse protection;
- privacy boundaries.

Current completion does not make future architecture impossible.

Future possibility does not make speculative migration necessary now.

## Contact Boundary

Newsletter subscription data must remain distinct from Contact submissions.

Contact cannot silently populate the active subscriber set.

Any future cross-system integration requires an explicit consent and data-governance decision.

## Freeze Governance

Newsletter should not be redesigned during Phase 1 unless a verified bug, accessibility defect, production issue or explicitly approved experience revision requires a change.

## Audit Note

Version 1.1 uses the conservative documentation method.

The complete supplied v1.0 implementation document is preserved above apart from Version metadata.

No implemented consent, lifecycle, security, persistence or Production QA responsibility has been removed because it may evolve later.
