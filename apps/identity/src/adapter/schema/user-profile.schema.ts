import { z } from "zod";

export const user_profile_schema = z.object({
   username: z.string().min(3).max(20),
   email: z.string().email().min(3).max(35),
   password: z.string().min(8).max(56),
   emailVerified: z.date(),
   name: z.string().min(3).max(50),
   phone: z.string().min(10).max(10),
   avatar: z.string().url(),
});

export type USER_PROFILE_SCHEMA_TYPE = z.infer<typeof user_profile_schema>;
