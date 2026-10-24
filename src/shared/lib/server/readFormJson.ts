// Shared by the public form routes. The limit applies to bytes actually read,
// including streamed requests without a trustworthy Content-Length header.
export const MAX_FORM_BODY_BYTES = 32 * 1024;

type FormJsonResult =
    | { ok: true; body: Record<string, unknown> }
    | { ok: false; status: 400 | 403 | 413 | 415; error: string; code: string };

export async function readFormJson(request: Request): Promise<FormJsonResult> {
    const reject = (status: 400 | 403 | 413 | 415, error: string, code: string): FormJsonResult =>
        ({ ok: false, status, error, code });

    if (request.headers.get("sec-fetch-site") === "cross-site") {
        return reject(403, "Invalid request origin.", "invalid_origin");
    }
    const origin = request.headers.get("origin");
    if (origin !== null) {
        try {
            // As in Next's origin checks, use the public forwarded host. The
            // Request URL can contain Next's internal listening hostname.
            const url = new URL(request.url);
            const host = request.headers.get("x-forwarded-host")?.split(",", 1)[0].trim() ||
                request.headers.get("host") || url.host;
            const protocol = request.headers.get("x-forwarded-proto")?.split(",", 1)[0].trim() ||
                url.protocol.slice(0, -1);
            const source = new URL(origin);
            if (source.origin !== origin || source.host !== host ||
                !["http", "https"].includes(protocol) || source.protocol !== `${protocol}:`) {
                return reject(403, "Invalid request origin.", "invalid_origin");
            }
        } catch {
            return reject(403, "Invalid request origin.", "invalid_origin");
        }
    }

    const mediaType = request.headers.get("content-type")?.split(";", 1)[0].trim().toLowerCase();
    if (mediaType !== "application/json") {
        return reject(415, "JSON content is required.", "unsupported_media_type");
    }

    const declaredLength = request.headers.get("content-length");
    if (declaredLength !== null && !/^\d+$/.test(declaredLength)) {
        return reject(400, "Invalid request.", "invalid_request");
    }
    if (declaredLength !== null && Number(declaredLength) > MAX_FORM_BODY_BYTES) {
        return reject(413, "Request is too large.", "payload_too_large");
    }

    const reader = request.body?.getReader();
    if (!reader) return reject(400, "Invalid request.", "invalid_request");

    try {
        const chunks: Uint8Array[] = [];
        let length = 0;
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            length += value.byteLength;
            if (length > MAX_FORM_BODY_BYTES) {
                // Do not wait for a potentially unbounded producer to finish.
                void reader.cancel().catch(() => {});
                return reject(413, "Request is too large.", "payload_too_large");
            }
            chunks.push(value);
        }

        const bytes = new Uint8Array(length);
        let offset = 0;
        for (const chunk of chunks) {
            bytes.set(chunk, offset);
            offset += chunk.byteLength;
        }
        const body: unknown = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
        if (!body || typeof body !== "object" || Array.isArray(body)) {
            return reject(400, "Invalid request.", "invalid_request");
        }
        return { ok: true, body: body as Record<string, unknown> };
    } catch {
        return reject(400, "Invalid request.", "invalid_request");
    } finally {
        reader.releaseLock();
    }
}
