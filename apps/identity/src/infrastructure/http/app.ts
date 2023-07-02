/* eslint-disable */
import http from "http";
import fastify from "fastify";
import cors from "@fastify/cors";
import { routes } from "../../adapter";
import { fileUtils } from "../../common";
import JOSEToken from "../../common/token.util";
import { cryptoUtils } from "../../common/crypto";
import * as fastifyPlugin from "../../application/plugin";
import { schemas } from "../../adapter/schema";
import fastifyConfig from "../../application/config/fastify.config";
import { errorHandler } from "../../adapter/middleware/error.handler";
import { notFoundHandler } from "../../adapter/middleware/not-found.handler";
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";

import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

const server: FastifyInstance<http.Server, http.IncomingMessage, http.ServerResponse> =
    fastify(fastifyConfig.fastifyOption);

async function initRoutes(
    server: FastifyInstance<http.Server, http.IncomingMessage, http.ServerResponse>
) {
    routes(server).routes.forEach((route) => {
        server.withTypeProvider<ZodTypeProvider>().route(route);
    });
}

async function initSchema(
    server: FastifyInstance<http.Server, http.IncomingMessage, http.ServerResponse>
) {
    for (const schema of [...schemas]) {
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

    if (
        keysDir &&
        JOSEToken.rsakeyId === undefined &&
        JOSEToken.ecsdakeyId === undefined
    ) {
        const rsaKeysId = fileUtils.getFolderNames("keys/RSA");
        const ecsdaKeysId = fileUtils.getFolderNames("keys/ECSDA");
        new JOSEToken(rsaKeysId[0], ecsdaKeysId[0]);
    }

    if (!keysDir) {
        const rsa256KeyId = cryptoUtils.generateRandomSHA256(32);
        const escdaKeyId = cryptoUtils.generateRandomSHA256(32);
        console.log("keys directory does not exist");
        const { privateKey, publicKey } = JOSEToken.generateKeyPair(4096, rsa256KeyId);
        const { privateKey: escdaPrivateKey, publicKey: escdaPublicKey } =
            JOSEToken.generateKeyPairECDSA(escdaKeyId);
        console.log(privateKey, publicKey);
        console.log(escdaPrivateKey, escdaPublicKey);
        return;
    }

    if (!wellKnownDir) {
        JOSEToken.buildJWKSPublicKey();
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
