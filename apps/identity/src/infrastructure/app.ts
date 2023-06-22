import cors from "@fastify/cors";
import fastify, { errorCodes } from "fastify";
import {
   serializerCompiler,
   validatorCompiler,
} from "fastify-type-provider-zod";
import type http from "http";
import openapi from "../application/config/openapi.json";

import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import { routes } from "@/adapter";
import { fastify as config } from "../application/config/fastify.config";
import { configPlugin } from "../application/plugin";

const server: FastifyInstance<
   http.Server,
   http.IncomingMessage,
   http.ServerResponse
> = fastify({
   logger: process.env["NODE_ENV"] === "test" ? false : true,
   ignoreTrailingSlash: true,
});

async function initialize() {
   await server.register(configPlugin);
   await server.register(cors, config.cors);
   server.setValidatorCompiler(validatorCompiler);
   server.setSerializerCompiler(serializerCompiler);

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
      console.error(error);
      process.exit(1);
   }
});

export { server };