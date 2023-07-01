import { FastifyInstance, FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";

import type { Identity } from "@/types/main";
import configEnv from "../config/api.config";

// eslint-disable-next-line import/prefer-default-export
export const configPlugin: FastifyPluginAsync = fp(async (fastify: FastifyInstance) => {
    fastify.decorate<Identity.Config.Api>("config", configEnv);
});
