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
import CryptoUtils from "@/common/lib/crypto";

class TokenFactory {
    static accessToken(identity: TokenPayloadIdentityReadonly): GenerateTokenArgs {
        return {
            identity,
            ip_address: identity.ip_address,
            device_id: identity.device_id,
            type: constant.TokenType.access,
            expiresIn: Math.floor(new Date().getTime() / 1000 + 1 * 60 * 60),
            algorithm: constant.TokenAlgorithm.RS256,
        };
    }

    static refreshToken(identity: TokenPayloadIdentityReadonly): GenerateTokenArgs {
        return {
            identity,
            ip_address: identity.ip_address,
            device_id: identity.device_id,
            type: constant.TokenType.refresh,
            expiresIn: Math.floor(new Date().getTime() / 1000 + 1 * 4 * 60 * 60),
            algorithm: constant.TokenAlgorithm.ES256,
        };
    }

    static simplePayloadIdentity(
        data: TokenPayloadIdentityReadonly
    ): TokenPayloadIdentityReadonly {
        return {
            id: data.id,
            email: data.email,
            resource: data.role,
            ip_address: data.ip_address,
            device_id: data.device_id,
        };
    }

    static createPayload(
        identity: TokenPayloadIdentity,
        type: TokenTypes,
        expirationTime: number
    ): TokenPayloadWithIdentity {
        return {
            type,
            id: identity.id,
            exp: expirationTime,
            iss: constant.issuer,
            email: identity.email,
            sub: constant.clientId,
            aud: constant.audience,
            nbf: Date.now() / 1000,
            resource: identity.resource,
            sid: constant.TokenSID.active,
            jti: CryptoUtils.generateCUID(),
            iat: Math.floor(Date.now() / 1000),
        };
    }

    static createHeader(alg: string, kid: string): JWTHeaderParameters {
        return {
            alg,
            typ: "jwt",
            kid,
        };
    }

    static genereteToken(
        value: string,
        payload: JWTPayload,
        header: JWTHeaderParameters | JWTHeader,
        type: string,
        expirationTime: number,
        device_id?: string,
        ip_address?: string
    ): Token {
        return <Token>{
            kid: header.kid,
            expires_at: payload.exp,
            value,
            type,
            tokenStatus: constant.TokenSID.active,
            nbf: Date.now() / 1000,
            createdAt: new Date(),
            jti: payload.jti as string,
            header: JSON.stringify(header),
            payload: JSON.stringify(payload),
            identityId: payload.id,
            device_id,
            ip_address,
            expirationTime: new Date(expirationTime * 1000),
        };
    }

    static generateJWTOption(algorithms: string[] | string): JWTVerifyOptions {
        const { audience, issuer, clientId, requiredClaims } = constant;
        return <JWTVerifyOptions>{
            audience,
            issuer,
            algorithms: [...algorithms] as string[],
            nbf: true,
            currentDate: new Date(),
            subject: clientId,
            clockTolerance: "1 minutes",
            typ: "jwt",
            requiredClaims,
        };
    }
}

export default TokenFactory;
