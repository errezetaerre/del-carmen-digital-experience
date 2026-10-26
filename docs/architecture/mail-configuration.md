# Mail Configuration and Readiness

Document ID: DOC-MAIL-OPS

Version: 1.1

Last Updated: 2026-10-25

Status: Actual local branch reviewed; owner-confirmed infrastructure/local delivery; production validation and Redis credential rotation pending

## Scope and ownership

Contact and Newsletter use the existing Resend and Upstash services. `src/config/mail.ts` validates server-only settings; API handlers create clients only when a valid request needs them. Missing credentials do not prevent compilation or rendering the public site. Production submissions return a controlled service-unavailable response until configured.

`src/config/siteOrigin.ts` holds the approved https://rolandodelcarmen.com public origin and its validator for SEO and email links. `src/config/newsletterHttp.ts` owns the action-page response policy shared by the handlers and Next configuration. No catalogue, Glass/Standard motion, consent version, retention period or Redis lifecycle script changes in this increment.

## Environment settings

| Variable | Purpose and precedence |
| --- | --- |
| `RESEND_API_KEY` | Required server credential for Contact and confirmation delivery. Presence is checked locally; validity requires a provider check. |
| `MAIL_FROM` | Shared sender, as an address or `Rolando Del Carmen <address>`. Use an address on a domain verified in the sending provider. |
| `CONTACT_EMAIL_FROM` | Optional Contact sender override, before `MAIL_FROM`. |
| `NEWSLETTER_EMAIL_FROM` | Optional Newsletter sender override, before `MAIL_FROM`. |
| `CONTACT_EMAIL_TO` | Required destination for enquiries; independent of the sender. The approved provisional Gmail can remain the destination. |
| `MAIL_REPLY_TO` | Optional Newsletter reply destination. Defaults to the existing public contact in `legal.ts`. Contact always uses the visitor's address as Reply-To. |
| `UPSTASH_REDIS_REST_URL` | Required HTTPS origin for the existing Redis service. No path, query, user information or fragment. |
| `UPSTASH_REDIS_REST_TOKEN` | Required server credential for rate limiting and Newsletter persistence. |
| `SITE_URL` | Approved public HTTPS origin, without a path, query or fragment; shared production choice with SEO. The connected official origin is `https://rolandodelcarmen.com`. |
| `NEXT_PUBLIC_SITE_URL` | Validated legacy email-origin fallback. Migrate to `SITE_URL` rather than keeping conflicting values. Never use a public-prefixed variable for a secret. |
| `VERCEL_ENV`, `VERCEL_URL` | Platform settings. Preview email/action links use that deployment's validated `VERCEL_URL`, not the Production origin. Do not manually copy a Preview URL into Production settings. |

A bare configured sender address receives the approved display name `Rolando Del Carmen`; an explicit `Name <address>` is preserved. Contact and Newsletter use `no-reply@rolandodelcarmen.com`. Contact destination and Newsletter Reply-To remain `errezetaerre@gmail.com`. Receiving is separate: the future studio@ address is not operational and is not substituted into forms. Contact subjects use `[Rolando Del Carmen] Artworks Inquiry — Visitor` in English and the corresponding Spanish enquiry label. Header-bound visitor names reject line breaks.

Only non-production permits the existing `onboarding@resend.dev` test fallback. Production requires an explicit sender and rejects the Resend test domain. Resend's test sender has recipient restrictions: a successful local format check does not remove them.

`docs/architecture/mail-configuration.env.example` is a reference, not a live environment file. Copy the required values into the appropriate local/provider environment settings; do not commit filled credentials. This increment does not read that documentation file automatically.

## Safe configuration sequence

1. Preserve the connected official domain, HTTPS and www-to-apex 308. Keep the Vercel alias accessible. No DNS/account changes are part of this code increment.
2. Owner reports Resend domain Verified, Sending enabled, Receiving/open tracking/click tracking disabled; preserve those settings. The new key was tested locally and saved as a Vercel Secret. Inventory consumers before revoking the older Onboarding key.
3. Choose the actual From address on that verified domain. Receiving mail is separate: the approved public Gmail can receive enquiries and replies while a professional mailbox is decided later.
4. Set the server variables in the intended environment. Review Production/Preview scopes before release. Do not expose the production Redis/mail credentials to public Preview deployments or submit live forms there. Preview-specific links do not isolate subscriber data. The existing del-carmen-contact database must be preserved; this review does not provision another database or isolate its data by changing a URL. Until an approved isolated test setup exists, verify Preview forms using offline fixtures and unconfigured-service responses.
5. Run `npm run check:mail -- --production` locally using a representative configuration. This loads production environment-file precedence, simulates Production validation and prints only check results and variable names. A nonzero exit means missing/invalid configuration, not a failed site build. Run `npm run check:mail` for the current/local environment instead.
6. Review actual Vercel environment scopes, provider verification and permission/retention settings. Rebuild/redeploy only through the agreed Git review workflow when ready; environment changes are not an implicit deployment approval.
7. After the approved deployment, coordinate a small live test on the official domain: Contact receipt/Reply-To, Newsletter receipt/expiry, explicit confirmation, persistence/language/consent and unsubscribe. Owner already passed Contact, Reply-To and Newsletter DOI tests locally; those results do not verify a Production deployment. This audit performs no real email or database operation.

The checker makes no network request and sends no message. It cannot verify domain ownership, DNS, mailbox existence, credential validity, delivery or provider retention. Do not paste raw `.env` files or full token URLs into the chat. Its redacted status output is suitable for reviewing the next configuration step.

## Newsletter action contract

Existing confirmation/unsubscribe URLs continue to work. A valid-shaped token on GET renders a small EN/ES confirmation form; GET and automatic HEAD never contact Redis or change subscription state. Opening or scanning a link alone cannot activate/cancel a subscription. The explicit native form POST validates the origin, URL-encoded media type, at most 2048 actual bytes, unique allowed fields and the existing opaque token before the lifecycle transition. Human actions are limited to ten attempts per ten minutes per IP/action.

Human success uses a 303 redirect to the existing localized Home result; invalid/expired/used tokens keep the existing invalid-result flow. Service errors return a retryable 503; quota errors return 429 with Retry-After. A timeout message does not assert whether a transaction completed: a retry or subsequent result determines its state.

These utility pages are script-free, cookie-free, no-store and noindex, with no remote font, image or script. Their exact-path Next header rules use a restrictive no-script CSP and DENY framing. Their `strict-origin` referrer policy strips the token/path while retaining the Origin needed for native form POST validation; `no-referrer` would produce a null Origin in that flow. Other API endpoints retain `no-referrer`. Access logs at the hosting layer still need their own sensitive-URL controls; application logs exclude message bodies, raw tokens, addresses and credentials.

The unsubscribe receiver also accepts a form-URL-encoded `List-Unsubscribe=One-Click` POST with the bearer token in its URL and a direct idempotent 200 response. It has no small per-visitor quota, as mail-provider servers share egress IPs. This is receiver preparation only. There is still no campaign sender or new unsubscribe-token distribution: recipient-specific issuance/link delivery, signed List-Unsubscribe headers, DKIM coverage, suppression/bounce operations and real provider acceptance remain prerequisites to marketing sends. This increment does not send a welcome message or reconfirm existing subscribers.

Pending records retain the approved 24-hour TTL. Active records and current unsubscribe lookups persist; minimal withdrawn records retain the approved 30-day TTL. `subscriberLifecycle.ts`, Lua atomic rechecks, hash-only lookups, consent evidence and race-safe cleanup are unchanged. No historical data is migrated or deleted.

## Redis credential renewal and release window

The existing `del-carmen-contact` database contains real data. Do not create a replacement, run FLUSHDB, delete records or reset credentials as part of installing this patch. The optional Redis test owns a different ephemeral local child process; its process-ID check is mandatory before any test write.

1. Inventory all consumers of the existing REST credentials: local `.env.local`, Vercel Production, any Preview overrides/integrations and scheduled/administrative jobs. Record locations and owners, never secret values. Verify REST URL and token belong to this same resource; a read-only token cannot support the application's writes/rate limits.
2. Verify the reviewed code locally, decide the release window and have Vercel update/build access ready. Review available provider backup/recovery arrangements without creating a new database or changing plans automatically. Commit/push/PR/deployment remain separate approval steps.
3. First distinguish changing Vercel storage from rotating Upstash credentials. Saving the current token as a Vercel Secret hides it after saving but does not invalidate a token disclosed elsewhere. It also does not update existing deployments.
4. Before using Reset Credentials/Reset Password, confirm the console's exact impact. Upstash's reset returns new password/REST tokens; do not assume old and new tokens coexist. If reset invalidates current consumers immediately, plan for forms to return controlled 503 responses until all consumers and the new deployment are updated. No zero-downtime promise is made.
5. The owner performs the agreed reset only in that window. Save the new credential privately, update the URL/token pair in local configuration and the intended Vercel environments as Secret where appropriate. Never paste credentials, filled env files or token-bearing confirmation URLs into chat, docs or Git. Keep Preview unconnected to production data.
6. Run the offline `check:mail -- --production` check locally, then deploy the approved release with the new variables. It does not prove Redis authentication. Verify live connectivity using a controlled production form/DOI test and the provider's authenticated console; inspect only that test record to establish persistence. Avoid listing/exporting real subscribers.
7. Verify both languages, Contact receipt/visitor Reply-To, Newsletter confirmation and persistence, then the prepared unsubscribe flow before marketing. Record commit/deployment IDs, timestamps and redacted results. Marketing token issuance/distribution and campaigns remain a separate unfinished block.
8. A rollback to an old deployment retains that deployment's old variables and can fail after rotation. Rebuild a known-good code revision with the new credentials for recovery. Keep the previous application revision; do not recover by restoring revoked secrets or deleting data. Revoke the old Resend Onboarding key only after its consumers are accounted for and the new key is verified in production.

No credential reset, provider change, production deployment or live test has been executed by this review. The next owner action is to confirm the consumer inventory and environment scopes before scheduling rotation.

## Origin compatibility and environment retirement

`SITE_URL` is shared by SEO and production mail. The source fallback now matches the official domain, including builds with no service credentials. The only runtime consumer of `NEXT_PUBLIC_SITE_URL` in the reviewed source is the legacy fallback in `config/mail.ts`; the checker, fixtures and documentation also mention it. Keep compatibility while inspecting all Vercel scopes. Once every intended production environment supplies the official SITE_URL, the owner can remove the obsolete Vercel value in the same approved release; no current deployment is modified by merely deleting a saved variable. Preview email links use platform VERCEL_URL and remain non-indexable.

## Verification for this increment

- Production build/TypeScript succeeds with 125 generated pages and no Resend/Redis credentials.
- Lint has zero errors and the same twelve inherited warnings; no rule is globally disabled.
- `npm run test:security`: 47 baseline server regressions pass.
- `npm run test:newsletter`: 44 configuration/action/delivery-contract regressions pass, with isolated service substitutes and no real mail.
- `npm run test:seo`: four regressions cover official canonical/social/robots/sitemap origins, explicit override, Preview/local noindex and preserved Spanish/legal gates.
- Optional `REDIS_SERVER=/absolute/path/to/redis-server npm run test:newsletter:redis`: a dedicated, non-persistent loopback process runs eight real Lua lifecycle scenarios. It never connects to an existing Redis instance. These previously passed with Redis 8.2.1 in Mail Readiness v1; the executable is not available for a fresh run in this review. The lifecycle source is byte-identical, and the default installer does not require Redis.
- Historical Mail Readiness v1 evidence: Chromium 153 verifies twenty action-page viewport/language combinations, four native POST retry flows without credentials, HEAD, invalid-token redirects and cross-origin rejection. Four selected WCAG A/AA Axe 4.11 audits of the phone portrait action pages report no violations. This is not an accessibility certification or a physical Safari/device test.
- Actual snapshot: 374 manifest hashes match; branch fix/accessibility-security-baseline, local HEAD dee21f91b0359c8c87d91d46612c1f173c73f31e, no upstream association, local origin/main cd98843. No .env file is present. Pattern checks find no credentials in included source/diff; this is not a Git-history or provider-account secret audit.
- Production build/TypeScript generates 125 pages without mail/Redis credentials. 95 offline regressions pass (47 security + 44 mail + 4 SEO). Lint reports zero errors and twelve inherited warnings. Full npm audit reports zero known vulnerabilities on 2026-10-25; no new dependency/lock edit is made by this increment.
- Next start HTTP checks cover safe GET/HEAD, strict action headers, same-origin retryable 503 with no credentials, foreign-origin 403, malformed JSON 400, robots/sitemap 200 and 58 official-origin sitemap URLs. GETs do not send mail or read subscribers. The existing loopback English /contact self-redirect also reproduces on the prior baseline; public EN/ES navigation must be checked on Preview before merge. Do not treat the local 307 self-redirect as a passed page test.
- Source artwork catalogue, Glass/Standard modules, form UI, translations, consent versions and subscriberLifecycle.ts remain byte-identical to the supplied snapshot in this increment. The earlier approved accessibility changes remain present.
- No commit, push, PR, deployment, live provider request, real mail or live Redis operation is included.

## References

- [Vercel variable rotation and deployments](https://vercel.com/docs/environment-variables/rotating-secrets)
- [Vercel Config and Secret variables](https://vercel.com/docs/environment-variables/sensitive-environment-variables)
- [Upstash database credential reset](https://upstash.com/docs/devops/developer-api/redis/reset_password)
- [Resend sender display names](https://resend.com/docs/api-reference/emails/send-email)

- [Resend test-domain limitations](https://resend.com/docs/knowledge-base/403-error-resend-dev-domain)
- [Resend domain verification](https://resend.com/docs/dashboard/domains/introduction)
- [Resend sender addresses and receiving mail](https://resend.com/docs/knowledge-base/how-do-I-create-an-email-address-or-sender-in-resend)
- [RFC 8058: one-click unsubscribe and unwanted GET effects](https://www.rfc-editor.org/rfc/rfc8058.html)
- [Referrer-Policy and native POST Origin](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Referrer-Policy)

Related contracts: `form-privacy-consent.md`, `data-retention-operations.md` and the Contact/Newsletter implementation documents. Existing legal drafts and the Spanish indexing gate stay in effect.
