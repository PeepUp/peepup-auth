import { environmentUtils } from "../../common";
import { config } from "./api.config";

import type { FastifyCorsOptions } from "@fastify/cors";
import { FastifyServerOptions } from "fastify";
import { __metadata } from "tslib";

const cors: FastifyCorsOptions = {
    origin: config.environment.whiteListClient,
    methods: ["POST", "GET", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
        "Content-Type",
        "Authorization",
        "origin",
        "Accept",
        "x-requested-with",
    ],
    exposedHeaders: [
        "Access-Control-Allow-Origin",
        "Access-Control-Allow-Methods",
        "Access-Control-Allow-Headers",
    ],
    credentials: true,
    maxAge: 86400,
    preflight: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
    hideOptionsRoute: true,
};

const fastifyOption: FastifyServerOptions = {
    pluginTimeout: 10000,
    logger: {
        level: "debug",
        enabled: true,
    },
    ignoreTrailingSlash: true,
    jsonShorthand: false,
    ajv: {
        customOptions: {
            allowUnionTypes: true,
            coerceTypes: true,
            allErrors: false,
            useDefaults: true,
            removeAdditional: true,
        },
    },
    disableRequestLogging: true,
};

export const fastifyConfig = {
    cors,
    fastifyOption,
};
