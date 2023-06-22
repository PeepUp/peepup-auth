import { buildJsonSchemas } from "fastify-zod";
import { z } from "zod";

export const user_profile_schema = z.object({
   username: z.string().min(3).max(20),
   email: z.string().email().min(3).max(35),
   emailVerified: z.date(),
   name: z.string().min(3).max(50),
   phone: z.string().min(10).max(13),
   avatar: z.string().url(),
});

export const get_user_profile_response_schema = z.object({
   data: user_profile_schema,
});

export type USER_PROFILE_SCHEMA_TYPE = z.infer<typeof user_profile_schema>;
