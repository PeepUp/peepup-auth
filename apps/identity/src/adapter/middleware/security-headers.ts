import { DoneFuncWithErrOrRes, FastifyReply, FastifyRequest } from "fastify";

export async function securityHeaders(
    _: FastifyRequest,
    reply: FastifyReply,
    done: DoneFuncWithErrOrRes
) {
    reply.header("Server", "dofavour_v1");
    reply.header("Access-Control-Allow-Credentials", "true");
    reply.header("X-Content-Type-Options", "nosniff");
    reply.header("Cache-control", "no-cache, no-store, max-age=0, must-revalidate");
    reply.header("X-Permitted-Cross-Domain-Policies", "none");
    reply.header(
        "Content-Security-Policy",
        "default-src 'self';base-uri 'self';font-src 'self' https: data:;form-action 'self';frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self';script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests"
    );
    reply.header("Strict-Transport-Security", "max-age=31536000; includeSubdomains;");
    reply.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, X-Csrf-Token, x-csrf-token, X-CSRF-TOKEN, X-CSRF-Token, Authorization, authorization"
    );
    reply.header("Cross-Origin-Embedder-Policy", "require-corp");
    reply.header("Access-Control-Max-Age", "86400");
    reply.header("Pragma", "no-cache");
    reply.header("Cross-Origin-Resource-Policy", "same-origin");
    reply.header("Cross-Origin-Opener-Policy", "same-origin");
    reply.header("Expires", "-1");
    reply.header("Content-Security-Policy", "script-src 'self'");
    reply.header("X-XSS-Protection", "0");
    reply.header("Referrer-Policy", "no-referrer");
    reply.header("X-Frame-Options", "DENY");

    // reply.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    reply.removeHeader("X-Powered-By");

    /* reply.header(
         "Permissions-Policy",
         "accelerometer=(),autoplay=(),camera=(),display-capture=(),document-domain=(),encrypted-media=(),fullscreen=(),geolocation=(),gyroscope=(),magnetometer=(),microphone=(),midi=(),payment=(),picture-in-picture=(),publickey-credentials-get=(),screen-wake-lock=(),sync-xhr=(self),usb=(),web-share=(),xr-spatial-tracking=()"
     ); */

    return done();
}
