/* eslint-disable class-methods-use-this */

import JWTException from "@/adapter/middleware/errors/jwt-error";
import UnauthorizedException from "@/adapter/middleware/errors/unauthorized";
import ForbiddenException from "@/adapter/middleware/errors/forbidden-exception";
import {
    jwksURL,
    publicKeyFile,
    cwd,
    ecsdaKeysDirPath,
    rsaKeysDirPath,
    TokenAlgorithm,
} from "@/common/constant";

import path from "path";
import * as fs from "fs";
import { createPublicKey } from "crypto";
import * as jose from "jose";
import type {
    JWTHeaderParameters,
    JWTPayload,
    JWTVerifyOptions,
    JoseHeaderParameters,
    JWK,
} from "jose";
import type { ParsedToken, Token } from "@/types/types";
import type {
    CreateTokenArgs,
    DecodedToken,
    JWTHeader,
    TokenPayloadIdentity,
    TokenPayloadProtected,
} from "@/types/token";
import FileUtil from "@/common/utils/file.util";

class JwtToken {
    constructor(
        public keyId: string | null,
        public payload: JWTPayload,
        public header: JWTHeaderParameters | JoseHeaderParameters | JWTHeader
    ) {}

    public setHeader(header: JWTHeaderParameters): void {
        this.header = header;
    }

    public setPayload(payload: JWTPayload): void {
        this.payload = payload;
    }

    public async createToken(data: CreateTokenArgs): Promise<Readonly<string>> {
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
                throw new JWTException({
                    message: "JWTException: Cannot create token!",
                    statusCode: 400,
                    cause: "JWTException: Cannot create token!",
                    stack: "",
                    rest: {},
                });
            }

            return signature;
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error(error.message);
                throw new Error("JWTException: Cannot generate new token!");
            }

            throw new Error("JWTException: unhandled error while generate token!");
        }
    }

    async buildJWKSPublicKey(kid: string, ecsdaKeyId: string): Promise<void> {
        try {
            const keysList: JWK[] = [];
            const jwksPath = path.join(cwd, "public", ".well-known");
            const rsakeys = FileUtil.getDir(rsaKeysDirPath);
            const ecsdakeys = FileUtil.getDir(ecsdaKeysDirPath);

            if (rsakeys.length === 0) return;
            if (ecsdakeys.length === 0) return;

            await Promise.all(
                rsakeys.map(async (keyId) => {
                    const jwk = await this.JWKFromPEM(
                        FileUtil.readFile({
                            path: path.join(rsaKeysDirPath, keyId, publicKeyFile),
                            encoding: "utf-8",
                        }),
                        kid,
                        TokenAlgorithm.RS256
                    );
                    keysList.push(jwk);
                })
            );

            await Promise.all(
                ecsdakeys.map(async (keyId) => {
                    const jwk = await this.JWKFromPEM(
                        FileUtil.readFile({
                            path: path.join(ecsdaKeysDirPath, keyId, publicKeyFile),
                            encoding: "utf-8",
                        }),
                        ecsdaKeyId,
                        TokenAlgorithm.ES256
                    );
                    keysList.push(jwk);
                })
            );

            if (!FileUtil.checkDir(jwksPath)) fs.mkdirSync(jwksPath, { recursive: true });

            const jwks = JSON.stringify({ keys: keysList }, null, 2);
            fs.writeFileSync(path.join(jwksPath, "jwks.json"), jwks);
        } catch (error) {
            if (error instanceof Error) throw new Error(error.message);
        }
    }

    public async JWKFromPEM(pemKey: string, kid: string, alg: string): Promise<JWK> {
        const jwk = await jose.exportJWK(createPublicKey({ key: pemKey, format: "pem" }));

        return {
            ...jwk,
            use: "sig",
            alg,
            kid,
        };
    }

    public static decodeJwt(token: string): DecodedToken {
        try {
            return jose.decodeJwt(token) as DecodedToken;
        } catch (error) {
            if (error instanceof Error) {
                throw new JWTException({
                    message: "JWTException: Invalid token!",
                    statusCode: 400,
                    cause: "Invalid token signature",
                    stack: "",
                    rest: {},
                });
            }

            return {} as DecodedToken;
        }
    }

    public async verifyJWT(
        token: string,
        publicKey: string,
        algorithm: string,
        options: JWTVerifyOptions,
        identity: TokenPayloadProtected
    ): Promise<boolean | Error> {
        try {
            const publicKeyImport = await jose.importSPKI(publicKey, algorithm);
            const { payload, protectedHeader } = await jose.jwtVerify(
                token,
                publicKeyImport,
                options
            );

            if (!payload || !protectedHeader) {
                throw new UnauthorizedException(
                    "JWTException: Missing payload or protected header!"
                );
            }

            const validateToken = this.validateTokenPayload({
                payload,
                options,
                algorithm,
                identity,
                protectedHeader,
            });

            if (validateToken instanceof Error) {
                throw new JWTException({
                    message: validateToken.message,
                    statusCode: 403,
                    cause: "Invalid token signature",
                    stack: validateToken.message,
                    rest: {
                        ...validateToken,
                    },
                });
            }

            if (payload.id && payload.id !== identity.id) {
                throw new JWTException({
                    message: "JWTException: Invalid token signature",
                    statusCode: 401,
                    cause: "Invalid token signature",
                    stack: "JWTException: Invalid token signature",
                    rest: null,
                });
            }

            if (payload.resource && payload.resource !== identity.resource) {
                throw new JWTException({
                    message: "JWTException: Invalid token signature",
                    statusCode: 401,
                    cause: "Invalid token signature",
                    stack: "JWTException: Invalid token signature",
                    rest: null,
                });
            }

            return true;
        } catch (error) {
            console.dir({ error }, { depth: Infinity });

            if (error instanceof jose.errors.JWSInvalid) {
                return new JWTException({
                    message: "Token is invalid",
                    statusCode: 403,
                    cause: "Token is invalid",
                    stack: error.stack ?? "",
                    rest: {
                        ...error,
                    },
                });
            }

            if (error instanceof jose.errors.JOSEError) {
                return new JWTException({
                    message: error.message,
                    statusCode: 403,
                    name: error.name,
                    cause: "",
                    stack: error.stack ?? "",
                    rest: {
                        ...error,
                    },
                });
            }

            if (error instanceof Error) throw new Error(error.message);
            if (error instanceof JWTException) return error;

            return false;
        }
    }

    public static async parsedToken(
        token: Token | ParsedToken
    ): Promise<Token | ParsedToken> {
        return {
            ...token,
            payload: (await JSON.parse(token.header as string)) as TokenPayloadIdentity,
            header: (await JSON.parse(token.header as string)) as TokenPayloadIdentity,
        };
    }

    public async verifyJWTByJWKS(
        token: Readonly<string>,
        algorithm: string,
        options: JWTVerifyOptions,
        identity: Readonly<TokenPayloadProtected>
    ): Promise<boolean | Error> {
        try {
            const jwks = jose.createRemoteJWKSet(jwksURL);
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

            const validate = this.validateTokenPayload({
                payload,
                options,
                algorithm,
                identity,
                protectedHeader,
            });

            if (validate instanceof Error) {
                console.log("error while validate the payload!");
                console.log({ validate });
                throw new UnauthorizedException("JWTException: Invalid token signature");
            }

            if (payload.id === undefined && payload.id !== identity.id) {
                throw new UnauthorizedException("JWTException: Invalid token signature");
            }

            if (
                payload.resource === undefined &&
                payload.resource !== identity.resource
            ) {
                throw new UnauthorizedException("JWTException: Invalid token signature");
            }

            return true;
        } catch (error) {
            if (error instanceof Error) {
                console.log({
                    from: error.constructor.name,
                    name: error.name,
                    message: error.message,
                    stack: error.stack,
                    cause: error.cause ?? "",
                    here: "here!!",
                });
            }

            if (error instanceof jose.errors.JWTExpired) {
                return new JWTException({
                    message: "Token is expired",
                    statusCode: 401,
                    cause: "exp",
                    stack: error.stack ?? "",
                    rest: {},
                });
            }

            if (error && error.constructor.name === "JWTInvalid") {
                throw new JWTException({
                    name: "JWTInvalid",
                    message: "___Token JWT invalid",
                    statusCode: 401,
                    cause: "alg",
                    stack: "",
                    rest: { ...error },
                });
            }

            if (error instanceof Error && error.name === "JOSEAlgNotAllowed") {
                console.log("JWTException: JOSEAlgNotAllowed");
                throw new JWTException({
                    name: error.name,
                    message: "Token JWT invalid",
                    statusCode: 401,
                    cause: "alg",
                    stack: error.stack ?? "",
                    rest: { ...error },
                });
            }

            if (error instanceof jose.errors.JOSEAlgNotAllowed) {
                throw new JWTException({
                    message: "Token signature invalid",
                    statusCode: 401,
                    cause: "alg",
                    stack: error.stack ?? "",
                    rest: { ...error },
                });
            }

            if (error instanceof jose.errors.JOSEError) {
                // throw new UnauthorizedException(`Invalid token: ${error.message}`);
                console.log(`JWTException: ${error.message}`);
            }

            if (error instanceof Error) {
                // throw new Error(error.message);
                console.error("Error occurred during JWT verification:", error);
            }

            return new Error();
        }
    }

    private validateTokenPayload(
        data: Readonly<{
            payload: JWTPayload;
            options: JWTVerifyOptions;
            algorithm: string;
            identity: TokenPayloadProtected;
            protectedHeader: JWTHeaderParameters;
        }>
    ): boolean | Error {
        const { payload, options, identity, protectedHeader } = data;

        if (payload.jti && payload.jti !== identity.jti) {
            return new UnauthorizedException("Invalid token: Invalid jti token");
        }

        if (protectedHeader.kid && protectedHeader.kid !== identity.kid) {
            return new UnauthorizedException("Invalid token: Invalid kid token");
        }

        if (
            protectedHeader.alg &&
            options.algorithms &&
            options.algorithms.includes(protectedHeader.alg) === false
        ) {
            return new UnauthorizedException("Invalid token: Invalid algorithm");
        }

        if (protectedHeader.typ && protectedHeader.typ !== options.typ) {
            return new UnauthorizedException("Invalid token: Invalid type");
        }

        // Check expiration time (exp)
        if (payload.exp && payload.exp <= Math.floor(Date.now() / 1000)) {
            return new UnauthorizedException("Invalid token: Expired");
        }

        // Check not before (nbf)
        if (payload.nbf && payload.nbf > Math.floor(Date.now() / 1000)) {
            return new UnauthorizedException("Invalid token: Not yet valid");
        }

        // Check audience (aud)
        if (payload.aud && payload.aud !== options.audience) {
            return new UnauthorizedException("Invalid token: Invalid audience");
        }

        // Check issuer (iss)
        if (payload.iss && payload.iss !== options.issuer) {
            return new UnauthorizedException("Invalid token: Invalid issuer");
        }

        // Check subject (sub)
        if (payload.sub && payload.sub !== options.subject) {
            return new UnauthorizedException("Invalid token: Missing subject");
        }

        if (payload.sid && payload.sid !== "active") {
            return new UnauthorizedException("Invalid token: Expired");
        }

        return true;
    }
}

export default JwtToken;
