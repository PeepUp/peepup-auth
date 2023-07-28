import type { Entity, RoleType } from "@/types/types";

export interface Identity extends Entity {
    avatar: string;
    readonly email: string;
    readonly emailVerified: Date | null;
    firstName: string;
    lastName: string;
    readonly password: string;
    phoneNumber: string | null;
    state: string;
    readonly username?: string | null;
    isAdmin: boolean;
    readonly createdAt?: Date;
    readonly updatedAt?: Date;
    readonly role: RoleType;
    readonly providerId: number | null;
}
