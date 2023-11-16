import { join } from "path";
import dotenv from "dotenv";

import type { Identity } from "@/types/main";

const envPath = (nodeEnv: string): string => {
    if (nodeEnv === "test") return ".env.test";
    if (nodeEnv === "development") return ".env.local";
    return ".env";
};

dotenv.config({
    path: envPath(process.env.NODE_ENV as string),
});

const TOKEN_PATH = "/tokens";
const config: Identity.Config.Api = {
    environment: {
        env: process.env.NODE_ENV,
        port: parseInt(process.env.PORT as string, 10),
        host: process.env.HOST,
        whiteListClient: process.env.WHITE_LISTED_DOMAINS?.split(","),
        encryption: {
            algorithm: process.env.ENCRYPTION_ALGORITHM as string,
            secret_key: process.env.ENCRYPTION_SECRET_KEY as string,
            secret_iv: process.env.ENCRYPTION_SECRET_IV as string,
        },
    },
    logging: {
        level: process.env.LOG_LEVEL,
    },
    swagger: {
        title: "DoFavour Auth API",
        description: "DoFavour Auth API Documentation: [nextra](http://localhost:3000)",
        url: <Awaited<string>>process.env.SWAGGER_URL,
    },
    api: {
        prefix: "/v1",
        root: "/",
        paths: {
            tokens: {
                root: TOKEN_PATH,
                paths: {
                    rotate: {
                        path: join(TOKEN_PATH, "rotate"),
                        method: "POST",
                    },
                    decode: {
                        path: join(TOKEN_PATH, "decode"),
                        method: "POST",
                    },
                    sessions: {
                        root: join(TOKEN_PATH, "sessions"),
                        method: "GET",
                        paths: {
                            active: {
                                path: join(TOKEN_PATH, "sessions", "active"),
                                method: "GET",
                            },
                            whoami: {
                                path: join(TOKEN_PATH, "sessions", "whoami"),
                                method: "GET",
                            },
                            histories: {
                                path: join(TOKEN_PATH, "sessions", "histories"),
                                method: "GET",
                            },
                        },
                    },
                },
            },
        },
    },
};

export default config;
