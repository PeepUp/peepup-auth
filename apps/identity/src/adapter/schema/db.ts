import * as z from "zod";

export const selectQueryOption = z
    .object({
        id: z.boolean().optional(),
        username: z.boolean().optional(),
        avatar: z.boolean().optional(),
        email: z.boolean().optional(),
        firstName: z.boolean().optional(),
        lastName: z.boolean().optional(),
        state: z.boolean().optional(),
        providerId: z.boolean().optional(),
        phoneNumber: z.boolean().optional(),
        emailVerified: z.boolean().optional(),
    })
    .partial();

export const queryOptions = z.object({
    take: z
        .string()
        .regex(/^[0-9]+$/)
        .or(z.number())
        .optional(),
    select: selectQueryOption.optional(),
});

export type QueryOptions = z.infer<typeof queryOptions>;
export type SelectQueryOption = z.infer<typeof selectQueryOption>;
