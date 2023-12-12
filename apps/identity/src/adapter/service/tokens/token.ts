/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable class-methods-use-this */

import * as constant from "@/common/constant";

import { join } from "path";

import JwtToken from "@/common/libs/token";
import FileUtil from "@/common/utils/file.util";
import TokenFactory from "@/domain/factory/token";

import JWTException from "@/adapter/middleware/errors/jwt-error";
import UnauthorizedException from "@/adapter/middleware/errors/unauthorized";
import ForbiddenException from "@/adapter/middleware/errors/forbidden-exception";
import BadRequestException from "@/adapter/middleware/errors/bad-request-exception";

import type * as Type from "@/types/types";
import type * as TokenType from "@/types/token";

import type { JWTHeaderParameters, JWTVerifyOptions } from "jose";
import type { PostRefreshTokenParams } from "@/adapter/schema/token";
import type { QueryWhitelistedTokenArgs } from "@/infrastructure/data-source/token.data-source";

/*
 * @TO-DO:
 * ☐ feat: token sidejacking prevention using fingerprint: (reference: https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html)
 *
 *
 * */
export default class TokenManagementService {
    private verifyOptions: JWTVerifyOptions = {};

    private keyId: TokenType.SupportedKeyAlgorithm = <TokenType.SupportedKeyAlgorithm>{};

    constructor(
        private readonly tokenRepository: Type.TokenAccessor,
        private readonly wlTokenRepository: Type.WhiteListedTokenAccessor
    ) {
        this.setupKID();
        this.setupVerifyOptions();
    }

    async getTokenById(jti: Type.ID): Promise<Readonly<Type.Token> | null> {
        return this.tokenRepository.getToken({
            jti: jti as string,
        });
    }

    async generate(data: TokenType.GenerateTokenArgs): Promise<Readonly<Type.Token>> {
        const {
            identity,
            type,
            expiresIn: expirationTime,
            ip_address,
            device_id,
            algorithm: alg,
            fingerprint,
        } = data;

        const kid = this.getKID(alg);
        const jwt = new JwtToken(kid, {}, {});

        const header = TokenFactory.createHeader(alg, kid);
        const payload = TokenFactory.createPayload(identity, type, expirationTime, fingerprint);
        const privateKey = this.getKeyFile({ kid, alg, name: constant.privateKeyFile });
        const signature = await jwt.createToken({ privateKey, payload, header });

        const tokenData = TokenFactory.genereteCompactToken({
            type,
            header,
            payload,
            device_id,
            ip_address,
            expirationTime,
            value: signature,
        });

        const result = await this.saveToken(tokenData, identity.id);
        if (!result) throw new Error("Error: cannot save token");
        return result;
    }

    async saveToken(token: Type.Token, identityId: Type.ID): Promise<Readonly<Type.Token> | null> {
        const data = await this.tokenRepository.saveToken(token, identityId);
        if (!data) throw new Error("Error: cannot save new token in database!");
        return data;
    }

    async getTokenHistories(access_token: string): Promise<Readonly<Type.Token[]> | null> {
        const token = this.splitAuthzHeader(access_token);
        const decode = JwtToken.decodeJwt(token);
        const data = await this.tokenRepository.getTokens(decode.id as string);

        if (!data) return [];

        const result: Readonly<Type.Token>[] = data.filter(
            (t: Type.Token) => t.tokenStatus === constant.TokenStatusType.revoked
        );

        return result;
    }

    async getActiveTokenSessions(
        access_token: string,
        options?: Type.AuthorizationHeaderOptions
    ): Promise<Readonly<Type.Token[]> | null> {
        const token = options?.authorizationHeader
            ? this.splitAuthzHeader(access_token)
            : access_token;

        const decoded: TokenType.DecodedToken = JwtToken.decodeJwt(token);
        const data = await this.wlTokenRepository.findManyByIdentityId(decoded.id);

        if (!data) return [];

        return data.map((t: Type.Token) => ({
            ...t,
            payload: JSON.parse(t.payload as string),
            header: JSON.parse(t.header as string),
        }));
    }

    async getAllTokenSessions(
        access_token: string,
        options?: Type.AuthorizationHeaderOptions
    ): Promise<Readonly<Type.Token[]> | null> {
        const token = options?.authorizationHeader
            ? this.splitAuthzHeader(access_token)
            : access_token;

        const decoded: TokenType.DecodedToken = JwtToken.decodeJwt(token);
        const data = await this.tokenRepository.getTokens(decoded.id as string);

        if (!data) return [];

        return data.map((t: Type.Token) => ({
            ...t,
            payload: JSON.parse(t.payload as string),
            header: JSON.parse(t.header as string),
        }));
    }

    async revokeToken(jti: Type.ID): Promise<boolean> {
        const result = await this.tokenRepository.revokeToken(jti);

        if (!result) {
            throw new Error("Error: cannot revoke token");
        }

        return result !== null;
    }

    decodeToken(token: string): Readonly<TokenType.TokenPayloadIdentity> | null {
        const decode: TokenType.DecodedToken = JwtToken.decodeJwt(token);

        if (!decode) {
            throw new BadRequestException("Error: cannot decode token!");
        }

        return {
            id: decode.id,
            sid: decode.sid,
            jti: decode.jti,
            exp: decode.exp,
            iat: decode.iat,
            iss: decode.iss,
            aud: decode.aud,
            nbf: decode.nbf,
            email: decode.email,
            resource: decode.resource,
            sub: decode.sub,
            type: decode.type,
        } satisfies TokenType.TokenPayloadIdentity;
    }

    async rotateToken(
        params: PostRefreshTokenParams,
        ip_address: string,
        device_id: string,
        fingerprint?: string
    ): Promise<Readonly<Pick<Type.TokenContract, "access_token">>> {
        const { refresh_token } = params;
        const decodedRefreshToken = JwtToken.decodeJwt(refresh_token);

        const tokenJtiAndIdentityId: QueryWhitelistedTokenArgs = {
            tokenId_identityId: {
                tokenId: decodedRefreshToken.jti as string,
                identityId: decodedRefreshToken.id as string,
            },
        };

        const [verifyRefreshToken, tokens] = await Promise.all([
            this.verifyToken(refresh_token, tokenJtiAndIdentityId),
            this.getActiveTokenSessions(decodedRefreshToken.id as string),
        ]);

        if (verifyRefreshToken === null) {
            throw new UnauthorizedException(
                "Error: Refresh or Access token is expired or invalid!"
            );
        }

        if (!tokens || !tokens.length) {
            throw new UnauthorizedException("Error: Token is expired or invalid!");
        }

        const token = tokens.filter(
            (t: Type.Token) =>
                t.type === constant.TokenType.access &&
                t.tokenStatus === constant.TokenStatusType.active &&
                t.jti === decodedRefreshToken.jti &&
                t.id === decodedRefreshToken.id
        )[0];

        if (!token) {
            throw new ForbiddenException("Invalid token: token is expired or invalid");
        }

        const [revokedToken, _deletedTokeninWL] = await Promise.all([
            this.revokeToken(token.jti),
            this.deleteWhitelistedToken(tokenJtiAndIdentityId),
        ]);

        if (!revokedToken) {
            throw new ForbiddenException("Invalid token: token cannot be revoked");
        }

        const { payload: stringPayload, header: stringHeader } = token;
        const payload = await JSON.parse(stringPayload as string);
        const header: JWTHeaderParameters = await JSON.parse(stringHeader as string);

        const identity: TokenType.TokenPayloadIdentity = {
            email: payload.email,
            id: payload.id,
            resource: payload.resource,
        };

        const { value } = await this.generate({
            identity,
            type: constant.TokenType.access,
            algorithm: header.alg,
            expiresIn: constant.ExipirationTime.access,
            device_id,
            ip_address,
        });

        if (!value) {
            throw new Error("Error: cannot generate access token!");
        }

        return { access_token: value };
    }

    async deleteWhitelistedToken(query: QueryWhitelistedTokenArgs): Promise<void> {
        await this.tokenRepository.deleteWhitelistedToken(query);
    }

    async verifyToken(
        token: string,
        query: QueryWhitelistedTokenArgs,
        fingerprint?: string
    ): Promise<Readonly<Type.Token> | null> {
        const jwt = new JwtToken(this.keyId.RS256, {}, {});

        // Get whitelistedTokens from database
        const whitelistedToken = await this.tokenRepository.WhitelistedToken(query);

        if (!whitelistedToken) {
            throw new BadRequestException(
                "Error: Token invalid! Check your token is valid or correct!"
            );
        }

        if (whitelistedToken.tokenStatus !== constant.TokenStatusType.active) {
            throw new UnauthorizedException("Error: Token is no longer active!");
        }

        const { payload, header, jti, kid, ...rest }: Type.ParsedToken =
            await JwtToken.parsedToken(whitelistedToken);

        if (!payload || !header) {
            throw new UnauthorizedException("Invalid token: token is corrupted!");
        }

        const identity = Object.freeze({
            id: rest.identityId,
            resource: payload.resource,
            jti,
            kid,
        });

        const result = await jwt.verifyJWTByJWKS(token, header.alg, this.verifyOptions, identity);

        if (!result || result instanceof Error) {
            /* const relatedToken = await this.getLinkedToken({
                jti: data.jti,
                identityId: data.id,
                device_id: data.device_id as string,
                ip_address: data.ip_address as string,
            });


            if (relatedToken) {
                if (relatedToken.type === TokenType.refresh && relatedToken.jti) {
                    // refresh_token
                    await this.tokenRepository.revokeToken(relatedToken.jti as string);
                    await this.deleteWhitelistedToken({
                        id: relatedToken.id as number,
                        tokenId_identityId: {
                            tokenId: relatedToken.jti as string,
                            identityId: relatedToken.id as string,
                        },
                    });
                }

                // access token
                await this.tokenRepository.revokeToken(data.jti);
                await this.deleteWhitelistedToken({
                    tokenId_identityId: {
                        tokenId: data.jti as string,
                        identityId: data.id as string,
                    },
                });
            } */

            if (result instanceof JWTException) {
                console.log({ errorJWTVERIFY: result });
            }

            throw new UnauthorizedException("Error: Token is invalid!");
        }

        return whitelistedToken;
    }

    async getLinkedToken({
        jti,
        identityId,
        device_id,
        ip_address,
    }: {
        jti?: string;
        identityId?: string;
        device_id?: string;
        ip_address?: string;
    }): Promise<Readonly<Type.Token> | null> {
        const data = await this.tokenRepository.findRelatedTokens({
            device_id: device_id as string,
            ip_address: ip_address as string,
        });

        if (!data) return null;

        return data;
    }

    setupKID(): void {
        const { keysPath } = constant;

        const [ecsdaKeyId] = FileUtil.getDir(join(keysPath, "ECSDA"));
        const [rsa256KeyId] = FileUtil.getDir(join(keysPath, "RSA"));
        this.keyId.RS256 = rsa256KeyId as string;
        this.keyId.ES256 = ecsdaKeyId as string;
    }

    setupVerifyOptions(): void {
        const { audience, issuer, clientId, requiredClaims } = constant;
        this.verifyOptions = {
            audience,
            issuer,
            algorithms: ["RS256", "ES256"],
            currentDate: new Date(),
            subject: clientId,
            clockTolerance: "1 minutes",
            typ: "jwt",
            requiredClaims,
        };
    }

    getKeyFile(data: {
        kid: string;
        alg: constant.TokenAlgorithm | string;
        name: string;
    }): Readonly<string> {
        const { kid, alg, name } = data;
        const path = join(
            process.cwd(),
            "keys",
            alg === constant.TokenAlgorithm.RS256
                ? constant.CertAlgorithm.RSA
                : constant.CertAlgorithm.EC,
            kid,
            name
        );

        const key = FileUtil.readFile({ path });
        if (!key) throw new Error(`Error: cannot read key file, with path: ${path}`);
        return key;
    }

    splitAuthzHeader(value: string): Readonly<string> {
        const split = value.split(" ");

        if (split[0] !== "Bearer") {
            throw new BadRequestException("Error: Header Authorization format invalid!");
        }

        if (!split[1]) {
            throw new BadRequestException("Error: Token invalid!");
        }

        return split[1];
    }

    getKID(alg: constant.TokenAlgorithm | string): string {
        switch (alg) {
            case constant.TokenAlgorithm.RS256 || "RS256":
                return this.keyId.RS256;
            case constant.TokenAlgorithm.ES256 || "ES256":
                return this.keyId.ES256;
            default:
                throw new Error("Error: cannot get or select keyId from given algorithm!");
        }
    }
}
