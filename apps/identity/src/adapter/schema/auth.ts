import { z } from "zod";
import { createIdentityForRegistration, password } from "./identity";

const method = z.enum(["password", "oidc"] as const);
// const typeValue = z.enum(["api", "browser"] as const);
const password_identifier = z.enum(["email", "username"] as const);

// const inactive_method = z.enum(["password", "rephrase_words"] as const);
const traits = createIdentityForRegistration;

export const localStrategy = z.object({
    traits,
    password_identifier,
    method,
});

export const authHeader = z.object({
    Authorization: z.string().startsWith("Bearer"),
});

export const POST_INACTIVATE_IDENTITY_BODY_SCHEMA = z.object({});
export const POST_REGISTER_IDENTITY_BODY_SCHEMA = localStrategy
    .omit({ password_identifier: true })
    .merge(z.object({ password }));

export const POST_INACTIVATED_IDENTITY_BODY_SCHEMA = localStrategy
    .omit({ password_identifier: true })
    .merge(z.object({ password }));

export const ip_schema = z.string().ip();

export const POST_LOGIN_IDENTITY_BODY_SCHEMA = localStrategy.merge(
    z.object({ password })
);

export type InactivatedIdentityBody = z.infer<typeof POST_REGISTER_IDENTITY_BODY_SCHEMA>;
export type RegisterIdentityBody = z.infer<typeof POST_REGISTER_IDENTITY_BODY_SCHEMA>;
export type LoginIdentityBody = z.infer<typeof POST_LOGIN_IDENTITY_BODY_SCHEMA>;
