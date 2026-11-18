# DAT-05 — Del Carmen Studio Admin

**V0.7 technical contract · 2026-11-17 (Costa Rica).** The reference architecture is accepted. Implementation is deferred. Provider trials, credentials, database changes, deployments and the first publication require separate authorization. Studio covers private editorial administration. Collector Commerce and Glass ArtBook retain their own contracts.

## Decision record

| Version | Disposition | Scope |
| --- | --- | --- |
| V0.1 | Functional decision approved | A private Studio inside the existing Next.js project, separate from the public gallery. |
| V0.2 | Functional decision approved | Artworks Manager and an Artwork Editor with six tabs, ordered **Identity**, **Artwork Details**, **Translations**, **Media**, **Classification**, and **Review**. |
| V0.3 | Functional decision approved | Edit → Save Draft → Preview & Validate → Publish → History. Only explicit publication changes the public catalogue. |
| V0.4 | Functional decision approved | One initial administrator, strong authentication, server-side authorization and distinct, least-privilege database access. |
| V0.5 | Technical audit accepted | The diagnostic baseline is main commit `a6b40a88b388a549261284977cff62ea86d51a27`. It documents the constraints on implementation. |
| V0.6 | Architectural direction approved with adjustments | ADR-01 through ADR-05 cover reader authority, revisions and publication, visibility and media, identity and privileges, and acceptance gates. |
| V0.7 | Technical contract accepted with qualifications | The sections below record the withdrawal, revision and cache qualifications. Physical design, operational choices and rollout remain open as identified below. |

DAT-02 and Collections v1.18 govern titles, dates, states, translations, media roles, series membership and curatorial references. Reuse their validators, selectors and localized projections. Studio adds no public properties to `Artwork` or `ArtworkSeries`. See the [artwork model](../domains/artworks/artwork-model.md), [Collections specification](../domains/collection/collection-specification.md) and [decision register](../project/project-memory.md#decision-052).

## Public reader transition

**ADR-01.** Production already reads PostgreSQL. On refresh, the reader verifies the expected schema and complete equivalence with the Git catalogue in a consistent read-only transaction. Successful loads are cached per instance for 30 seconds by default. A failed refresh does not silently serve files or stale data. This is the DAT-04 baseline for current operations. See the [catalogue database record](catalogue-database.md).

1. Establish a baseline publication version that identifies the Git commit and the verified catalogue fingerprint. Record the matching EN/ES public projections and eligible media. A structured-data fingerprint alone cannot detect changed image bytes or newly restricted exposure.
2. With editorial writes disabled, compare the existing reader and a candidate that checks the approved schema and a committed publication version. Verify data integrity, eligible media and every public projection, including Home, the archive, detail, collections, series, navigation, metadata and sitemap. Resolve discrepancies before promotion.
3. Switch reads while both readers still agree. At parity, a deliberate rollback may use the verified release with the same safe public content. After the first independent publication, only roll back to a reader compatible with the current publication and withdrawals. A frozen Git snapshot can expose withdrawn work or discard later edits.

Select the cache after measuring cold and warm latency, database reads and Neon activity, multi-instance version propagation and withdrawal latency. Compare version checks on read with bounded caching and active invalidation. The version, public projections and eligible assets must agree. Before enabling writes, demonstrate how failed invalidations are retried and how an urgent suppression takes effect across public routes and media. Use the current TTL as the comparison point.

## Revisions, publication and history

**ADR-02.** Keep one published catalogue. Private revision storage is justified because an incomplete edit must survive without altering published rows. The candidate schema name `studio`, route `/studio`, table layout and revision encoding remain proposals.

| Operation | Minimum contract |
| --- | --- |
| Save Draft | A meaningful explicit save creates an immutable private revision of one work, including its edited translations, classifications and media references. Record stable work identity, revision and preceding revision, published base version (or no prior publication), format version, actor and time. Incomplete drafts are allowed. Keystrokes and an identical resave do not create history entries. |
| Preview & Validate | Render the exact selected revision with existing EN/ES projections. Return validation results for required facts, translations, relationships, curatorial dependencies, media and exposure. Preview is administrative, authenticated and read-only. |
| Publish | Reauthorize the actor and revalidate the selected revision server-side. Check the expected draft head and published base under concurrency control. Apply changes to the existing catalogue, advance the public version and record the immutable publication event in one transaction. A stale base returns a conflict with the saved work available for review. |
| History and retry | Record the operation, actor, time, work, source revision, prior and resulting published versions, and withdrawal reason when applicable. A repeated request with the same idempotency key and payload returns its recorded result. Reusing the key for a different request is a conflict. A failed transaction leaves the previous publication intact. |
| Editorial reversal | Republish a selected prior revision as a new, attributable event. Revalidate current exposure authorization, media and relationships. Retain the intervening history and the stable identity. Physical database recovery follows the separate DAT-04 procedure. |

Retain the revisions and versioned media references needed to understand or restore published history under current rights. Retention and cleanup of never-published drafts and unreferenced private uploads require a separate policy. Neither private revision snapshots nor the audit log create a second set of catalogue tables.

## Visibility, withdrawal and protected media

**ADR-03.** Publication eligibility is an editorial decision. A planned work can have an authorized public preview. Availability such as `reserved` carries its existing domain meaning. Neither value establishes permission to exhibit. A private draft of a published work leaves its approved public version intact. A work or revision held for an exhibition is excluded from public delivery until explicitly authorized.

| Case | Public and editorial behavior |
| --- | --- |
| Authorized upcoming work | Display its real, pre-blurred WebP with the already approved additional CSS blur. Every public responsive or sharing variant must be eligible. Preserve the approved appearance. |
| Private draft or exhibition embargo | Exclude private content, private-only identifiers, relationships and media from public pages, route data, APIs, navigation, counts, SEO, sharing metadata and sitemap. Authorize every administrative preview on the server and prevent caching of its response. |
| Normal withdrawal | Review Home, series covers and other public dependencies. Provide approved replacements where required, validate the resulting public views and withdraw in a recorded transaction. Keep the work's identity, revision history and private source. |
| Urgent withdrawal | Block public access to the work and affected derivatives without waiting for a replacement. Suppress a dependent public section temporarily if necessary. Preserve stored relationships and required keys, record the reason, invalidate prior public delivery and verify by direct URL across instances. Restoration needs explicit editorial authorization. |

Protected sharp originals belong in private storage, outside public paths and distributable assets. Generate an approved derivative before public delivery. Check responsive sources, image optimization, cached variants and social images as well as the artwork page. Private previews must use authorized delivery and keep source URLs out of public payloads. Stage new media privately before committing catalogue references. Confirm that older delivery URLs are blocked where access must be withdrawn. Copies already downloaded cannot be revoked.

The approved WebP change was merged in [PR #22](https://github.com/errezetaerre/del-carmen-digital-experience/pull/22). The owner confirmed its Production deployment was Ready. That media release is separate from Studio.

## Identity and database permissions

**ADR-04.** Start with one explicitly provisioned administrator. Require strong authentication with MFA/passkeys, secure and revocable sessions, server-side authorization for each resource and recent authentication for sensitive actions. Recovery must work after loss of a device and support revocation of its sessions. Public registration is outside the administrative flow.

Self-hosted **Better Auth** is the preferred candidate for an isolated trial. It offers a path without a mandatory authentication subscription. The operator would still own patching, session and key management, mail delivery where used, backup, recovery drills and hosting costs. Clerk remains a managed alternative if the trial shows that the operational burden outweighs the benefit. Selection, licensing and pricing checks, enrollment and credentials remain pending.

| Capability | Permission boundary |
| --- | --- |
| Public reads | Keep the DAT-04 `catalogue_reader` grants. At transition, review only the minimum additional read access needed for a published version and eligible content. Keep private revisions, administrative history, identity data and writes inaccessible to the reader. |
| Administrative identity | The auth service handles only its identity and session data. An authenticated session alone confers no catalogue write permission. |
| Draft editing | Permit private revision creation, authorized reads and necessary private bookkeeping. Protect prior revision content and deny direct writes to public catalogue tables. |
| Publication | Prefer a narrowly callable operation for publish, withdraw and reverse. If a privileged SQL function is chosen, use a dedicated non-login owner with only required grants, trusted schema resolution, explicit execute grants and revoked default public execution. Enforce version checks, validation and audit inside the transaction. |
| Migrations and recovery | Keep ownership, DDL and recovery credentials outside web runtimes. Scope credentials per environment and keep publication capability out of public route handlers. |

## Manual catalogue updates

While Studio is deferred, follow the current parity-gated release process. The [operational commands and their guards](catalogue-database.md#operational-commands) remain authoritative.

1. Classify the change. Replacing an already authorized public derivative at the same catalogue reference and declared dimensions can follow the reviewed asset-release path. Validate the actual image, approved blur, variants and caches. A change to facts, translations, references, image metadata, eligibility or curation requires coordinated review of the public projections and any affected Git/PostgreSQL data.
2. Start from a matching baseline. Review the proposed difference, dependencies, expected public result and reversal. Rehearse on an isolated target and verify the full schema/fingerprint and EN/ES projections with the existing checks. Keep protected originals and unreleased data out of distributable Git assets.
3. Maintain a verified safe public release throughout the change. If structured data must change, agree the sequence and recovery point first. Only an explicitly authorized operator may apply a reviewed differential transaction to the intended target. If the currently serving parity reader would see a mismatch, hold the update until a safe, explicitly selected serving release and cutover are available. The current seed command imports an empty catalogue or verifies an equal one. It refuses a populated different catalogue and cannot serve as an update command.
4. Verify the candidate reader against the matching Git revision and database, then review the affected EN/ES pages, media, metadata and sitemap before promotion. On failure retain the last safe exposure, and use the rehearsed reversal only while current editorial restrictions are respected. Ad hoc Production edits and automatic fallback have no place in this procedure.

## Acceptance gates

**ADR-05.** These are gates for independently authorized future work. At this closeout all Studio implementation and release gates remain unopened.

| Order and environment | Evidence required to advance |
| --- | --- |
| 1 · Development, reader | Establish the baseline version, schema and fingerprint. Prove dual-reader parity on current data, detect drift, and verify both languages, routes, metadata and error handling. |
| 2 · Development, private Studio | This track can proceed independently of the reader. Test isolated authentication, recovery, server-side authorization, draft conflicts, repeated requests, transactions, reversal, private media and denial of unauthorized reads/writes. |
| 3 · Isolated Preview | Join the two tracks using separate database, media, identity and credentials. Test publishing and both withdrawals with Home/series dependencies, direct URLs and multiple cache instances. Measure latency, cost and propagation. Rehearse recovery and the post-divergence reader rollback. |
| 4 · Production, reads only | With writes disabled, show matching public versions and EN/ES content, a safe fallback release at parity, and continuing availability. Account for older deployments and cached assets. Resolve all exposure, privilege and rollback failures. |
| 5 · First publication | Obtain separate owner authorization. Start with a small reversible editorial correction. Verify the committed event, public version, EN/ES outputs and cache convergence. On failure suspend further writes, keep safe reads available and use the tested reader rollback or editorial reversal as applicable. |

Open decisions include the measured cache strategy and withdrawal time target, enforcement on older URLs, private storage and retention, the auth trial and its operating cost, the physical revision schema and exact SQL grants/function. The owner must accept the evidence and recovery plan before any first Production publication.
