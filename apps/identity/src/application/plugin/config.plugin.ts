import { FastifyInstance, FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import configEnv from "../config/api.config";

import type { Identity } from "@/types/main";

export const configPlugin: FastifyPluginAsync = fp(async (fastify: FastifyInstance) => {
    fastify.decorate<Identity.Config.Api>("config", configEnv);
});
