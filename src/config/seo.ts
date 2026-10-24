// Keep the live origin until the registered domain is connected and verified.
const currentPublicOrigin = "https://del-carmen-digital-experience.vercel.app";

export function resolveSiteOrigin(value: string = currentPublicOrigin): string {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.username || url.password ||
        url.pathname !== "/" || url.search || url.hash) {
        throw new Error("SITE_URL must be an HTTPS origin without a path, credentials, query or fragment.");
    }
    return url.origin;
}

export const siteOrigin = resolveSiteOrigin(process.env.SITE_URL?.trim() || currentPublicOrigin);

// Vercel sets VERCEL_ENV for each build. Local development remains noindex.
export const isIndexableDeployment = process.env.VERCEL_ENV
    ? process.env.VERCEL_ENV === "production"
    : process.env.NODE_ENV === "production";
