import { z } from "zod";

export const options = z.object({
    endpoint: z.string().url().optional(),
    client_id: z.string(),
    client_secret: z.string(),
    refresh_token: z.string(),
    scope: z.string(),
});

export const grant_type = z.enum(["refresh_token", "access_token"]);

export const POST_REFRESH_TOKEN_QUERY_PARAMS_SCHEMA = options.merge(
    z.object({
        grant_type: grant_type.default("refresh_token"),
    })
);

export type PostRefreshTokenParams = z.infer<
    typeof POST_REFRESH_TOKEN_QUERY_PARAMS_SCHEMA
>;
