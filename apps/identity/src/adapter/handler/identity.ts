import { z } from "zod";
import IdentityService from "../service/identity";

import type { FastifyReply, FastifyRequest } from "fastify";

export const registerMethodValues = ["password", "oidc"] as const;
export const passwordIdentifier = ["email", "username"] as const;
export const requestRegisterIdentityBody = z.object({
   traits: z.object({
      email: z.string().email().optional(),
      username: z.string().optional(),
   }),
   method: z.enum(registerMethodValues),
   password: z.string(),
});

export const identityPasswordIdentifier = z.object({
   password_identifier: z.enum(passwordIdentifier),
});

export const requestLoginIdentityBody = requestRegisterIdentityBody.merge(
   identityPasswordIdentifier
);

export type RequestLoginIdentityBody = z.infer<typeof requestLoginIdentityBody>;
export type RequestRegisterIdentityBody = z.infer<typeof requestRegisterIdentityBody>;

/**
 * @todo:
 *  ☐ clean up this mess (code smells & clean code)
 *
 *  @figure
 *   🤔
 *
 * */
class IdentityHandler {
   constructor(readonly identitiesService: IdentityService) {}

   async login(
      request: FastifyRequest<{ Body: RequestLoginIdentityBody }>,
      reply: FastifyReply
   ): Promise<unknown> {
      const { traits, password, method, password_identifier } = request.body;

      const result = await this.identitiesService.login({
         password,
         traits,
         method,
         password_identifier,
      });

      if (result === null) {
         setImmediate(() => {
            reply.status(404).send({
               status: "failed",
               code: 401,
               codeStatus: "Unauthorized",
               message:
                  "failed logged in identity, check username, email or password are incorrect",
            });
         });
      }

      setImmediate(() => {
         reply.status(200).send({
            status: "ok",
            code: 200,
            codeStatus: "Ok",
            message: "Logged in successfully",
         });
      });

      return reply;
   }

   async registration(
      request: FastifyRequest<{ Body: RequestRegisterIdentityBody }>,
      reply: FastifyReply
   ): Promise<unknown> {
      const { traits, password, method } = request.body;
      console.dir(request.body, { depth: Infinity });

      await this.identitiesService.registration({
         password,
         traits,
         method,
      });

      setImmediate(() => {
         reply.status(201).send({
            status: "ok",
            code: 201,
            codeStatus: "created",
            message: "successfull creating identity",
         });
      });

      return reply;
   }
}

export default IdentityHandler;
