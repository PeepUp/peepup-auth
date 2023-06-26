import { FastifyInstance, FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";

import { config as _config } from "../../application/config";
import type { Identity } from "@/types/identity";

export const configPlugin: FastifyPluginAsync = fp(async (fastify: FastifyInstance) => {
   fastify.decorate<Identity.Config.Api>("config", _config);
});
