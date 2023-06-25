import cors from "@fastify/cors";
import fastify from "fastify";
import { fastifyConfig } from "../application/config/fastify.config";
import { configPlugin } from "../application/plugin";
import { routes } from "../adapter";
import { errorHandler } from "../adapter/middleware/error-handler";
import { accountSchema } from "../adapter";
import { environmentUtils } from "../common";
import {
   serializerCompiler,
   validatorCompiler,
   ZodTypeProvider,
} from "fastify-type-provider-zod";

import type http from "http";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { request } from "http";

const server: FastifyInstance<
   http.Server,
   http.IncomingMessage,
   http.ServerResponse
> = fastify({
   pluginTimeout: 10000,
   logger: {
      enabled: environmentUtils.isDevelopment() ? true : false,
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
});

async function initialize() {
   await server.register(configPlugin);
   await server.register(cors, fastifyConfig.cors);

   server.setValidatorCompiler(validatorCompiler);
   server.setSerializerCompiler(serializerCompiler);

   for (const schema of [...accountSchema]) {
      server.addSchema(schema);
   }
}

initialize().catch((error) => {
   if (error instanceof Error) {
      process.exit(1);
   }
});

server.after(() => {
   const { routes: router } = routes();

   router.forEach((route) => {
      server.withTypeProvider<ZodTypeProvider>().route(route);
   });

   server.setErrorHandler(errorHandler);

   server.setNotFoundHandler((request: FastifyRequest, reply: FastifyReply) => {
      reply.code(404).send({
         ok: false,
         message: "Resource or Service Not Found!",
         path: request.url,
         docs: "http://localhost:3000",
         api_docs: "http://localhost:4334/api-docs",
         response_time: reply.getResponseTime(),
      });
   });
});

server.ready((err) => {
   if (err) {
      throw err;
   }

   console.log("successfully booted!");
});

export { server };
