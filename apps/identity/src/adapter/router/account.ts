import { FastifyReply, FastifyRequest } from "fastify";
import {
   getUserById,
   getUserByUserName,
   getUserProfileByUsername,
   loginAccount,
   registerAccount,
} from "../controller/account.controller";
import { $ref } from "../schema/account.schema";
import AccountService from "../service/account";

import type {
   CREATE_ACCOUNT_REQUEST_BODY_SCHEMA_TYPE,
   GET_ACCOUNT_PARAMS_ID_SCHEMA_TYPE,
   GET_ACCOUNT_PARAMS_USERNAME_SCHEMA_TYPE,
} from "../schema/account.schema";
import type { Routes } from "./root";

export default (accountService: AccountService): { routes: Routes } => ({
   routes: [
      {
         method: "GET",
         url: "/accounts/:accountId",
         handler: (
            request: FastifyRequest<{
               Params: GET_ACCOUNT_PARAMS_ID_SCHEMA_TYPE;
            }>,
            reply: FastifyReply
         ) => getUserById(request, reply, accountService),
         schema: {
            describe: "[ GET /account:/id ] get user by id",
            params: $ref("get_account_params_id_schema"),
            response: {
               200: $ref("get_account_response_schema"),
            },
         },
      },
      {
         method: "GET",
         url: "/accounts/username/:username",
         handler: getUserByUserName,
         schema: {
            describe: "[ GET /account/username/:username ] get user by id",
            params: $ref("get_account_params_username_schema"),
            response: {
               200: $ref("get_account_response_schema"),
            },
         },
      },
      {
         method: "GET",
         url: "/accounts/:username/profile",
         handler: (
            request: FastifyRequest<{
               Params: GET_ACCOUNT_PARAMS_USERNAME_SCHEMA_TYPE;
            }>,
            reply: FastifyReply
         ) => getUserProfileByUsername(request, reply, accountService),
         schema: {
            describe: "[ GET /account/:username/profile ] get user by id",
            params: $ref("get_account_params_username_schema"),
            response: {
               200: $ref("get_account_response_schema"),
            },
         },
      },
      {
         method: "POST",
         url: "/local/registration",
         handler: async (
            request: FastifyRequest<{
               Body: CREATE_ACCOUNT_REQUEST_BODY_SCHEMA_TYPE;
            }>,
            reply: FastifyReply
         ) => registerAccount(request, reply, accountService),
         schema: {
            describe: "[ POST /account ] create user",
            body: $ref("create_account_request_body_schema"),
            response: {
               201: $ref("create_account_response_schema"),
               422: $ref(
                  "error_unprocessable_content_response_registration_account_schema"
               ),
            },
         },
      },
   ],
});
