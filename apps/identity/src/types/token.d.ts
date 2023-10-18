import type { Identity } from "@domain/entity/identity";
import type { JWTPayload, JWTHeaderParameters, JWTVerifyOptions } from "jose";
import type { AccessInfo, EmailAndIdentityId, Token, TokenTypes } from "@/types";

import { TokenAlgorithm } from "@/common/constant";
import { ID } from "./types";

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
    readonly algorithm: TokenAlgorithm | string;
    readonly expiresIn: number;
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

export type TokenPayloadIdentity = Required<EmailAndIdentityId> &
    Required<Pick<AccessInfo, "resource">> &
    Required<{
        role: Pick<AccessInfo, "resource">;
        ip_address?: string | null;
        device_id?: string | null;
    }>;

export type TokenPayloadIdentityReadonly = Readonly<TokenPayloadIdentity>;
export type TokenPayloadWithIdentity = JWTPayload & TokenPayloadIdentity;

export interface JWTHeader {
    alg: string;
    typ: string;
    kid: string;
}
