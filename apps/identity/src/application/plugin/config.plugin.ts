import { FastifyInstance, FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";

import { Identity } from "@/types/main";
import { config as _config } from "../../application/config";

export const configPlugin: FastifyPluginAsync = fp(async (fastify: FastifyInstance) => {
    fastify.decorate<Identity.Config.Api>("config", _config);
});
