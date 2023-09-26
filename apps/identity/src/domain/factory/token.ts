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
import { cryptoUtils } from "@/common/utils/crypto";

class TokenFactory {
    static accessToken(identity: TokenPayloadIdentityReadonly): GenerateTokenArgs {
        return <GenerateTokenArgs>{
            identity,
            ip_address: identity.ip_address,
            device_id: identity.device_id,
            type: constant.TokenType.access,
            expiresIn: Math.floor(new Date().getTime() / 1000 + 1 * 60 * 60),
            algorithm: constant.TokenAlgorithm.RS256,
        };
    }

    static refreshToken(identity: TokenPayloadIdentityReadonly): GenerateTokenArgs {
        return <GenerateTokenArgs>{
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
    ) {
        return <TokenPayloadWithIdentity>{
            type,
            email: identity.email,
            id: identity.id,
            resource: identity.resource,
            sid: constant.TokenSID.active,
            aud: constant.audience,
            iat: Math.floor(Date.now() / 1000),
            nbf: Date.now() / 1000,
            exp: expirationTime,
            iss: constant.issuer,
            sub: constant.clientId,
            jti: cryptoUtils.generateCUID(),
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
