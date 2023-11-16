/* eslint-disable import/extensions */
import { Prisma } from "@prisma/client";
// eslint-disable-next-line import/no-unresolved
import { TokenType } from "@/common/constant";

import type { Entity, ID, TokenStatus, TokenTypes } from "@/types/types";

export default class Token implements Entity {
    id?: ID | null = null;

    constructor(
        private readonly value: string,
        private readonly type: TokenTypes | TokenType | null,
        private readonly header: Prisma.JsonValue,
        private readonly payload: Prisma.JsonValue,
        private readonly kid: string,
        private readonly jti: string,
        private readonly nbf: number,
        private readonly expires_at: number,
        private readonly expirationTime: Date,
        private readonly createdAt: Date,
        private readonly identityId: string | null,
        private readonly device_id: string | null,
        private readonly ip_address: string | null,
        private readonly tokenStatus?: TokenStatus | null
    ) {}

    public getId(): ID | null {
        return this.id ?? null;
    }

    public getValue(): string {
        return this.value;
    }

    public getType(): TokenTypes | TokenType | null {
        return this.type;
    }

    public getHeader(): Prisma.JsonValue {
        return this.header;
    }

    public getPayload(): Prisma.JsonValue {
        return this.payload;
    }

    public getKid(): string {
        return this.kid;
    }

    public getJti(): string {
        return this.jti;
    }

    public getNbf(): number {
        return this.nbf;
    }

    public getExpiresAt(): number {
        return this.expires_at;
    }

    public getTokenStatus(): TokenStatus | null {
        return this.tokenStatus ?? null;
    }

    public getExpirationTime(): Date {
        return this.expirationTime;
    }

    public getCreatedAt(): Date {
        return this.createdAt;
    }

    public getIdentityId(): string | null {
        return this.identityId;
    }

    public getDeviceId(): string | null {
        return this.device_id;
    }

    public getIpAddress(): string | null {
        return this.ip_address;
    }
}
