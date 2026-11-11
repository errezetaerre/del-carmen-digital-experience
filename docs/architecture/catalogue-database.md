# Catalogue PostgreSQL — DAT-02 persistence foundation

Status: all five catalogue page families, editorial copy, curatorial presentation and sitemap integration reviewed locally through v1.9. v1.10 prepares explicit navigation/static-param policies and expanded read verification. Actual isolated Preview remains pending; Production stays file-backed.
Updated: 2026-11-10 (Costa Rica).
Source: main `eb23294b20a14843c046de7a63373efd91972396`, after PR #17 and the approved thumbnail pan.
Authority: current TypeScript catalogue, Artwork model v1.8, Collection Specification v1.18 and the owner's explicit persistence rules. Earlier snapshots are not seed sources.
Decision history remains in `implementation-roadmap.md`, under DAT-02.

## Boundary

This work supplies the data dictionary, one versioned SQL migration, typed import/read mappings, a server-only read repository and local operational commands. The Home, `/artworks`, `/artworks/[slug]`, `/collections` and `/series/[slug]` server boundaries support explicit PostgreSQL reads in local/Preview; files remain their default and their enforced Vercel Production source. Legacy plain-record adapters, canonical seed/parity inputs and non-catalogue content retain their file-backed owners. No browser-side query, migration/seed during a build or thumbnail-owned query is added. Canonical records, EN/ES messages, media, filters, gestures and Standard/Glass presentation remain unchanged.

Existing Upstash `del-carmen-contact`, Contact, Newsletter, their credentials, records and delivery behavior are separate. No Redis command, credential rotation, email or subscription action is performed by this tooling. Commerce, accounts, uploads and administration remain later increments.

## Data dictionary

All application tables are in the private `catalogue` schema. IDs and slugs stay exactly as authored; no new UUIDs replace current identifiers. Table names are physical mappings, not new business entities.

| Table | Key | Persisted content and rules |
| --- | --- | --- |
| `artwork` | `id`; unique `slug` | Original `title`, `date`, `creation_status`, `authorship`, `context`, `medium`, `support`, nullable `series_id`, dimensions, `availability`, optional price/currency pair. |
| `artwork_series` | `id`; unique `slug` | Original `title`, `artistic_status`, `publication_status`, optional `year_start`/`year_end`, `cover_artwork_id`, responsive visual metadata. No Collection duplicate. |
| `locale` | `code` | Initially `en` and `es`, not an SQL enum restricted to those languages. Additional valid language tags can be registered without changing tables. |
| `artwork_translation` | (`artwork_id`, `locale`) | Optional quote/description and an image-role → alt-text dictionary. English copy is extracted from the current canonical records and stored once here. No translated-title column. |
| `series_translation` | (`series_id`, `locale`) | Optional description/statement and media-path → alt-text dictionary. English and Spanish editorial values preserve their exact Unicode and punctuation. |
| `artwork_image` | (`artwork_id`, `role`) | `src`, optional pixel width/height. Roles: primary, heroPortrait, heroLandscape, thumbnail, collection. Alts belong to translations. No binary columns or data URLs. |
| `category` | `id` | Existing category identifiers; labels remain in the existing UI message dictionaries. |
| `artwork_category` | (`artwork_id`, `category_id`) | Category assignment; `ordinal` preserves the existing order of an artwork's category labels. This is not gallery order. |
| `artwork_recognition` | `id` | Existing artwork reference, kind, title, event and recognition year. Featured curation is not duplicated as an award. |
| `home_curation` | singleton `home` | Existing Hero artwork, Featured artwork and Featured series references. |
| `home_selected_artwork` | `artwork_id`; unique `ordinal` | Existing ordered Home Selected Works relationship. Its sequence is curatorial data, not an artificial order on all artworks. |
| `schema_migration` | migration `id` | SQL checksum and technical application timestamp; not artwork chronology. Managed by the runner. |

### Scalar mappings

| Domain field | SQL storage | Constraint / meaning |
| --- | --- | --- |
| `Artwork.date` | `artwork.date` as text | Exactly YYYY or a real Gregorian YYYY-MM-DD, years 0001–9999. `make_date` validates days and leap-century rules. No invented month/day or timezone conversion. |
| Artwork UI year | No column | Continue deriving it through `getArtworkYear`. No persisted year alias, generated year, completion timestamp or sort-order column. |
| `creationStatus` | `creation_status` | planned / in-progress / completed, independent of date, publication and availability. |
| `artisticStatus` | `artistic_status` | upcoming / ongoing / completed. |
| `publicationStatus` | `publication_status` | draft / published / archived; internal editorial state, not a forced public badge. |
| `availability` | `availability` | available / reserved / sold / unavailable. Do not rename sold to sold-out in storage. |
| Series chronology | nullable integer years | Preserve Yasemi: yearStart 2025, no yearEnd, ongoing, published. Preserve all other current years/states exactly. |
| Dimensions / existing price | `numeric` | Positive dimensions; non-negative price; amount and currency are jointly present/absent. Price import is not checkout authorization. |

A planned/in-progress artwork's date may be an artistic reference or anticipated date. A completed artwork's date can be a documented completion date or only its known year. No constraint infers creation status from date or vice versa.

### Visual metadata and normalization

Artwork images use individual role records. Series `visuals` uses JSONB only for the existing domain-owned optional images, Hero media/layout and atmosphere structure. It retains portrait/landscape references, pixel metadata, media variants and optional playback flags without inventing many UI-specific tables. All alt strings are removed from this metadata and stored in the translation row. SQL rejects alt properties and inline data URLs in `visuals`; source/read validation checks the approved media shape and references.

Membership is `Artwork.seriesId` → `artwork_series.id`. Covers reference real artworks using a deferred foreign key; the Series/Artwork import can therefore commit atomically despite that cycle. No `artworkIds[]`, `worksCount` or parallel membership list is persisted. Counts are derived. Home and category assignment ordinals preserve actual existing ordered relationships; neither is a global Artwork sorting column.

Translations use locale-keyed rows, including media alts. Facts and original titles are never replaced during localization. Registering another database locale does not by itself publish new routes, UI messages or unreviewed translations; those remain explicit application/editorial work.

### Ordering contract

SQL physical row order has no domain meaning. No artwork position/archive/newest column is added. Existing `selectArtworkArchive` remains the owner: newest default, oldest/title retained, year first, known full dates within a year before the separate year-only group in either direction, then original title and stable ID. Existing creation-state defaults, facets, search, Featured and query/navigation contracts remain unchanged.

Round-trip comparison ignores the physical sequence of entity rows but compares every stored field, translation, relationship and actual ordered category/Home sequence. Local tests also compare all current EN/ES localization outputs and every current archive facet/order against the real existing functions. Public service integration and its Series-context navigation order will be reviewed explicitly before activation; this foundation does not swap the current file-backed arrays.

## Operational commands

| Command | Effect |
| --- | --- |
| `npm run test:catalogue-db` | Disposable PostgreSQL/PGlite SQL, real-driver loopback and read-repository tests. No external provider calls or actual credentials; never touches Neon or Redis. |
| `npm run db:check` | Read-only connection probe and migration-journal presence check. |
| `npm run db:migrate` | Local-development-only, checksummed SQL migrations under one transaction/advisory lock. Applied SQL files cannot be silently edited; future changes require a new numbered migration. |
| `npm run db:seed` | Reads the current local catalogue/translations/recognitions/curation, imports into empty catalogue tables, verifies the complete round trip inside the same transaction before commit. |
| `npm run db:verify` | Read-only migration-version/column-inventory and full source-to-database equivalence check with SHA-256 summary. |
| `npm run db:read` | Read-only repository exercise: verifies current schema, compares all EN/ES artwork and published-series projections with the current source, then verifies the complete catalogue/fingerprint. No migration, seed or write. |

The import is idempotent only when the destination already matches. It refuses nonempty differing/partial catalogues and never performs updates, deletes, resets or automatic repair. A failed constraint or equality check rolls back all imported rows. Unknown new canonical fields also stop the mapping instead of being silently lost. Values use PostgreSQL parameters; trusted SQL identifiers come only from the fixed table/column mapping.

Connection pool size is one for these local tools. TLS explicitly verifies certificates and hostnames (`verify-full`). No raw connection URL, credential, query parameter or provider-error detail is logged. These tools are not an anonymous HTTP API.

## Environment setup — preserve existing local mail/Redis configuration

Vercel was inspected after the owner's installation: Neon variables, including `DATABASE_URL` and `DATABASE_URL_UNPOOLED`, are sensitive and limited to Preview. Production has no new database URL. Preview branching was selected in the handoff; its actual per-deployment endpoint isolation still needs verification with a later Preview deployment.

The owner has already created the dedicated `development` branch (parent `main`, expiration Never), configured its pooled/direct strings locally and completed the import. Do not create it again or copy main's connection string over it. For reference, the existing ignored `.env.local` uses these fields, preserving all Contact/Newsletter/Redis entries:

```dotenv
DATABASE_URL=""
DATABASE_URL_UNPOOLED=""
CATALOGUE_DB_TARGET="development"
CATALOGUE_DB_ENDPOINT=""
```

Fill URLs privately from the selected branch; do not paste them in chat. `CATALOGUE_DB_ENDPOINT` is its first hostname label without `-pooler`, such as `ep-example`, not a password. Both URLs must target the same endpoint, database and role. The direct URL is required for writes. Never copy a parent/future-production endpoint into this development setup.

Do not use `vercel env pull .env.local --yes` here: it can replace existing local settings and Preview Secret values are not a reliable source for local credentials. No existing env file is generated, replaced, uploaded or committed by this package. Connection identity checks and the development marker reduce mistakes; they are not an authorization boundary or proof that a hostname is non-production. Verify the branch in Neon before copying its strings.

Writes are refused in Vercel deployments, when VERCEL_ENV is set, when NODE_ENV is production, without the development marker, for mismatched endpoints, missing direct URLs or non-TLS/non-Neon connections. Builds never run migrations or seeds.

After reviewing the dictionary and SQL, run locally against the isolated development branch:

```bash
npm run db:check
```

Review that connection result before importing. The subsequent explicit sequence is:

```bash
npm run db:migrate &&
npm run db:seed &&
npm run db:verify
```

Do not add migration/seed commands to a Vercel build or redeploy Production as part of this step.

## Verification and activation gates

Local PostgreSQL tests cover migration idempotency/history protection, schema columns, strict date parity with TypeScript, the full current catalogue import, preservation of Yasemi and optional facts, all EN/ES presentation values, current filters/sorting, state/availability constraints, foreign keys, unique slugs, rejection of inline image data, adding a third locale, transaction rollback, non-overwriting repeat imports, parameterized hostile text and endpoint/environment guards.

Before public activation:

1. Review the data dictionary and migration with the owner.
2. Verify the actual development-branch connection; apply/import/verify there and retain the output fingerprint.
3. Verify Preview database branch isolation and schema/data state with real provider connections. A Secret's presence alone is not connectivity or persistence verification.
4. Integrate server-only repository reads, publication selection, localized DTOs and bounded caching without per-thumbnail/per-turn queries. Review navigation sequences and approved Standard/Glass behaviors.
5. Compare facts, translations, images/roles, curation, recognition, filters, pages and contextual navigation with the current catalogue; run TypeScript/tests/build and actual Preview QA.
6. Prepare the separate Production database target, least-privilege runtime access, migration/import verification and recovery/export plan. Review environment scope, then activate only after approval.

Current state: the owner executed migration 0001 and imported/verified the real Neon development catalogue after v1.1. No Neon SQL has been executed by the assistant, no Production connection has been enabled, no credentials/Redis records have changed, and no commit/push/deployment is part of this increment. PGlite is PostgreSQL compiled to WebAssembly for isolated SQL tests; provider networking/persistence evidence comes from the owner's separate real commands below.

### Results for this prepared increment

- 16 new tests pass using actual disposable PostgreSQL/PGlite, including the operator command's refusal to write in Production without exposing its credential sentinel.
- 183 existing offline regressions pass, including Artwork dates/series/archive, thumbnail pan, both book experiences, navigation, Analytics and mail/form/SEO behavior. No real mail or Redis integration test was run.
- `next typegen` and `tsc --noEmit` pass.
- Lint: zero errors, the same ten warnings in unchanged code; no rule suppressed.
- Real Next 16.4.2 production build passes with 125 pages. It requires no database credentials.
- Production dependency audit: zero reported vulnerabilities at verification.

These foundation results are local. The owner subsequently confirmed real development connectivity, persistence and repository reads below. Preview isolation, owner browser verification of the first page and Production activation remain separate gates.


### v1.1 — real-driver JSONB import correction (2026-11-10)

The owner confirmed real Neon development connectivity and migration application. Its first seed failed with SQLSTATE 23514. A local PostgreSQL-wire reproduction using Postgres.js 4.1.0 rejected `artwork_series.visuals` because pre-stringified objects were serialized again as JSON strings. The failed attempt rolls back; recreating tables or changing artwork data is not a remedy.

The mapper now passes native JSON objects as bound values. The same client adapter is tested over the actual driver/protocol, including full import/equivalence, repeat-import idempotency and data persistence across driver reconnection. `@electric-sql/pglite-socket` is development-only; verified TLS in the real Neon client remains unchanged. The disposable loopback fixture alone uses a non-TLS local connection and no actual credentials. Safe CLI constraint names help distinguish future validation errors without leaking record or provider contents. Migration 0001, the physical schema and catalogue source are unchanged.

The owner applied v1.1, passed all 18 database tests and successfully retried `db:seed` followed by `db:verify` against the existing development branch. No new migration, reset, drop, credential rotation or Production connection was needed. The development-only ESLint/minimatch finding is resolved in the read-preparation increment below.

### v1.2 — confirmed development data and read preparation (2026-11-10)

Both independent owner commands reported **45 artworks, 4 series and 1 recognition**, with the identical SHA-256 `187a3603ffa43e279d010a10e0ec5292e7d051c06eca7ee966c4d08eeefe1084`. This confirms the real development import and persisted round trip. It does not mean public pages use PostgreSQL or that a Preview deployment has been checked.

`src/server/catalogue/reader.ts` provides typed server-only repository methods for artworks, published series, recognitions and Home curation. Editorial fields and media alts come from the loaded database translations, with original-title/English fallback semantics and no static-Spanish overwrite. Returned records are detached copies so one consumer cannot alter another's cache. No credentials, client objects or full translation registries are returned in domain records.

One reader instance coalesces concurrent loads and caches the consistent read-only snapshot for 30 seconds (bounded configurable TTL up to 60 seconds). There is no background polling, timer, stale-on-error or file fallback. A failure is retriable. This is an instance-scoped cache, not a distributed cache or Next route cache; future page wiring must deliberately reuse the instance at the server boundary. Entity enumeration has no display-order contract. Current archive filters/sorting remain in their existing selector; Series context order, curation/badge consumers, page metadata and already-localized DTO handling must be reviewed before swapping any existing service.

The owner ran `npm run db:read` successfully against the already-configured development branch: 45 artworks, 4 published series, EN/ES, complete equivalence and the same recorded SHA-256. The read command checks the local target/endpoint; an explicit Vercel Preview environment can use its own pooled URL, while Vercel Production is refused. This guard is an operator safeguard, not independent proof of branch identity. Actual Preview endpoint isolation remains a required check. No migration, data rewrite or public API was introduced in v1.2. Existing db:check/verify diagnostics remain read-only.

The seven moderate development advisories were traced to `@typescript-eslint/typescript-estree` → minimatch 10.2.6 (GHSA-g3hv-75wg-m249). A narrow root override pins **only that dependency edge** to minimatch 11.0.1. Root minimatch 3.1.5, the TypeScript-ESLint group, Next and all application runtime packages retain their versions. Full npm audit reports zero vulnerabilities; lint still reports the same ten existing warnings and zero errors. Re-evaluate the override when upstream adopts a fixed version; do not use a blanket major upgrade or `npm audit fix --force`.

Local v1.2 checks: 25 database/read tests, 183 existing offline regressions, TypeScript and the real 125-page Next build passed. Repository tests cover actual DB-edited copy, additional locales, published-only series selection, cache concurrency/expiry/failure recovery, detached outputs and Production rejection. The existing actual-driver loopback test exercises a persisted editorial edit through this reader and restores its disposable fixture. Tests never access the owner's Neon, Redis, mail or env file. No UI, gesture, source record or applied migration changes were included. The owner db:read checkpoint is now complete; the following increment starts public-page integration in an explicitly enabled local/Preview environment.

### v1.3 — first page: `/artworks` (2026-11-10)

The owner authorized connecting pages in stages after real db:read succeeded. Keep the existing uncommitted `feat/catalogue-postgres` branch and apply this increment over v1.2. Migration 0001 and its checksum remain unchanged; its tables already exist and contain the verified catalogue. No new SQL, seed, reset or Production database connection is required.

`CATALOGUE_ARTWORKS_SOURCE` is a server-only opt-in: absent or `files` preserves the existing source; `postgres` activates the archive reader in local/Preview. Vercel Production always returns files, even if that flag is accidentally set there. Do not use a NEXT_PUBLIC-prefixed flag or change any database credentials. For a temporary local test, use:

```bash
CATALOGUE_ARTWORKS_SOURCE=postgres npm run dev
```

Next loads the existing private development configuration. The flag lasts only for that command; stopping it and running plain npm run dev returns to files. No env file is rewritten. For next start, select the source before next build as well: a file-backed prerendered build cannot be changed into a database build just by changing the runtime flag.

The actual `/[locale]/artworks` page now awaits the DAL inside its existing Suspense boundary, retaining the same client archive, fallback, filters, default newest order, pagination, query history, thumbnail cards and detail links. Next connection() runs before database initialization and outside the error sanitizer, so opted-in builds defer reads to requests. A module-scoped reader reuses one bounded pool/cache. Its successful refresh logs only `Catalogue /artworks: PostgreSQL verified`; no endpoint, row, SQL or credential is logged. No application query occurs for client-only filter/search updates or other pages/book gestures.

This first stage is a **parity-gated migration**, not permission to start editing a second independent catalogue. Each refreshed read verifies the reviewed schema history/columns and the complete snapshot in one repeatable read-only transaction. It requires equivalence with the current file catalogue, including translations/curation/recognitions. This temporarily protects file-backed detail/context navigation and static client localization from diverging from the gallery. Database edits will intentionally fail this gate until their consuming pages are migrated in later stages. No silent file/stale fallback hides a failure. Framework-facing failures are sanitized to catalogue_archive_read_failed; Next prerender signals propagate unchanged.

Shared current-file mapping now belongs to fileSource.ts and is reused by seed/verify tooling. The shared Postgres.js configuration/adapter belongs to postgresClient.mjs with a typed declaration; the old scripts import remains a compatibility re-export. Application readers have server-only entry points. schemaVersion.ts contains reviewed migration identity/checksum metadata only, tested against all actual SQL files; no DDL is bundled into an activation routine or executed by a page.

Verification: 33 database/integration tests and 183 previous offline regressions pass; TypeScript and both real builds pass, lint has zero errors and the same ten warnings. The Production-guard build with postgres opt-in and an invalid sentinel URL retains both statically rendered archive locales; the local opt-in build makes this route dynamic and needs no usable URL during build. Raw HTTP verifies the Spanish file-backed page and sanitized/no-fallback opted-in error handling. As already observed in the earlier local audit, raw English as-needed requests redirect to the same unprefixed path on this standalone setup; routing files are unchanged. Actual EN/ES page-to-gallery data contracts are tested; browser/device review in the owner's normal local environment remains required. No secret/driver markers are present in browser chunks. Models, arrays, media, styles, gestures, dependency versions and the applied SQL remain byte-identical to the reviewed baseline.

Preview capability is prepared, not enabled or deployed by this increment. Before setting the opt-in there, verify its actual isolated endpoint and migrated/imported/equivalent catalogue. Automatic Preview branches derived from a still-empty main database may not have the development schema/data; never repair that by auto-running migrations/seeds in build or by pointing Preview at Production. Owner approval, branch/data preparation and Preview verification remain explicit checkpoints. No commit, push, PR, merge, Vercel setting change or deployment is included.

### v1.4 — artwork detail and metadata (2026-11-10)

The owner confirmed real local gallery GET /artworks and /es/artworks with HTTP 200 and the PostgreSQL verification message. Subsequent recorded category-context, language and Standard/Glass URLs also responded 200. Those detail requests still used files at that checkpoint. The earlier English redirect from raw standalone probes is not reproduced in these owner requests; no routing change is required for this stage.

The same CATALOGUE_ARTWORKS_SOURCE opt-in now covers artwork detail and its generateMetadata function. detailSource.ts returns a server-only ArtworkDetailCatalogue; the existing page uses it for artwork lookup, all artwork records, published Series context and membership. Static slug generation continues to use current files without database access. The original scenes, book inputs, context validation, archive sorting/filtering, Previous/Next and return-link code remain with their current owners.

A detail projection restores the existing file-catalogue sequence after a verified read, using actual database records keyed by unchanged ID. This preserves Series-context navigation despite arbitrary SQL row order. It is an explicit transitional compatibility rule under the full-parity gate, not a persisted artworkIds/order/count field or a new source of membership. The shared archive selector still owns chronological/alphabetic gallery ordering. Missing/duplicate projection members stop rather than disappear silently; draft/archived Series remain excluded while artwork creation status stays independent.

Archive and detail reuse the reader/cache/pool in archiveRuntime.ts. Cache sharing is per module/server instance, not a distributed guarantee across workers, isolated Vercel route functions or deployments. Metadata and page requests can share the same pending read there. Successful refresh evidence is scoped: Catalogue /artworks: PostgreSQL verified and Catalogue /artworks/[slug]: PostgreSQL verified. The scope is a fixed internal value, never a logged user slug, URL or credential. Calls during cache validity use the loaded snapshot; a later request after expiry refreshes it. There is no background polling.

The detail request boundary preserves Next prerender signals, validates the same schema/full-catalogue parity and sanitizes provider failures as catalogue_detail_read_failed without file/stale substitution. It returns detached domain records to the existing server page; no client object, credential or repository method is sent to React client components. Titles, date precision/derived years, descriptions/translations, image references, recognition/curation and SEO stay equivalent to the current catalogue. Production remains files even if the opt-in is mistakenly set there.

Validation: 40 database/integration tests and 183 existing offline regressions pass. Tests exercise actual EN/ES page and metadata outputs for all existing creation states/sorts, category/year/medium/search/Featured filters, every current Series context, direct planned works, Standard/Glass inputs, neighbours, notFound handling, static slug generation and supplied-record projection. Real Postgres.js protocol coverage also projects persisted data and preserves every Series sequence. TypeScript, both source-mode builds and lint pass; lint retains zero errors and the same ten warnings. HTTP checks exercise real Spanish detail in both modes with a forced-files Production environment and invalid database URL, and sanitized/no-fallback failure in opted-in mode. Next can stream a missing page with HTTP 200 plus a 404/not-found UI and noindex; verify that semantic response rather than assuming the status alone proves a successful catalogue read.

Owner checkpoint: stop the server, apply this increment over v1.3 on feat/catalogue-postgres, run the checks, and restart with the same temporary opt-in. Open a detail in EN/ES and confirm the new fixed detail verification message, neighbours/back context, Standard/Glass and a Series-context link. The actual successful detail-page read against the owner's Neon remains pending that output. Home/Collections/Series pages and their independent viewers remain file-backed; Preview data/isolation and Production activation keep their separate gates. No new dependency, migration, data write, env rewrite, credential/Redis/mail change, commit or deployment is included.

Image warning follow-up: the owner saw Next/Image's one-dimension CSS warning for /artworks/el_misionero.webp. Its existing primary viewer already has w-auto/h-auto, with additional responsive sizing rules; another zoom-image instance has its own constraints. The log does not identify the exact DOM instance or prove a distorted painting. No image dimensions, aspect ratio, style, asset or warning suppression is changed here. Identify the affected rendered img and compare its attributes, natural size and computed CSS before proposing a separate visual correction. This runtime warning is separate from the ten inherited lint warnings.

### v1.5 — Collections and Series (2026-11-10)

The owner confirmed the Stage 2 detail verification message with successful EN/ES and Standard/Glass requests, alongside successful gallery requests. Fast subsequent development requests and later refreshed reads are observable, but those timings are whole-request measurements, not isolated SQL benchmarks or Production latency guarantees.

Stage 3 applies the existing private opt-in to Collections and Series pages/metadata. seriesSource.ts uses the same request boundary, full-parity gate and instance-scoped reader; files remain the default and mandatory Vercel Production source. Its fixed success messages are Catalogue /collections: PostgreSQL verified and Catalogue /series/[slug]: PostgreSQL verified. Errors are sanitized to catalogue_collections_read_failed or catalogue_series_read_failed without fallback. No new env key, dependency, migration, write or provider setting is needed.

seriesCatalogue.ts composes the detached detail projection rather than adding a parallel Collection entity. Both the Series cycle and its member sequence retain current-file reference order under the existing parity gate. Collections has its separate descending yearStart order, with stable ties/missing-year fallback unchanged. That rule is now shared in domains/collections/services/collectionEntries.ts; getCollections keeps its synchronous API and CollectionEntry type export. Before/after evaluation of the original service is identical. Original Collections order is epifanias, yasemi, the_inner_treasury, the_discipline_of_seeing; the Series cycle remains yasemi, epifanias, the_inner_treasury, the_discipline_of_seeing. No order/count/member-array column is persisted.

The two server pages keep their existing components and markup: four published Series, raw artwork membership, local EN/ES projection, responsive hero/atmosphere references, statement/description, cover rules, selected-artwork validation, Standard/Glass mode and SEO. Slugs for static generation still come from files without a DB read. Actual page/metadata comparisons exercise each Series, both languages and modes, repeated/foreign artwork query values, missing/unpublished Series and source-record usage. Real Postgres.js protocol coverage also projects persisted Series/Collections data. Publication remains independent of artistic status and artwork creation status; Yasemi stays 2025/ongoing/without yearEnd.

Local results: 49 database/integration tests and 183 previous offline regressions pass; TypeScript, both real builds and lint pass, with zero errors and ten inherited lint warnings. Production-guard HTTP checks show Collections and Series Standard/Glass content with an invalid DB URL, and missing-Series not-found/noindex behavior. Opted-in runtime failure tests return sanitized errors with no file substitute or private value. Collections is prerendered in both locales in the forced-files build and dynamic in the opt-in build; neither build needs a working DB URL. No canonical record, media reference, component/style, translation file, applied SQL or lockfile changes are included. React review confirms server-only reads/DTOs, conditional lazy driver loading, one snapshot rather than per-card reads, unchanged keys/controls and no new client hooks.

Next checkpoint: apply over Stage 2 on feat/catalogue-postgres, run checks and restart with the same temporary opt-in. Visit Collections, every Series in EN/ES, both Series modes and a linked artwork detail; confirm both new fixed verification messages and the approved layout/navigation. Successful real Neon Stage 3 reads and normal browser/device review remain pending owner output. Home and its independent experience stay file-backed. Preview isolation/schema/data and Production activation retain their separate approval gates. The previously recorded el_misionero.webp image-sizing warning remains a separate pending DOM inspection; no proportions are changed here.


### v1.6 — Home and its Glass ArtBook (2026-11-10)

Owner Stage 3 evidence confirms the Collections/Series PostgreSQL read messages and HTTP 200 for recorded EN/ES routes, including Series Glass and linked artwork details. This verifies successful requests against the owner's development branch; it does not replace complete physical-device/visual review. Development request durations include rendering, compilation and networking and do not measure SQL latency alone.

Stage 4 extends the same opt-in to Home and its SEO metadata through homeSource.ts. createHomeCatalogue resolves the existing curation against supplied Artwork/ArtworkSeries records, restores approved member sequence through the existing detail projection, derives the featured collection's count and returns only Home's selected public records. It does not add a Collection entity, stored count, ordering column or schema. Original titles, strict date precision, creation/artistic/publication independence and Yasemi's 2025/ongoing/no-yearEnd data are retained.

The Home server composition passes a typed HomeCatalogue DTO to the current Hero, Featured Work, Featured Collection and Selected Works. The same DTO reaches the lazy HomeGlassArtbook through HomeExperience. getHomeBookContent now takes that explicit selection; it does not re-read static curation in the browser. Chapters, Journal, Newsletter, artist/signature assets, portrait/landscape references, markup, styles, materials, gestures, preference and navigation retain their approved owners. Journal and brand/editorial content are outside this catalogue migration. Legacy synchronous Home services remain compatible for other callers and parity tests.

The shared instance reader emits Catalogue /: PostgreSQL verified once per successful snapshot/scope. One read-only snapshot serves the selection, without per-thumbnail or per-turn queries or polling. Metadata/page consumers reuse its bounded instance cache; this is not a promise of a distributed cache across Vercel functions. Next's request boundary stays outside error sanitization. Failures become catalogue_home_read_failed, without provider details or a file/stale substitute. Forced Vercel Production continues with files even if the flag is postgres; neither build runs migrations or imports data.

The temporary full-equivalence gate remains necessary: shared badge/cover presentation, static localization, sitemap and other independent consumers still read current files. Do not edit the database independently or remove that gate as part of this stage. Preview still needs verified isolated endpoints and migrated/imported/equivalent data. Production activation remains a later reviewed change.

Verification: 58 database/integration tests plus 183 existing offline regressions pass. Home tests compare current file service results with supplied and persisted records, reverse SQL row order, changed curated IDs, EN/ES book content, optional sections/publication, detached values, page/SEO data and section props, request/prerender/error guards and enforced Production files. The real Postgres.js protocol test also reads the Home projection and EN/ES book from a disposable PostgreSQL catalogue. TypeScript, lint and two actual Next builds are checked, along with HTTP Home rendering/failure and client-bundle server separation; final outcomes and operational steps are recorded in the delivery README. Owner successful Neon Home requests and visual review remain pending.

The Stage 3 logs also identify these separate pre-existing runtime warnings; no dimensions, layout, script policy or warning suppression is changed here:

| Warning | Current source | Next focused verification |
| --- | --- | --- |
| Hero portrait fill/sizes=100vw | domains/home/sections/hero/HeroArtwork.tsx has separate CSS-selected mobile/desktop layers. | Inspect the visible img and viewport before adjusting resource sizes; a hidden responsive variant is not proof that approved proportions are wrong. |
| Artist fill without sizes | domains/home/sections/artistStatement/ArtistStatement.tsx | Match sizes to the actual responsive column; preserve rendering geometry. |
| Collection hero fill/static parent | domains/collections/components/CollectionHeroMedia.tsx places Image directly in an unpositioned picture inside a positioned wrapper. | Inspect the picture containing block and preserve media selection/crop while correcting the technical positioning separately. |
| Script encountered in client render | HomeExperience renders the existing constant HOME_BOOK_BOOTSTRAP in a raw script tag. | Verify initial SSR and client navigation/preference restoration before a separate bootstrap integration change; do not assume client-inserted scripts execute. |

The earlier el_misionero.webp CSS warning retains its separate DOM-inspection task. Browser warnings are distinct from the ten inherited lint warnings and are not PostgreSQL failures.

Owner checkpoint: remain on feat/catalogue-postgres, stop the server, apply this increment over v1.5, run checks and restart with the same temporary local opt-in. Verify Home EN/ES in Standard/Glass, all book chapters and artwork/Series navigation. Expect the new fixed Home read message. Do not migrate, seed, reset data, change credentials or deploy. Redis/Contact/Newsletter infrastructure and production behaviour remain untouched.


### v1.7 — initial Home bootstrap and client navigation (2026-11-10)

The owner confirms successful Home reads in EN/ES with Catalogue /: PostgreSQL verified and HTTP 200, including a recorded credits chapter URL. The PostgreSQL Home request checkpoint is complete; whole-request development times are not SQL latency measurements. No new database connection, import or schema is needed.

React's development warning on the ES switch comes from the existing HomeExperience bootstrap script being included again when the client mounts Home. The bootstrap is parser-executed startup markup, not an action to repeat on client navigation. HomeExperience now uses stable useSyncExternalStore snapshots to retain that markup for server rendering and initial hydration only, then omit it on ordinary client renders/remounts. This preserves identical initial markup/hydration and the existing pre-hydration Glass preparation. Later entries use the established shared preference hook, without inserting an inert script. No global layout script, provider, timer, storage write policy, suppression, dependency or new preference is introduced.

Only the bootstrap lifecycle changes. The bootstrap body, shell/CSS, Standard/Glass content, chapter/query semantics, focus/scroll policy and all catalogue sources/guards remain unchanged. The correction is incremental over v1.6 on the same pending feat/catalogue-postgres branch. Startup preference and blocked-storage tests, Home/series/gesture/catalogue regressions, TypeScript, lint and the real build are checked; the delivery README records executed browser coverage and its environment limits separately from the owner's final EN/ES review.

Image advisories remain separate: existing Hero sizes, Artist missing sizes, CollectionHeroMedia containing-block review and the earlier el_misionero CSS inspection retain their tasks. The latest log also identifies captura_de_jesucristo.webp as an above-fold LCP candidate. Inspect the visible archive entry/viewport before considering eager loading for a small initial set; do not make every thumbnail eager or undo the approved bounded image loading. No sizes, loading priorities, image dimensions or resources are changed in v1.7.

No migration/seed/SQL write, private variable change, Redis/Contact/Newsletter action, commit, push, PR, merge or deployment is performed. Production remains file-backed under the existing explicit guard, and Preview retains its isolation/equivalence gate.


### v1.8 — catalogue editorial consumers (2026-11-10)

Owner checkpoint: v1.7 fixes the Home startup warning in the owner's EN → ES → EN navigation; Home, gallery and artwork detail again return 200 with PostgreSQL verification messages and Standard/Glass requests. Remaining image advisories are tracked separately. The owner prioritizes data unification and explicitly postpones a Glass ArtBook presentation of /artworks; that requested prototype is added to the existing implementation-roadmap backlog, not implemented here.

Stage 5 connects editorial copy consumption to the same catalogue snapshot as the entity facts. CatalogueRepository keeps its canonical raw-record API and adds getArtworkViews/getSeriesViews for requested UI locales. Each detached public read DTO retains the original Artwork/ArtworkSeries fields and carries catalogueEditorial with selected language copies of quote/description or statement/description and existing media alternatives. English is always available as fallback; only requested and actually present translations are included. Titles, IDs, slugs, dates, states, image URLs/dimensions and prices are not translation fields.

catalogueEditorial is an ephemeral serialized read-model field, defined in i18n/catalogueEditorial.ts. It is not a new canonical model property, column, source-of-truth registry, membership/count or import attribute. The existing canonical validation rejects attempts to import UI DTOs, rather than silently discarding their additional data. The projector derives resolved copies through the existing repository localization functions, so fallback semantics agree with the persisted snapshot. It introduces no SQL query per record, language, render or page turn.

All five staged page-source boundaries now deliver those read DTOs. readFileCatalogue builds the same repository from the current file snapshot in default/enforced-Production file mode. Opted-in mode uses the existing parity-gated PostgreSQL repository. Existing pure UI helpers first consume DTO copy and do not overwrite it with a static Spanish dictionary. A missing translation uses that DTO's original English copy, even when a legacy file happens to contain a Spanish entry for the same ID. Repeated localization and English/Spanish reversal restore the right copy/alts without mutating inputs; malformed DTO metadata fails instead of falling back to another source. Legacy plain-record helper calls retain their compatible file adapter until their callers are reviewed. Static UI messages, labels, legal copy, brand, Journal and unrelated page content remain in their current owners.

The same serializable data travels through detail scenes, portraits, shared viewers, landscape Glass JSON snapshots, Series/Collections projections and Home/its book. Their components, markup, styles, motion, assets and navigation are unchanged. There is no new React provider or browser database client. JSON serialization tests cover that boundary, and real Postgres.js protocol tests verify an edited persisted Spanish description through the same client localization helper. Those edited-copy tests use disposable databases/provided repositories; the live staged parity gate still refuses an independently edited Neon catalogue.

Validation: 66 database/integration tests and 183 existing offline regressions pass (249 total), with TypeScript, lint (zero errors, the same ten inherited warnings), both source-mode builds and focused browser/HTTP checks recorded in the delivery README. Checks compare all 45 artworks and four series in EN/ES, preserve canonical facts/titles/chronology, verify absent/third-language copy, poster/video/atmosphere alternatives, mutation isolation, read-only/error/Production gates and refusal to persist DTOs. Current catalogue fingerprint and applied migration checksum remain unchanged. The public copies add no image bytes and are limited to configured UI languages; a JSON-only sample of all 45 records grows from 6,277 to 10,475 bytes under gzip, not a measurement of the complete RSC/network payload.

Owner checkpoint: apply over v1.7 on the same pending feat/catalogue-postgres branch, stop/restart the local server with the existing opt-in, and compare EN/ES copy/alts in Home, gallery, Collections, Series and artwork Standard/Glass. Existing verification messages remain unchanged. No dependencies, schema, migration/seed, private environment, provider credentials, Redis/mail action, commit/push/PR/merge or deployment is changed. Preview data/isolation and Production activation retain separate gates.

Unification remains deliberately incomplete: recognition/cover/Featured presentation, featured filtering/curation, sitemap and transitional Series/record ordering/reference policies retain their following reviews. The full-equivalence gate remains in place. Do not independently edit the real database or remove that gate merely because editorial DTO consumption is connected.


### v1.9 — curatorial presentation and catalogue sitemap (2026-11-10)

Owner checkpoint: v1.8 is reviewed successfully on the owner's development Neon catalogue. Home, Artworks, detail, Collections and Series return HTTP 200, including EN/ES switches and Standard/Glass. The owner says everything looks correct and requests the next unification steps. Remaining Next/Image advisories are tracked separately; no image geometry/loading change is part of this stage.

Stage 6 derives cover/Featured roles and recognition history from the same repository snapshot as facts and editorial copy. getArtworkViews/getSeriesViews now include typed, detached cataloguePresentation read metadata: artwork cover/featured flags with only that artwork's recognition records, and the published series' featured flag. These are derived public read values, not new canonical fields/SQL columns or a duplicate source of curation. The canonical import validator rejects them. Recognition lookups are grouped once per snapshot; no query per badge, language, render or page turn is added.

Shared getArtworkPresentation, the Featured archive predicate, Home cover markers, featured-Series markers and Series arrival-glow predicate consume the supplied record. Passing only an ID to those active components would lose its snapshot context, so the component props now carry their existing Artwork/ArtworkSeries record. Their DOM/classes, labels, styles, sizes, material and motion are preserved. An explicit false or empty recognition history remains authoritative, so removed roles/awards cannot be restored from a static file. Existing plain-record/string helpers retain compatibility for offline/legacy consumers; those file imports are not claimed to have disappeared.

Generic badge/status labels stay in the existing EN/ES UI dictionaries. The reviewed Recognitions event-name display adapter also remains there: it applies only when the ID AND the canonical English event match. A changed/new stored event keeps its supplied original text rather than being overwritten by an old Spanish label for the same ID. This is not a new recognition-translation table or an automatic translation service; an independently editable recognition-translation model would need its own later requirement/migration. Current EN/ES output is equal for all 45 works and four series.

The asynchronous sitemap uses catalogueSitemapPaths/getCatalogueSitemapPaths instead of importing entity services. It includes all current artwork states and only published Series, keeps fixed/Journal routes and the existing domain/language/legal gates, and sorts catalogue paths lexically for stable output independently of SQL physical order. The public URL set is unchanged. Non-indexable local development/Preview returns [] before any catalogue read. An indexable local production-build test may opt in through the existing request boundary/shared reader; failure is catalogue_sitemap_read_failed with no provider detail or file substitution. Vercel Production remains forced to files. Its sitemap and catalogue still build without a database even if the opt-in flag is accidentally present. The new fixed sitemap read message appears only when that route actually reads PostgreSQL; it is not expected for an empty noindex sitemap.

Verification: 78 catalogue/integration tests plus 183 prior offline regressions pass (261 total). Coverage includes the actual Postgres.js protocol for changed curation, recognition kind/title/event/year and sitemap slug; JSON/localization round-trips; authoritative empty/false values; public badge component SSR; all current EN/ES presentation; filtering, mutation and canonical-import guards; no extra queries; published/public sitemap membership; request/error/noindex/Production gates. TypeScript, lint (zero errors, the same ten prior warnings), builds and HTTP evidence are recorded with their actual outcomes/limits in the delivery README. Isolated test engines are used, not live Neon/Redis. The original catalogue fingerprint, applied SQL migration and source records are unchanged.

The remaining file references are deliberate migration/release boundaries: current static-param enumeration, Series/detail ordering/membership references, canonical seed/equivalence inputs, plain-record compatibility and unrelated site content. Do not remove the complete parity gate or enable independent Neon edits/Production reads yet. Next: owner reviews this increment locally, then explicitly review transitional navigation/order policies and isolated Preview readiness before planning activation. No schema/seed/data/credential change, Redis/Contact/Newsletter action, commit/push/PR/merge or deployment occurs.


### v1.10 — navigation policies, dynamic slugs and complete read-model verification (2026-11-10)

The owner confirms v1.9 looks correct locally, with all five PostgreSQL scopes returning HTTP 200, EN/ES switches and Standard/Glass. The requested private artwork administration/upload/recognition workflow is approved as a later prototype after unification; its task is recorded in the existing roadmap, not implemented by this increment.

The remaining Series/detail sequence references were not chronological data. For example, Yasemi I precedes II/III/IV and Epifanias keeps its existing editorial story order. Replacing them with newest or SQL row order would change the approved journey. domains/artworks/presentation/seriesNavigationOrder.ts makes the existing four-Series cycle and 17 current Series-member position preferences explicit. These private ID preferences are presentation configuration, not entities, a second membership list, persisted artworkIds, SQL columns or a global /artworks order. Membership always comes from supplied Artwork.seriesId, and publication from supplied Series.publicationStatus. Unknown/missing preferences never create, hide or reject records. Missing entries are ignored; future works follow the known sequence sorted by newest/date precision/original title/ID; future published series follow the known cycle by start year descending/original title/ID. The fixed English original-title collator keeps that contextual sequence independent of the UI language. Future administrator-controlled manual rearrangement would require its own reviewed curatorial model; it is not silently added here.

Detail/Home/Series factories no longer require arrays of file-backed entity references or exact legacy reference lengths. Raw artwork enumeration has no UI order contract: /artworks and independent detail use their existing selected filter/date/title/ID order; Series-local galleries/dialogs/details use the explicit presentation policy after FK membership selection. Duplicate IDs/slugs remain rejected; schema/snapshot validation and the complete source-equivalence gate retain catalogue completeness checks before a repository is delivered. Current group cycles, all 17 member positions, Home curation and both Standard/Glass projections are equal to the previously approved outputs. New supplied records are retained without changing a static membership/reference array. Source boundaries no longer import getArtworks/getArtworkSeries merely to recover those arrays; all entity facts/editorial/roles/membership still come from their one repository.

Static params use server/catalogue/staticParams.ts. Default/enforced Vercel Production keeps its exact current file-backed slug enumeration. Local/Preview postgres opt-in returns [] before loading file data or a database; the dynamic page resolves its slug from its real request repository. Unknown build-time slugs therefore are not an obsolete generated-list gate. The already request-time detail/Series pages explicitly declare dynamic=force-dynamic: Next 16.4.2 otherwise classifies an empty-param route for on-demand static generation, causing DYNAMIC_SERVER_USAGE on searchParams/connection reads. No force-static, dynamicParams=false, build-time connection or new persistence field is introduced. Catalogue data must still pass the staged parity gate; the growth fixtures do not authorize independently adding records to real Neon yet.

The existing npm run db:read command now reuses the application parity/schema reader for one repeatable-read, read-only snapshot. server/catalogue/verifyReadModel.ts verifies detached EN/ES editorial/role payloads, recognition/curation, Series/Collections/Home navigation, archive sort outputs and sitemap without extra SQL, private output or writes. It reports one fixed Catalogue consumers: OK line and the existing agreed fingerprint/count summary. Missing or altered public projections fail with catalogue_read_model_not_equivalent. Raw/format-only db:check remains distinct, and migrate/seed behavior is not activated or modified.

Verification: 86 catalogue/integration tests plus 183 existing regressions pass (269 total), with TypeScript, lint (zero errors, unchanged ten warnings), both guarded file/default and opt-in builds, and bounded HTTP tests recorded in the delivery README. Coverage shuffles record order, retains every existing Series position, varies creation/publication independently, adds supplied future records without reference-length rejection, verifies actual page/metadata resolution in EN/ES with empty PostgreSQL static params, tests read-view corruption and ensures verification adds no queries. The real Postgres.js protocol test also exercises the full read-model verifier. SQL migrations, canonical records/models, images/visuals, UI messages/styles/book engines, lockfile and existing database fingerprint remain unchanged.

The final HTTP checks confirm current Home/Collections/Series/detail render their approved labels, future slugs reach the request reader rather than a stale build list, and missing file records retain notFound. Next may stream an error/notFound after sending a 200 header; checks therefore inspect the sanitized error digest, source-failure code and absence of catalogue output as well as status. No DYNAMIC_SERVER_USAGE remains after the explicit dynamic declaration.

Next checkpoint: owner applies over v1.9, runs the local build/tests and db:read against the already approved development endpoint, then reviews all current routes/filters/Standard/Glass. No reseed/migrate is needed. Actual Preview still requires an isolated target (not development or Production), the applied schema, complete equivalent data, appropriate sensitive private variables and route verification on that deployment. No Preview/Production opt-in variable, endpoint, live SQL/data, credentials, Redis/mail, commit/push/PR/merge or deployment is changed here. Complete equality is kept until those release checkpoints and controlled activation are approved. The private admin and /artworks Glass prototype follow later.
