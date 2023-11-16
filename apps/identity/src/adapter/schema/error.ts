import { z } from "zod";

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

export type DEFAULT_API_ERROR_RESPONSE_SCHEMA = z.infer<
    typeof default_api_error_response_schema
>;
