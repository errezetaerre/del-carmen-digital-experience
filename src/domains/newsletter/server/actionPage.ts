import { localizeHref, type SiteLocale } from "@/i18n/config";
import { getSiteMessages } from "@/i18n/messages";
import { newsletterActionHeaders } from "@/config/newsletterHttp";

export type NewsletterAction = "confirm" | "unsubscribe";
type PageState = "action" | "unavailable" | "rateLimited" | "invalidRequest";

function escape(value: string) {
    return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}

export function newsletterActionPage(action: NewsletterAction, locale: SiteLocale, state: PageState = "action", token?: string, status = 200, extraHeaders: Record<string, string> = {}) {
    const copy = getSiteMessages(locale).NewsletterAction;
    const confirm = action === "confirm";
    const heading = state === "action" ? copy[confirm ? "confirmTitle" : "unsubscribeTitle"] : copy[`${state}Title`];
    const description = state === "action" ? copy[confirm ? "confirmDescription" : "unsubscribeDescription"] : copy[`${state}Description`];
    const validToken = token && /^[a-f0-9]{64}$/i.test(token) ? token : null;
    return new Response(`<!doctype html><html lang="${locale}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><meta name="referrer" content="strict-origin"><title>${escape(heading)} | Del Carmen</title>
<style>*{box-sizing:border-box}body{margin:0;min-height:100svh;display:grid;place-items:center;padding:32px 24px;background:#080808;color:#f5f5f5;font:16px/1.7 system-ui,sans-serif}main{width:min(100%,520px);padding-block:32px}.brand{color:#c9a35a;font-size:11px;letter-spacing:.3em;text-transform:uppercase}h1{font:400 clamp(32px,6vw,48px)/1.15 Georgia,serif;margin:26px 0 22px}p{color:#b5b0a9;margin:0 0 28px}button{max-width:100%;padding:14px 22px;border:1px solid #c9a35a;background:transparent;color:#e1bb80;font:500 12px/1.5 system-ui,sans-serif;letter-spacing:.12em;text-transform:uppercase;cursor:pointer}button:hover{background:#c9a35a;color:#080808}a{color:#d2c2a6;text-underline-offset:5px}:where(a,button):focus-visible{outline:2px solid #e1bb80;outline-offset:5px}nav{display:flex;flex-wrap:wrap;gap:22px;margin-top:36px;padding-top:24px;border-top:1px solid #c9a35a33;font-size:13px}</style></head>
<body><main aria-labelledby="action-title"><div class="brand">Del Carmen</div><h1 id="action-title">${escape(heading)}</h1><p>${escape(description)}</p>
${validToken ? `<form method="post" action="/api/newsletter/${action}"><input type="hidden" name="token" value="${escape(validToken)}"><input type="hidden" name="locale" value="${locale}"><button type="submit">${escape(state === "action" ? copy[confirm ? "confirmButton" : "unsubscribeButton"] : copy.retry)}</button></form>` : ""}
<nav aria-label="${escape(copy.navigation)}"><a href="${localizeHref("/", locale)}">${escape(copy.back)}</a><a href="${localizeHref("/privacy", locale)}">${escape(copy.privacy)}</a></nav></main></body></html>`, {
        status,
        headers: {
            "Content-Type": "text/html; charset=utf-8", ...newsletterActionHeaders,
            ...extraHeaders,
        },
    });
}
