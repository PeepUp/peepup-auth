import { buildJsonSchemas } from "fastify-zod";
import {
    localStrategy,
    POST_REGISTER_IDENTITY_BODY_SCHEMA,
    POST_LOGIN_IDENTITY_BODY_SCHEMA,
} from "./auth";
import {
    GET_IDENTITIES_RESPONSE_SCHEMA,
    GET_IDENTITY_PARAMS_ID_SCHEMA,
    GET_IDENTITY_PARTIAL_QUERY_SCHEMA,
    GET_IDENTITY_RESPONSE_SCHEMA,
    PUT_IDENTITY_BODY_SCHEMA,
} from "./identity";
import {
    POST_REFRESH_TOKEN_QUERY_PARAMS_SCHEMA,
    TOKEN_QUERY_STRING,
    ID_TOKEN_PARAMS,
} from "./token";

const { schemas: identitySchema, $ref } = buildJsonSchemas({
    // Auth
    localStrategy,
    POST_REGISTER_IDENTITY_BODY_SCHEMA,
    POST_LOGIN_IDENTITY_BODY_SCHEMA,

    // Identity
    GET_IDENTITY_RESPONSE_SCHEMA,
    GET_IDENTITY_PARAMS_ID_SCHEMA,
    GET_IDENTITY_PARTIAL_QUERY_SCHEMA,
    PUT_IDENTITY_BODY_SCHEMA,
    GET_IDENTITIES_RESPONSE_SCHEMA,

    // Token
    POST_REFRESH_TOKEN_QUERY_PARAMS_SCHEMA,
    ID_TOKEN_PARAMS,
    TOKEN_QUERY_STRING,
});

export { $ref };
export const schemas = [...identitySchema];
