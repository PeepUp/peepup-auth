import { IdentityStateTypes } from "@prisma/client";
import type { Entity } from "@/types/types";

export interface Identity extends Entity {
    avatar: string;
    readonly email: string;
    readonly emailVerified: Date | null;
    firstName: string;
    lastName: string;
    readonly password: string;
    phoneNumber: string | null;
    state: IdentityStateTypes;
    role: string;
    readonly username?: string | null;
    readonly createdAt?: Date;
    readonly updatedAt?: Date;
    readonly providerId: number | null;
}
