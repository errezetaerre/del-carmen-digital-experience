import { currentPublicOrigin, resolveSiteOrigin } from "./siteOrigin";
export { resolveSiteOrigin } from "./siteOrigin";

export const siteOrigin = resolveSiteOrigin(process.env.SITE_URL?.trim() || currentPublicOrigin);

// Vercel sets VERCEL_ENV for each build. Local development remains noindex.
export const isIndexableDeployment = process.env.VERCEL_ENV
    ? process.env.VERCEL_ENV === "production"
    : process.env.NODE_ENV === "production";
