# Internationalization

Version: 1.5
Document ID: DOC-I18N
Project: Del Carmen Digital Experience
Status: Foundation/Artwork approved/pushed; Home/Collections, About/Artist and Journal approved; forms/legal implemented for review
Last Updated: 2026-10-18

## Decision and source

The owner approved one shared EN/ES site, English as the default, manual language selection, unchanged artwork titles and shared assets. The first increment is the language foundation, navigation and one artwork pilot, rather than a claim that the complete public Spanish edition is ready.

Implementation starts from the actual upstream commit `f2cf5b15c6b2c16d9979d164831b44680d64a8b6`, with its root configuration, lockfile and latest owner catalogue. A separate local `feat/i18n-en-es` branch holds the work. No deployment or upstream push is part of this increment.

The owner subsequently approved and pushed the foundation/Artwork block as `d56b7729f9b603a9ae64035a260a0b094a09eba9` on `feat/i18n-en-es`. That fetched commit matches the v2 delivery tree exactly and is the base for the Home/Collections increment. Its Vercel Preview is the review environment reported by the owner; the project's production branch, protections and variables have not been inspected or changed here.

## Shared architecture

- All public layouts/pages move once into `src/app/[locale]/`; their components remain in their existing domains.
- `src/app/api/`, `globals.css` and `favicon.ico` remain global. Public image/video paths and their files remain unchanged.
- `src/i18n/config.ts` owns the `en | es` type, URL helpers and Spanish release state.
- `routing.ts`, `navigation.ts`, `request.ts` and `src/proxy.ts` integrate `next-intl` with App Router.
- `messages/en.json` and `messages/es.json` hold shared interface messages by namespace. English/Spanish keys and interpolation variables must match.
- `artworkCopy.ts` reads stored Spanish editorial translations by canonical artwork ID from `content/artworks.es.json` and maps medium/support/category labels. The translation file covers the current 45 works, including their existing image-variant alternative text. Titles, IDs, slugs, years, authorship, prices, availability, dimensions, membership and image URLs retain their canonical source.
- `seriesCopy.ts` reads `content/series.es.json` for the four existing series' description/statement and image alt text. Series names remain original, with canonical media/layout/year/status/cover/member facts intact. `journalCopy.ts` and `content/journal.es.json` translate only the two published Home teasers in this increment.
- `EnglishContent.tsx` temporarily marks untranslated editorial/form/legal sections as English without introducing a layout box. Translated shared elements override that language where necessary. Remove each boundary when that section's Spanish content is reviewed.

The project adds exact dependency `next-intl@4.14.9`. Its declared peers include the existing Next.js/React versions; Next.js remains 16.2.12 and React remains 19.2.4. The added package is MIT-licensed; its declared dependency licenses include MIT, Apache-2.0 and BSD-3-Clause. Existing locked package versions remain unchanged. Dependency distributions retain their accompanying notices/licenses.

The request configuration uses the supported `requestLocale`/`setRequestLocale` integration. It does not enable experimental `next/root-params` on Next.js 16.2.12.

## URLs and interaction context

English public routes keep their existing unprefixed addresses. Spanish uses `/es` with the same pathname and canonical slugs. `/en/...` redirects to the English unprefixed form. The URL determines language: browser negotiation is disabled and the language preference cookie is disabled.

Localized Link/router wrappers preserve navigation language and active-menu aliases, including Collections on `/series/*`. The selector preserves the current path, filters, Series context, selected work, `experience=standard|glass` and URL fragment. It reads the actual current browser address at click time, including native Glass history changes that have not yet reached a React render. Modifier clicks retain browser behavior.

Native Glass history uses the same localized URL helper. Standard route-continuity snapshots receive the localized destination before navigation and recognize both prefixed/unprefixed artwork paths. Their source/destination keys keep the prefix so cleanup waits for the correct language destination. The approved gesture ownership, weight/inertia, material, sheet geometry, touch adapter, dust and focus controller are retained.

The selector is present in navigation, the mobile menu, footer and Glass exit controls. Artwork names remain original. The interface uses English/Spanish labels, not country flags.

## Implemented content and remaining work

The owner installed the first migration, confirmed the production build and reviewed navigation, Standard and Glass positively on 2026-10-18. That review establishes the first pilot; it is not approval of later translations or the complete Spanish edition.

Implemented foundation: navigation/footer, Home hero/tagline, Epifanía Nupcial's editorial pilot, technical sheet, loading/controls, shared viewer, fullscreen controls, distinctions/creation-state labels, native Glass labels and artwork metadata.

The next bounded block adds the Artworks archive introduction/metadata, category/year/medium/Featured controls, ICU plural result counts, empty/clear states and shared thumbnail labels. All 45 current works now have stored Spanish quote/description and every existing primary/thumbnail/collection/hero alternative text. Standard, native Glass and the shared viewer consume the same immutable artwork-localization helper. The confirmed La No Bienal distinction retains its event/year and translates only the edition wording. Query keys and canonical filter values remain unchanged across languages. Archive and thumbnail classes, hover/focus animation functions and the complete Standard/Glass movement code retain their exact pilot source.

The original Epifanía quote/description/primary alt remain exact. English artwork objects, derived presentation and metadata remain exact. Unknown future artwork IDs retain English fallback and explicit English prose marking; add their Spanish records when the canonical catalogue grows.

The owner approved the complete Artwork block and committed/pushed it before this increment. The next implemented block translates Home's Featured work, artist statement, featured collection, selected works, Journal preview, invitation and newsletter introduction; Collections intro/metadata/hero/thumbnail controls; and all four series' description, statement, state/counts, navigation and metadata. Original series and painting names remain exact. Both published Journal teaser titles/excerpts/categories are translated on Home, without publishing the five entries that still lack story content.

Home/Collections, About/Artist and Journal have been approved. The final content block below localizes forms, feedback, confirmation delivery and legal drafts. The Home newsletter retains Suspense without its temporary English wrapper. Complete bilingual editorial, browser/device, accessibility, legal/commercial and release review remains open.

The About/Artist increment adds typed `About` and `Artist` message namespaces to the same dictionaries: 157 new values per language, 367 total keys. About's Hero, Essence, Ecosystem and Continue scenes are translated; Artist's Hero, biography, philosophy, practice, five chronological milestones, desktop navigator, 17 process-image alternatives and closing artwork scene use the active locale. The seven philosophy paragraphs feed both the animated and reduced-motion reading modes. Page metadata follows the locale without changing the English title/description.

The two completed route-level English boundaries are removed. Person, atelier, teacher, artwork, exhibition and brand names remain source names, as does the named film `The Encounter`. The film keeps its disabled, coming-soon state with translated availability/accessibility copy. The unused AboutFilm component also receives local messages but remains unmounted; this does not enable playback or introduce another scene.

Text is resolved inside the existing scene functions, with the same record/paragraph counts, selectors, media order and layout. Journey chapter indices/numbers, event callbacks and proximity/scroll behavior stay exact. Canonical biography dates and distinction facts are preserved rather than updated from inference. All existing motion files, CSS, Glass/Standard behavior, catalogue, dependencies, APIs and consent records remain byte-identical to v3.

The following Journal increment translates its index, both existing published articles and the related-entry ribbon. The approved Home teaser translations are reused for categories, titles and excerpts. `content/journalStories.es.json` stores the three scenes of The Art of Remembering and the four scenes of Inside the Studio, keyed by their unchanged canonical story/scene IDs. `journalStoryCopy.ts` localizes only existing eyebrow/title/text fields; English objects retain identity, media/layout/facts remain exact and unknown or incompletely translated scenes retain English copy with an explicit scene language. Seventeen interface messages in `Journal` bring the dictionaries to 384 matching keys. The 367 preceding values remain exact.

The two Journal route-level English boundaries are removed, and index/article metadata follows the active locale. Entry and related-entry prose use their own fallback language. A named accessible label is added to each image-only index link, which previously had an empty image alternative and no accessible link name; its geometry, destination and decorative image treatment are retained. All three English Journal pages keep their exact previous visible copy and metadata.

The canonical seven-entry catalogue still exposes only the two entries with complete stories. The other five records remain unpublished/not-found; translations do not create a story or publishing state. Both Journal motion files, the shared carousel/input engine, scene layouts, videos/posters/playback flags, CSS, dependencies, artwork data, forms and legal/consent records remain unchanged. The already approved Spanish Home/About/Artist visible responses remain exact.

Testing a direct `/series/[slug]?artwork=...` load exposed the existing viewer portal's `document.body` access during server rendering. SeriesGallery now imports that same viewer with `next/dynamic({ssr:false})` inside its existing Client Component. All four selected-work deep links return successfully in both languages. The viewer implementation, selection/Close handlers, context query, touch/zoom, geometry and physics are unchanged. This check establishes server readiness, not browser hydration or physical-device behavior.

Spanish editorial wording is prepared for owner review. Several canonical English quotes already use the same short template (`el_misionero`, `el_baul_de_los_tesoros`, `sendero_del_sol`); the translation preserves their meaning rather than inventing new artist statements. The catalogue's existing reference-photo/digital-retouch notes and distinctions remain source content, not a new attribution or commercial authenticity claim. Review ambiguous wording with the owner before the final editorial release.

`spanishReleaseReady` remains `false`; Spanish inherits `noindex, follow`, and language alternates are disabled during the content/domain review. The existing legal documents retain their own draft/noindex behavior in both route sets. Enable Spanish indexing/alternates only after content, legal/commercial text, canonical production origin and responsive/accessibility checks are complete. No public origin or social preview artwork is invented here.

## Privacy, commercial and editorial boundaries

Translations are stored locally. Visits do not call an AI translation service. This increment adds no language cookie, analytics, marketing processing, checkout, product offers or payment integration.

The operator details, consent statements/revisions, retention periods, subscriber lifecycle and contact/newsletter API bodies remain unchanged. Their English notices must continue to describe the actual English forms during the pilot. Their eventual Spanish translation needs equivalent meaning and correct consent-record language/version handling; do not silently change those records while translating labels.

Authorship remains independent from a future sale offer: a hand-painted master copy/study is not automatically a print/edition. Availability labels do not create an authorization to buy or confirm an order. Existing source prices are not modified or advertised as new offers by this work.

## Installation and recovery

This increment moves route files and changes the real package/configuration files. Apply the supplied Git patch from the clean approved repository, rather than copying a partial `src/app` tree over the old paths. The patch does not contain `artworks.ts`, public assets, `.env.local`, installed dependencies or build output. Its reference folder includes the complete seven-file Glass module for review.

After extracting `Del_Carmen_EN_ES_Pilot_v1.zip` into Downloads, run from the project root:

```sh
git switch -c feat/i18n-en-es &&
git apply --check "$HOME/Downloads/Del_Carmen_EN_ES_Pilot_v1/Del_Carmen_EN_ES_Pilot_v1.patch" &&
git apply "$HOME/Downloads/Del_Carmen_EN_ES_Pilot_v1/Del_Carmen_EN_ES_Pilot_v1.patch" &&
npm ci &&
npm run build
```

The check must pass before application. If it reports a mismatch, keep the working tree and resolve the source difference; do not use forced or rejected-hunk application. Retain the existing `.env.local` on the owner's machine. No new environment variable is required.

Use the branch for review and commit after approval. The original upstream commit remains the recovery point. A reverse check/application is available while this increment has not been mixed with later edits:

```sh
git apply --reverse --check "$HOME/Downloads/Del_Carmen_EN_ES_Pilot_v1/Del_Carmen_EN_ES_Pilot_v1.patch"
```

Do not apply a reverse patch over later work without reviewing its effect.

### Incremental Artwork block after pilot v1

`Del_Carmen_EN_ES_Artworks_v2.zip` is incremental over the installed first pilot. It contains the patch only; it does not contain a replacement catalogue, dependencies or assets. Stay on the existing review branch and stop the local server before rebuilding. After extracting into Downloads:

```sh
i18n_artworks_patch="$HOME/Downloads/Del_Carmen_EN_ES_Artworks_v2/Del_Carmen_EN_ES_Artworks_v2.patch"
git apply --check "$i18n_artworks_patch" &&
git apply "$i18n_artworks_patch" &&
npm run build
```

No new dependency installation is needed for this block. Restart the server and review `/es/artworks`, filters, and several works in Standard/Glass. A reverse check with the same patch is available before later edits; do not overwrite conflicting owner changes.

### Incremental Home/Collections block after approved v2

`Del_Carmen_EN_ES_Home_Collections_v3.zip` contains an incremental patch over the approved/pushed `d56b772` commit. It does not add dependencies or replace canonical artwork/series/journal data or media. Remain on `feat/i18n-en-es`, stop the local server and extract into Downloads:

```sh
i18n_home_patch="$HOME/Downloads/Del_Carmen_EN_ES_Home_Collections_v3/Del_Carmen_EN_ES_Home_Collections_v3.patch"
git apply --check "$i18n_home_patch" &&
git apply "$i18n_home_patch" &&
npm run build
```

Restart the server and review `/es`, `/es/collections` and all four `/es/series/[slug]` pages, including a direct selected-work link and browser refresh. The newsletter form and full Journal/Artist destinations still retain their explicitly marked English copy until their own blocks. Commit/push the increment on the review branch after owner approval; no merge or production promotion is performed by this patch.

### Incremental About/Artist block after approved v3

`Del_Carmen_EN_ES_About_Artist_v4.zip` contains only the incremental patch over the approved Home/Collections result tree `9d677c66a545144a63968fc7f1d9fc4943339c19`. That is a content baseline, not a claim that the owner has committed or pushed v3. Keep the existing feature branch, stop the server and extract into Downloads:

```sh
i18n_artist_patch="$HOME/Downloads/Del_Carmen_EN_ES_About_Artist_v4/Del_Carmen_EN_ES_About_Artist_v4.patch"
git apply --check "$i18n_artist_patch" &&
git apply "$i18n_artist_patch" &&
npm run build
```

No dependency installation or new environment variable is needed. The check can succeed whether the preceding approved content is committed or still in the working tree; preserve unrelated owner edits. Restart the server and review `/es/about` and `/es/artist`, including long headings, five milestones, portrait/landscape and reduced motion. Journal/forms/legal translation is a later block. A reverse check/application remains available before subsequent work is mixed into these files.

### Incremental Journal block after approved v4

`Del_Carmen_EN_ES_Journal_v5.zip` contains an incremental patch over the approved About/Artist result tree `e64058aa859e0070e37fd0c250cc72838d0ee90b`. This is a content baseline, not an assumption about the owner's latest commit hash. Keep `feat/i18n-en-es`, stop the server, extract into Downloads and run from the repository root:

```sh
i18n_journal_patch="$HOME/Downloads/Del_Carmen_EN_ES_Journal_v5/Del_Carmen_EN_ES_Journal_v5.patch"
git apply --check "$i18n_journal_patch" &&
git apply "$i18n_journal_patch" &&
npm run build
```

No new dependency, asset folder or environment variable is required. Preserve unrelated owner edits if the check reports a conflict. Restart the server and review `/es/journal`, `/es/journal/the-art-of-remembering` and `/es/journal/inside-the-studio`, including the related-entry ribbon, language switching, long headings, portrait/landscape and reduced motion. Contact/newsletter forms, feedback and equivalent legal/consent localization are the next language block. Reverse check/application remains available before mixing later changes into these files.

## Verification and practical limits

The real project installs from its lockfile, passes `npm run build` with TypeScript and generates 123 static pages. Build/server checks use placeholder provider credentials; they do not submit contact/newsletter forms, access real subscriber data or validate provider delivery. Focused lint covers the added i18n/proxy/configuration code.

The first pilot passed 60 focused checks covering message keys/interpolation, locale URLs, language-switch context/modifier behavior, all 45 canonical works, exact English presentation/metadata preservation, owner Yasemi state, original asset paths, HTML escaping, price/creation-state separation, stored legal/consent/API preservation, unchanged physical/input algorithms, and English/Spanish Standard snapshot cleanup. Eighteen checks used a real production Next server across 33 HTTP requests; the other 42 used actual compiled modules/components with explicit hook/router/DOM fixtures.

The loopback test server is bound to `localhost`: Next.js 16.2.12 normalizes a 127.0.0.1 middleware URL to localhost, which makes an explicitly 127-bound test server treat that rewrite as external and loop. A matching hostname/default server binding avoids that fixture mismatch; no production-host rewrite hack is added.

Headless browser installation was unavailable in the environment. These checks do not establish rendered visual layout, physical touch/trackpad arbitration, screen-reader pronunciation or production crawler behavior. Review EN/ES on desktop, phone/tablet portrait and landscape; switch inside a selected Series work and a natively advanced Glass work; verify Standard/Glass return behavior, readable long Spanish labels, image zoom, focus and native vertical reading. Translation completion and production legal/commercial review remain open.

The Artwork block also passes the real production build/TypeScript and focused lint (zero errors; the existing native thumbnail `<img>` warning remains). Twenty-nine additional checks cover all 45 translated records/alt variants, exact catalogue/fact/price/path preservation, immutable/idempotent localization, English equivalence, source-equivalent layout/animation/physics, ICU parsing/plurals and actual archive render/event fixtures for canonical filters. Nine production-server checks exercise all 45 Standard routes in each language, translated archive/metadata, Glass entry, status and localized context. These fixtures do not replace browser hydration or device review.

The Home/Collections block passes build/TypeScript with 123 static pages, 21 new content/invariance checks and 12 production-server checks across 21 requests; all 29 Artwork checks also pass against the new 210-key message set. Before rebuilding, six English pages were captured from the approved production build; the new Home/Collections/four Series responses retain exactly the same normalized visible English copy and metadata. Tests also retain every changed component's class expressions, all approved motion engines, media/facts, arbitrary-member gallery selection callbacks and physical/input source. No real form/provider request is submitted.

Focused lint on changed files has no new findings. It retains the pre-existing SeriesGallery `react-hooks/set-state-in-effect` error, its dependency warning and two native-image warnings; the baseline/current rule/severity counts match exactly and the existing selection effect body remains identical. These are outstanding technical QA, not a clean lint claim. Browser hydration, actual lazy-viewer opening/Close/focus, long Spanish text fit, portrait/landscape touch behavior and assistive technology still require owner/device review.

The About/Artist block passes build/TypeScript with 123 static pages, 11 content/invariance checks and 12 production-server checks across five real GET responses. Before rebuilding, the preceding About/Artist responses and Spanish Home were saved from the approved build. New English About/Artist visible copy and metadata match exactly; Spanish Home remains visibly exact. Spanish checks cover all public scenes, both philosophy reading modes, all five milestone records, all 17 process alternatives, practice/closing alternatives, localized links, accessible desktop navigation, film availability and the noindex/no-cookie release boundary. The 210 preceding messages remain exact in both languages.

Focused lint for About/Artist retains one pre-existing JourneyNavigator `react-hooks/refs` error: `getProximity` reads button geometry through refs during rendering. Running the same rule against the approved v3 source confirms the same error; the callback is byte-identical and no new finding is introduced. The other changed files pass lint. This inherited issue and the earlier SeriesGallery findings remain technical debt. The frozen motion and lint rules are not rewritten as part of translation. Source/HTTP checks do not establish browser hydration, visual Spanish fit, physical-device interactions or screen-reader behavior.

The Journal block passes production build/TypeScript (123 static pages), 11 content/invariance checks and 11 production-server checks across 21 real GET requests. The three English Journal responses preserve the previous visible copy/metadata, while the approved Spanish Home/About/Artist responses stay visibly exact. Checks cover both published stories/all seven scenes, index and related-entry language/URLs, named image links, article/social metadata, scene media/playback attributes, same-story language-switch targets, the five unpublished records and an unknown slug in both languages, plus noindex/no-cookie/missing-message boundaries. All previous 367 dictionary values and the canonical data remain exact.

Focused Journal lint has zero errors and the same three existing native-image warnings as the approved source, without new findings. Earlier JourneyNavigator/SeriesGallery lint debt and the inherited dependency release gate are not resolved by this block. Actual browser hydration, rendered Spanish fit, video-file playback, physical devices, reduced-motion behavior and screen-reader use still require review. Test runs use placeholder provider credentials and GET requests only; no form/subscriber/provider action or deployment is performed.

## Known dependency release gate — 2026-10-18

Read-only `npm audit` on the approved upstream lockfile and the first pilot found the same 12 flagged packages (11 high, one critical), with no new finding introduced by the language dependency. This Artwork increment leaves both package files byte-identical to the installed pilot. The current Next.js 16.2.12 has upstream security advisories, including [AVIF image optimization](https://github.com/vercel/next.js/security/advisories/GHSA-2xp9-vwfh-vxw4). A controlled dependency/security update and regression checks are required before public release; passing a build does not resolve those findings. Do not apply an automatic forced major change as part of a content translation patch.

## Preview and production workflow

Per [Vercel environments](https://vercel.com/docs/deployments/environments), Preview supports testing changes separately from the production environment. Non-production branch commits normally produce Preview deployments; a push/merge to the configured production branch normally triggers production. Finishing translation does not itself promote a deployment. Keep work on the review branch until content, legal/commercial meaning, dependencies and release QA are validated; inspect the actual project configuration before the final merge/promotion. No Vercel settings, deployment, domain, protection or environment variable is changed in this increment.

## Contact, newsletter and legal draft localization — v6

The owner approved Journal and then noted that Contact/newsletter were still English. The next bounded block now supplies Contact introduction/metadata, subject options, field errors and delivery feedback; all newsletter states; shared privacy details/checkboxes; both legal drafts/layout/metadata; and the confirmation email. All 384 previous dictionary values remain exact, with 532 matching interface keys after this block.

`formPrivacyCopy.ts` / `content/formPrivacy.es.json` retain the original English `2026-10-15.1` notice and register Spanish `2026-10-18.1-es`. Canonical purpose IDs and the English registry stay exact. `legalCopy.ts` / `content/legalContact.es.json` render the same approved address in Spanish; operator identity/email and address facts remain canonical. Legal wording is a translation of the existing drafts, not approval/certification of legal sufficiency. Draft dates and approved retention periods remain intact.

Forms send `locale` with consent/version. Only omitted locale (legacy English), `en` or `es` are accepted. APIs validate the registered version for that language and derive the statement/purpose on the server. New Contact mail records include language; new newsletter consent objects include `language` with version/purpose/statement/server time. A checked notice is bound to its current language/version; changing to another language cannot submit the earlier checkbox as acceptance of the new copy. Field errors store message keys so feedback follows the active locale.

`server/confirmationEmail.ts` preserves the approved mail design/English visible wording and supplies Spanish copy, HTML language and escaped text/URL attributes. Spanish links include `locale=es`. Confirm/unsubscribe redirects retain the allowed presentation locale, existing `newsletter` result values and `#invitation` anchor. Query language affects presentation only; it never alters the stored consent. Existing English forms/links remain compatible; historical records are not given invented language or consent evidence.

All Redis Lua scripts, TTLs, key/audience ownership, token entropy/hash checks, race/cleanup guards, honeypots, rate limits and analytics settings stay exact. Unsubscribe still keeps only email/status/date for 30 days. No existing subscriber is migrated/reconfirmed and no real provider, subscriber or mail operation is performed by this implementation/test work. No cookie, dependency, asset, database, domain, sale or deployment is added.

`Del_Carmen_EN_ES_Forms_Legal_v6.zip` applies over approved Journal result tree `26cf29e2f347d905535ed5b25b1357a224855190`. Keep the existing feature branch, stop the server, extract into Downloads and run from the project root:

```sh
i18n_forms_patch="$HOME/Downloads/Del_Carmen_EN_ES_Forms_Legal_v6/Del_Carmen_EN_ES_Forms_Legal_v6.patch"
git apply --check "$i18n_forms_patch" &&
git apply "$i18n_forms_patch" &&
npm run build
```

No dependency installation or new environment variable is required. Preserve unrelated owner edits if application reports a conflict. Review `/es/contact`, the Home newsletter, `/es/privacy` and `/es/terms`, including native browser validation, actual configured email delivery, language switching and physical-device layout. Reverse check/application remains available before later edits are mixed in.

Validation: build/TypeScript pass with 123 static pages; 16 functional groups exercise actual compiled components/routes/helpers through explicit hook/transport/provider/Redis fixtures; five source/invariance checks preserve approved classes/motion/data/settings; nine production-server groups cover 15 real GET requests. English Contact/Privacy/Terms/Home, hydrated form fixtures and mail wording remain exact. Previously approved Spanish Home/Journal/About/Artist visible responses remain exact. Tests cover language-bound consent, translated errors/results, forged or mismatched consent rejection with no delivery/write, correct stored statements/mail, legacy English, rate/honeypot/active/provider-cleanup contracts and result redirects.

Focused lint retains the existing NewsletterForm `react-hooks/set-state-in-effect` error in query-result synchronization, confirmed against v5 without a new finding. Earlier JourneyNavigator/SeriesGallery debt and inherited dependency release gates remain open. The 30 groups do not establish real-provider persistence/delivery, rendered device/screen-reader/reduced-motion/native-validation behavior or legal sufficiency. Spanish stays noindex; legal drafts stay noindex in both languages.
