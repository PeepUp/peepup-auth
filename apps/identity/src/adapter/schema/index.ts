import { buildJsonSchemas } from "fastify-zod";
import * as AuthSchema from "./auth";
import * as IdentitySchema from "./identity";
import * as TokenSchema from "./token";
import * as DBSchema from "./db";

const { schemas: identitySchema, $ref } = buildJsonSchemas({
    // Auth
    LOCAL_STRATEGY: AuthSchema.localStrategy,
    POST_REGISTER_IDENTITY_BODY_SCHEMA: AuthSchema.POST_REGISTER_IDENTITY_BODY_SCHEMA,
    POST_LOGIN_IDENTITY_BODY_SCHEMA: AuthSchema.POST_LOGIN_IDENTITY_BODY_SCHEMA,

    // Identity
    GET_IDENTITIES_QUERY_SCHEMA: IdentitySchema.GET_IDENTITIES_QUERY_SCHEMA,
    GET_IDENTITY_RESPONSE_SCHEMA: IdentitySchema.GET_IDENTITY_RESPONSE_SCHEMA,
    GET_IDENTITY_PARAMS_ID_SCHEMA: IdentitySchema.GET_IDENTITY_PARAMS_ID_SCHEMA,
    GET_IDENTITY_PARTIAL_QUERY_SCHEMA: IdentitySchema.GET_IDENTITY_PARTIAL_QUERY_SCHEMA,
    PUT_IDENTITY_BODY_SCHEMA: IdentitySchema.PUT_IDENTITY_BODY_SCHEMA,
    GET_IDENTITIES_RESPONSE_SCHEMA: IdentitySchema.GET_IDENTITIES_RESPONSE_SCHEMA,

    // Token
    POST_REFRESH_TOKEN_QUERY_PARAMS_SCHEMA: TokenSchema.POST_REFRESH_TOKEN_QUERY_PARAMS_SCHEMA,
    ID_TOKEN_PARAMS: TokenSchema.ID_TOKEN_PARAMS,
    TOKEN_QUERY_STRING: TokenSchema.TOKEN_QUERY_STRING,

    // DB Schema options
    DB_QUERY_OPTIONS: DBSchema.queryOptions,
    DB_SELECT_QUERY_OPTIONS: DBSchema.selectQueryOption,
});

export { $ref };
export const schemas = [...identitySchema];
