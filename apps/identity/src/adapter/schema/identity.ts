import { buildJsonSchemas } from "fastify-zod";
import { z } from "zod";

export const password = z.string().min(8).max(72);
export const state = z.enum(["active", "inactive", "disabled"]);

const identitySchema = z.object({
    password,
    state,
    id: z.string().uuid(),
    username: z.string().optional(),
    lastName: z.string().optional(),
    firstName: z.string().optional(),
    avatar: z.string().url().optional(),
    email: z.string().email().optional(),
    emailVerified: z.boolean().optional(),
    createdAt: z.string().datetime().optional(),
    providerId: z.string().optional(),
});

const usernameOrEmail = identitySchema.pick({
    email: true,
    username: true,
});

export const PUT_IDENTITY_BODY_SCHEMA = identitySchema.required().pick({
    lastName: true,
    firstName: true,
    avatar: true,
});

export const createIdentityForRegistration = usernameOrEmail;

export const GET_IDENTITIES_RESPONSE_SCHEMA = z.object({
    data: z.array(identitySchema).optional(),
});

export const GET_IDENTITY_PARTIAL_QUERY_SCHEMA = z.object({
    ...usernameOrEmail.shape,
});

export const GET_IDENTITY_PARAMS_ID_SCHEMA = identitySchema.pick({ id: true });
export const GET_IDENTITY_RESPONSE_SCHEMA = identitySchema;

export type GetIdentityParamsId = z.infer<typeof GET_IDENTITY_PARAMS_ID_SCHEMA>;
export type GetIdentityResponse = z.infer<typeof GET_IDENTITY_RESPONSE_SCHEMA>;
export type GetIdentitiesResponse = z.infer<typeof GET_IDENTITY_RESPONSE_SCHEMA>;
export type IdentityQueryPartial = z.infer<typeof GET_IDENTITY_PARTIAL_QUERY_SCHEMA>;
export type PutIdentityBody = z.infer<typeof PUT_IDENTITY_BODY_SCHEMA>;

export const { schemas: identitiesSchema, $ref: refIdentities } = buildJsonSchemas({
    // Identities Management Schemas
    // PUT_IDENTITY_BODY_SCHEMA,
    // GET_IDENTITY_PARTIAL_QUERY_SCHEMA,
    // GET_IDENTITY_RESPONSE_SCHEMA,
    // // Identities Management Schemas REST
});
