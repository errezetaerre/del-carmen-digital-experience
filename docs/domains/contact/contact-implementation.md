# Contact Implementation

Version: 1.0

Document ID: DOC-CON-IMP

Project: Del Carmen Digital Experience

Parent Brand: Rō Visual

Document Type: Implementation

Authority Level: High

Status: 🟢 Approved / Complete / Frozen

Owner: Del Carmen Digital Experience

Last Updated: 2026-09-07

---

## Ownership

Public page:

`src/app/contact/page.tsx`

Domain:

`src/domains/contact/`

Server endpoint:

`src/app/api/contact/route.ts`

Shared Footer:

`src/shared/layout/footer/`

## Canonical Structure

```text
src/app/contact/page.tsx
src/app/api/contact/route.ts
src/domains/contact/index.tsx
src/domains/contact/sections/contact/ContactExperience.tsx
src/domains/contact/sections/contact/ContactForm.tsx
src/domains/contact/sections/contact/ContactMotion.tsx
```

## Rendering Architecture

ContactExperience owns the visual scene and composes ContactForm. ContactMotion is a small Client Component because GSAP requires browser-specific behavior. The public Contact page remains statically prerenderable; submission processing is isolated in the dynamic API route.

## Form Model

The visitor-facing payload contains name, email, subject and message. A non-visible `contactField` honeypot is also submitted for bot detection.

Canonical subject values:

- `artworks`
- `collaboration`
- `general`

Client states:

- `idle`
- `submitting`
- `success`
- `error`
- `rateLimited`

## Server Validation

The API route normalizes and validates incoming values before delivery. The canonical limits include a maximum name length of 100 characters, maximum email length of 254 characters, approved subject membership and maximum message length of 5000 characters. Invalid requests are rejected server-side.

## Honeypot

The honeypot field is named `contactField`. When populated, the endpoint returns a successful-looking response without sending an email. This behavior has been functionally verified.

## Email Delivery

Resend is the canonical Phase 1 delivery provider for Contact.

Environment variables:

- `RESEND_API_KEY`
- `CONTACT_EMAIL_TO`

Secrets must remain server-side and must never be committed to the repository.

Current development sender:

`Del Carmen <onboarding@resend.dev>`

The submitted visitor address is assigned to `replyTo`. Real delivery and Reply-To behavior have been verified.

The development sender is temporary and must be replaced after the final Del Carmen domain is selected and verified.

## Rate Limiting

Upstash Redis and `@upstash/ratelimit` protect the endpoint.

Environment variables:

- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

Canonical limiter:

`Ratelimit.slidingWindow(5, "10 m")`

The client handles HTTP 429 explicitly and presents the approved rate-limited feedback state. Upstash connectivity and limiter behavior have been functionally verified.

## Motion

ContactMotion uses `useLayoutEffect`, `gsap.context()` and a restrained timeline. It reveals the editorial invitation first and then the form as one functional unit. Cleanup uses `context.revert()`. Reduced-motion users receive visible content without the animated entrance.

The hydration visibility system includes `.contact-motion` only inside `prefers-reduced-motion: no-preference`.

## Design System

Contact uses the shared Container and shared Button. The Send action uses the `outline` variant because it commits a form action. Canonical Primary Gold and semantic success/error tokens are used; raw amber utility colors are not part of the approved Contact implementation.

## Production Validation

Production build executed on 2026-09-07:

```text
Next.js 16.2.12 (webpack)
Compiled successfully
TypeScript completed successfully
Static generation: 51/51
/contact        Static
/api/contact    Dynamic server route
```

## Deferred Production QA

The following are intentionally deferred rather than incomplete Contact implementation:

- final `.art` versus `.com` domain decision;
- creation and verification of the public correspondence mailbox;
- activation of the public mailto destination;
- replacement of the Resend onboarding sender;
- DNS sender authentication, including SPF/DKIM/DMARC as required by the selected provider;
- end-to-end production delivery testing;
- controlled npm security review.

No forced npm audit remediation should be performed during Phase 1 without reviewing dependency impact.

## Freeze Rule

Contact v1.0 is complete, approved and frozen. It should be reopened only for a verified bug, accessibility defect, production issue or explicitly approved experience revision.
