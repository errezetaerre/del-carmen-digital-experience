# Search metadata and discovery

The shared metadata factory owns canonical URLs, Open Graph/Twitter metadata and page indexing policy. Each route passes its own internal `pathname`; the locale layout sets `metadataBase` and does not inherit a home-page canonical into its children.

## Public origin

`src/config/seo.ts` reads the server-side `SITE_URL` environment variable. Until the registered domain is connected and verified, its fallback is the current public production address, `https://del-carmen-digital-experience.vercel.app`.

After approval of the domain connection, set `SITE_URL=https://rolandodelcarmen.com` in the Production environment and rebuild. This changes metadata and discovery URLs; it does not configure Cloudflare DNS, Vercel domains, HTTPS, www redirects or email. An invalid origin fails explicitly rather than publishing malformed URLs. HTTPS is required; paths, credentials, query strings and fragments are rejected.

## Canonical and language policy

- English uses unprefixed public paths; Spanish uses `/es`. Internal `/en` render paths are not canonical URLs.
- Experience mode, source selection, filters, search, ordering and fragments do not create separate canonical pages.
- Spanish pages retain their own canonical and `noindex` while `spanishReleaseReady` is false. They are omitted from the sitemap and from language alternate declarations.
- Once the existing Spanish release gate is approved and changed, the same metadata and sitemap helpers emit reciprocal EN/ES and x-default alternates. The routing middleware's automatic Link header remains disabled to avoid advertising unreviewed routes.
- Privacy and Terms remain drafts with `noindex`; they are excluded from discovery and language alternates. Their editorial release is separate work.

## Deployment policy

Vercel Preview/Development builds and local development are not indexable. Production builds may index released pages. Outside Vercel, a normal production build is treated as public; a separate staging deployment must explicitly set `VERCEL_ENV=preview` when building and running.

Preview robots disallows crawling and its sitemap is empty. Page metadata also carries noindex. These are crawler instructions, not authentication or access protection.

## Discovery

App Router serves `/sitemap.xml` and `/robots.txt` from `src/app/sitemap.ts` and `src/app/robots.ts`.

The sitemap is generated from canonical catalog services: seven public index/editorial routes, Artwork detail, ArtworkSeries detail and Journal entries that have published stories. It does not include API endpoints, legal drafts, query variants or unpublished Journal entries. Planned artworks remain legitimate Coming Soon detail pages. No artificial modification dates or update-frequency promises are generated.

Production robots allows public crawling and excludes `/api/`. It deliberately allows crawlers to read Spanish/legal pages so their noindex metadata can be seen. Do not replace those noindex directives with robots exclusions.

## Social sharing

Home uses its curated, completed artwork; completed Artwork pages use their primary catalog image; Series uses its completed cover artwork when available; Journal uses the published entry image. The existing image paths, titles and localized content remain canonical. Planned/in-progress artwork reference images are not exposed in social previews. Other pages retain title/description cards without an invented image.

## Release checks

Run lint and production build with the project's existing environment configuration. Inspect canonical/robots/social tags and XML in the new Preview, then validate DNS, HTTPS, domain redirects and real social previews when connecting the domain. Review the Spanish and legal release gates separately. Search engine indexing and third-party share caches are not guaranteed by a successful local build.
