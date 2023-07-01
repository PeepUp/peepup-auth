/* eslint-disable */
import { buildJsonSchemas } from "fastify-zod";
import { z } from "zod";
import {
    GET_IDENTITIES_RESPONSE_SCHEMA,
    GET_IDENTITY_PARAMS_ID_SCHEMA,
    GET_IDENTITY_PARTIAL_QUERY_SCHEMA,
    GET_IDENTITY_RESPONSE_SCHEMA,
    PUT_IDENTITY_BODY_SCHEMA,
    createIdentityForRegistration,
    password,
} from "./identity";

const method = z.enum(["password", "oidc"] as const);
const typeValue = z.enum(["api", "browser"] as const);
const password_identifier = z.enum(["email", "username"] as const);

const traits = createIdentityForRegistration;

const localStrategy = z.object({
    traits,
    password_identifier,
    method,
});

export const POST_REGISTER_IDENTITY_BODY_SCHEMA = localStrategy
    .omit({ password_identifier: true })
    .merge(z.object({ password }));

export const POST_LOGIN_IDENTITY_BODY_SCHEMA = localStrategy.merge(
    z.object({ password })
);

export type RegisterIdentityBody = z.infer<typeof POST_REGISTER_IDENTITY_BODY_SCHEMA>;
export type LoginIdentityBody = z.infer<typeof POST_LOGIN_IDENTITY_BODY_SCHEMA>;

export const { schemas: authSchema, $ref } = buildJsonSchemas({
    localStrategy,
    POST_REGISTER_IDENTITY_BODY_SCHEMA,
    POST_LOGIN_IDENTITY_BODY_SCHEMA,
    GET_IDENTITY_RESPONSE_SCHEMA,
    GET_IDENTITY_PARAMS_ID_SCHEMA,
    GET_IDENTITY_PARTIAL_QUERY_SCHEMA,
    PUT_IDENTITY_BODY_SCHEMA,
    GET_IDENTITIES_RESPONSE_SCHEMA,
});
