import fastify from "fastify";
import fastifyEnv from "@fastify/env";
import { errorCodes } from "fastify";
import crypto from "crypto";

import environment from "../config";
import accountRoutes from "../adapter/account/account.routes";
import mainRoutes from "../adapter/home";

import type { IncomingMessage, ServerResponse, Server } from "http";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

const server: FastifyInstance<Server, IncomingMessage, ServerResponse> =
   fastify({ logger: process.env.NODE_ENV === "test" ? false : true });

async function initialize() {
   server.register(fastifyEnv, environment);
   await server.after();

   server.addHook(
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
   );

   server.register(import("@fastify/cors"), {
      // @ts-ignore
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
   });

   server.register(accountRoutes, { prefix: "/api/v1" });
   server.register(mainRoutes, { prefix: "/" });

   server.setNotFoundHandler((_request, reply) => {
      reply.code(404).send({
         ok: false,
         message: "Not Found",
         docs: "http://localhost:3000",
      });
   });

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
