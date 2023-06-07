import type {
   FastifyInstance,
   FastifyPluginAsync,
   FastifyReply,
   FastifyRequest,
} from "fastify";

const accountRoutes: FastifyPluginAsync = async (
   server: FastifyInstance
): Promise<void> => {
   const path = "/account";

   server.route({
      method: "GET",
      url: `${path}`,
      handler: async (
         _request: FastifyRequest,
         reply: FastifyReply
      ): Promise<void> => {
         return reply.send({
            code: 200,
            result: "ok",
            type: "application/json",
         });
      },
   });
};

export { accountRoutes };
