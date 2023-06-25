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

export const REGISTRATION_METHOD_VALUES = ["password", "oidc"] as const;
export const REGISTRATION_TYPE_VALUES = ["api", "browser"] as const;

export const ui_nodes_registration_account_schema = z.object({
   "traits.email": z.object({}),
});

const registration_account_request_body_schema = z.object({
   csrfToken: z.string().min(1).max(100).optional(),
   method: z.enum(REGISTRATION_METHOD_VALUES),
   password: z.string().min(8).max(72),
   traits: z.object({
      email: z.string().email().min(5).max(35),
   }),
});

const error_registration_flow_response_registration_account_schema = z.object({
   data: z.object({
      issued_at: z.string().datetime(),
      request_url: z.string().url(),
      type: z.enum(REGISTRATION_TYPE_VALUES),
      ui: z.object({
         action: z.string(),
         method: z.string(),
         messages: z.array(z.object({})).optional(),
         nodes: z.object({ ...ui_nodes_registration_account_schema.shape }),
      }),
   }),
});

const gone_response_registration_account_schema = z.object({
   data: z.object({
      code: z.number().or(z.string()),
      debug: z.string().optional(),
      details: z.object({}).optional(),
      id: z.string(),
      message: z.string(),
      reason: z.string(),
      request: z.string().or(z.number({})),
      status: z.string(),
   }),
});

const error_unprocessable_content_response_registration_account_schema =
   z.object({
      error: z
         .object({
            error: z.object({
               code: z.number().or(z.string()),
               debug: z.string().optional(),
               details: z.object({}).optional(),
               id: z.string(),
               message: z.string(),
               reason: z.string(),
               request: z.string().or(z.number({})),
               status: z.string(),
            }),
         })
         .optional(),
      redirect_browser_to: z.string().url().optional(),
   });

const default_error_response_registration_account_schema = z.object({
   error: z.object({
      code: z.number().or(z.string()),
      debug: z.string().optional(),
      details: z.object({}).optional(),
      id: z.string(),
      message: z.string(),
      reason: z.string(),
      request: z.string().or(z.number({})),
      status: z.string(),
   }),
});

export const default_api_error_response_schema = z.object({
   error: z.object({
      code: z.number().or(z.string()),
      debug: z.string().optional(),
      details: z.object({}).optional(),
      id: z.string(),
      message: z.string(),
      reason: z.string(),
      request: z.string().or(z.number({})),
      status: z.string(),
   }),
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
         invalid_type_error: "Username must be a string",
      })
      .min(5, {
         message: "Username must be at least 5 characters",
      })
      .max(35),
});

const partial_user_profile_schema = user_profile_schema.deepPartial();

export const get_account_response_schema = z.object({
   data: z.object({
      ...partial_user_profile_schema.shape,
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

export type ERROR_GONE_RESPONSE_REGISTRATION_ACCOUNT_SCHEMA = z.infer<
   typeof gone_response_registration_account_schema
>;
export type ERROR_UNPROCESSABLE_CONTENT_RESPONSE_REGISTRATION_ACCOUNT_SCHEMA =
   z.infer<
      typeof error_unprocessable_content_response_registration_account_schema
   >;
export type DEFAULT_ERROR_RESPONSE_REGISTRATION_ACCOUNT_SCHEMA = z.infer<
   typeof default_error_response_registration_account_schema
>;
export type ERROR_REGISTRATION_FLOW_RESPONSE_REGISTRATION_ACCOUNT_SCHEMA =
   z.infer<typeof error_registration_flow_response_registration_account_schema>;
export type REGISTRATION_ACCOUNT_REQUEST_BODY_SCHEMA = z.infer<
   typeof registration_account_request_body_schema
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
   registration_account_request_body_schema,

   // error
   error_registration_flow_response_registration_account_schema,
   gone_response_registration_account_schema,
   error_unprocessable_content_response_registration_account_schema,
   default_error_response_registration_account_schema,
});
