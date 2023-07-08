import { join } from "path";

import type { JWTPayload, JWTVerifyOptions } from "jose";
import type { AccessInfo, ID, Token, TokenAccessor, TokenTypes } from "@/types/types";
import { fileUtils } from "../../common/utils/utils";
import JOSEToken from "../../common/utils/token.util";
import { cryptoUtils } from "../../common/utils/crypto";
import ForbiddenException from "../middleware/error/forbidden-exception";
import {
    audience,
    clientId,
    issuer,
    jwtType,
    privateKeyFile,
    publicKeyFile,
    requiredClaims,
} from "../../common/constant";

import type { PostRefreshTokenParams } from "../schema/token";
import type { QueryWhitelistedTokenArgs } from "../../infrastructure/data-source/token.data-source";
import type { Identity } from "../../domain/entity/identity";

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

        if (!createdToken) {
            throw new Error("Error: cannot create token");
        }

        const existingToken = await this.tokenRepository.WhitelistedToken({
            tokenId_identityId: {
                tokenId: payload.jti,
                identityId: identity.id,
            },
        });

        if (existingToken) {
            throw new Error("Error: token already exists");
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

        const result = await this.addTokenToWhiteList(signingToken, <ID>identity.id);

        if (!result) {
            throw new Error("Error: cannot save token");
        }

        return result;
    }

    async addTokenToWhiteList(
        token: Token,
        identityId: ID
    ): Promise<Readonly<Token> | null> {
        const data = await this.tokenRepository.saveToken(token, identityId);
        return data;
    }

    async allWhiteListedToken(identityId: ID): Promise<Readonly<Token[]> | null> {
        const data = await this.tokenRepository.getAllWhiteListedToken(identityId);

        if (!data) {
            throw new ForbiddenException("Invalid token: token is expired or invalid");
        }

        return data;
    }

    async revokeToken(jti: ID): Promise<boolean> {
        const result = await this.tokenRepository.revokeToken(jti);

        if (!result) {
            throw new Error("Error: cannot revoke token");
        }

        return result !== null;
    }

    async generateTokenFromRefreshToken(
        params: PostRefreshTokenParams
    ): Promise<Readonly<{ access_token: string }>> {
        const { refresh_token: token } = params;
        const decode = JOSEToken.decodeJwt(token);

        if (!decode) {
            throw new ForbiddenException("Invalid token: token is expired or invalid");
        }

        // verify token using decode jti and id
        await this.verifyToken(token, {
            tokenId_identityId: {
                tokenId: <string>decode.jti,
                identityId: <string>decode.id,
            },
        });

        // check token in database
        const tokenInDatabase = await this.allWhiteListedToken(<string>decode.id);

        if (!tokenInDatabase) {
            throw new ForbiddenException("Invalid token: token is expired or invalid");
        }

        const data = tokenInDatabase.filter((t: Token) => t.tokenTypes === "access")[0];

        await this.revokeToken(data.jti);

        await this.deleteTokenInWhiteListed({
            tokenId_identityId: {
                tokenId: <string>data.jti,
                identityId: <string>data.identityId,
            },
        });

        const { tokenStatus, payload, header } = data;

        if (tokenStatus !== "active") {
            throw new ForbiddenException("Invalid token: token is expired or invalid");
        }

        const jsonPayload: TokenPayloadIdentity = await JSON.parse(<string>payload);
        const jsonHeader = await JSON.parse(<string>header);

        const identity: TokenPayloadIdentity = {
            email: jsonPayload.email,
            id: jsonPayload.id,
            resource: jsonPayload.resource,
        };

        const accessToken = await this.generateToken({
            identity,
            tokenType: "access",
            algorithm: jsonHeader.alg,
            expiresIn: Math.floor(Date.now() / 1000) + 24 * 60 * 60 * 1000,
        });

        if (!accessToken) {
            throw new Error("Error: cannot generate access token");
        }

        return { access_token: accessToken.value };
    }

    async deleteTokenInWhiteListed(query: QueryWhitelistedTokenArgs): Promise<void> {
        await this.tokenRepository.deleteTokenInWhiteListed(query);
    }

    async verifyToken(
        token: string,
        query: QueryWhitelistedTokenArgs
    ): Promise<Readonly<Token> | null> {
        const { rsakeyId } = JOSEToken;
        const data = await this.tokenRepository.WhitelistedToken(query);

        if (!data) {
            throw new ForbiddenException("Invalid token: token is expired or invalid");
        }

        const { payload, header } = data;
        const jsonPayload: TokenPayloadIdentity = await JSON.parse(<string>payload);
        const jsonHeader = await JSON.parse(<string>header);

        const path = join(
            process.cwd(),
            "keys",
            jsonHeader.alg === "RS256" ? "RSA" : "ECSDA",
            jsonHeader.kid === rsakeyId ? rsakeyId : jsonHeader.kid,
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
