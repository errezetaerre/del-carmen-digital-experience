# Newsletter Implementation
Version: 1.0
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
