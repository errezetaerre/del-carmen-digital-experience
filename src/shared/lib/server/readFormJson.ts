// Bound the actual stream, not only the caller's Content-Length claim.
export const MAX_FORM_BODY_BYTES = 32 * 1024;

export type FormRequestFailure = { ok: false; status: 400 | 403 | 413 | 415; error: string; code: string };
const reject = (status: FormRequestFailure["status"], error: string, code: string): FormRequestFailure =>
    ({ ok: false, status, error, code });

export function hasAllowedRequestOrigin(request: Request): boolean {
    if (request.headers.get("sec-fetch-site") === "cross-site") return false;
    const origin = request.headers.get("origin");
    if (origin === null) return true;
    try {
        const url = new URL(request.url);
        const host = request.headers.get("x-forwarded-host")?.split(",", 1)[0].trim() || request.headers.get("host") || url.host;
        const protocol = request.headers.get("x-forwarded-proto")?.split(",", 1)[0].trim() || url.protocol.slice(0, -1);
        const source = new URL(origin);
        return source.origin === origin && source.host === host &&
            ["http", "https"].includes(protocol) && source.protocol === `${protocol}:`;
    } catch { return false; }
}

export async function readFormText(request: Request, maxBytes: number): Promise<{ ok: true; text: string } | FormRequestFailure> {
    const declaredLength = request.headers.get("content-length");
    if (declaredLength !== null && !/^\d+$/.test(declaredLength)) return reject(400, "Invalid request.", "invalid_request");
    if (declaredLength !== null && Number(declaredLength) > maxBytes) return reject(413, "Request is too large.", "payload_too_large");
    const reader = request.body?.getReader();
    if (!reader) return reject(400, "Invalid request.", "invalid_request");
    try {
        const chunks: Uint8Array[] = [];
        let length = 0;
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            length += value.byteLength;
            if (length > maxBytes) {
                void reader.cancel().catch(() => {});
                return reject(413, "Request is too large.", "payload_too_large");
            }
            chunks.push(value);
        }
        const bytes = new Uint8Array(length);
        let offset = 0;
        for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
        return { ok: true, text: new TextDecoder("utf-8", { fatal: true }).decode(bytes) };
    } catch { return reject(400, "Invalid request.", "invalid_request"); }
    finally { reader.releaseLock(); }
}

export async function readFormJson(request: Request): Promise<{ ok: true; body: Record<string, unknown> } | FormRequestFailure> {
    if (!hasAllowedRequestOrigin(request)) return reject(403, "Invalid request origin.", "invalid_origin");
    const mediaType = request.headers.get("content-type")?.split(";", 1)[0].trim().toLowerCase();
    if (mediaType !== "application/json") return reject(415, "JSON content is required.", "unsupported_media_type");
    const result = await readFormText(request, MAX_FORM_BODY_BYTES);
    if (!result.ok) return result;
    try {
        const body: unknown = JSON.parse(result.text);
        if (!body || typeof body !== "object" || Array.isArray(body)) return reject(400, "Invalid request.", "invalid_request");
        return { ok: true, body: body as Record<string, unknown> };
    } catch { return reject(400, "Invalid request.", "invalid_request"); }
}
