import type { JWTPayload, JWTHeaderParameters, JWTVerifyOptions } from "jose";
import { TokenAlgorithm } from "@/common/constant";
import type { AccessInfo, EmailAndIdentityId, Token, TokenTypes } from "@/types";

export type TokenPayload = EmailAndIdentityId & Pick<AccessInfo, "resource">;
export type TokenPayloadProtected = TokenPayload & { jti: string; kid: string };

export type AccessToken = string;
export type RefreshToken = string;
export type TokenQueryArgs = Partial<Pick<Token, "jti" | "identityId" | "value">>;

export type AuthToken = {
    access_token: AccessToken;
    refresh_token: RefreshToken;
};

export type SupportedKeyAlgorithm = {
    [key in TokenAlgorithm]: string;
};

export interface JwtToken extends KeyPair {
    keyId: string;
    payload?: JWTPayload;
    header?: JWTHeaderParameters;
}

export type DecodedToken = {
    id: string;
    type: string;
    email: string;
    id: string;
    resource: string;
    sid: string;
    aud: string;
    iat: number;
    nbf: number;
    exp: number;
    iss: string;
    sub: string;
    jti: string;
};

export type GenerateTokenArgs = {
    identity: TokenPayload;
    type: TokenTypes;
    ip_address: string;
    device_id: string;
    fingerprint?: string;
    readonly algorithm: TokenAlgorithm | string;
    readonly expiresIn: number;
    readonly subject?: string;
};

export type VerifyTokenArgs = KeyPair & {
    algorithm: string;
    token: string;
    issuer?: string;
    audience?: string;
    options?: JWTVerifyOptions;
};

export type CreateTokenArgs = Pick<KeyPair, "privateKey"> & {
    payload: JWTPayload | TokenPayloadWithIdentity;
    header: JWTHeaderParameters | JoseHeaderParameters;
};

export type KeyPair = {
    privateKey: string;
    publicKey: string;
};

// eslint-disable @typescript-eslint/no-redeclare
// eslint-disable import/export
export type ITokenPayloadIdentity = Required<EmailAndIdentityId> &
    Required<Pick<AccessInfo, "resource">> &
    Required<{
        role: Pick<AccessInfo, "resource">;
        ip_address?: string;
        device_id?: string;
        fingerprint?: string;
    }> & { id: string };

export type TokenPayloadIdentityReadonly = Readonly<TokenPayloadIdentity>;
export type TokenPayloadWithIdentity = JWTPayload & TokenPayloadIdentity;

// eslint-disable @typescript-eslint/no-redeclare
// eslint-disable import/export
export interface TokenPayloadIdentity {
    id: string | number;
    sid: string;
    jti: string;
    exp: number | Date;
    iat: number;
    iss: string;
    aud: string;
    nbf: number;
    email: string;
    resource: string;
    sub: string;
    type: string;
}

export interface JWTHeader {
    alg: string;
    typ: string;
    kid: string;
}
