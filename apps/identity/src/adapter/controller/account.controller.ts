import { FastifyReply, FastifyRequest } from "fastify";
import {
   CREATE_ACCOUNT_REQUEST_BODY_SCHEMA_TYPE,
   GET_ACCOUNT_PARAMS_ID_SCHEMA_TYPE,
   GET_ACCOUNT_PARAMS_USERNAME_SCHEMA_TYPE,
   LOGIN_ACCOUNT_REQUEST_BODY_SCHEMA_TYPE,
} from "../schema/account.schema";
import AccountService from "../service/account";

export async function getUserById(
   request: FastifyRequest<{ Params: GET_ACCOUNT_PARAMS_ID_SCHEMA_TYPE }>,
   reply: FastifyReply,
   accountService: AccountService
) {
   const profile = await accountService.getAccountById(
      request.params.accountId
   );
   console.log({ profile });

   return reply.code(200).send({
      data: {
         profile,
      },
   });
}

export async function getUserByUserName(
   _request: FastifyRequest<{
      Params: GET_ACCOUNT_PARAMS_USERNAME_SCHEMA_TYPE;
   }>,
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

   const existingAccount = await accountService.getProfileByEmail(email);
   if (existingAccount.profile.email === email) {
      return reply.code(409).send({
         code: "409",
         codeStatus: "Conflict",
         ok: false,
         message: "Account is already taken",
         error: {
            details: [
               {
                  message: `Account with email '${email}' is invalid or already taken`,
               },
            ],
         },
      });
   }

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

export async function loginAccount(
   request: FastifyRequest<{ Body: LOGIN_ACCOUNT_REQUEST_BODY_SCHEMA_TYPE }>,
   reply: FastifyReply,
   accountService: AccountService
) {
   const { email, password } = request.body;
   const existingAccount = await accountService.getProfileByEmail(email);

   if (existingAccount.profile.email !== email) {
      return reply.code(404).send({
         code: "404",
         codeStatus: "Not Found",
         ok: false,
         message: "Account is not found",
         error: {
            details: [
               {
                  message: `Account with email '${email}' is not found`,
               },
            ],
         },
      });
   }

   const { profile } = await accountService.loginAccount({
      email,
      password,
   });

   if (profile) {
      return reply.code(200).send({
         data: {
            access_token: "test",
            refresh_token: "test",
            token_type: "Bearer",
         },
      });
   }
}
