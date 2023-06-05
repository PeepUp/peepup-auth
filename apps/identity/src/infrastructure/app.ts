import fastify from "fastify";
import fastifyEnv from "@fastify/env";

import environment, { node_env } from "../config";
import accountRoutes from "../adapter/account/account.routes";

import type { IncomingMessage, ServerResponse, Server } from "http";
import type { FastifyInstance } from "fastify";

const server: FastifyInstance<Server, IncomingMessage, ServerResponse> =
   fastify({ logger: node_env === "test" ? false : true });

async () => await server.register(fastifyEnv, environment);

export { server };
