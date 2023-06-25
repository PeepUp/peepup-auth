import { dependencies } from "../../infrastructure/diConfig";
import accountRouter from "./account";
import checkhealthRouter from "./metadata/checkhealth";
import versionRouter from "./metadata/version";
import openapiRouter from "./openapi";

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
      any,
      FastifyBaseLogger
   >
>;

export function routes(): { routes: Routes } {
   const { accountService } = dependencies;
   const { routes: accountRoutes } = accountRouter(accountService);
   const { routes: checkhealthRoutes } = checkhealthRouter();
   const { routes: openapiRoutes } = openapiRouter();
   const { routes: versionRoutes } = versionRouter();

   return {
      routes: [
         ...openapiRoutes,
         ...accountRoutes,
         ...checkhealthRoutes,
         ...versionRoutes,
      ],
   };
}
