import * as jose from "jose";
import { JWK } from "jose";
import { join } from "path";
import { mkdirSync, writeFileSync } from "fs";
import { createPublicKey, generateKeyPairSync } from "crypto";
import type { JWTHeaderParameters, JWTPayload, JWTVerifyOptions } from "jose";
import { fileUtils } from "./utils";

import type { TokenPayloadIdentity } from "../../adapter/service/token";
import ForbiddenException from "../../adapter/middleware/error/forbidden-exception";

class JOSEToken {
    public static rsakeyId: string;

    public static ecsdakeyId: string;

    public static payload: JWTPayload;

    public static header: JWTHeaderParameters;

    constructor(rsakeyId?: string, ecsdaKeyId?: string) {
        JOSEToken.rsakeyId = <string>rsakeyId;
        JOSEToken.ecsdakeyId = <string>ecsdaKeyId;
    }

    public static generateKeyPairECDSA(keyId: string = this.ecsdakeyId): KeyPair {
        try {
            const { privateKey, publicKey } = generateKeyPairSync("ec", {
                namedCurve: "prime256v1",
                publicKeyEncoding: {
                    type: "spki",
                    format: "pem",
                },
                privateKeyEncoding: {
                    type: "pkcs8",
                    format: "pem",
                },
            });

            const rootDirPath = join(process.cwd(), `/keys/ECSDA`);
            const dirPath = join(process.cwd(), `/keys/ECSDA/${keyId}`);
            const privateKeyPath = join(dirPath, "private.pem.key");
            const publicKeyPath = join(dirPath, "public.pem.key");

            if (
                fileUtils.checkDirectory(rootDirPath) &&
                fileUtils.countFilesAndDirectories(rootDirPath).directories > 5
            ) {
                fileUtils.deleteFolderRecursive(rootDirPath);
            }

            if (!fileUtils.checkDirectory(dirPath)) {
                console.log(`📁 created new directory : ${dirPath}`);
                mkdirSync(dirPath, { recursive: true });
            }

            console.log(`🔑 Keys generated: ${privateKeyPath} and ${publicKeyPath}`);

            writeFileSync(privateKeyPath, privateKey);
            writeFileSync(publicKeyPath, publicKey);

            return { privateKey, publicKey };
        } catch (error) {
            console.log(error);
            return { privateKey: "", publicKey: "" };
        }
    }

    public static generateKeyPair(modulusLength = 4096, keyId = this.rsakeyId): KeyPair {
        try {
            const { privateKey, publicKey } = generateKeyPairSync("rsa", {
                modulusLength,
                publicKeyEncoding: {
                    type: "spki",
                    format: "pem",
                },
                privateKeyEncoding: {
                    type: "pkcs8",
                    format: "pem",
                },
            });

            const rootDirPath = join(process.cwd(), `/keys/RSA`);
            const dirPath = join(process.cwd(), `/keys/RSA/${keyId}`);
            const privateKeyPath = join(dirPath, "private.pem.key");
            const publicKeyPath = join(dirPath, "public.pem.key");

            if (
                fileUtils.checkDirectory(rootDirPath) &&
                fileUtils.countFilesAndDirectories(rootDirPath).directories > 5
            ) {
                fileUtils.deleteFolderRecursive(rootDirPath);
            }

            if (!fileUtils.checkDirectory(dirPath)) {
                console.log(`📁 created new directory : ${dirPath}`);
                mkdirSync(dirPath, { recursive: true });
            }

            console.log(`🔑 Keys generated: ${privateKeyPath} and ${publicKeyPath}`);

            writeFileSync(privateKeyPath, privateKey);
            writeFileSync(publicKeyPath, publicKey);

            return { privateKey, publicKey };
        } catch (error) {
            console.log(error);
            return { privateKey: "", publicKey: "" };
        }
    }

    public static async createJWToken({
        privateKey,
        header,
        payload,
        exiprationTime,
    }: CreateTokenArgs): Promise<string> {
        try {
            if (this.header === undefined) {
                this.header = header;
            }

            if (this.payload === undefined) {
                this.payload = {
                    aud: payload.aud,
                    sub: payload.sub,
                    iss: payload.iss,
                };
            }

            const privateKeyImport = await jose.importPKCS8(privateKey, header.alg);
            const signature = await new jose.SignJWT({
                ...payload,
            })
                .setProtectedHeader({
                    alg: header.alg,
                    typ: "JWT",
                    kid: header.kid,
                })
                .setAudience(<string>payload.aud)
                .setExpirationTime(exiprationTime)
                .setIssuer(<string>payload.iss)
                .setSubject(<string>payload.sub)
                .setIssuedAt(<number>header.iat)
                .sign(privateKeyImport);

            return signature;
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(error.message);
            }

            return "";
        }
    }

    static async buildJWKSPublicKey(): Promise<void> {
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
                    console.log(this.rsakeyId);
                    const jwk = await this.JWKFromPEM(publicKey, this.rsakeyId, "RS256");
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
                    console.log(this.ecsdakeyId);
                    const jwk = await this.JWKFromPEM(
                        publicKey,
                        this.ecsdakeyId,
                        "ES256"
                    );

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

    static async JWKFromPEM(pemKey: string, keyId: string, alg: string): Promise<JWK> {
        const jwk = await jose.exportJWK(createPublicKey({ key: pemKey, format: "pem" }));

        return {
            use: "sig",
            alg,
            kid: keyId,
            ...jwk,
        };
    }

    public static decodeJwt(token: string): JWTPayload {
        return jose.decodeJwt(token);
    }

    public static async verifyJWT(
        token: string,
        publicKey: string,
        algorithm: string,
        options: JWTVerifyOptions,
        identity: TokenPayloadIdentity & { jti: string; kid: string }
    ): Promise<boolean> {
        try {
            const publicKeyImport = await jose.importSPKI(publicKey, algorithm);

            console.log({ identity });

            if (!publicKeyImport) {
                throw new Error("Internal server error: Invalid public key!");
            }

            const { payload, protectedHeader } = await jose.jwtVerify(
                token,
                publicKeyImport,
                options
            );

            if (!payload || !protectedHeader) {
                console.log("Payload or protected header is missing");
                throw new ForbiddenException(
                    "Invalid token: or Payload or protected header is missing"
                );
            }

            const { iat, exp, nbf, aud, iss, jti, sub } = payload;

            console.log(iat, exp, nbf, aud, iss, jti, sub);
            console.log({ payload, protectedHeader });

            const isValidate = this.validateTokenPayload(
                payload,
                options,
                algorithm,
                identity,
                protectedHeader
            );

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

    public static async verifyJWTByJWKS(
        token: string,
        publicKey: string,
        algorithm: string,
        options: JWTVerifyOptions,
        identity: TokenPayloadIdentity & { jti: string; kid: string }
    ): Promise<boolean> {
        try {
            const publicKeyImport = await jose.importSPKI(publicKey, algorithm);
            const jwks = jose.createRemoteJWKSet(
                new URL("http://127.0.0.1:4334/oauth2/v1/jwks/keys")
            );

            if (!publicKeyImport) {
                throw new Error("Internal server error: Invalid public key!");
            }

            const { payload, protectedHeader } = await jose.jwtVerify(
                token,
                jwks,
                options
            );

            if (!payload || !protectedHeader) {
                console.log("Payload or protected header is missing");
                throw new ForbiddenException(
                    "Invalid token: or Payload or protected header is missing"
                );
            }

            const isValidate = this.validateTokenPayload(
                payload,
                options,
                algorithm,
                identity,
                protectedHeader
            );

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

    public static validateTokenPayload(
        payload: JWTPayload,
        options: JWTVerifyOptions,
        algorithm: string,
        identity: TokenPayloadIdentity & { jti: string; kid: string },
        protectedHeader: JWTHeaderParameters
    ): boolean {
        if (payload.jti && payload.jti !== identity.jti) {
            throw new ForbiddenException("Invalid token: Invalid jti token");
        }

        if (protectedHeader.kid && protectedHeader.kid !== identity.kid) {
            throw new ForbiddenException("Invalid token: Invalid kid token");
        }

        // Perform additional payload checks/validation
        const currentTimestamp = Math.floor(Date.now() / 1000);

        // Check issued at time (iat)
        if (payload.iat && payload.iat > currentTimestamp) {
            throw new ForbiddenException("Invalid token: Issued in the future");
        }

        if (
            protectedHeader.alg &&
            options.algorithms &&
            protectedHeader.alg !== algorithm
        ) {
            console.log({ a: protectedHeader.alg, b: options.algorithms });
            throw new ForbiddenException("Invalid token: Invalid algorithm");
        }

        if (protectedHeader.typ && protectedHeader.typ !== options.typ) {
            throw new ForbiddenException("Invalid token: Invalid type");
        }

        // Check expiration time (exp)
        if (payload.exp && payload.exp <= currentTimestamp) {
            throw new ForbiddenException("Invalid token: Expired");
        }

        // Check not before (nbf)
        if (payload.nbf && payload.nbf > currentTimestamp) {
            throw new ForbiddenException("Invalid token: Not yet valid");
        }

        // Check audience (aud)
        if (payload.aud && payload.aud !== options.audience) {
            throw new ForbiddenException("Invalid token: Invalid audience");
        }

        // Check issuer (iss)
        if (payload.iss && payload.iss !== options.issuer) {
            throw new ForbiddenException("Invalid token: Invalid issuer");
        }

        // Check subject (sub)
        if (payload.sub && payload.sub !== options.subject) {
            throw new ForbiddenException("Invalid token: Missing subject");
        }

        if (payload.sid && payload.sid !== "active") {
            throw new ForbiddenException("Invalid token: Expired");
        }

        return true;
    }
}

export interface VerifyTokenArgs {
    publicKey: string;
    privateKey: string;
    algorithm: string;
    token: string;
    issuer?: string;
    audience?: string;
    options?: jose.JWTVerifyOptions;
}

export interface CreateTokenArgs {
    privateKey: string;
    payload: JWTPayload;
    header: JWTHeaderParameters;
    exiprationTime: number;
}

export interface KeyPair {
    privateKey: string;
    publicKey: string;
}

export default JOSEToken;
