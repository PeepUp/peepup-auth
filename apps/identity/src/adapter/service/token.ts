import { join } from "path";
import type { JWTPayload, JWTVerifyOptions } from "jose";
import { fileUtils } from "../../common";
import JOSEToken from "../../common/token.util";
import { cryptoUtils } from "../../common/crypto";
import { Identity } from "../../domain/entity/identity";

import type { AccessInfo, ID, Token, TokenAccessor, TokenTypes } from "@/types/types";
import { QueryWhitelistedTokenArgs } from "../../infrastructure/data-source/token.data-source";
import {
    audience,
    clientId,
    issuer,
    jwtType,
    privateKeyFile,
    publicKeyFile,
    requiredClaims,
} from "../../common/constant";
import ForbiddenException from "../middleware/error/forbidden-exception";
import { PostRefreshTokenParams } from "../schema/token";

export type TokenPayloadIdentity = Pick<Identity, "email" | "id"> &
    Pick<AccessInfo, "resource">;

export type LoginToken = {
    access_token: string;
    refresh_token: string;
};

export type GenerateTokenArgs = {
    identity: TokenPayloadIdentity;
    tokenType: TokenTypes;
    algorithm: string;
    expiresIn: number;
};

export default class TokenManagementService {
    constructor(private readonly tokenRepository: TokenAccessor) {}

    async generateToken(data: GenerateTokenArgs): Promise<Readonly<Token>> {
        const { identity, tokenType, expiresIn, algorithm } = data;
        const { rsakeyId, ecsdakeyId } = JOSEToken;

        const keyId = algorithm === "RS256" ? rsakeyId : ecsdakeyId;
        const expirationTime =
            expiresIn ?? Math.floor(Date.now() / 1000) + 24 * 60 * 60 * 1000;

        const path = join(
            process.cwd(),
            "keys",
            algorithm === "RS256" ? "RSA" : "ECSDA",
            keyId,
            privateKeyFile
        );

        const privateKey = fileUtils.readFile(path, "utf-8");

        const payload: JWTPayload = {
            email: identity.email,
            id: identity.id,
            resource: identity.resource,
            sid: "active",
            aud: audience,
            iat: Math.floor(Date.now() / 1000),
            nbf: Math.floor(Date.now() / 1000),
            exp: expirationTime,
            iss: issuer,
            sub: clientId,
            jti: cryptoUtils.generateCUID(),
        };

        const header = {
            alg: algorithm,
            typ: tokenType,
            kid: keyId,
        };

        let createdToken;

        if (algorithm === "ES256") {
            createdToken = await JOSEToken.createJWToken({
                privateKey,
                payload,
                header,
                exiprationTime: expiresIn,
            });
        } else if (algorithm === "RS256") {
            createdToken = await JOSEToken.createJWToken({
                privateKey,
                payload,
                header,
                exiprationTime: expiresIn,
            });
        }

        const signingToken: Token = {
            nbf: <number>payload.nbf,
            kid: header.kid,
            expires_at: expirationTime,
            value: <string>createdToken,
            tokenTypes: tokenType,
            tokenStatus: "active",
            createdAt: new Date(),
            jti: <string>payload.jti,
            header: JSON.stringify(header),
            payload: JSON.stringify(payload),
            identityId: <string>identity.id,
            expirationTime: new Date(expirationTime * 1000),
        };

        const result = await this.tokenRepository.saveToken(
            signingToken,
            <ID>identity.id
        );

        if (!result) {
            throw new Error("Error: cannot save token");
        }

        return result;
    }

    async generateTokenFromRefreshToken(
        params: PostRefreshTokenParams
    ): Promise<Readonly<Token>> {
        const { refresh_token: token } = params;
        const decode = JOSEToken.decodeJwt(token);

        if (!decode) {
            throw new ForbiddenException("Invalid token: token is expired or invalid");
        }

        const verifyToken = await this.verifyToken(token, {
            tokenId_identityId: {
                tokenId: <string>decode.jti,
                identityId: <string>decode.id,
            },
        });

        if (!verifyToken) {
            throw new ForbiddenException("Invalid token: token is expired or invalid");
        }

        const data = await this.tokenRepository.WhitelistedToken({
            tokenId_identityId: {
                tokenId: <string>decode.jti,
                identityId: <string>decode.id,
            },
        });

        if (!data) {
            throw new ForbiddenException("Invalid token: token is expired or invalid");
        }

        throw new Error("Method not implemented.");
    }

    async verifyToken(
        token: string,
        query: QueryWhitelistedTokenArgs
    ): Promise<Readonly<Token> | null> {
        const data = await this.tokenRepository.WhitelistedToken(query);

        if (!data) {
            throw new ForbiddenException("Invalid token: token is expired or invalid");
        }

        const { payload, header } = data;
        const { rsakeyId } = JOSEToken;

        const jsonPayload: TokenPayloadIdentity = await JSON.parse(<string>payload);
        const jsonHeader = await JSON.parse(<string>header);

        const path = join(
            process.cwd(),
            "keys",
            jsonHeader.alg === "RS256" ? "RSA" : "ECSDA",
            rsakeyId,
            publicKeyFile
        );

        const publicKey = fileUtils.readFile(path, "utf-8");

        const options: JWTVerifyOptions = {
            audience,
            issuer,
            algorithms: [jsonHeader.alg],
            currentDate: new Date(),
            subject: clientId,
            maxTokenAge: "1 hours",
            typ: jwtType,
            requiredClaims,
        };

        const identity = {
            email: jsonPayload.email,
            id: jsonPayload.id,
            resource: jsonPayload.resource,
            jti: data.jti,
            kid: data.kid,
        };

        const result = await JOSEToken.verifyJWTByJWKS(
            token,
            publicKey,
            jsonHeader.alg,
            options,
            identity
        );

        if (!result) {
            throw new ForbiddenException("Invalid token: verification failed");
        }

        return data;
    }
}
