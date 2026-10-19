import type { SiteLocale } from "./config";
import type { SiteMessages } from "./messages";

declare module "next-intl" {
    interface AppConfig {
        Locale: SiteLocale;
        Messages: SiteMessages;
    }
}
