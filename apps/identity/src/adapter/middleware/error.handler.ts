import type {
   FastifyError,
   FastifyInstance,
   FastifyReply,
   FastifyRequest,
} from "fastify";

export async function errorHandler(
   this: FastifyInstance,
   error: FastifyError,
   _request: FastifyRequest,
   reply: FastifyReply
) {
   if (error.validation) {
      return reply.code(400).send({
         ok: false,
         code: error.statusCode,
         codeStatus: "Bad Request",
         errors: {
            context: error.validationContext,
            message: error.message,
         },
      });
   }

   if (error instanceof Error) {
      console.dir(error, { depth: 10 });
      console.log(error.stack);

      return reply.code(500).send({
         code: 500,
         message: "Internal Server Error",
      });
   }

   return reply.code(500).send({ ok: false });
}
