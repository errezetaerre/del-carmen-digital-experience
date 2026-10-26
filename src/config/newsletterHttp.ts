// Route-specific policy must follow the general headers in next.config.ts.
// Next's response configuration can override a Route Handler's own headers.
export const newsletterActionHeaders = {
    "Cache-Control": "no-store",
    // Strip the token/path while preserving the Origin of native POST forms.
    "Referrer-Policy": "strict-origin",
    "X-Robots-Tag": "noindex, nofollow",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'",
};
