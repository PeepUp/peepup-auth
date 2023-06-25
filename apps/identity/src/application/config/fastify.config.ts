import { join } from "path";
import { config } from "./api.config";

import type { AutoloadPluginOptions } from "@fastify/autoload";
import type { FastifyCorsOptions } from "@fastify/cors";
import { __metadata } from "tslib";

const cors: FastifyCorsOptions = {
   origin: config.environment.whiteListClient,
   methods: ["POST", "GET", "PUT", "DELETE", "OPTIONS"],
   allowedHeaders: [
      "Content-Type",
      "Authorization",
      "origin",
      "Accept",
      "x-requested-with",
   ],
   exposedHeaders: [
      "Access-Control-Allow-Origin",
      "Access-Control-Allow-Methods",
      "Access-Control-Allow-Headers",
   ],
   credentials: true,
   maxAge: 86400,
   preflight: true,
   preflightContinue: false,
   optionsSuccessStatus: 204,
   hideOptionsRoute: true,
};

const routes: AutoloadPluginOptions = {
   dir: join(__dirname, "../../"),
   dirNameRoutePrefix: false,
   matchFilter: (path) => path.includes(".adapter."),
   indexPattern: /.*adapter(\.ts|\.js|\.cjs|\.mjs)$/,
   routeParams: false,
   forceESM: true,
   maxDepth: 3,
   options: { prefix: config.api.prefix },
};

export const fastifyConfig = {
   cors,
   routes,
};
