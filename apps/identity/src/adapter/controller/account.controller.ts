import { FastifyReply, FastifyRequest } from "fastify";
import {
   GET_ACCOUNT_PARAMS_EMAIL_SCHEMA_TYPE,
   GET_ACCOUNT_PARAMS_ID_SCHEMA_TYPE,
   GET_ACCOUNT_PARAMS_USERNAME_SCHEMA_TYPE,
} from "../schema/account.schema";
import AccountService from "../service/account";

export async function getUserById(
   request: FastifyRequest<{ Params: GET_ACCOUNT_PARAMS_ID_SCHEMA_TYPE }>,
   reply: FastifyReply,
   accountService: AccountService
) {
   const { profile } = await accountService.getAccountById(
      request.params.accountId
   );

   return reply.code(200).send({
      data: {
         profile,
      },
   });
}

export async function getUserByUserName(
   request: FastifyRequest<{ Params: GET_ACCOUNT_PARAMS_USERNAME_SCHEMA_TYPE }>,
   reply: FastifyReply
) {
   return reply.code(200).send({
      data: {
         profile: {
            username: "test",
            name: "test",
            email: "test",
            password: "test",
            phone: "test",
            emailVerified: new Date(),
            avatar: "test",
         },
      },
   });
}

export async function getUserProfileByUsername(
   request: FastifyRequest<{ Params: GET_ACCOUNT_PARAMS_USERNAME_SCHEMA_TYPE }>,
   reply: FastifyReply,
   accountService: AccountService
) {
   console.log({ params1: request.params.username });
   return reply.code(200).send({
      data: {
         username: "test",
         name: "test",
         email: "test",
         password: "test",
         phone: "test",
         emailVerified: new Date(),
         avatar: "test",
      },
   });
}
