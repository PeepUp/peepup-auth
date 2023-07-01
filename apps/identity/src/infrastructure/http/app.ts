/* eslint-disable */

import cors from "@fastify/cors";
import fastify from "fastify";
import http from "http";
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { authSchema } from "../../adapter/schema/auth.schema";
import { routes } from "../../adapter";
import { errorHandler } from "../../adapter/middleware/error.handler";
import { notFoundHandler } from "../../adapter/middleware/not-found.handler";
import fastifyConfig from "../../application/config/fastify.config";
import * as fastifyPlugin from "../../application/plugin";
import { fileUtils } from "../../common";
import JOSEToken from "../../common/token.util";

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
    for (const schema of [...authSchema]) {
        server.addSchema(schema);
    }
}

async function initSchemaValidatorAndSerializer(
    server: FastifyInstance<http.Server, http.IncomingMessage, http.ServerResponse>
) {
    await server.after();
    server.setValidatorCompiler(validatorCompiler);
    server.setSerializerCompiler(serializerCompiler);
}

async function initJWKS() {
    const keysDir = fileUtils.checkDirectory("keys");
    const wellKnownDir = fileUtils.checkDirectory("public/.well-known");

    if (keysDir && JOSEToken.keyId === undefined) {
        const kid = fileUtils.getFolderNames("keys");
        new JOSEToken("", kid[0]);
    }

    if (!wellKnownDir) {
        JOSEToken.buildJWKSPublicKey();
    }

    if (!keysDir) {
        console.log("keys directory does not exist");
        const { privateKey, publicKey } = JOSEToken.generateKeyPair();
        console.log(privateKey, publicKey);
        return;
    }
}

async function setup() {
    await server.register(cors, fastifyConfig.cors);
    await server.register(fastifyPlugin.configPlugin);
    await server.register(fastifyPlugin.signal, { timeout: 10000 });

    await initRoutes(server);
    await server.after();
    await initSchema(server);
    await initSchemaValidatorAndSerializer(server);
    await initJWKS();
}

void setup().catch((error: unknown) => console.log(error));

server.after(() => {
    server.setNotFoundHandler(notFoundHandler);
    server.setErrorHandler(errorHandler);
});

export default server;
