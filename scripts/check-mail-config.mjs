import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { serverModules } from "./lib/loadProjectModule.mjs";

const require = createRequire(import.meta.url);
const { loadEnvConfig } = require("@next/env");
const production = process.argv.includes("--production");
loadEnvConfig(fileURLToPath(new URL("../", import.meta.url)), !production && process.env.NODE_ENV !== "production", { info() {}, error() {} });
const config = serverModules()("src/config/mail.ts");
const env = { ...process.env, ...(production ? { NODE_ENV: "production", VERCEL_ENV: "production" } : {}) };
const request = new Request("http://localhost:3000");
let failed = 0;
console.log("Mail configuration — presence and format only; no messages or provider calls.");
for (const [label, check] of [
    ["Contact sender and recipient", () => config.getContactMailSettings(env)],
    ["Newsletter sender and reply address", () => config.getNewsletterMailSettings(env)],
    ["Redis endpoint and credential presence", () => config.getRedisSettings(env)],
    ["Newsletter link origin", () => config.getNewsletterOrigin(request, env)],
]) {
    try { check(); console.log(`${label}: OK`); }
    catch (error) {
        failed++;
        console.error(`${label}: ${error instanceof config.MailConfigurationError ? `${error.code} (${error.fields.join(", ")})` : "unavailable"}`);
    }
}
if (env.NEXT_PUBLIC_SITE_URL && env.SITE_URL && env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "") !== env.SITE_URL.replace(/\/$/, "")) {
    console.warn("SITE_URL overrides a different legacy NEXT_PUBLIC_SITE_URL. Review/remove the obsolete value.");
}
if (env.NEXT_PUBLIC_SITE_URL && !env.SITE_URL) {
    console.warn("Only the legacy mail origin is configured. Set SITE_URL to the approved origin to align mail and SEO.");
}
console.log("Domain verification, DNS, credentials at providers and real delivery still require their separate checks. No secret values were printed.");
process.exitCode = failed ? 1 : 0;
