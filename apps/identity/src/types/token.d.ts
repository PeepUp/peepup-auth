import type { Identity } from "@domain/entity/identity";
import type { JWTPayload, JWTHeaderParameters } from "jose";
import type { AccessInfo, TokenTypes } from "./types";

import { TokenAlgorithm } from "../common/constant";

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
    type: TokenTypes;
    readonly algorithm: TokenAlgorithm | string;
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
    payload: JWTPayload | TokenPayloadWithIdentity;
    header: JWTHeaderParameters | JoseHeaderParameters;
};

export interface KeyPair {
    privateKey: string;
    publicKey: string;
}

export type TokenPayloadIdentity = Pick<Identity, "email" | "id"> &
    Pick<AccessInfo, "resource">;

export type TokenPayloadWithIdentity = JWTPayload & TokenPayloadIdentity;

export interface JWTHeader {
    alg: string;
    typ: string;
    kid: string;
}
