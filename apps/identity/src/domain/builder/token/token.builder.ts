import { Prisma } from "@prisma/client";

import { TokenType } from "@/common/constant";
import Token from "@/domain/entity/token";

import type { TokenStatus, TokenTypes } from "@/types/types";

export interface TokenBuilderRequired {
    readonly value: string;
    type: TokenTypes | TokenType | null;
    readonly device_id: string | null;
    readonly ip_address: string | null;
}

export default class TokenBuilder {
    private header: Prisma.JsonValue;

    private payload: Prisma.JsonValue;

    private kid: string;

    private jti: string;

    private nbf: number;

    private expires_at: number;

    private tokenStatus: TokenStatus | null;

    private expirationTime: Date = new Date();

    private createdAt: Date = new Date();

    private identityId: string | null;

    private readonly value: string;

    private type: TokenTypes | TokenType | null;

    private device_id: string | null;

    private ip_address: string | null;

    constructor(data: TokenBuilderRequired) {
        this.value = data.value;
        this.type = data.type;
        this.device_id = data.device_id;
        this.ip_address = data.ip_address;
        this.identityId = null;
        this.tokenStatus = null;
        this.expires_at = 0;
        this.header = {};
        this.payload = {};
        this.kid = "";
        this.jti = "";
        this.nbf = 0;
    }

    public setType(type: TokenTypes): TokenBuilder {
        this.type = type;
        return this;
    }

    public setHeader(header: Prisma.JsonValue): TokenBuilder {
        this.header = header;
        return this;
    }

    public setPayload(payload: Prisma.JsonValue): TokenBuilder {
        this.payload = payload;
        return this;
    }

    public setKid(kid: string): TokenBuilder {
        this.kid = kid;
        return this;
    }

    public setJti(jti: string): TokenBuilder {
        this.jti = jti;
        return this;
    }

    public setNbf(nbf: number): TokenBuilder {
        this.nbf = nbf;
        return this;
    }

    public setExpiresAt(expires_at: number): TokenBuilder {
        this.expires_at = expires_at;
        return this;
    }

    public setStatus(status: TokenStatus): TokenBuilder {
        this.tokenStatus = status;
        return this;
    }

    public setExpirationTime(expirationTime: Date): TokenBuilder {
        this.expirationTime = expirationTime;
        return this;
    }

    public setCreatedAt(createdAt: Date): TokenBuilder {
        this.createdAt = createdAt;
        return this;
    }

    public setIdentityId(identityId: string | null): TokenBuilder {
        this.identityId = identityId;
        return this;
    }

    public setDeviceId(device_id: string | null): TokenBuilder {
        this.device_id = device_id;
        return this;
    }

    public setIpAddress(ip_address: string | null): TokenBuilder {
        this.ip_address = ip_address;
        return this;
    }

    public setTokenStatus(tokenStatus: TokenStatus | null): TokenBuilder {
        this.tokenStatus = tokenStatus;
        return this;
    }

    public build(): Token {
        return new Token(
            this.value,
            this.type,
            this.header,
            this.payload,
            this.kid,
            this.jti,
            this.nbf,
            this.expires_at,
            this.expirationTime,
            this.createdAt,
            this.identityId,
            this.device_id,
            this.ip_address,
            this.tokenStatus
        );
    }
}
