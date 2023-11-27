import type { JWTHeaderParameters, JWTPayload, JWTVerifyOptions } from "jose";
import type { Token, TokenTypes } from "@/types/types";
import type {
    GenerateTokenArgs,
    JWTHeader,
    TokenPayloadIdentity,
    TokenPayloadIdentityReadonly,
    TokenPayloadWithIdentity,
} from "@/types/token";

import * as constant from "@/common/constant";
import CryptoUtils from "@/common/libs/crypto";

class TokenFactory {
    static accessToken(identity: TokenPayloadIdentityReadonly): GenerateTokenArgs {
        return {
            identity,
            device_id: identity.device_id,
            ip_address: identity.ip_address,
            type: constant.TokenType.access,
            fingerprint: identity.fingerprint,
            algorithm: constant.TokenAlgorithm.RS256,
            expiresIn: Math.floor(new Date().getTime() / 1000 + 1 * 60 * 60),
        } satisfies GenerateTokenArgs;
    }

    static refreshToken(identity: TokenPayloadIdentityReadonly): GenerateTokenArgs {
        return {
            identity,
            device_id: identity.device_id,
            ip_address: identity.ip_address,
            fingerprint: identity.fingerprint,
            type: constant.TokenType.refresh,
            algorithm: constant.TokenAlgorithm.ES256,
            expiresIn: Math.floor(new Date().getTime() / 1000 + 1 * 4 * 60 * 60),
        } satisfies GenerateTokenArgs;
    }

    static simplePayloadIdentity(data: TokenPayloadIdentityReadonly): TokenPayloadIdentityReadonly {
        console.log({ payload: data });
        return {
            id: data.id,
            email: data.email,
            resource: data.role,
            ip_address: data.ip_address,
            device_id: data.device_id,
            fingerprint: data.fingerprint,
        } satisfies TokenPayloadIdentityReadonly;
    }

    static createPayload(
        identity: TokenPayloadIdentity,
        type: TokenTypes,
        expirationTime: number,
        subject?: string
    ): TokenPayloadWithIdentity {
        return {
            type,
            id: identity.id,
            exp: expirationTime,
            iss: constant.issuer,
            email: identity.email,
            sub: constant.clientId ?? subject,
            aud: constant.audience,
            nbf: Date.now() / 1000,
            resource: identity.resource,
            sid: constant.TokenSID.active,
            jti: CryptoUtils.generateCUID(),
            iat: Math.floor(Date.now() / 1000),
        } satisfies TokenPayloadIdentity;
    }

    static createHeader(alg: string, kid: string): JWTHeaderParameters {
        return {
            alg,
            typ: "jwt",
            kid,
        } satisfies JWTHeaderParameters;
    }

    static genereteCompactToken({
        value,
        type,
        expirationTime,
        device_id,
        ip_address,
        payload,
        header,
    }: {
        value: string;
        payload: JWTPayload;
        header: JWTHeaderParameters | JWTHeader;
        type: TokenTypes;
        expirationTime: number;
        device_id: string;
        ip_address: string;
    }): Token {
        return {
            type,
            value,
            ip_address,
            device_id,
            createdAt: new Date(),
            nbf: Date.now() / 1000,
            kid: header.kid as string,
            jti: payload.jti as string,
            header: JSON.stringify(header),
            payload: JSON.stringify(payload),
            identityId: payload.id as string,
            expires_at: payload.exp as number,
            tokenStatus: constant.TokenSID.active,
            expirationTime: new Date(expirationTime * 1000),
        } satisfies Token;
    }

    static generateJWTOption(algorithms: string[] | string): JWTVerifyOptions {
        const { audience, issuer, clientId, requiredClaims } = constant;

        return {
            issuer,
            audience,
            typ: "jwt",
            requiredClaims,
            subject: clientId,
            currentDate: new Date(),
            clockTolerance: "1 minutes",
            algorithms: [...algorithms] as string[],
        } satisfies JWTVerifyOptions;
    }
}

export default TokenFactory;
