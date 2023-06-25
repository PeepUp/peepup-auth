import cors from "@fastify/cors";
import fastify from "fastify";
import type http from "http";
import { fastify as config } from "../application/config/fastify.config";
import { configPlugin } from "../application/plugin";
import {
   serializerCompiler,
   validatorCompiler,
} from "fastify-type-provider-zod";

import type { FastifyInstance } from "fastify";
import { accountSchema } from "../adapter";

const server: FastifyInstance<
   http.Server,
   http.IncomingMessage,
   http.ServerResponse
> = fastify({
   pluginTimeout: 10000,
   logger: {
      enabled: process.env["NODE_ENV"] === "test" ? false : true,
   },
   ignoreTrailingSlash: true,
   ajv: {
      customOptions: {},
   },
});

async function initialize() {
   await server.register(configPlugin);
   await server.register(cors, config.cors);
   server.setValidatorCompiler(validatorCompiler);
   server.setSerializerCompiler(serializerCompiler);

   for (const schema of [...accountSchema]) {
      server.addSchema(schema);
   }

   /* server.setNotFoundHandler((request: FastifyRequest, reply: FastifyReply) => {
      reply.code(404).send({
         ok: false,
         message: "Resource or Service Not Found!",
         path: request.url,
         docs: "http://localhost:3000",
         api_docs: "http://localhost:4334/api-docs",
         response_time: reply.getResponseTime(),
      });
   }); */

   /*    server.addHook(
      "onSend",
      (
         _request: FastifyRequest,
         reply: FastifyReply,
         _payload: unknown,
         done
      ) => {
         reply.headers({
            Server: "e6167e18-b68e-4949-9cac-f7bd8e827102",
         });

         done();
      }
   ); */

   /* server.setErrorHandler(function (error, _request, reply) {
      if (error instanceof errorCodes.FST_ERR_BAD_STATUS_CODE) {
         // Log error
         this.log.error(error);
         // Send error response
         reply.status(500).send({ ok: false });
      } else {
         // fastify will use parent error handler to handle this
         reply.send(error);
      }
   }); */
}

initialize().catch((error) => {
   if (error instanceof Error) {
      process.exit(1);
   }
});

export { server };
