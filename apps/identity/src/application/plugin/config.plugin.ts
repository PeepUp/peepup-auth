import fp from "fastify-plugin";
import configEnv from "@/application/config/api.config";

import type { Identity } from "@/types/main";
import type { FastifyInstance, FastifyPluginAsync } from "fastify";

export const configPlugin: FastifyPluginAsync = fp(async (fastify: FastifyInstance) => {
    fastify.decorate<Identity.Config.Api>("config", configEnv);
});
