import type { IdentityRoutes } from "@/types/types";
import dependencies from "../../infrastructure/diConfig";
import localIdentityRoutes from "./auth/local.identity";
import jwksRoutes from "./certs/jwks";
import identityRoutes from "./identity/identity";
import checkhealthRoutes from "./metadata/checkhealth";
import mainRoutes from "./metadata/main";
import openapiRoutes from "./metadata/openapi";
import versionRoutes from "./metadata/version";

/**
 *
 * @todo
 *  ☑️ clean up this mess (code smells & clean code)
 *  ☑️ destructuring routes
 *  ☐ [SOON] may be i need to add some prefix to routes
 *
 */
export function routes(): { routes: IdentityRoutes } {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { identityService, authenticationService, tokenManagementService } =
        dependencies;
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
            ...openapi,
            ...checkhealth,
            ...version,
            ...identity,
            ...localStrategy,
        ],
    };
}
