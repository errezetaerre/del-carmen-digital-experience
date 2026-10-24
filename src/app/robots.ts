import type { MetadataRoute } from "next";
import { isIndexableDeployment, siteOrigin } from "@/config/seo";

export default function robots(): MetadataRoute.Robots {
    if (!isIndexableDeployment) return { rules: { userAgent: "*", disallow: "/" } };
    return {
        // Allow the Spanish pilot and legal drafts to be crawled so their noindex is seen.
        rules: { userAgent: "*", allow: "/", disallow: "/api/" },
        sitemap: `${siteOrigin}/sitemap.xml`,
    };
}
