import dotenv from "dotenv";
import path from "path";
import { z } from "zod";

const env = process.env;
const node_env = env.NODE_ENV ?? "development";

dotenv.config({
   path:
      env.NODE_ENV == "production"
         ? path.join(__dirname, "..", "..", ".env")
         : path.join(__dirname, "..", "..", ".env.local"),
});

const environmentSchema = z.object({
   api: z.object({
      metadata: z.object({
         image: z.string(),
      }),
   }),
   app: z.object({
      port: z.number().positive().finite(),
      host: z.string().url(),
      origin: z.string().array(),
      isProduction: z.boolean(),
   }),
   secret: z.object({}),
   db: z.object({}),
});

const environment = environmentSchema.parse({
   api: {
      metadata: {
         image: "/image",
      },
   },
   app: {
      port: parseInt(env.PORT ?? "8888"),
      host: `http://localhost:${env.PORT}`,
      origin: [
         `http://localhost:${env.PORT}`,
         `http://localhost:${env.CLIENT_PORT}`,
      ],
      isProduction: node_env === "production",
   },
   secret: {},
   db: {},
});

const config = {
   credentials: process.env.CREDENTIALS === "true",
   origin: [
      `http://localhost:${env.PORT}`,
      `http://localhost:${env.CLIENT_PORT}`,
   ],
};

export { environment, node_env, config };
