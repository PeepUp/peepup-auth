/* eslint-disable */
import http from "http";
import fastify from "fastify";
import cors from "@fastify/cors";
import { routes } from "../../adapter";
import { schemas } from "../../adapter/schema";

import * as fastifyPlugin from "../../application/plugin";
import fastifyConfig from "../../application/config/fastify.config";
import { errorHandler } from "../../adapter/middleware/error.handler";
import { notFoundHandler } from "../../adapter/middleware/not-found.handler";
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";

import type { FastifyInstance } from "fastify";
import type { JWTHeaderParameters } from "jose";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import { mkdirSync } from "fs";
import JwtToken from "../../common/utils/token";
import { keysPath } from "../../common/constant";
import Certificate from "../../common/utils/certs";
import { fileUtils } from "../../common/utils/utils";
import { cryptoUtils } from "../../common/utils/crypto";

const server: FastifyInstance<http.Server, http.IncomingMessage, http.ServerResponse> =
    fastify(fastifyConfig.fastifyOption);

async function initRoutes(
    server: FastifyInstance<http.Server, http.IncomingMessage, http.ServerResponse>
) {
    server.after(() => {
        routes(server).routes.forEach((route) => {
            server.withTypeProvider<ZodTypeProvider>().route(route);
        });
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
    const checkKeysDirectory = fileUtils.checkDirectory("keys");
    const checkWellKnownDirectory = fileUtils.checkDirectory("public/.well-known");

    console.log({
        checkKeysDirectory,
        checkWellKnownDirectory,
    });

    let rsa256KeyId: string | string[] = "";
    let ecsdaKeyId: string | string[] = "";

    if (!checkKeysDirectory) {
        const ecsda: Certificate = new Certificate(keysPath);
        const rsa256: Certificate = new Certificate(keysPath);
        console.log("Generating RSA256 and ECSDA keys...");
        console.log({
            rsa256,
            ecsda,
        });

        rsa256KeyId = cryptoUtils.generateRandomSHA256(32);
        ecsdaKeyId = cryptoUtils.generateRandomSHA256(32);

        mkdirSync(keysPath + "/RSA/" + rsa256KeyId, { recursive: true });
        mkdirSync(keysPath + "/ECSDA/" + ecsdaKeyId, { recursive: true });
        const rsa256Certs = rsa256.generateKeyPairRSA(4096);
        rsa256.saveKeyPair(rsa256Certs, keysPath + "/RSA/" + rsa256KeyId);

        const ecsdaCerts = ecsda.generateKeyPairECDSA("prime256v1");
        ecsda.saveKeyPair(ecsdaCerts, keysPath + "/ECSDA/" + ecsdaKeyId);
    }

    if (checkKeysDirectory) {
        rsa256KeyId = fileUtils.getFolderNames("keys/RSA");
        ecsdaKeyId = fileUtils.getFolderNames("keys/ECSDA");
        console.log({ message: "jwt setup OK!" });
    }

    if (!checkWellKnownDirectory) {
        if (rsa256KeyId[0] && ecsdaKeyId[0]) {
            console.log("Generating JWKS...");

            console.log({
                rsa256KeyId,
                ecsdaKeyId,
            });

            new JwtToken(rsa256KeyId[0], {}, <JWTHeaderParameters>{}).buildJWKSPublicKey(
                rsa256KeyId[0],
                ecsdaKeyId[0]
            );

            console.log("JWKS successfully generated");
        }
    }
}

async function setup() {
    await server.register(cors, fastifyConfig.cors);
    await server.register(fastifyPlugin.configPlugin);
    await server.register(fastifyPlugin.signal, { timeout: 10000 });

    await initSchemaValidatorAndSerializer(server);

    await initRoutes(server);
    await server.after();

    await initSchema(server);
    await initJWKS();
}

void setup().catch((error: unknown) => console.log(error));

server.after(() => {
    server.setNotFoundHandler(notFoundHandler);
    server.setErrorHandler(errorHandler);
});

server.ready(() => {
    console.log({
        listPlugin: {
            cors: server.hasPlugin("@fastify/cors"),
        },
    });
});

export default server;
