import type { SiteLocale } from "@/i18n/config";
import { getSiteMessages } from "@/i18n/messages";

function escapeHtml(value: string) {
    return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}

export function createNewsletterConfirmationEmail(locale: SiteLocale, confirmationUrl: string) {
    const copy = getSiteMessages(locale).NewsletterEmail;
    return {
        subject: copy.subject,
        text: ["Del Carmen", "", copy.heading, "", copy.description, "", copy.confirm + ": " + confirmationUrl, "", copy.expiry].join("\n"),
        html: `
                    <!doctype html>
                    <html lang="${locale}">
                        <body
                            style="
                                margin:0;
                                padding:0;
                                background:#0B0B0B;
                                color:#f5f5f5;
                                font-family:Arial,sans-serif;
                            "
                        >
                            <div
                                style="
                                    max-width:600px;
                                    margin:0 auto;
                                    padding:64px 32px;
                                "
                            >
                                <p
                                    style="
                                        margin:0 0 24px;
                                        color:#C9A35A;
                                        font-size:11px;
                                        letter-spacing:4px;
                                        text-transform:uppercase;
                                    "
                                >
                                    Del Carmen
                                </p>

                                <h1
                                    style="
                                        margin:0 0 24px;
                                        color:#f5f5f5;
                                        font-family:Georgia,serif;
                                        font-size:36px;
                                        font-weight:400;
                                        line-height:1.15;
                                    "
                                >
                                    ${escapeHtml(copy.heading)}
                                </h1>

                                <p
                                    style="
                                        margin:0 0 36px;
                                        color:#A1A1AA;
                                        font-size:16px;
                                        line-height:1.7;
                                    "
                                >
                                    ${escapeHtml(copy.description)}
                                </p>

                                <a
                                    href="${escapeHtml(confirmationUrl)}"
                                    style="
                                        display:inline-block;
                                        border:1px solid rgba(201,163,90,0.65);
                                        padding:14px 22px;
                                        color:#C9A35A;
                                        font-size:12px;
                                        font-weight:600;
                                        letter-spacing:2px;
                                        text-decoration:none;
                                        text-transform:uppercase;
                                    "
                                >
                                    ${escapeHtml(copy.confirm)}
                                </a>

                                <p
                                    style="
                                        margin:36px 0 0;
                                        color:#6f6f73;
                                        font-size:12px;
                                        line-height:1.6;
                                    "
                                >
                                    ${escapeHtml(copy.expiry)}
                                </p>
                            </div>
                        </body>
                    </html>
                `,
    };
}
