/* eslint-disable class-methods-use-this */

import { join } from "path";
import { createPublicKey } from "crypto";
import { mkdirSync, writeFileSync } from "fs";
import * as jose from "jose";
import type {
    JWTHeaderParameters,
    JWTPayload,
    JWTVerifyOptions,
    JoseHeaderParameters,
    JWK,
} from "jose";
import type { CreateTokenArgs, JWTHeader, TokenPayloadProtected } from "@/types/token";
import { fileUtils } from "./utils";
import UnauthorizedException from "../../adapter/middleware/error/unauthorized";
import ForbiddenException from "../../adapter/middleware/error/forbidden-exception";


class JwtToken {
    constructor(
        public keyId: string,
        public payload: JWTPayload,
        public header: JWTHeaderParameters | JoseHeaderParameters | JWTHeader
    ) {}

    public setHeader(header: JWTHeaderParameters): void {
        this.header = header;
    }

    public setPayload(payload: JWTPayload): void {
        this.payload = payload;
    }

    public async createToken(data: CreateTokenArgs): Promise<Readonly<string> | null> {
        const { payload, header, privateKey } = data;

        try {
            const privateKeyImport = await jose.importPKCS8(privateKey, header.alg);

            const signature = await new jose.SignJWT(payload)
                .setAudience(payload.aud as string)
                .setExpirationTime(payload.exp as number)
                .setIssuer(payload.iss as string)
                .setIssuedAt(payload.iat as number)
                .setJti(payload.jti as string)
                .setNotBefore(payload.nbf as number)
                .setProtectedHeader(header)
                .sign(privateKeyImport);

            if (!signature) {
                throw new Error("ErrorJwt: Cannot Create new Token Signature!");
            }

            return signature;
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(error.message);
            }

            return null;
        }
    }

    async buildJWKSPublicKey(kid: string, ecsdaKeyId: string): Promise<void> {
        try {
            const keysDirPath = join(process.cwd(), `/keys`);
            const rsakeysCounter = fileUtils.getFolderNames(`${keysDirPath}/RSA`);
            const ecsdakeysCounter = fileUtils.getFolderNames(`${keysDirPath}/ECSDA`);
            const keysList: JWK[] = [];

            if (rsakeysCounter.length === 0) return;
            if (ecsdakeysCounter.length === 0) return;

            await Promise.all(
                rsakeysCounter.map(async (keyId) => {
                    const publicKeyPath = join(
                        process.cwd(),
                        `/keys/RSA/${keyId}/public.pem.key`
                    );
                    const publicKey = fileUtils.readFile(publicKeyPath, "utf-8");
                    const jwk = await this.JWKFromPEM(publicKey, kid, "RS256");
                    keysList.push(jwk);
                })
            );

            await Promise.all(
                ecsdakeysCounter.map(async (keyId) => {
                    const publicKeyPath = join(
                        process.cwd(),
                        `/keys/ECSDA/${keyId}/public.pem.key`
                    );
                    const publicKey = fileUtils.readFile(publicKeyPath, "utf-8");
                    const jwk = await this.JWKFromPEM(publicKey, ecsdaKeyId, "ES256");

                    keysList.push(jwk);
                })
            );

            const jwksPath = join(process.cwd(), `/public/.well-known/`);

            if (!fileUtils.checkDirectory(jwksPath)) {
                mkdirSync(jwksPath, { recursive: true });
            }

            const jwks = JSON.stringify({ keys: keysList }, null, 2);
            writeFileSync(`${jwksPath}jwks.json`, jwks);
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            }
        }
    }

    public async JWKFromPEM(pemKey: string, keyId: string, alg: string): Promise<JWK> {
        const jwk = await jose.exportJWK(createPublicKey({ key: pemKey, format: "pem" }));

        return {
            ...jwk,
            use: "sig",
            alg,
            kid: keyId,
        };
    }

    public static decodeJwt(token: string): JWTPayload {
        return jose.decodeJwt(token);
    }

    public async verifyJWT(
        token: string,
        publicKey: string,
        algorithm: string,
        options: JWTVerifyOptions,
        identity: TokenPayloadProtected
    ): Promise<boolean> {
        try {
            const publicKeyImport = await jose.importSPKI(publicKey, algorithm);
            const { payload, protectedHeader } = await jose.jwtVerify(
                token,
                publicKeyImport,
                options
            );

            if (!payload || !protectedHeader) {
                throw new ForbiddenException(
                    "Invalid token: Payload or protected header is missing"
                );
            }

            const isValidate = this.validateTokenPayload({
                payload,
                options,
                algorithm,
                identity,
                protectedHeader,
            });

            if (!isValidate) {
                throw new ForbiddenException("Invalid token: Invalid identity token");
            }

            if (payload.id && payload.id !== identity.id) {
                throw new ForbiddenException("Invalid token: Invalid identity token");
            }

            if (payload.resource && payload.resource !== identity.resource) {
                throw new ForbiddenException("Invalid token: Invalid identity token");
            }

            return true;
        } catch (error) {
            console.dir({ error }, { depth: Infinity });

            if (error instanceof jose.errors.JWSInvalid) {
                throw new ForbiddenException("Invalid token: Invalid signature");
            }

            if (error instanceof jose.errors.JOSEError) {
                throw new ForbiddenException(`Invalid token: ${error.message}`);
            }

            if (error instanceof Error) {
                console.error("Error occurred during JWT verification:", error);
                throw new Error(error.message);
            }

            return false;
        }
    }

    public async verifyJWTByJWKS(
        token: string,
        algorithm: string,
        options: JWTVerifyOptions,
        identity: TokenPayloadProtected
    ): Promise<boolean> {
        try {
            const jwks = jose.createRemoteJWKSet(
                new URL("http://127.0.0.1:4334/oauth2/v1/jwks/keys")
            );

            const { payload, protectedHeader } = await jose.jwtVerify(
                token,
                jwks,
                options
            );

            if (!payload || !protectedHeader) {
                throw new ForbiddenException(
                    "Invalid token: Payload or protected header is missing"
                );
            }

            const isValidate = this.validateTokenPayload({
                payload,
                options,
                algorithm,
                identity,
                protectedHeader,
            });

            if (!isValidate) {
                throw new UnauthorizedException(
                    "Invalid token: Invalid identity token all"
                );
            }

            if (payload.id === undefined && payload.id !== identity.id) {
                console.log({ id: payload.id });
                throw new UnauthorizedException(
                    "Invalid token: Invalid identity token id!"
                );
            }

            if (
                payload.resource === undefined &&
                payload.resource !== identity.resource
            ) {
                throw new UnauthorizedException(
                    "Invalid token: Invalid identity token resource"
                );
            }

            return true;
        } catch (error) {
            console.dir({ error }, { depth: Infinity });

            if (error instanceof jose.errors.JWSInvalid) {
                throw new UnauthorizedException("Invalid token: Invalid signature");
            }

            if (error instanceof jose.errors.JOSEError) {
                throw new UnauthorizedException(`Invalid token: ${error.message}`);
            }

            if (error instanceof Error) {
                console.error("Error occurred during JWT verification:", error);
                throw new Error(error.message);
            }

            return false;
        }
    }

    private validateTokenPayload(data: {
        payload: JWTPayload;
        options: JWTVerifyOptions;
        algorithm: string;
        identity: TokenPayloadProtected;
        protectedHeader: JWTHeaderParameters;
    }): boolean {
        const { payload, options, identity, protectedHeader } = data;

        if (payload.jti && payload.jti !== identity.jti) {
            throw new UnauthorizedException("Invalid token: Invalid jti token");
        }

        if (protectedHeader.kid && protectedHeader.kid !== identity.kid) {
            throw new UnauthorizedException("Invalid token: Invalid kid token");
        }

        // Perform additional payload checks/validation
        const currentTimestamp = Math.floor(Date.now() / 1000);

        if (
            protectedHeader.alg &&
            options.algorithms &&
            options.algorithms.includes(protectedHeader.alg) === false
        ) {
            throw new UnauthorizedException("Invalid token: Invalid algorithm");
        }

        if (protectedHeader.typ && protectedHeader.typ !== options.typ) {
            throw new UnauthorizedException("Invalid token: Invalid type");
        }

        // Check expiration time (exp)
        if (payload.exp && payload.exp <= currentTimestamp) {
            throw new UnauthorizedException("Invalid token: Expired");
        }

        // Check not before (nbf)
        if (payload.nbf && payload.nbf > currentTimestamp) {
            throw new UnauthorizedException("Invalid token: Not yet valid");
        }

        // Check audience (aud)
        if (payload.aud && payload.aud !== options.audience) {
            throw new UnauthorizedException("Invalid token: Invalid audience");
        }

        // Check issuer (iss)
        if (payload.iss && payload.iss !== options.issuer) {
            throw new UnauthorizedException("Invalid token: Invalid issuer");
        }

        // Check subject (sub)
        if (payload.sub && payload.sub !== options.subject) {
            throw new UnauthorizedException("Invalid token: Missing subject");
        }

        if (payload.sid && payload.sid !== "active") {
            throw new UnauthorizedException("Invalid token: Expired");
        }

        return true;
    }
}

export default JwtToken;
