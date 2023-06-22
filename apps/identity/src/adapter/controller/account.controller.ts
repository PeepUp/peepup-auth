import { FastifyReply, FastifyRequest } from "fastify";
import {
   CREATE_ACCOUNT_REQUEST_BODY_SCHEMA_TYPE,
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
   const { profile } = await accountService.getProfileByUsername(
      request.params.username
   );

   return reply.code(200).send({
      data: {
         ...profile,
      },
   });
}

export async function registerAccount(
   request: FastifyRequest<{ Body: CREATE_ACCOUNT_REQUEST_BODY_SCHEMA_TYPE }>,
   reply: FastifyReply,
   accountService: AccountService
) {
   const { email, password, name } = request.body;

   console.log({
      request: request.body,
   });
   await accountService.registerAccount({
      name,
      email,
      password,
   });

   return reply.code(201).send({
      data: {
         code: "Created",
         message: "Account is created successfully!",
         status: "Success",
      },
   });
}
