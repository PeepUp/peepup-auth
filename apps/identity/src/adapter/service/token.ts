import { join } from "path";
import type { JWTPayload } from "jose";
import type { AccessInfo, ID, Token, TokenAccessor } from "@/types/types";
import { fileUtils } from "../../common";
import JOSEToken from "../../common/token.util";
import { Identity } from "../../domain/entity/identity";

export type TokenPayloadIdentity = Pick<Identity, "email" | "id"> &
    Pick<AccessInfo, "resource">;

export default class TokenManagementService {
    constructor(private readonly tokenRepository: TokenAccessor) {}

    async generateToken(
        identity: TokenPayloadIdentity,
        tokenType: string
    ): Promise<Readonly<Token>> {
        const keyId = "2b3dbb78b05b682704aeafdc44df35c30031661ad0ac8069c3b4eb5063cb52e9";
        const path = join(process.cwd(), "keys", keyId, "private.pem.key");
        const privateKey = fileUtils.readFile(path, "utf-8");
        const clientId = process.env.CLIENT_ID ?? "dofavourMobileApp";
        const expirationTime = Math.floor(Date.now() / 1000) + 30 * 60;

        const payload: JWTPayload = {
            email: identity.email,
            id: identity.id,
            resource: identity.resource,
            aud: process.env.AUDIENCE ?? "https://dofavour.com",
            alg: "RS256",
            exp: expirationTime,
            iss: process.env.ISSUER ?? "https://api.dofavour.com",
            sub: clientId,
            jti: "123",
        };

        const header = {
            alg: "RS256",
            typ: tokenType,
            kid: keyId,
        };

        const createdToken = await JOSEToken.createJWToken({
            privateKey,
            payload,
            header,
            exiprationTime: expirationTime,
        });

        const signingToken: Token = {
            value: createdToken,
            tokenStatus: "active",
            tokenTypes: "access",
            kid: header.kid,
            header: JSON.stringify(header),
            jti: <string>payload.jti,
            nbf: 123,
            expires_at: 123,
            payload: JSON.stringify(payload),
            expirationTime: new Date(expirationTime * 1000),
            identityId: <string>identity.id,
            createdAt: new Date(),
        };

        const data = await this.tokenRepository.saveToken(signingToken, <ID>identity.id);

        if (!data) {
            throw new Error("Error: cannot save token");
        }

        return data;
    }
}
