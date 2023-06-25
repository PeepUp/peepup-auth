import { buildJsonSchemas } from "fastify-zod";
import { z } from "zod";
import {
   user_profile_schema,
   get_user_profile_response_schema,
} from "./user-profile.schema";

export const account_schema = z.object({
   profile: user_profile_schema.optional().or(z.undefined()),
});

export const create_account_body_schema = user_profile_schema.pick({
   id: true,
   username: true,
   name: true,
   email: true,
   password: true,
   phone: true,
});

export const get_account_params_id_schema = z.object({
   accountId: z.preprocess((val) => Number(val), z.number().min(1).int()),
});

export const get_account_params_email_schema = z.object({
   email: z.string().email().min(5).max(35),
});

export const get_account_params_username_schema = z.object({
   username: z
      .string({
         required_error: "Username is required",
         coerce: true,
         invalid_type_error: "Username must be a string",
      })
      .min(5)
      .max(35),
});

export const get_account_response_schema = z.object({
   data: z.object({
      profile: user_profile_schema.optional(),
   }),
});

export const create_account_request_body_schema = z.object({
   name: z.string().max(35).min(0),
   email: z.string().email().max(35).min(0),
   password: z.string().min(8).max(72),
});

export const login_account_request_body_schema = z.object({
   email: z.string().email().max(35).min(0),
   password: z.string().min(8).max(72),
});

export const login_account_response_schema = z.object({
   data: z.object({
      access_token: z.string(),
      refresh_token: z.string(),
   }),
});

export const create_account_response_schema = z.object({
   data: z.object({
      code: z.number().or(z.string()),
      message: z.string(),
      status: z.string(),
   }),
});

export type ACCOUNT_SCHEMA_TYPE = z.infer<typeof account_schema>;
export type CREATE_ACCOUNT_BODY_SCHEMA_TYPE = z.infer<
   typeof create_account_body_schema
>;

export type GET_ACCOUNT_PARAMS_ID_SCHEMA_TYPE = z.infer<
   typeof get_account_params_id_schema
>;

export type GET_ACCOUNT_PARAMS_EMAIL_SCHEMA_TYPE = z.infer<
   typeof get_account_params_email_schema
>;

export type GET_ACCOUNT_PARAMS_USERNAME_SCHEMA_TYPE = z.infer<
   typeof get_account_params_username_schema
>;

export type GET_ACCOUNT_RESPONSE_SCHEMA_TYPE = z.infer<
   typeof get_account_response_schema
>;

export type CREATE_ACCOUNT_REQUEST_BODY_SCHEMA_TYPE = z.infer<
   typeof create_account_request_body_schema
>;

export type LOGIN_ACCOUNT_REQUEST_BODY_SCHEMA_TYPE = z.infer<
   typeof login_account_request_body_schema
>;
export type LOGIN_ACCOUNT_RESPONSE_SCHEMA_TYPE = z.infer<
   typeof login_account_response_schema
>;

export const { schemas: accountSchema, $ref } = buildJsonSchemas({
   account_schema,
   create_account_body_schema,
   get_account_params_id_schema,
   get_account_params_email_schema,
   get_account_params_username_schema,
   get_account_response_schema,
   create_account_response_schema,
   get_user_profile_response_schema,
   create_account_request_body_schema,
   login_account_request_body_schema,
   login_account_response_schema,
});
