import fp from "fastify-plugin";
import configEnv from "@/application/config/api.config";
import { FastifyInstance, FastifyPluginAsync } from "fastify";

import type { Identity } from "@/types/main";

export const configPlugin: FastifyPluginAsync = fp(async (fastify: FastifyInstance) => {
    fastify.decorate<Identity.Config.Api>("config", configEnv);
});
