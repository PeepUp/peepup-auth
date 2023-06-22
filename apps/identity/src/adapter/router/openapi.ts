import openapi from "../../application/config/openapi.json";
import { Routes } from "./root";

import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export default (): { routes: Routes } => {
   return {
      routes: [
         {
            method: "GET",
            url: "/openapi",
            handler: async (
               _request: FastifyRequest,
               reply: FastifyReply
            ): Promise<unknown> => {
               return reply.code(200).send(openapi);
            },
         },
      ],
   };
};
