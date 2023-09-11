/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable class-methods-use-this */

import { join } from "path";
import type { JWTHeaderParameters, JWTVerifyOptions } from "jose";
import type {
    GenerateTokenArgs,
    TokenPayloadIdentity,
    TokenPayloadWithIdentity,
} from "@/types/token";
import type {
    AuthorizationHeaderOptions,
    ID,
    ParsedToken,
    Token,
    TokenAccessor,
    TokenContract,
    WhiteListedTokenAccessor,
} from "@/types/types";
import type { PostRefreshTokenParams } from "@/adapter/schema/token";
import type { QueryWhitelistedTokenArgs } from "@/infrastructure/data-source/token.data-source";

import JwtToken from "@/common/utils/token";
import * as constant from "@/common/constant";
import * as utils from "@/common/utils/utils";
import TokenFactory from "@/domain/factory/token";
import JWTException from "@/adapter/middleware/error/jwt-error";
import UnauthorizedException from "@/adapter/middleware/error/unauthorized";
import ForbiddenException from "@/adapter/middleware/error/forbidden-exception";
import BadRequestException from "@/adapter/middleware/error/bad-request-exception";

export default class TokenManagementService {
    private rsa256KeyId: string = "";

    private ecsdaKeyId: string = "";

    private verifyOptions: JWTVerifyOptions = {};

    constructor(
        private readonly tokenRepository: TokenAccessor,
        private readonly wlTokenRepository: WhiteListedTokenAccessor
    ) {
        this.setupKID();
        this.setupVerifyOptions();
    }

    async getTokenById(jti: ID): Promise<Readonly<Token> | null> {
        return this.tokenRepository.getToken({
            jti: jti as string,
        });
    }

    async generate(data: GenerateTokenArgs): Promise<Readonly<Token>> {
        const { identity, type, expiresIn, ip_address, device_id, algorithm: alg } = data;
        const kid =
            alg === constant.TokenAlgorithm.RS256 ? this.rsa256KeyId : this.ecsdaKeyId;
        const payload = TokenFactory.createPayload(identity, type, expiresIn);
        const header = TokenFactory.createHeader(alg, kid);
        const jwt = new JwtToken(kid, {}, {});
        const privateKey = this.getKeyFile({
            kid,
            alg,
            name: constant.privateKeyFile,
        });

        const token = await jwt.createToken({
            privateKey,
            payload,
            header,
        });

        if (!token) throw new Error("Error: failed create token!");

        const tokenData = TokenFactory.genereteToken(
            token,
            payload,
            header,
            type,
            expiresIn,
            device_id,
            ip_address
        );

        const result = await this.saveToken(tokenData, identity.id);

        if (!result) throw new Error("Error: cannot save token");

        return result;
    }

    async saveToken(token: Token, identityId: ID): Promise<Readonly<Token> | null> {
        const data = await this.tokenRepository.saveToken(token, identityId);
        return data;
    }

    async saveTokens(tokens: Token[], identityId: ID): Promise<Readonly<Token> | null> {
        throw new Error("Method not implemented.");
    }

    async saveTokensToWhitelist(
        tokens: Token | Token[],
        identityId: ID
    ): Promise<Readonly<Token> | null> {
        console.log(tokens);
        throw new Error("Method not implemented.");
    }

    async saveTokenToWhitelist(
        token: Token,
        identityId: ID
    ): Promise<Readonly<Token> | null> {
        throw new Error("Method not implemented.");
    }

    async getTokenHistories(access_token: string): Promise<Readonly<Token[]> | null> {
        const token = this.splitAuthzHeader(access_token);
        const decode = JwtToken.decodeJwt(token);
        const data = await this.tokenRepository.getTokens(decode.id as string);

        if (!data) return [];

        const result: Readonly<Token>[] = data.filter(
            (t: Token) => t.tokenStatus === constant.TokenStatusType.revoked
        );

        return result;
    }

    async getTokenSessions(
        access_token: string,
        options?: AuthorizationHeaderOptions
    ): Promise<Readonly<Token[]> | null> {
        let data = null;

        if (options && options?.authorizationHeader) {
            data = await this.wlTokenRepository.findManyByIdentityId(
                JwtToken.decodeJwt(this.splitAuthzHeader(access_token)).id as string
            );
        }

        if (!data) return [];

        return data.map((t: Token) => ({
            ...t,
            payload: JSON.parse(t.payload as string),
            header: JSON.parse(t.header as string),
        }));
    }

    async revokeToken(jti: ID): Promise<boolean> {
        const result = await this.tokenRepository.revokeToken(jti);

        if (!result) {
            throw new Error("Error: cannot revoke token");
        }

        return result !== null;
    }

    async decodeToken(token: string): Promise<Readonly<TokenPayloadWithIdentity> | null> {
        const decode = JwtToken.decodeJwt(token);

        return <TokenPayloadWithIdentity>{
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
        };
    }

    async rotateToken(
        params: PostRefreshTokenParams,
        ip_address: string,
        device_id: string
    ): Promise<Readonly<Pick<TokenContract, "access_token">>> {
        const { refresh_token } = params;
        const decodeRefreshToken = JwtToken.decodeJwt(refresh_token);
        console.log({ decode: decodeRefreshToken });

        if (!decodeRefreshToken) {
            throw new ForbiddenException("Error: Token invalid!");
        }

        const tokenJtiAndIdentityId: QueryWhitelistedTokenArgs = {
            tokenId_identityId: {
                tokenId: decodeRefreshToken.jti as string,
                identityId: decodeRefreshToken.id as string,
            },
        };

        const [verifyRefreshToken, tokens] = await Promise.all([
            this.verifyToken(refresh_token, tokenJtiAndIdentityId),
            this.getTokenSessions(decodeRefreshToken.id as string),
        ]);

        console.log({ verifyRefreshToken });

        if (!tokens || !tokens.length) {
            throw new UnauthorizedException("Error: Token is expired or invalid!");
        }

        const token = tokens.filter(
            (t: Token) =>
                t.type === constant.TokenType.access &&
                t.tokenStatus === constant.TokenStatusType.active &&
                t.jti === decodeRefreshToken.jti &&
                t.id === decodeRefreshToken.id
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

        const identity: TokenPayloadIdentity = {
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
        query: QueryWhitelistedTokenArgs
    ): Promise<Readonly<Token> | null> {
        const jwt = new JwtToken(this.rsa256KeyId, {}, <JWTHeaderParameters>{});

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

        const { payload, header, jti, kid }: ParsedToken =
            await jwt.parsedToken(whitelistedToken);

        if (!payload || !header) {
            throw new UnauthorizedException("Invalid token: token is corrupted!");
        }

        const identity = Object.freeze({
            email: payload.email,
            id: payload.id,
            resource: payload.resource,
            jti,
            kid,
        });

        const result = await jwt.verifyJWTByJWKS(
            token,
            header.alg,
            this.verifyOptions,
            identity
        );

        if (!result || result instanceof Error) {
            /* const relatedToken = await this.getLinkedToken({
                jti: data.jti,
                identityId: data.id,
                device_id: data.device_id as string,
                ip_address: data.ip_address as string,
            });

            console.log({ relatedToken });
            console.log({ access_token: data });

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

    // eslint-disable-next-line class-methods-use-this

    async getLinkedToken({
        jti,
        identityId,
        device_id,
        ip_address,
    }: {
        jti?: string;
        identityId?: string | ID;
        device_id?: string;
        ip_address?: string;
    }): Promise<Readonly<Token> | null> {
        console.log({ jti, identityId, device_id, ip_address });

        const data = await this.tokenRepository.findRelatedTokens({
            device_id: device_id as string,
            ip_address: ip_address as string,
        });

        console.log({ whitelistedToken: data });

        if (!data) {
            return null;
        }

        return data;
    }

    setupKID(): void {
        const { keysPath } = constant;
        const isRSADirectoryExist = utils.fileUtils.checkDirectory(join(keysPath, "RSA"));
        const isECSDADirectoryExist = utils.fileUtils.checkDirectory(
            join(keysPath, "ECSDA")
        );

        if (isRSADirectoryExist && isECSDADirectoryExist) {
            const [ecsdaKeyId] = utils.fileUtils.getFolderNames(join(keysPath, "ECSDA"));
            const [rsa256KeyId] = utils.fileUtils.getFolderNames(join(keysPath, "RSA"));
            this.rsa256KeyId = <string>rsa256KeyId;
            this.ecsdaKeyId = <string>ecsdaKeyId;
        }
    }

    setupVerifyOptions(): void {
        const { audience, issuer, clientId, requiredClaims } = constant;
        this.verifyOptions = {
            audience,
            issuer,
            algorithms: ["RS256"],
            currentDate: new Date(),
            subject: clientId,
            maxTokenAge: "1 hours",
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

        const key = utils.fileUtils.readFile(path, "utf-8");

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
}
