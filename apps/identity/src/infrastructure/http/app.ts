/* eslint-disable */
import * as fastifyPlugin from "@/application/plugin";

import http from "http";
import fastify from "fastify";
import cors from "@fastify/cors";
import cookie from "@fastify/cookie";
import fastifyConfig from "@/application/config/fastify.config";

import JwtToken from "@/common/libs/token";
import CryptoUtil from "@/common/libs/crypto";
import Certificate from "@/common/libs/certs";
import FileUtil from "@/common/utils/file.util";

import { mkdirSync } from "fs";
import { constant } from "@/common";
import { routes } from "@/adapter/routes";
import { schemas } from "@/adapter/schema";

import { errorHandler } from "@/adapter/middleware/error.handler";
import { notFoundHandler } from "@/adapter/middleware/not-found.handler";
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";

import { join } from "path";

import type { FastifyInstance } from "fastify";
import type { JWTHeaderParameters } from "jose";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

const server: FastifyInstance<http.Server, http.IncomingMessage, http.ServerResponse> = fastify(
    fastifyConfig.option
);

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
    for (const schema of [...schemas]) server.addSchema(schema);
}

async function initSchemaValidatorAndSerializer(
    server: FastifyInstance<http.Server, http.IncomingMessage, http.ServerResponse>
) {
    await server.after();
    server.setValidatorCompiler(validatorCompiler);
    server.setSerializerCompiler(serializerCompiler);
}

async function initJWKS() {
    const checkKeysDirectory = FileUtil.checkDir("keys");
    const checkWellKnownDirectory = FileUtil.checkDir("public/.well-known");

    const { keysPath, rsaKeysDirPath, ecsdaKeysDirPath } = constant;

    console.log({
        checkKeysDirectory,
        checkWellKnownDirectory,
    });

    let rsa256KeyId: string | string[] = "";
    let ecsdaKeyId: string | string[] = "";

    if (!checkKeysDirectory) {
        const ecsda: Certificate = new Certificate(keysPath);
        const rsa256: Certificate = new Certificate(keysPath);

        console.log({
            message: "Generating RSA256 and ECSDA keys...",
        });

        rsa256KeyId = CryptoUtil.generateRandomSHA256(32);
        ecsdaKeyId = CryptoUtil.generateRandomSHA256(32);

        mkdirSync(join(rsaKeysDirPath, rsa256KeyId), { recursive: true });
        mkdirSync(join(ecsdaKeysDirPath, ecsdaKeyId), { recursive: true });

        const rsa256Certs = rsa256.generateKeyPairRSA(4096);
        rsa256.saveKeyPair(rsa256Certs, keysPath + "/RSA/" + rsa256KeyId);

        const ecsdaCerts = ecsda.generateKeyPairECDSA("prime256v1");
        ecsda.saveKeyPair(ecsdaCerts, keysPath + "/ECSDA/" + ecsdaKeyId);
    }

    if (checkKeysDirectory) {
        rsa256KeyId = FileUtil.getDir("keys/RSA");
        ecsdaKeyId = FileUtil.getDir("keys/ECSDA");
        console.log({ message: "JWKS ready & ok!" });
    }

    if (!checkWellKnownDirectory) {
        if (rsa256KeyId[0] && ecsdaKeyId[0]) {
            console.log({ message: "Generating JWKS KEY..." });
            console.log({ rsa256KeyId, ecsdaKeyId });

            new JwtToken(rsa256KeyId[0], {}, <JWTHeaderParameters>{}).buildJWKSPublicKey(
                rsa256KeyId[0],
                ecsdaKeyId[0]
            );

            console.log({ message: "JWKS successfully generated" });
        }
    }
}

async function setup() {
    // internal plugin
    await server.register(fastifyPlugin.configPlugin);
    await server.register(fastifyPlugin.signal, fastifyConfig.gracefullShutdown);

    // external plugin
    await server.register(cors, fastifyConfig.cors);
    await server.register(cookie, fastifyConfig.cookies);

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
            cookie: server.hasPlugin("@fastify/cookie"),
            csrfProtection: server.hasPlugin("@fastify/csrf-protection"),
            config_environmnet: server.hasDecorator("config"),
        },
    });
});

export default server;
