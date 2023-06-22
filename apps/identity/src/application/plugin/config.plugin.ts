import { FastifyInstance, FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";

import { config as _config } from "../../application/config";

declare module "fastify" {
   interface FastifyInstance {
      config: Auth.Config.Api;
   }
}

export const configPlugin: FastifyPluginAsync = fp(
   async (fastify: FastifyInstance) => {
      fastify.decorate<Auth.Config.Api>("config", _config);
   }
);
