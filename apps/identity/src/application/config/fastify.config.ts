import type { FastifyCorsOptions } from "@fastify/cors";

import { FastifyServerOptions } from "fastify";

const cors: FastifyCorsOptions = {
    origin: ["http://localhost:3000"],
    methods: ["POST", "GET", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
        "Content-Type",
        "Authorization",
        "origin",
        "Accept",
        "x-requested-with",
        "_device_id",
        "user_session",
        "Access-Control-Allow-Origin",
        "Access-Control-Allow-Methods",
        "Access-Control-Allow-Headers",
    ],
    exposedHeaders: ["Access-Control-Allow-Methods", "Access-Control-Allow-Headers"],
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

const fastifyConfig = {
    cors,
    fastifyOption,
};

export default fastifyConfig;
