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

import { join } from "path";
import { createWriteStream, mkdirSync } from "fs";
import { constant } from "@/common";
import { routes } from "@/adapter/routes";
import { schemas } from "@/adapter/schema";

import { errorHandler } from "@/adapter/middleware/error.handler";
import { notFoundHandler } from "@/adapter/middleware/not-found.handler";
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";

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

function setupDirectoryStructure() {
    const { keysPath, jwksPath } = constant;

    const isKeysDirExist = FileUtil.isCheckDirectoryExist(keysPath);
    const isWellKnownDirExist = FileUtil.isCheckDirectoryExist(jwksPath);
    const isFileJwksExist = FileUtil.isCheckDirectoryExist(join(jwksPath, "jwks.json"));

    if (isWellKnownDirExist && isFileJwksExist && isKeysDirExist) return;

    if (!isKeysDirExist) mkdirSync(keysPath, { recursive: true });

    if (!isWellKnownDirExist && !isFileJwksExist) {
        mkdirSync(jwksPath, { recursive: true });
        createWriteStream(join(jwksPath, "jwks.json"));
    }

    if (isWellKnownDirExist && isFileJwksExist === false) {
        createWriteStream(join(jwksPath, "jwks.json"));
    }
}

function isDirectoryReady() {
    const { keysPath, jwksPath } = constant;

    const isKeysDirExist = FileUtil.isCheckDirectoryExist(keysPath);
    const isWellKnownDirExist = FileUtil.isCheckDirectoryExist(jwksPath);
    const isFileJwksExist = FileUtil.isCheckDirectoryExist(join(jwksPath, "jwks.json"));

    if (isKeysDirExist && isWellKnownDirExist && isFileJwksExist) return true;
    return false;
}

async function initJWKS() {
    let rsa256KeyId: Array<string> = [];
    let ecsdaKeyId: Array<string> = [];
    const isInitialized = isDirectoryReady();
    const { keysPath, rsaKeysDirPath, ecsdaKeysDirPath, jwksPath } = constant;

    if (!isInitialized) {
        // need to recreate all directory structure
        setupDirectoryStructure();
        // new instance of certificate
        const ecsdaCert: Certificate = new Certificate(keysPath);
        const rsa256Cert: Certificate = new Certificate(keysPath);

        console.log("--- Generating JWKS KEY Certificates ---");

        rsa256KeyId.push(CryptoUtil.generateRandomSHA256(32));
        ecsdaKeyId.push(CryptoUtil.generateRandomSHA256(32));

        FileUtil.makeDir(join(rsaKeysDirPath, rsa256KeyId[0] as string));
        FileUtil.makeDir(join(ecsdaKeysDirPath, ecsdaKeyId[0] as string));

        const rsa256Certs = rsa256Cert.generateKeyPairRSA(4096);
        rsa256Cert.saveKeyPair(rsa256Certs, keysPath + "/RSA/" + rsa256KeyId);

        const ecsdaCerts = ecsdaCert.generateKeyPairECDSA("prime256v1");
        ecsdaCert.saveKeyPair(ecsdaCerts, keysPath + "/ECSDA/" + ecsdaKeyId);

        console.log("----- Generating JWKS KEY Certificates Successfully -----");

        // generate jwks.json file
        const jwtTokenLib = new JwtToken(rsa256KeyId[0] as string, {}, <JWTHeaderParameters>{});
        await jwtTokenLib.buildJWKSPublicKey(rsa256KeyId[0] as string, ecsdaKeyId[0] as string);

        console.log("----- Generating JWKS JSON File Successfully -----");
        console.log('----- JWKS JSON File Path: "' + jwksPath + "/jwks.json" + '" -----');
        return;
    }

    console.log("--- JWKS KEY Certificates Already Exist & ready to Run ---");
}

async function setup() {
    // internal plugin
    await server.register(fastifyPlugin.configPlugin);
    await server.register(fastifyPlugin.signal, fastifyConfig.gracefullShutdown);
    // external plugin
    await server.register(cors, fastifyConfig.cors);
    await server.register(cookie, fastifyConfig.cookies);

    await initSchemaValidatorAndSerializer(server);
    await server.after();
    await initRoutes(server);
    await server.after();

    await initSchema(server);
    await server.after();
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
            config_environmnet: server.hasDecorator("config"),
        },
    });
});

export default server;
