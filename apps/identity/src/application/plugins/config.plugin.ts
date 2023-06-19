import { FastifyInstance, FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";

import { config as _config } from "../../application/config";

/**
 * Instruct TypeScript that this value exists on the Fastify instance.
 */
declare module "fastify" {
   interface FastifyInstance {
      config: Auth.Config.Api;
   }
}

/**
 * Decorate Fastify with the plugin.
 */
export const config: FastifyPluginAsync = fp(
   async (fastify: FastifyInstance) => {
      fastify.decorate<Auth.Config.Api>("config", _config);
   }
);
