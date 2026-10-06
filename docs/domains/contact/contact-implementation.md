# Contact Implementation

Version: 1.1

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


---

# Conservative Audit Addendum — 2026-10-05

This addendum preserves the complete Contact Implementation v1.0 above.

The module remains **Approved / Complete / Frozen**.

## Canonical Runtime Boundary

Public page:

`src/app/contact/page.tsx`

Server endpoint:

`src/app/api/contact/route.ts`

Public URL:

`/contact`

Server URL:

`/api/contact`

The public Contact page remains statically prerenderable while submission processing remains isolated in the dynamic server route.

## Canonical Form and Validation

Visitor-facing payload:

- name
- email
- subject
- message

Bot-detection honeypot:

`contactField`

Canonical subject values:

- `artworks`
- `collaboration`
- `general`

Canonical server limits remain:

- name: maximum 100 characters
- email: maximum 254 characters
- subject: approved membership
- message: maximum 5000 characters

The server remains responsible for normalization and validation.

## Delivery

Resend remains the canonical Phase 1 Contact delivery provider.

The visitor email remains assigned to `replyTo`.

The supplied v1.0 implementation records real delivery and Reply-To behavior as verified.

Current development sender:

`Del Carmen <onboarding@resend.dev>`

This sender remains temporary development infrastructure.

It must not be reclassified as the final production sender.

## Abuse Protection

The canonical Phase 1 protection remains:

- server-side validation;
- `contactField` honeypot;
- Upstash Redis rate limiting.

Canonical limiter:

`Ratelimit.slidingWindow(5, "10 m")`

The project completion decision describes this as five requests per ten minutes per resolved client IP.

HTTP 429 continues to map to the approved rate-limited client state.

## Secrets

The documented environment variables remain server-side responsibilities:

- `RESEND_API_KEY`
- `CONTACT_EMAIL_TO`
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

Secrets must never be committed to the repository.

## Production Validation Record

The supplied implementation records the 2026-09-07 production build as successful:

```text
Next.js 16.2.12 (webpack)
Compiled successfully
TypeScript completed successfully
Static generation: 51/51
/contact        Static
/api/contact    Dynamic server route
```

This remains a historical validation record.

It is not a claim that every future build automatically has the same result.

## Deferred Production QA — Preserved

The following remain explicitly deferred rather than evidence of incomplete Contact v1.0:

- final `.art` versus `.com` domain decision;
- public correspondence mailbox creation and verification;
- activation of the public `mailto:` destination;
- replacement of the Resend onboarding sender;
- DNS sender authentication, including SPF/DKIM/DMARC as required;
- end-to-end production delivery testing;
- controlled npm security review.

These items must not be deleted merely because Contact itself is frozen.

The supplied implementation also states that forced npm audit remediation should not be performed during Phase 1 without reviewing dependency impact.

## Future Infrastructure

Resend and Upstash are canonical Phase 1 implementation choices.

Their current use does not prohibit a later explicitly approved provider or infrastructure migration.

Likewise, future CRM, collector or account integrations must not silently couple Contact submissions to Newsletter or marketing consent.

Any such evolution requires an explicit data/consent decision.

## Freeze Governance

Contact should be reopened only for a verified bug, accessibility defect, production issue or explicitly approved experience revision.

Deferred Production QA does not constitute a redesign of the Contact experience.

## Audit Note

Version 1.1 uses the conservative documentation method.

The complete supplied v1.0 implementation document is preserved above apart from Version metadata.

No implemented delivery, validation, abuse-protection or deferred production responsibility has been removed because it is not yet production-final.
