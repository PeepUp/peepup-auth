import IdentityService from "../service/identity";

import { Identity } from "@prisma/client";
import type { FastifyReply, FastifyRequest } from "fastify";
import { set, z } from "zod";
import type { Routes } from "..";

export const requestIdentityParams = z.object({
   email: z.string().email().optional(),
   username: z.string().optional(),
});

export type RequestIdentityParams = z.infer<typeof requestIdentityParams>;

export default (identitiesService: IdentityService): { routes: Routes } => {
   return {
      routes: [
         {
            method: "GET",
            url: "/identities",
            handler: async (
               request: FastifyRequest<{
                  Querystring: RequestIdentityParams;
               }>,
               reply: FastifyReply
            ): Promise<unknown> => {
               const { email, username } = request.query;
               console.dir(request.query, { depth: Infinity });

               if (Object.keys(request.query).length > 0) {
                  const data = await identitiesService.getIdentityByQuery({
                     email,
                     username,
                  });

                  if (data === null) {
                     reply.code(200).send({
                        code: 404,
                        message: "data identity record not found",
                        data: [],
                     });
                  }

                  reply.code(200).send({
                     data,
                  });
               }

               if (Object.keys(request.query).length === 0) {
                  const data = await identitiesService.getIdentities();
                  console.log(data);
                  if (data === null) {
                     reply.code(200).send({
                        code: 404,
                        message: "data identity record not found",
                        data: [],
                     });
                  }

                  setImmediate(() => {
                     reply.code(200).send({
                        data,
                     });
                  });
               }

               return reply;
            },
            schema: {
               describe: "[ GET /identities ] get all identities [ ROLE: ADMIN ONLY]",
            },
         },
         {
            method: "GET",
            url: "/identities/:id",
            handler: async (
               request: FastifyRequest<{ Params: { id: string } }>,
               reply: FastifyReply
            ): Promise<unknown> => {
               const { id } = request.params;
               const data = await identitiesService.getIdentityById(id);

               if (data === null) {
                  setImmediate(() => {
                     reply.code(200).send({
                        code: 404,
                        message: "data identity record not found",
                        data: [],
                     });
                  });

                  return reply;
               }

               setImmediate(() => {
                  reply.code(200).send({
                     data,
                  });
               });

               return reply;
            },
            schema: {
               describe: "[ GET /identities ] get all identities [ ROLE: ADMIN ONLY]",
            },
         },
      ],
   };
};
