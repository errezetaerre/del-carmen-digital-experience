import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { isSiteLocale } from "./config";

export async function activateLocale(params: Promise<{ locale: string }>) {
    const { locale } = await params;
    if (!isSiteLocale(locale)) notFound();
    setRequestLocale(locale);
    return locale;
}
