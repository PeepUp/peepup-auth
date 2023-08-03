import { join } from "path";
import type { JWTHeaderParameters } from "jose";
import type { ID, Token, TokenAccessor, TokenContract } from "@/types/types";
import type { GenerateTokenArgs, JWTHeader, TokenPayloadIdentity } from "@/types/token";
import { TokenTypes } from "@prisma/client";
import JwtToken from "../../common/utils/token";
import TokenFactory from "../../domain/factory/token";
import { fileUtils } from "../../common/utils/utils";
import ForbiddenException from "../middleware/error/forbidden-exception";
import {
    CertAlgorithm,
    TokenAlgorithm,
    ExipirationTime,
    privateKeyFile,
    keysPath,
    requiredClaims,
    audience,
    clientId,
    issuer,
} from "../../common/constant";

import type { PostRefreshTokenParams } from "../schema/token";
import type { QueryWhitelistedTokenArgs } from "../../infrastructure/data-source/token.data-source";

export default class TokenManagementService {
    private rsa256KeyId: string = "";

    private ecsdaKeyId: string = "";

    constructor(private readonly tokenRepository: TokenAccessor) {
        this.setupKID();
    }

    async generateToken(data: GenerateTokenArgs): Promise<Readonly<Token>> {
        const { identity, type, expiresIn, algorithm } = data;
        const keyId =
            algorithm === TokenAlgorithm.RS256 ? this.rsa256KeyId : this.ecsdaKeyId;
        const jwt = new JwtToken(keyId, {}, <JWTHeaderParameters>{});
        const expirationTime = expiresIn;
        const path = join(
            process.cwd(),
            "keys",
            algorithm === TokenAlgorithm.RS256 ? CertAlgorithm.RSA : CertAlgorithm.EC,
            keyId,
            privateKeyFile
        );

        const privateKey = fileUtils.readFile(path, "utf-8");

        const identityPayload = Object.freeze({
            email: identity.email,
            id: identity.id,
            resource: identity.resource,
        });

        const payload = TokenFactory.createPayload(identityPayload, type, expirationTime);
        const header = TokenFactory.createHeader(algorithm, keyId);

        const createdToken = await jwt.createJWToken({
            privateKey,
            payload,
            header,
        });

        if (!createdToken) throw new Error("Error: cannot create token");

        const existingToken = await this.tokenRepository.WhitelistedToken({
            tokenId_identityId: {
                tokenId: payload.jti,
                identityId: identity.id,
            },
        });

        /*
         *  Figure out how to handle if token already exists
         *
         *  TODO:
         */
        if (existingToken) throw new Error("Error: token already exists");

        const result = await this.addTokenToWhiteList(
            TokenFactory.genereteToken(
                payload,
                header,
                TokenTypes.access,
                createdToken,
                ExipirationTime.access
            ),
            identity.id
        );

        if (!result) throw new Error("Error: cannot save token");

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

    async rotateToken(
        params: PostRefreshTokenParams
    ): Promise<Readonly<Pick<TokenContract, "access_token">>> {
        const { refresh_token: token } = params;
        const decode = JwtToken.decodeJwt(token);

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

        const data = tokenInDatabase.filter(
            (t: Token) => t.type === "access" && t.tokenStatus === "active"
        )[0];

        if (!data) {
            throw new ForbiddenException("Invalid token: token is expired or invalid");
        }

        const [revokedToken] = await Promise.all([
            this.revokeToken(data.jti),
            this.deleteTokenInWhiteListed({
                tokenId_identityId: {
                    tokenId: <string>data.jti,
                    identityId: <string>data.identityId,
                },
            }),
        ]);

        if (!revokedToken) {
            throw new ForbiddenException("Invalid token: token cannot be revoked");
        }

        const { tokenStatus, payload, header } = data;

        if (tokenStatus !== "active") {
            throw new ForbiddenException("Invalid token: token is expired or invalid!");
        }

        const jsonPayload: TokenPayloadIdentity = await JSON.parse(payload as string);
        const jsonHeader = await JSON.parse(header as string);

        const identity: TokenPayloadIdentity = {
            email: jsonPayload.email,
            id: jsonPayload.id,
            resource: jsonPayload.resource,
        };

        const accessToken = await this.generateToken({
            identity,
            type: TokenTypes.access,
            algorithm: jsonHeader.alg,
            expiresIn: ExipirationTime.access,
        });

        if (!accessToken) {
            throw new Error("Error: cannot generate access token!");
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
        const jwt = new JwtToken(this.rsa256KeyId, {}, <JWTHeaderParameters>{});

        const data = await this.tokenRepository.WhitelistedToken(query);

        if (!data) {
            throw new ForbiddenException("Invalid token: token is invalid");
        }

        const { payload: stringPayload, header: stringHeader } = data;
        const payload: TokenPayloadIdentity = await JSON.parse(
            JSON.stringify(stringPayload)
        );

        const header: JWTHeader = await JSON.parse(JSON.stringify(stringHeader));

        if (!payload || !header) {
            throw new ForbiddenException("Invalid token: token is corrupted!");
        }

        const identity = Object.freeze({
            email: payload.email,
            id: payload.id,
            resource: payload.resource,
            jti: data.jti,
            kid: data.kid,
        });

        const options = {
            audience,
            issuer,
            algorithms: ["RS256"],
            currentDate: new Date(),
            subject: clientId,
            maxTokenAge: "1 hours",
            clockTolerance: "1 minutes",
            typ: "jwt",
            nbf: true,
            requiredClaims,
        };

        const result = await jwt.verifyJWTByJWKS(token, header.alg, options, identity);

        if (!result) {
            throw new ForbiddenException("Invalid token: verification failed");
        }

        return data;
    }

    // eslint-disable-next-line class-methods-use-this
    async getTokenHistories(): Promise<Readonly<Token[]> | null> {
        throw new Error("Method not implemented!");
    }

    setupKID(): void {
        const isRSADirectoryExist = fileUtils.checkDirectory(join(keysPath, "RSA"));
        const isECSDADirectoryExist = fileUtils.checkDirectory(join(keysPath, "ECSDA"));

        if (isRSADirectoryExist && isECSDADirectoryExist) {
            const [ecsdaKeyId] = fileUtils.getFolderNames(join(keysPath, "ECSDA"));
            const [rsa256KeyId] = fileUtils.getFolderNames(join(keysPath, "RSA"));
            this.rsa256KeyId = <string>rsa256KeyId;
            this.ecsdaKeyId = <string>ecsdaKeyId;
        }
    }
}
