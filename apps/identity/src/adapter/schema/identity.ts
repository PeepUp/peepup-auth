import { buildJsonSchemas } from "fastify-zod";
import { z } from "zod";

const getIdentitiesResponseSchema = z.object({
    data: z.array(z.object({})).optional(),
});

export const password = z.string().min(8).max(72);

const identitySchema = z.object({
    id: z.string().uuid(),
    email: z.string().email().optional(),
    username: z.string().optional(),
    password,
});

export const createIdentityForRegistration = identitySchema
    .pick({
        email: true,
        username: true,
    })
    .strict();

// create identity

const GET_IDENTITY_PARAMS_ID_SCHEMA = identitySchema.pick({ id: true });

export type GetIdentityParams = z.infer<typeof GET_IDENTITY_PARAMS_ID_SCHEMA>;

export const { schemas, $ref } = buildJsonSchemas({
    // Identities Management Schemas
    getIdentitiesResponseSchema,

    // Identities Management Schemas REST
    GET_IDENTITY_PARAMS_ID_SCHEMA,
});
