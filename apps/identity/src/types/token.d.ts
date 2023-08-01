import type { Identity } from "@domain/entity/identity";
import type { AccessInfo, TokenTypes } from "./types";

export type TokenPayload = Pick<Identity, "email" | "id"> & Pick<AccessInfo, "resource">;

export type AuthToken = {
    access_token: string;
    refresh_token: string;
};

export interface JwtToken extends KeyPair {
    keyId: string;
    payload?: JWTPayload;
    header?: JWTHeaderParameters;
}

export type GenerateTokenArgs = {
    identity: TokenPayload;
    readonly tokenType: TokenTypes;
    readonly algorithm: string;
    readonly expiresIn: number;
};

export type VerifyTokenArgs = KeyPair & {
    algorithm: string;
    token: string;
    issuer?: string;
    audience?: string;
    options?: jose.JWTVerifyOptions;
};

export type CreateTokenArgs = Pick<KeyPair, "privateKey"> & {
    payload: JWTPayload;
    header: JWTHeaderParameters;
};

export interface KeyPair {
    privateKey: string;
    publicKey: string;
}

export type TokenPayloadIdentity = Pick<Identity, "email" | "id"> &
    Pick<AccessInfo, "resource">;

export type GenerateTokenArgs = {
    identity: TokenPayloadIdentity;
    tokenType: TokenTypes;
    algorithm: string;
    expiresIn: number;
};

export interface JWTHeader {
    alg: string;
    typ: string;
    kid: string;
}
