# Contact Implementation

Version: 1.7

Document ID: DOC-CON-IMP

Project: Del Carmen Digital Experience

Parent Brand: Rō Visual

Document Type: Implementation

Authority Level: High

Status: 🟢 Approved / Complete / Frozen

Owner: Del Carmen Digital Experience

Last Updated: 2026-10-18

---

## Ownership

Public page:

`src/app/[locale]/contact/page.tsx`

Domain:

`src/domains/contact/`

Server endpoint:

`src/app/api/contact/route.ts`

Shared Footer:

`src/shared/layout/footer/`

## Canonical Structure

```text
src/app/[locale]/contact/page.tsx
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

`src/app/[locale]/contact/page.tsx`

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

---

## Public Correspondence Email — 2026-10-15

Rolando approved `errezetaerre@gmail.com` as the temporary public contact while the domain and domain-based email are being prepared.

`ContactForm.tsx` now reads the email from `legalContact` in `src/config/legal.ts`. The existing direct-correspondence text becomes a `mailto:` link with a visible focus style. The same configuration supplies the contact details in Privacy and Terms; those pages remain drafts pending the remaining content/data-handling review.

Form fields, validation, submission behavior, status feedback, Resend calls, honeypot and rate limiting are unchanged. The displayed correspondence email and the API recipient are separate configurations. In the complete application, set or verify `CONTACT_EMAIL_TO=errezetaerre@gmail.com` to direct form deliveries to that inbox. This patch does not edit the deployment environment or send a test email.

The authorised residential notification address is used by the legal notices; ContactForm displays only the public email. The legal configuration is public data and contains no credentials.

For a later domain-email migration, update the public email in `src/config/legal.ts` and separately review the API recipient and verified sender configuration. For a move, update the address in the legal configuration.

---

## Contact Retention Proposal and Rate-Limit Analytics — 2026-10-15

**Historical proposal.** The 12-month period has since been confirmed. See the approved operational procedure below. Contact inbox retention remains a manual responsibility.

The delivered Contact endpoint changes only `analytics: true` to `analytics: false` in its Upstash Ratelimit configuration. The limiter remains in place; validation, message delivery, honeypot and response paths retain their source. Existing provider analytics/logs are not deleted by changing that flag.

Proposed operational policy, pending review: keep an ordinary enquiry with no continuing transaction or dispute for at most **12 months after the last substantive exchange or closure**, then delete the project correspondence that is no longer needed. Review closed enquiry threads periodically so this is an actual process rather than an unenforced statement.

The source sends messages through Resend to a configured inbox; it does not create a Contact-message database. A future Redis cleanup cannot remove that inbox correspondence. Targeted review/deletion in the receiving mailbox and checks on provider copies are separate operational tasks. This delivery neither connects to the personal Gmail account nor deletes any message.

Contract, sale, accounting or dispute material requires its own justified retention analysis and is outside the proposed ordinary-enquiry rule. Do not apply a blanket mailbox purge or reuse this proposed period as a legal deadline for those records. Individual data requests must be handled independently of the routine enquiry-review schedule.

The related Newsletter proposal and implementation constraints are recorded in `docs/domains/newsletter/newsletter-implementation.md`, section “Data Minimisation and Retention Proposal”. No 12-month automatic deletion or final privacy-policy promise is introduced by this patch.

---

## Approved Contact Retention Procedure — 2026-10-15

Rolando confirmed **12 months after the last substantive exchange or closure, as applicable**, for ordinary closed enquiries without a continuing transaction or dispute. This supersedes the pending-review status of the historical proposal above. The source still sends Contact messages to the configured inbox and does not store a Contact-message database.

Implementation is therefore operational: review project enquiry threads, distinguish open/transaction/accounting/dispute matters, and delete eligible closed correspondence when its period ends. Do not apply this rule to the entire personal Gmail inbox or assume it deletes provider-held copies. No Gmail access, message deletion, inbox filter or scheduled automation is introduced by this source delivery.

The owner procedure, treatment of dates and exceptions, individual requests and production checks are documented in `docs/architecture/data-retention-operations.md`. Privacy's draft now states the approved period. The existing Contact endpoint and form remain byte-identical to the preceding patch, including `analytics: false`, validation, rate limiting and delivery configuration.

Newsletter's newly approved automated retention is implemented separately in its three lifecycle routes and shared server helper. Contact enquiries remain independent of newsletter subscriptions and consent. Existing historical newsletter data requires a separate inventory before any migration. Production delivery, provider retention, prior information/consent and final legal publication review remain outstanding.

---

## Prior Information and Explicit Consent — 2026-10-15

The approved continuation adds prior information and a purpose-specific, initially unchecked consent field to Contact. It reopens only this form/data-handling scope; the Contact page composition, existing enquiry categories and delivery provider remain in place.

`FormPrivacyNotice` appears before the visible data fields. It identifies the responsible person, explains the enquiry purpose and required fields, links to Privacy in a new tab and offers native expandable details covering recipients, handling, refusal, retention, rights and the responsible address. The public identity/address/email continue to come from `src/config/legal.ts`. `PrivacyConsentField` uses a native required checkbox with an associated label, notice and inline error. All four visible enquiry fields are marked required; Contact retains its custom validation flow.

The frontend posts `consent: true` and `consentVersion`. The API independently requires the boolean `true` and the exact current revision from `src/config/formPrivacy.ts`; missing consent and outdated revisions return 400 with `consent_required` or `consent_outdated`. Neither rejection sends an enquiry or subscribes the address. The existing antiabuse limiter still runs first, with optional analytics disabled; the honeypot retains its fake-success behavior.

The delivered enquiry email now includes the exact consent statement, purpose, notice revision, server-recorded UTC request time and Contact source. No separate Contact database, IP/agent audit trail, automatic reply or newsletter enrolment is added. The consent record shares the correspondence's ordinary retention procedure; it is not copied into an indefinite separate archive. Server time records receipt of the declaration, not an independently measured browser click or verified identity.

On successful submission the checkbox resets to unchecked. Errors preserve the entered information. A stale-notice error asks for a reload and new consent; it does not silently label an older notice as current. Submitting disables the new field and keeps repeated-submit protection. Malformed/nonobject JSON now returns 400 rather than falling into the generic Contact server-error path.

The wording revision and implementation/test record are in `docs/architecture/form-privacy-consent.md`. Contact/Newsletter UI and API files must be installed together. This source work does not verify live delivery, actual provider settings, final legal sufficiency or production readiness of the draft notices.


---

## Persistent Submission Feedback — 2026-10-16

The prior implementation placed Contact feedback below the action row and cleared success after five seconds. Success now appears above the action row, remains until editing begins and changes the disabled submit button to “Message sent”. Editing any existing visible field or the consent choice returns the form to its normal action state. Error and rate-limit feedback use the same visible region and preserve retry behavior.

The feedback region uses `role="status"`, polite live announcements and atomic content. A success effect requests native `scrollIntoView({ block: "nearest" })` so the acknowledgement can be brought into view without moving keyboard focus. The timeout is removed. The acknowledgement still depends on a successful API response; it is not a claim that the final mailbox received or read the email.

Only `ContactForm.tsx` changes in source. The Contact API, email body/consent evidence, Newsletter lifecycle, notice revision and all other modules retain their bytes. No visitor acknowledgement email or extra provider call is added.

The 17 existing isolated consent/submission scenarios pass with the updated component and current success wording. All 210 code files parse. The other 214 source files are byte-identical to the preceding consent patch. These checks use the previously documented stand-ins; browser rendering, native scrolling, real provider delivery and full-project build/typecheck remain to be verified in the complete application.

## EN/ES Contact and consent metadata — 2026-10-18

The shared public route is `src/app/[locale]/contact/page.tsx`, serving `/contact` and `/es/contact` with localized metadata. ContactExperience/Form labels, subject descriptions, errors and feedback use the same typed message system. Classes, fields, canonical subject values, endpoint, animation, honeypot and rate-limit settings retain the approved implementation. Source user text is never automatically translated.

Client field errors store message keys and resolve them at render time. Checkbox acceptance references its selected language and notice revision, so switching language cannot carry acceptance into a differently worded notice. Payloads add `locale` with existing consent/version fields. Shared notice/checkbox text and the approved address are rendered in the same language.

The server accepts omitted locale as legacy English, or exact `en`/`es`. Unsupported locale returns 400 `invalid_locale`. Consent must remain boolean true and the version must match the server's registered language copy; otherwise the existing consent-required/outdated contract blocks delivery. Contact records the exact server-selected statement, purpose, version, language, UTC time and localized source path in the operator email. It does not translate the visitor's message, change recipient/sender, create Contact persistence or send a new auto-reply.

English revision `2026-10-15.1` remains exact; Spanish revision `2026-10-18.1-es` is archived in DOC-FORM-PRIVACY-CONSENT. Retention and operator facts are unchanged. Build/TypeScript, actual compiled form/API fixtures and production GETs verify both languages, old English compatibility and no delivery on invalid consent. Existing English visible copy is exact. Real provider delivery, native browser validation, physical layout/accessibility and final legal draft review remain production/editorial QA.
