import { FastifyGracefulExitOptions } from "@/types/types";
import { FastifyCookieOptions } from "@fastify/cookie";
import type { FastifyCorsOptions } from "@fastify/cors";

import { FastifyServerOptions } from "fastify";

const cors: FastifyCorsOptions = {
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
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
        "Access-Control-Allow-Credentials",
    ],
    exposedHeaders: [
        "Access-Control-Allow-Methods",
        "Access-Control-Allow-Headers",
        "Access-Control-Allow-Credentials",
    ],
    credentials: true,
    maxAge: 86400,
    preflight: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
    hideOptionsRoute: true,
};

const option: FastifyServerOptions = {
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

const gracefullShutdown: FastifyGracefulExitOptions = {
    timeout: 10000,
    message: "🌿 Server is shutting down",
};

const cookies: FastifyCookieOptions = {
    hook: "onRequest",
    secret: (process.env.COOKIE_SECRET_KEY as string) || "secret",
};

const fastifyConfig = {
    cors,
    option,
    cookies,
    gracefullShutdown,
};

export default fastifyConfig;
