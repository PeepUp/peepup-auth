import type { JWTHeaderParameters, JWTPayload, JWTVerifyOptions } from "jose";
import type { Token, TokenTypes } from "@/types/types";
import type {
    GenerateTokenArgs,
    JWTHeader,
    TokenPayloadIdentity,
    TokenPayloadWithIdentity,
} from "@/types/token";

import { cryptoUtils } from "../../common/utils/crypto";
import {
    TokenAlgorithm,
    TokenSID,
    TokenType,
    audience,
    clientId,
    issuer,
    requiredClaims,
} from "../../common/constant";

class TokenFactory {
    static createAccessToken(identity: TokenPayloadIdentity): GenerateTokenArgs {
        return <GenerateTokenArgs>{
            identity,
            ip_address: identity.ip_address,
            device_id: identity.device_id,
            type: TokenType.access,
            expiresIn: Math.floor(new Date().getTime() / 1000 + 1 * 60 * 60),
            algorithm: TokenAlgorithm.RS256,
        };
    }

    static createRefreshToken(identity: TokenPayloadIdentity): GenerateTokenArgs {
        return <GenerateTokenArgs>{
            identity,
            ip_address: identity.ip_address,
            device_id: identity.device_id,
            type: TokenType.refresh,
            expiresIn: Math.floor(new Date().getTime() / 1000 + 1 * 4 * 60 * 60),
            algorithm: TokenAlgorithm.ES256,
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
            sid: TokenSID.active,
            aud: audience,
            iat: Math.floor(Date.now() / 1000),
            nbf: Date.now() / 1000,
            exp: expirationTime,
            iss: issuer,
            sub: clientId,
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
            tokenStatus: TokenSID.active,
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
