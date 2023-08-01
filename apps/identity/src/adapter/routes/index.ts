import type { FastifyInstance } from "fastify";
import type { IncomingMessage, Server, ServerResponse } from "http";
import type { IdentityRoutes } from "@/types/types";

import jwksRoutes from "./certs/jwks";
import tokenRoutes from "./token/token";
import mainRoutes from "./metadata/main";
import openapiRoutes from "./metadata/openapi";
import versionRoutes from "./metadata/version";
import identityRoutes from "./identity/identity";
import checkhealthRoutes from "./metadata/checkhealth";
import localIdentityRoutes from "./auth/local.identity";
import dependencies from "../../infrastructure/diConfig";
import AuthenticationMiddleware from "../middleware/authentication";

/**
 *
 * @todo
 *  ☑️ clean up this mess (code smells & clean code)
 *  ☑️ destructuring routes
 *  ☐ [SOON] may be i need to add some prefix to routes
 *
 */
export function routes(
    server: FastifyInstance<Server, IncomingMessage, ServerResponse>
): { routes: IdentityRoutes } {
    const { identityService, authenticationService, tokenManagementService } =
        dependencies;

    server.addHook("onRequest", (request, reply) =>
        AuthenticationMiddleware.jwt(request, reply, tokenManagementService)
    );

    const token = tokenRoutes(tokenManagementService).routes;
    const localStrategy = localIdentityRoutes(authenticationService).routes;
    const identity = identityRoutes(identityService).routes;
    const checkhealth = checkhealthRoutes().routes;
    const main = mainRoutes().routes;
    const openapi = openapiRoutes().routes;
    const version = versionRoutes().routes;
    const jwks = jwksRoutes().routes;

    return {
        routes: [
            ...main,
            ...jwks,
            ...token,
            ...openapi,
            ...checkhealth,
            ...version,
            ...identity,
            ...localStrategy,
        ],
    };
}
