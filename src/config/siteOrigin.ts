// Approved canonical identity shared by SEO and production email links.
export const currentPublicOrigin = "https://rolandodelcarmen.com";

export function resolveSiteOrigin(value: string = currentPublicOrigin): string {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.username || url.password ||
        url.pathname !== "/" || url.search || url.hash) {
        throw new Error("SITE_URL must be an HTTPS origin without a path, credentials, query or fragment.");
    }
    return url.origin;
}
