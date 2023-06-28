import { createPrivateKey, createPublicKey, generateKeyPairSync } from "crypto";
import { mkdirSync, writeFile, writeFileSync } from "fs";
import * as jose from "jose";
import { JWK } from "jose";
import { join } from "path";
import { config } from "../application";

import { cryptoUtils } from "./crypto";
import { fileUtils } from "./utils";

import type { JWTHeaderParameters, JWTPayload } from "jose";

type KeyFormat = "jwk" | "pkcs8" | "raw" | "spki";
type KeyEncodingFornat = "pem" | "der";

class JOSEToken {
    public static keyId: string = cryptoUtils.generateRandomSHA256(32);

    constructor(public issuer: string) {}

    public static generateKeyPair(modulusLength = 4096, keyId = this.keyId): KeyPair {
        try {
            const { privateKey, publicKey } = generateKeyPairSync("rsa", {
                modulusLength: modulusLength,
                publicKeyEncoding: {
                    type: "pkcs1",
                    format: "pem",
                },
                privateKeyEncoding: {
                    type: "pkcs8",
                    format: "pem",
                },
            });

            const rootDirPath = join(process.cwd(), `/keys`);
            const dirPath = join(process.cwd(), `/keys/${keyId}`);
            const privateKeyPath = join(dirPath, "private.pem.key");
            const publicKeyPath = join(dirPath, "public.pem.key");

            if (fileUtils.countFilesAndDirectories(rootDirPath).directories > 5) {
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

    static async signClaims(
        subject: string,
        privateKey: string,
        algorithm: string,
        issuer: string,
        payload: object
    ): Promise<string> {
        const privateKeyImport = await jose.importPKCS8(privateKey, algorithm);

        const jws = await new jose.CompactSign(
            new TextEncoder().encode(
                JSON.stringify({
                    ...payload,
                    sub: subject,
                    iss: issuer,
                })
            )
        )
            .setProtectedHeader({ alg: "RS256" })
            .sign(privateKeyImport);

        return jws;
    }

    static async createJWToken({
        privateKey,
        algorithm,
        payload,
        exiprationTime,
    }: CreateTokenArgs): Promise<string> {
        try {
            const privateKeyImport = await jose.importPKCS8(privateKey, algorithm);

            const signature = await new jose.SignJWT({
                ...payload,
                aud: "urn:example:client",
            })
                .setProtectedHeader({ alg: "RS256", typ: "JWT", kid: this.keyId })
                .setAudience("urn:example:client")
                .setExpirationTime("2h")
                .setIssuer(
                    `urn:server-1:${config.config.environment.host}:${config.config.environment.port}`
                )
                .setSubject("urn:example:subject")
                .setIssuedAt()
                .sign(privateKeyImport);

            console.log(signature);
            return signature;
        } catch (error) {
            console.log(error);
            return "";
        }
    }

    static async buildJWKSPublicKey(publicKey: string): Promise<void> {
        try {
            const keysDirPath = join(process.cwd(), `/keys`);
            const keysCounter = fileUtils.getFolderNames(keysDirPath);
            let keysList: JWK[] = [];

            if (keysCounter.length === 0) return;

            await Promise.all(
                keysCounter.map(async (keyId) => {
                    const publicKeyPath = join(
                        process.cwd(),
                        `/keys/${keyId}/public.pem.key`
                    );
                    const publicKey = fileUtils.readFile(publicKeyPath, "utf-8");
                    const jwk = await this.JWKFromPEM(publicKey);
                    keysList.push(jwk);
                })
            );

            const jwksPath = join(process.cwd(), `/public/.well-known/`);

            if (!fileUtils.checkDirectory(jwksPath)) {
                console.log(`📁 created new directory: ${jwksPath}`);
                mkdirSync(jwksPath, { recursive: true });
            }

            const jwks = JSON.stringify({ keys: keysList }, null, 2);
            writeFileSync(jwksPath + "jwks.json", jwks);
            console.log("jwks.json file created successfully.");
        } catch (error) {
            console.log(error);
        }
    }

    static async JWKFromPEM(pemKey: string): Promise<JWK> {
        const jwk = await jose.exportJWK(createPublicKey({ key: pemKey, format: "pem" }));
        return {
            use: "sig",
            alg: "RS256",
            kid: this.keyId,
            ...jwk,
        };
    }

    static async createToken({
        publicKey,
        privateKey,
        algorithm,
        payload,
        header,
        exiprationTime,
    }: CreateTokenArgs): Promise<string> {
        const privateKeyImport = await jose.importPKCS8(privateKey, algorithm);
        const publicKeyImport = await jose.importSPKI(publicKey, algorithm);

        /*  const encryptedPayload = await new jose.CompactEncrypt(
         new TextEncoder().encode(JSON.stringify(payload))
      )
         .setProtectedHeader({
            alg: "RSA-OAEP-256",
            enc: "A256GCM",
         })
         .encrypt(publicKeyImport); */

        const token = await new jose.SignJWT({
            ...payload,
            aud: "urn:client-1",
        })
            .setProtectedHeader({ alg: "RS256" })
            .setIssuedAt()
            .setIssuer(
                `urn:server-1:${config.config.environment.host}:${config.config.environment.port}`
            )
            .setAudience("urn:client-1")
            .setSubject("urn:example:subject")
            .setExpirationTime(exiprationTime)
            .sign(privateKeyImport);

        return token;
    }

    public static async verifyAndValidateJWT(
        jwtToken: string,
        publicKey: string,
        options?: jose.JWTVerifyOptions
    ): Promise<boolean> {
        try {
            const JWKS = jose.createRemoteJWKSet(
                new URL("http://127.0.0.1:4334/oauth2/v1/certs")
            );
            const publicKeyImport = await jose.importSPKI(publicKey, "RS256");

            const { payload, protectedHeader } = await jose.jwtVerify(
                jwtToken,
                publicKeyImport,
                options
            );

            const { iat, exp, nbf, aud, iss, jti, sub } = payload;

            console.log(payload, protectedHeader);

            // Validate 'not before' and 'expiration' claims
            const currentTime = Math.floor(Date.now() / 1000);
            if (nbf && currentTime < nbf) {
                console.log("Token is not yet valid");
                return false;
            }
            if (exp && currentTime >= exp) {
                console.log("Token has expired");
                return false;
            }

            // Additional validation logic for other claims

            return true;
        } catch (error) {
            console.error("Error occurred during JWT verification:", error);
            return false;
        }
    }

    static async verificationToken({
        privateKey,
        publicKey,
        algorithm,
        token,
        issuer = "urn:server-1:" +
            `${config.config.environment.host}:${config.config.environment.port}`,
        audience = "urn:example:audience",
        options,
    }: VerifyTokenArgs): Promise<{
        payload: JWTPayload;
        header: JWTHeaderParameters;
    }> {
        if (!publicKey || !algorithm || !token) {
            throw new Error("Invalid input parameters");
        }

        try {
            const publicKeyImport = await jose.importSPKI(publicKey, algorithm);

            const { payload, protectedHeader } = await jose.jwtVerify(
                token,
                publicKeyImport,
                options
            );

            if (!payload || !protectedHeader) {
                throw new Error("Invalid token: Missing payload or header");
            }

            if (payload.expiresAt && <number>payload.exp < Date.now() / 1000) {
                throw new Error("Invalid token: Token has expired");
            }

            return { payload, header: protectedHeader };
        } catch (error) {
            console.error(error);
            throw new Error("Token verification failed");
        }
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
    publicKey: string;
    privateKey: string;
    algorithm: string;
    payload: JWTPayload;
    header: JWTHeaderParameters;
    exiprationTime: string | number;
}

export interface KeyPair {
    privateKey: string;
    publicKey: string;
}

export default JOSEToken;

// class JsonWebKey {
//    public kty: string;
//    public kid: string;
//    public use: string;
//    public x5t: string;
//    public x5c: Array<string>;
//    public n?: string;
//    public e?: string;
//    public x?: string;
//    public y?: string;
//    public crv?: string;
// }
