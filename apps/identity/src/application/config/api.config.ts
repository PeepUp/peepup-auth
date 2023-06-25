import dotenv from "dotenv";

dotenv.config({
   path: process.env.NODE_ENV === "test" ? ".env.test" : ".env",
});

const env = process.env;

export const config: Auth.Config.Api = {
   environment: {
      env: env.NODE_ENV,
      port: parseInt(<string>env.PORT, 10),
      host: env.HOST,
      whiteListClient: env.WHITE_LISTED_DOMAINS?.split(","),
   },
   logging: {
      level: env.LOG_LEVEL,
   },
   swagger: {
      title: "DoFavour Auth API",
      description:
         "DoFavour Auth API Documentation: [nextra](http://localhost:3000)",
      url: <Awaited<string>>env.SWAGGER_URL,
   },
   api: {
      prefix: "/v1",
   },
};
