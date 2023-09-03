import { z } from "zod";

export const options = z.object({
    endpoint: z.string().url().optional(),
    client_id: z.string(),
    client_secret: z.string(),
    refresh_token: z.string(),
    scope: z.string(),
});

export const token = z.object({ token: z.string().nonempty() });
export const grant_type = z.enum(["refresh_token", "access_token"]);

export const POST_REFRESH_TOKEN_QUERY_PARAMS_SCHEMA = options.merge(
    z.object({
        grant_type: grant_type.default("refresh_token"),
    })
);

export const ID_TOKEN_PARAMS = z.object({ id: z.string().nonempty() });

export const TOKEN_QUERY_STRING = token;

export type PostRefreshTokenParams = z.infer<
    typeof POST_REFRESH_TOKEN_QUERY_PARAMS_SCHEMA
>;
export type TokenQueryString = z.infer<typeof TOKEN_QUERY_STRING>;
export type idTokenParams = z.infer<typeof ID_TOKEN_PARAMS>;
