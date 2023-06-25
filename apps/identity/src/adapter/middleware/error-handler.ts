import type { ZodError } from "zod";
import type {
   FastifyReply,
   FastifyRequest,
   FastifyInstance,
   FastifyError,
} from "fastify";
import { UserExistsException } from "../../common/exception";

interface ErrorResponse {
   code: number | string;
   status: string;
   payload: {
      message: string;
      details: ZodError;
   };
}

export function errorHandler(
   this: FastifyInstance,
   error: FastifyError,
   request: FastifyRequest,
   reply: FastifyReply
) {
   if (error.validation) {
      return reply.code(400).send({
         ok: false,
         code: error.statusCode,
         validation: true,
         codeStatus: "Bad Request",
         error: {
            message: error.message,
            details: error.validationContext,
            validation: error.validation,
         },
      });
   }

   if (error instanceof Error) {
      console.log(error);
      return reply.code(500).send({
         ok: false,
         message: "Internal Server Error",
      });
   }

   return reply.code(500).send({ ok: false });
}
