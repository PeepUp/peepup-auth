
import type { Token } from "@/types/types";
import type { JWTPayload, JWTVerifyOptions } from "jose";
import type { GenerateTokenArgs, TokenPayloadIdentity } from "@/types/token";
import { cryptoUtils } from "../../common/utils/crypto";
import {
    ExipirationTime,
    TokenAlgorithm,
    TokenSID,
    TokenTypeEnum,
    audience,
    clientId,
    issuer,
    requiredClaims,
} from "../../common/constant";

class TokenFactory {
    static createAccessToken(identity: TokenPayloadIdentity): GenerateTokenArgs {
        return <GenerateTokenArgs>{
            identity,
            tokenType: TokenTypeEnum.access,
            expiresIn: ExipirationTime.access,
            algorithm: TokenAlgorithm.RS256,
        };
    }

    static createRefreshToken(identity: TokenPayloadIdentity): GenerateTokenArgs {
        return <GenerateTokenArgs>{
            identity,
            tokenType: TokenTypeEnum.refresh,
            expiresIn: ExipirationTime.refresh,
            algorithm: TokenAlgorithm.ES256,
        };
    }

    static createPayload(identity: TokenPayloadIdentity, expirationTime: number) {
        return <JWTPayload>{
            email: identity.email,
            id: identity.id,
            resource: identity.resource,
            sid: TokenSID.active,
            aud: audience,
            iat: Math.floor(Date.now() / 1000),
            nbf: Math.floor(Date.now() / 1000),
            exp: expirationTime,
            iss: issuer,
            sub: clientId,
            jti: cryptoUtils.generateCUID(),
        };
    }

    static createHeader(alg: string, typ: string, kid: string) {
        return {
            alg,
            typ,
            kid,
        };
    }

    static genereteToken(payload: JWTPayload, header: any, value: string): Token {
        return <Token>{
            nbf: payload.nbf as number,
            kid: header.kid,
            expires_at: payload.exp,
            value,
            tokenTypes: payload.tokenTypes,
            tokenStatus: TokenSID.active,
            createdAt: new Date(),
            jti: payload.jti as string,
            header: JSON.stringify(header),
            payload: JSON.stringify(payload),
            identityId: payload.id,
            expirationTime: new Date((payload.expirationTime as number) * 1000),
        };
    }

    static generateJWTOption(
        algorithms: string[] | string,
        jwtType: string
    ): JWTVerifyOptions {
        return <JWTVerifyOptions>{
            audience,
            issuer,
            algorithms: typeof algorithms === typeof Array ? algorithms : [algorithms],
            currentDate: new Date(),
            subject: clientId,
            maxTokenAge: "1 minutes",
            clockTolerance: "1 minutes",
            typ: jwtType,
            requiredClaims,
        };
    }
}

export default TokenFactory;
