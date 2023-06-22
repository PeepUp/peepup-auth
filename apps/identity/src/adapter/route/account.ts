import {
   getUserByEmail,
   getUserById,
   getUserByUserName,
} from "../controller/account.controller";
import { $ref } from "../schema/account.schema";
import type { Routes } from "./root";
``;

export default (): { routes: Routes } => ({
   routes: [
      // {
      //    method: "GET",
      //    url: "/account/:accountId",
      //    handler: getUserById,
      //    schema: {
      //       describe: "[ GET /account:/id ] get user by id",
      //       params: $ref("get_account_params_id_schema"),
      //       response: {
      //          200: $ref("get_account_response_schema"),
      //       },
      //    },
      // },
      // {
      //    method: "GET",
      //    url: "/account/:email",
      //    handler: getUserByEmail,
      //    schema: {
      //       describe: "[ GET /account:/id ] get user by id",
      //       params: $ref("get_account_params_email_schema"),
      //       response: {
      //          200: $ref("get_account_response_schema"),
      //       },
      //    },
      // },
      {
         method: "GET",
         url: "/account/:username",
         handler: getUserByUserName,
         schema: {
            describe: "[ GET /account:/id ] get user by id",
            params: $ref("get_account_params_username_schema"),
            response: {
               200: $ref("get_account_response_schema"),
            },
         },
      },
      {
         method: "POST",
         url: "/account",
         handler: async () => {},
         schema: {
            describe: "[ POST /account ] create user",
            body: $ref("create_account_body_schema"),
            response: {
               201: $ref("create_account_response_schema"),
            },
         },
      },
   ],
});
