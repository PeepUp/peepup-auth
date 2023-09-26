import { IdentityStateTypes } from "@prisma/client";
import type { Entity } from "@/types/types";

export interface Identity extends Entity {
    role: string;
    email: string;
    avatar: string;
    lastName: string;
    firstName: string;
    state: IdentityStateTypes;
    phoneNumber: string | null;
    readonly updatedAt?: Date | null;
    readonly createdAt?: Date | null;
    readonly password: string;
    readonly username?: string | null;
    readonly providerId: number | null;
    readonly emailVerified: Date | null;
}

class IdentityImp implements Identity {
    avatar: string = "";

    email: string = "";

    readonly emailVerified: Date | null = null;

    firstName: string = "";

    lastName: string = "";

    readonly password: string = "";

    phoneNumber: string | null = null;

    state: IdentityStateTypes = IdentityStateTypes.unverified;

    role: string = "";

    readonly username?: string | null = null;

    readonly createdAt?: Date = new Date();

    readonly updatedAt?: Date = new Date();

    readonly providerId: number | null = null;
}

export default IdentityImp;
