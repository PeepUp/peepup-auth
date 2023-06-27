import { ZodTypeProvider } from "fastify-type-provider-zod";
import { dependencies } from "../../infrastructure/diConfig";
import identityRoutes from "./identity";
import localIdentityRoutes from "./local.identity";
import checkhealthRoutes from "./metadata/checkhealth";
import versionRoutes from "./metadata/version";
import jwksRoutes from "./oauth2/jwks";
import openapiRoutes from "./openapi";

import type { FastifyBaseLogger, RouteOptions } from "fastify";
import type http from "http";

export type Routes = Array<
   RouteOptions<
      http.Server,
      http.IncomingMessage,
      http.ServerResponse,
      any,
      any,
      any,
      ZodTypeProvider,
      FastifyBaseLogger
   >
>;

export function routes(): { routes: Routes } {
   const { identityService } = dependencies;
   const { routes: localStrategy } = localIdentityRoutes(identityService);
   const { routes: identity } = identityRoutes(identityService);
   const { routes: checkhealth } = checkhealthRoutes();
   const { routes: openapi } = openapiRoutes();
   const { routes: version } = versionRoutes();
   const { routes: jwks } = jwksRoutes();

   return {
      routes: [
         ...openapi,
         ...jwks,
         ...checkhealth,
         ...version,
         ...identity,
         ...localStrategy,
      ],
   };
}
