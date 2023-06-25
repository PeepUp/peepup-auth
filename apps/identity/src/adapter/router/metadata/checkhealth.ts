import { Routes } from "../root";

import type { FastifyReply, FastifyRequest } from "fastify";

export default (): { routes: Routes } => {
   return {
      routes: [
         {
            method: "GET",
            url: "/health/alive",
            handler: async (
               _request: FastifyRequest,
               reply: FastifyReply
            ): Promise<unknown> => {
               return reply.send({
                  status: "ok",
               });
            },
         },
         {
            method: "GET",
            url: "/health/ready",
            handler: async (
               _request: FastifyRequest,
               reply: FastifyReply
            ): Promise<void> => {
               return reply.code(200).send({
                  status: "ok",
               });
            },
         },
      ],
   };
};
