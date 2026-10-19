"use client";

import { useLocale, useTranslations } from "next-intl";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { usePathname } from "./navigation";
import { localizeHref, locales } from "./config";
import NextLink from "next/link";

type Props = { className?: string; onNavigate?: () => void };

function LanguageChoices({ className = "", onNavigate }: Props) {
    const locale = useLocale();
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const query = searchParams.toString();
    const t = useTranslations("Navigation");
    const [hash, setHash] = useState("");

    // Read after hydration so static rendering and incoming query/hash both work.
    useEffect(() => {
        const update = () => setHash(window.location.hash);
        update();
        window.addEventListener("hashchange", update);
        window.addEventListener("popstate", update);
        return () => { window.removeEventListener("hashchange", update); window.removeEventListener("popstate", update); };
    }, [pathname]);

    return <nav lang={locale} aria-label={t("language")} className={`inline-flex items-center gap-2 font-sans text-[11px] uppercase tracking-[0.12em] ${className}`}>
        {locales.map((language, index) => <span key={language} className="inline-flex items-center gap-2">
            {index > 0 && <span aria-hidden="true" className="text-current opacity-25">/</span>}
            {language === locale ? <span lang={language} aria-current="true" className="text-brand-gold">{language.toUpperCase()}</span> : <NextLink
                href={localizeHref(pathname + (query ? `?${query}` : "") + hash, language)} hrefLang={language}
                aria-label={t(language === "es" ? "switchToSpanish" : "switchToEnglish")}
                className="inline-flex min-h-6 min-w-6 items-center justify-center text-current opacity-60 transition-opacity hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-gold"
                scroll={false}
                onClick={(event) => {
                    const href = localizeHref(window.location.pathname + window.location.search + window.location.hash, language);
                    event.currentTarget.href = href;
                    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
                    event.preventDefault();
                    onNavigate?.();
                    router.replace(href, { scroll: false });
                }}
            >{language.toUpperCase()}</NextLink>}
        </span>)}
    </nav>;
}

export default function LanguageSwitcher(props: Props) {
    const locale = useLocale();
    return <Suspense fallback={<span className={`font-sans text-[11px] uppercase tracking-[0.12em] text-brand-gold ${props.className ?? ""}`}>{locale.toUpperCase()}</span>}>
        <LanguageChoices {...props} />
    </Suspense>;
}
