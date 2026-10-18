# Internationalization

Version: 1.1
Document ID: DOC-I18N
Project: Del Carmen Digital Experience
Status: Foundation reviewed; Artwork block implemented for owner review; broader Spanish release remains open
Last Updated: 2026-10-18

## Decision and source

The owner approved one shared EN/ES site, English as the default, manual language selection, unchanged artwork titles and shared assets. The first increment is the language foundation, navigation and one artwork pilot, rather than a claim that the complete public Spanish edition is ready.

Implementation starts from the actual upstream commit `f2cf5b15c6b2c16d9979d164831b44680d64a8b6`, with its root configuration, lockfile and latest owner catalogue. A separate local `feat/i18n-en-es` branch holds the work. No deployment or upstream push is part of this increment.

## Shared architecture

- All public layouts/pages move once into `src/app/[locale]/`; their components remain in their existing domains.
- `src/app/api/`, `globals.css` and `favicon.ico` remain global. Public image/video paths and their files remain unchanged.
- `src/i18n/config.ts` owns the `en | es` type, URL helpers and Spanish release state.
- `routing.ts`, `navigation.ts`, `request.ts` and `src/proxy.ts` integrate `next-intl` with App Router.
- `messages/en.json` and `messages/es.json` hold shared interface messages by namespace. English/Spanish keys and interpolation variables must match.
- `artworkCopy.ts` reads stored Spanish editorial translations by canonical artwork ID from `content/artworks.es.json` and maps medium/support/category labels. The translation file covers the current 45 works, including their existing image-variant alternative text. Titles, IDs, slugs, years, authorship, prices, availability, dimensions, membership and image URLs retain their canonical source.
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

The remaining Home sections, full Series/editorial copy, About/Artist/Journal, forms and legal documents still require Spanish content work. Existing English content remains available and explicitly marked where wrapped; translated shared cards override their local language. This is a partial Spanish preview, not a completed bilingual commercial release.

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

## Verification and practical limits

The real project installs from its lockfile, passes `npm run build` with TypeScript and generates 123 static pages. Build/server checks use placeholder provider credentials; they do not submit contact/newsletter forms, access real subscriber data or validate provider delivery. Focused lint covers the added i18n/proxy/configuration code.

The first pilot passed 60 focused checks covering message keys/interpolation, locale URLs, language-switch context/modifier behavior, all 45 canonical works, exact English presentation/metadata preservation, owner Yasemi state, original asset paths, HTML escaping, price/creation-state separation, stored legal/consent/API preservation, unchanged physical/input algorithms, and English/Spanish Standard snapshot cleanup. Eighteen checks used a real production Next server across 33 HTTP requests; the other 42 used actual compiled modules/components with explicit hook/router/DOM fixtures.

The loopback test server is bound to `localhost`: Next.js 16.2.12 normalizes a 127.0.0.1 middleware URL to localhost, which makes an explicitly 127-bound test server treat that rewrite as external and loop. A matching hostname/default server binding avoids that fixture mismatch; no production-host rewrite hack is added.

Headless browser installation was unavailable in the environment. These checks do not establish rendered visual layout, physical touch/trackpad arbitration, screen-reader pronunciation or production crawler behavior. Review EN/ES on desktop, phone/tablet portrait and landscape; switch inside a selected Series work and a natively advanced Glass work; verify Standard/Glass return behavior, readable long Spanish labels, image zoom, focus and native vertical reading. Translation completion and production legal/commercial review remain open.

The Artwork block also passes the real production build/TypeScript and focused lint (zero errors; the existing native thumbnail `<img>` warning remains). Twenty-nine additional checks cover all 45 translated records/alt variants, exact catalogue/fact/price/path preservation, immutable/idempotent localization, English equivalence, source-equivalent layout/animation/physics, ICU parsing/plurals and actual archive render/event fixtures for canonical filters. Nine production-server checks exercise all 45 Standard routes in each language, translated archive/metadata, Glass entry, status and localized context. These fixtures do not replace browser hydration or device review.

## Known dependency release gate — 2026-10-18

Read-only `npm audit` on the approved upstream lockfile and the first pilot found the same 12 flagged packages (11 high, one critical), with no new finding introduced by the language dependency. This Artwork increment leaves both package files byte-identical to the installed pilot. The current Next.js 16.2.12 has upstream security advisories, including [AVIF image optimization](https://github.com/vercel/next.js/security/advisories/GHSA-2xp9-vwfh-vxw4). A controlled dependency/security update and regression checks are required before public release; passing a build does not resolve those findings. Do not apply an automatic forced major change as part of a content translation patch.
