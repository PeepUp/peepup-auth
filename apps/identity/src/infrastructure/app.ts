import autoload from "@fastify/autoload";
import cors from "@fastify/cors";
import fastify, { errorCodes } from "fastify";

import { accountRoutes } from "../adapter/account/account.routes";
import mainRoutes from "../adapter/home";
import * as config from "../application/config";
import openapi from "../application/config/openapi.json";
import * as plugins from "../application/plugins";

import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import type { IncomingMessage, Server, ServerResponse } from "http";

const server: FastifyInstance<Server, IncomingMessage, ServerResponse> =
   fastify({
      logger: process.env["NODE_ENV"] === "test" ? false : true,
      ignoreTrailingSlash: true,
   });

async function initialize() {
   await server.register(plugins.config);
   await server.register(plugins.resources);
   await server.register(cors, config.fastify.cors);

   /* server.register(import("@fastify/cors"), {
      origin: server.config.WHITE_LISTED_DOMAINS,
      methods: ["POST", "GET", "PUT", "DELETE", "PATCH"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
      maxAge: 86400,
      preflight: true,
      preflightContinue: false,
      optionsSuccessStatus: 204,
      logLevel: "warn",
      hideOptionsRoute: true,
   }); */

   // server.addHook("onRequest", async (request: any, _reply: FastifyReply) => {
   //    request["startTime"] = Date.now();
   // });

   await server.register(mainRoutes, { prefix: "/" });
   server.get(
      "/api-docs",
      async (_request: FastifyRequest, reply: FastifyReply) => {
         return reply.status(200).send(openapi);
      }
   );

   // server.setNotFoundHandler((_request, reply) => {
   //    reply.code(404).send({
   //       ok: false,
   //       message: "Not Found",
   //       docs: "http://localhost:3000",
   //    });
   // });
   await server.register(autoload, config.fastify.routes);


   // server.addHook(
   //    "onSend",
   //    (
   //       _request: FastifyRequest,
   //       reply: FastifyReply,
   //       _payload: unknown,
   //       done
   //    ) => {
   //       reply.headers({
   //          Server: "e6167e18-b68e-4949-9cac-f7bd8e827102",
   //       });

   //       done();
   //    }
   // );

   server.setErrorHandler(function (error, _request, reply) {
      if (error instanceof errorCodes.FST_ERR_BAD_STATUS_CODE) {
         // Log error
         this.log.error(error);
         // Send error response
         reply.status(500).send({ ok: false });
      } else {
         // fastify will use parent error handler to handle this
         reply.send(error);
      }
   });
}

initialize().catch((error) => {
   if (error instanceof Error) {
      console.error(error);
      process.exit(1);
   }
});

export { server };
