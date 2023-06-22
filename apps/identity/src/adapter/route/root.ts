import { ZodTypeProvider } from "fastify-type-provider-zod";
import accountRouter from "./account";
import checkhealthRouter from "./checkhealth";

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
   const { routes: accountRoutes } = accountRouter();
   const { routes: checkhealthRoutes } = checkhealthRouter();

   return {
      routes: [...accountRoutes, ...checkhealthRoutes],
   };
}
