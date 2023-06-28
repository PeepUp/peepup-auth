import cors from "@fastify/cors";
import fastify from "fastify";
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import http from "http";

import { routes, schemas } from "../../adapter";
import { errorHandler } from "../../adapter/middleware/error.handler";
import { notFoundHandler } from "../../adapter/middleware/not-found.handler";
import { fastifyConfig } from "../../application/config/fastify.config";
import * as fastifyPlugin from "../../application/plugin";

import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

const server: FastifyInstance<http.Server, http.IncomingMessage, http.ServerResponse> =
    fastify(fastifyConfig.fastifyOption);

async function initRoutes(
    server: FastifyInstance<http.Server, http.IncomingMessage, http.ServerResponse>
) {
    routes().routes.forEach((route) => {
        server.withTypeProvider<ZodTypeProvider>().route(route);
    });
}

async function initSchema(
    server: FastifyInstance<http.Server, http.IncomingMessage, http.ServerResponse>
) {
    server.addSchema(schemas[0]);
}

async function initSchemaValidatorAndSerializer(
    server: FastifyInstance<http.Server, http.IncomingMessage, http.ServerResponse>
) {
    await server.after();
    server.setValidatorCompiler(validatorCompiler);
    server.setSerializerCompiler(serializerCompiler);
}

async function initErrorHandlers(
    server: FastifyInstance<http.Server, http.IncomingMessage, http.ServerResponse>
) {}

async function setup() {
    await server.register(cors, fastifyConfig.cors);
    await server.register(fastifyPlugin.configPlugin);
    await server.register(fastifyPlugin.signal, { timeout: 10000 });

    await server.after();
    await initRoutes(server);

    await server.after();
    await initSchema(server);
}

void setup().catch((error: unknown) => server.log.error(error));

server.after(() => {
    server.setNotFoundHandler(notFoundHandler);
    server.setErrorHandler(errorHandler);
});

export { server };
