import AbilityGuard from "@/adapter/middleware/guard/abilty";
import AuthenticationMiddleware from "@/adapter/middleware/guard/jwt";

import dependencies from "@/infrastructure/diConfig";
import jwksRoutes from "@/adapter/routes/certs/jwks";
import tokenRoutes from "@/adapter/routes/token/token";
import mainRoutes from "@/adapter/routes/metadata/main";
import openapiRoutes from "@/adapter/routes/metadata/openapi";
import versionRoutes from "@/adapter/routes/metadata/version";
import identityRoutes from "@/adapter/routes/identity/identity";
import checkhealthRoutes from "@/adapter/routes/metadata/checkhealth";
import localIdentityRoutes from "@/adapter/routes/auth/local.identity";

import { deviceIdHook } from "@/adapter/middleware/device-id";
import { fingerprintHook } from "@/adapter/middleware/fingerprint";
import { securityHeaders } from "@/adapter/middleware/security-headers";

import type { IdentityRoutes } from "@/types/types";
import type { IncomingMessage, Server, ServerResponse } from "http";
import type { DoneFuncWithErrOrRes, FastifyInstance } from "fastify";

export function routes(server: FastifyInstance<Server, IncomingMessage, ServerResponse>): {
    routes: IdentityRoutes;
} {
    const { identityService, authenticationService, tokenManagementService } = dependencies;

    server.addHook("onRequest", (request, reply, done) => {
        AbilityGuard.abac(request, reply, done);
    });

    server.addHook("onRequest", (request, reply, done: DoneFuncWithErrOrRes) =>
        deviceIdHook(request, reply, done)
    );

    server.addHook("onRequest", (request, reply, done: DoneFuncWithErrOrRes) =>
        fingerprintHook(request, reply, done)
    );

    server.addHook("onRequest", (request, reply) =>
        AuthenticationMiddleware.jwt(request, reply, tokenManagementService)
    );

    server.addHook("onSend", (request, reply, _, done: DoneFuncWithErrOrRes) => {
        securityHeaders(request, reply, done);
    });

    return {
        routes: [
            ...tokenRoutes(tokenManagementService).routes,
            ...localIdentityRoutes(authenticationService).routes,
            ...identityRoutes(identityService).routes,
            ...checkhealthRoutes().routes,
            ...mainRoutes().routes,
            ...openapiRoutes().routes,
            ...versionRoutes().routes,
            ...jwksRoutes().routes,
        ],
    };
}
