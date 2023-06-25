import { FastifyInstance, FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";

import * as _adapter from "../../adapter";

type Adapter = typeof _adapter;

export const resources: FastifyPluginAsync = fp(
   async (fastify: FastifyInstance) => {
      fastify.decorate<Adapter>("adapter", _adapter);
   }
);
