import { getRequestConfig } from "next-intl/server";
import { defaultLocale, isSiteLocale } from "./config";
import { getSiteMessages } from "./messages";

// requestLocale/setRequestLocale are supported by the project's Next.js 16.2.12.
// The newer next/root-params integration requires a later Next.js release.
export default getRequestConfig(async ({ requestLocale }) => {
    const requested = await requestLocale;
    const locale = isSiteLocale(requested) ? requested : defaultLocale;
    return { locale, messages: getSiteMessages(locale), timeZone: "America/Costa_Rica" };
});
