import dotenv from "dotenv";

import type { Identity } from "@/types/main";

dotenv.config({
    path: process.env.NODE_ENV === "test" ? ".env.test" : ".env",
});

const config: Identity.Config.Api = {
    environment: {
        env: process.env.NODE_ENV,
        port: parseInt(<string>process.env.PORT, 10),
        host: process.env.HOST,
        whiteListClient: process.env.WHITE_LISTED_DOMAINS?.split(","),
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
    },
};

export default config;
