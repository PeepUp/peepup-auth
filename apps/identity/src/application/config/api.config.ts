/*
 * API Configuration
 *
 *
 * */

const env = process.env;
export const config: Auth.Config.Api = {
   environment: {
      env: env.NODE_ENV,
      port: parseInt(<Awaited<string>>env.PORT),
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
      prefix: "v1",
   },
};
