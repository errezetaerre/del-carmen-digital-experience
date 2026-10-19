# Newsletter Implementation
Version: 1.5
Document ID: DOC-NEWS-IMP
Project: Del Carmen Digital Experience
Parent Brand: Rō Visual
Document Type: Technical Implementation
Authority Level: High
Status: 🟢 Approved / Complete / Frozen
Owner: Del Carmen Digital Experience
Last Updated: 2026-10-18

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

---

## Data Minimisation and Retention Proposal — 2026-10-15

**Historical proposal.** Rolando subsequently confirmed these periods. The implementation and current operational status are recorded in the approved-retention addendum below; statements here about expiry not yet being implemented describe the earlier patch.

### Implemented in the patch

`POST /api/newsletter` now configures Upstash Ratelimit with `analytics: false`. The optional identifier-based analytics history is disabled. The five-requests-per-ten-minutes limiter, IP-based identifier, prefix, response headers and lifecycle handlers retain their source. The Contact endpoint receives the same configuration change.

This does not purge analytics already collected, remove rate-limit counters or change provider/hosting logs. Account-specific retention must be verified in production. Reference: [Upstash Ratelimit features](https://upstash.com/docs/redis/sdks/ratelimit-ts/features#analytics--dashboard).

### Proposed policy — not implemented or represented as a live promise

These are proposed operational limits for review, not durations prescribed by law.

| Record | Proposed retention | Purpose and handling |
| --- | --- | --- |
| Unconfirmed request | 24 hours from the latest valid request | Align the pending subscriber record with its confirmation-link expiry. |
| Active subscriber | While the confirmed subscription and its purpose remain active; review necessity at least annually | Keep the active-set membership, necessary consent dates and a usable unsubscribe mechanism. No tracking pixel or email-open history is required by this proposal. |
| Unsubscribed record | At most 30 days after unsubscribe | Retain only the minimum record needed to verify and resolve unsubscribe incidents, then delete it. The need for this short follow-up period must be confirmed before adoption. |
| A valid deletion request | Handle separately from scheduled retention | Do not delay a rights request until a routine retention deadline. |

Unsubscribe must stop inclusion in the active audience immediately. The proposed 30-day follow-up must never keep an address eligible for sending. A fresh, explicit confirmation is required to reactivate a subscription after withdrawal.

Costa Rica's Law 8968 requires removing data that no longer serves its purpose. Article 7 sets a five-business-day period for resolving the relevant personal-data requests. These requirements inform the review; the proposed 24-hour/30-day operational limits do not replace individual rights or establish compliance by themselves. [Reference text](https://www.tse.go.cr/pdf/normativa/leydeprotecciondelapersona.pdf).

### Requirements before implementing expiry

- Apply pending expiry only while the record is still pending. An old request must not expire or delete a subsequently confirmed subscriber.
- Confirmation and unsubscribe must update the subscriber record, lookup tokens and active-set membership consistently. A resubscription must not inherit an old unsubscribe expiry.
- Do not give an active subscriber record or its valid unsubscribe lookup the pending-record TTL.
- Handle existing pending/unsubscribed records through a separately reviewed migration with an inventory/dry run. Approval of a future retention policy does not authorise deleting existing live data indiscriminately.
- Expiring a subscriber key must not leave its email in the active set or leave unmanaged token lookups. Use a bounded, consistent cleanup design rather than a blanket Redis flush.
- Verify the installed Redis SDK and runtime before selecting atomic operations or a scheduled mechanism. No runtime packages/configurations were supplied with the source snapshot.

The delivered patch introduces no new expiry, cleanup job or deletion operation. Existing confirmed subscribers and the confirmation/unsubscribe handlers remain unchanged. Privacy keeps its current draft wording until the policy and enforcement are complete.

### Providers and manual requests

Redis expiry cannot delete delivered email from Gmail or copies held by Resend. Resend documents account/plan-dependent retention; verify the actual account and applicable processing terms before promising a provider-wide deletion date. [Resend security information](https://resend.com/security).

Requests arrive at the public correspondence address in `src/config/legal.ts`. Record receipt, verify identity proportionately, identify the relevant data and resolve the request under the applicable rules. Keep only the minimum evidence needed for that handling, with a separately justified retention decision.

Production verification must include legitimate confirmation/resubscription races, blocked requests, successful form delivery, provider retention and rights-request handling. This document records a review proposal, not a deployment or live-data deletion.

---

## Approved Retention Implementation — 2026-10-15

Rolando confirmed the proposed periods. This addendum supersedes the historical proposal's pending-approval and no-expiry status. It describes delivered source, not an installed production change or a live-data cleanup.

### Current lifecycle ownership

The three existing API routes delegate persistence transitions to `src/domains/newsletter/server/subscriberLifecycle.ts`. It uses the existing `@upstash/redis` dependency and `eval(script, keys, args)`; no scheduler, new provider, environment secret or additional package is introduced. All accessed keys are passed through the EVAL keys array.

| Transition | Subscriber record | Lookup and audience handling |
| --- | --- | --- |
| New/repeated valid request, unless already active | Pending record: 86,400 seconds from the new request | New confirmation lookup: 86,400 seconds. Remove any stale active-set membership. |
| Confirm current pending token | Active record: persistent, with no pending TTL | Consume the current confirmation lookup; create persistent unsubscribe lookup; add active-set membership. |
| Unsubscribe with the current active token | Minimal record: `email`, `status`, `unsubscribedAt`; TTL 2,592,000 seconds | Remove active-set membership immediately and consume the unsubscribe lookup in the same atomic operation. |
| Resubscribe after unsubscribe | New pending record: 24 hours, replacing the former 30-day TTL | Require fresh confirmation; successful activation removes the pending expiry again. |
| Confirmation delivery fails | Delete only the matching pending request | Remove only that request's confirmation lookup. A newer request, active subscriber or subsequent unsubscribe record must survive. If cleanup fails, pending keys still expire within 24 hours. |

A replaced confirmation lookup remains only until its original 24-hour expiry. It cannot activate a subscriber once the stored confirmation hash changes. This bounded choice avoids reading one version of a subscriber and deleting a later request's keys. No orphaned active-set membership is created by pending expiry: pending records are excluded from the audience before the request completes.

Confirmation and unsubscribe recheck lookup ownership, stored status and the current token hash inside the write operation. A read that becomes stale between the initial lookup and EVAL cannot reactivate or withdraw a different subscription. Stored subscriber identity and audience key type are checked before the lifecycle writes. Redis script atomicity does not provide rollback for arbitrary runtime failures; production SDK/service validation remains required.

The existing key names and existing active-subscriber token fields are retained. The confirmation email template, sender configuration, validation, rate-limit policy and Home result redirects remain unchanged. `analytics: false` remains configured on both forms. API lookup failures now follow the existing error/invalid-result paths instead of leaving an unhandled read outside the lifecycle try/catch.

### Operational and historical-data limits

- Active records and valid unsubscribe lookups deliberately have no automatic expiry; necessity is reviewed annually by the operator.
- Contact's 12-month rule is a manual inbox process. Redis cannot delete received mail or provider copies.
- Existing pending/unsubscribed records without a TTL are not silently migrated. Inventory and a dry run are required before a separate targeted migration. New transitions apply the approved limits when this patch is installed.
- The current source has no campaign-sending implementation. Confirmation generates an unsubscribe token, but future outgoing newsletter delivery still needs a working recipient-specific unsubscribe mechanism. This patch does not claim campaign sending is production-ready or add a new mail flow.
- Individual deletion requests follow their own process rather than waiting for the 24-hour/30-day schedule.

The owner's concrete procedures and pre-publication checklist are in `docs/architecture/data-retention-operations.md`. Privacy now describes the approved periods, while keeping its draft label and the legal layout's `noindex` until production enforcement, prior information/consent, provider checks and the remaining review are complete.

### Validation of this patch

Twenty-two isolated regression scenarios execute the actual compiled TypeScript handlers/helper and their Lua scripts, with Lua 5.4 and a deterministic Redis-command/expiry model. Next response handling, Resend and Ratelimit are stand-ins; no external account is contacted. Coverage includes expiry boundaries, fresh and stale tokens, resubscription, competing requests/confirmations, interrupted delivery, cleanup failure, malformed stored state, active-set consistency, rate limiting and preserved redirects/template.

All 207 supplied TypeScript/TSX/MTS/MJS source files parse successfully. Relative to the preceding retention-proposal snapshot, four existing source files change and one helper is added; the other 207 source files are byte-identical, including the approved visual modules. This does not replace a full build/typecheck, installed-SDK integration check or a staging run against real Redis. The root project configuration and dependencies were not provided.

Technical references: [Upstash EVAL](https://upstash.com/docs/redis/sdks/ts/commands/scripts/eval), [Upstash serialization](https://upstash.com/docs/redis/sdks/ts/advanced), [Redis SET expiry semantics](https://redis.io/docs/latest/commands/set/), [Redis scripting atomicity](https://redis.io/docs/latest/develop/programmability/).

---

## Prior Information and Newsletter Consent — 2026-10-15

The Newsletter form now provides prior information before the email field and an initially unchecked, required consent checkbox specifically for artwork, exhibition and studio emails. Its disclosure uses the same responsible-person configuration as Contact/Privacy; the consent purpose remains separate from enquiry handling. The email/Subscribe row is retained on wider screens, while the native form follows email → consent → submit order on smaller screens.

The POST body adds `consent` and `consentVersion`. The API requires `consent === true` and the exact current notice revision before generating a token, writing subscriber data or sending a confirmation. Missing consent returns `consent_required`; an absent/old revision returns `consent_outdated`, both with HTTP 400. A rejected attempt leaves an existing pending request untouched. Rate limiting remains before body parsing and honeypot handling remains before the consent gate.

The server helper adds this object to new pending records:

```ts
consent: {
    noticeVersion: formPrivacy.version,
    purpose: formPrivacy.newsletter.purpose,
    statement: formPrivacy.newsletter.consentLabel,
    acceptedAt: requestedAt,
}
```

The timestamp is set by the server and identifies receipt of the declaration; client timestamps/purposes do not replace it. Lua confirmation preserves this evidence and records `confirmedAt` separately. Checking the box never activates a subscription by itself. The 24-hour pending TTL, persistent active/unsubscribe lookup behavior, atomic race protection and 30-day minimal unsubscribe TTL are unchanged. The unsubscribe transition still reduces the record to `email`, `status` and `unsubscribedAt`; it does not retain the consent object indefinitely after withdrawal.

Existing subscriptions and previously issued confirmation links are not assigned a fictional checkbox record. Their confirmation behavior is retained; legacy evidence must be reviewed separately during the historical-data inventory. This delivery does not send a reconfirmation campaign, backfill consent, delete live records or add a campaign sender.

The frontend blocks missing consent before fetch even if native validation is bypassed. Success clears the checkbox; stale-version responses preserve the email and request a reload/new choice. Generic failures retain user input for retry. Existing Home result feedback and the confirmation email template retain their behavior/content.

See `docs/architecture/form-privacy-consent.md` for revision wording, validation and operational limits. The form, shared components/configuration, API and helper must be installed together. Full project compilation, provider delivery, live unsubscribe distribution and final publication checks remain outstanding.

# EN/ES Newsletter, confirmation copy and consent — 2026-10-18

Newsletter remains inside Home Invitation/Suspense, with no standalone route. All form labels, privacy details, consent, validation feedback, pending/confirmed/unsubscribed/invalid/active/rate/error states and submit copy now follow locale. The temporary English wrapper is removed. Checkbox acceptance is tied to language/version; error keys resolve at render time. Form geometry, endpoint field names and existing result-state keys remain exact.

POST accepts an optional `locale`: omitted means legacy English; only exact `en`/`es` otherwise. It validates boolean consent and the matching server registry version: unchanged English `2026-10-15.1` or Spanish `2026-10-18.1-es`. Stored consent is generated from server copy, including language/version/purpose/statement/acceptedAt. The subscriber helper's sixth language argument defaults to English. No historical subscription is rewritten or given invented language.

The extracted `server/confirmationEmail.ts` retains email geometry/styles and English visible wording, provides Spanish copy/HTML language, and escapes translated content/confirmation URL attributes. Sender configuration and confirmation expiry stay unchanged. Spanish confirmation URLs append `locale=es`. Confirm/unsubscribe redirects localize their Home destination while preserving `newsletter` result keys and `#invitation`. Allowed query locale is presentation only; it does not change the accepted notice or subscription authorization.

All Redis scripts, pending/active TTL rules, active Set, token/hash/lookup lifecycle, race-safe cleanup, rate/honeypot and minimal 30-day unsubscribe record stay byte-exact. Existing English links remain valid. Future newsletter-delivery code should carry the stored language (with legacy English fallback) into content/result links; this increment does not implement campaigns or deliver a new welcome email.

Production build/TypeScript and compiled component/route/helper/provider fixtures plus GET verification pass. Tests use a simulated mail/Redis transport, never real subscribers or mail. Current lint retains the pre-existing query-result synchronization `react-hooks/set-state-in-effect` finding, verified against v5 with no new finding. Browser hydration/native validation/accessibility, real delivery/persistence and domain/sender QA remain open. Refer to DOC-I18N for installation and the overall release gate.
