import { Routes } from "../root";

import type { FastifyReply, FastifyRequest } from "fastify";

export default (): { routes: Routes } => {
   return {
      routes: [
         {
            method: "GET",
            url: "/version",
            handler: async (
               _request: FastifyRequest,
               reply: FastifyReply
            ): Promise<void> => {
               return reply.code(200).send({
                  version: "1.0.0",
               });
            },
         },
      ],
   };
};
