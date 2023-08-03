import { join } from "path";
import config from "../application/config/api.config";

export const jwksPath = "/.well-known/jwks.json";
export const clientUrl = process.env.CLIENT_URL || "http://127.0.0.1:3000";
export const issuer =
    (`urn:server-identity:${config.environment.host}:${config.environment.port}` as const) ??
    ("urn:server-1:http://127.0.0.1:4334" as const);

const identityPath = "/identities";
const tokenPath = "/token";

export const protectedResource = [
    identityPath,
    join(identityPath, "/:id"),
    join(identityPath, "/:id", "/inactivate"),
    join(tokenPath, "/histories"),
];

export const requiredClaims = [
    "jti",
    "email",
    "id",
    "resource",
    "sub",
    "aud",
    "iss",
    "iat",
    "nbf",
    "exp",
];

export const keysPath = join(process.cwd(), "/keys");
export const privateKeyFile = "private.pem.key" as const;
export const publicKeyFile = "public.pem.key" as const;
export const jwtType = "JWT" as const;
export const jwtAlgorithms = ["RS256", "ES256"];
export const maxTokenAge = "30 seconds" as const;
export const audience = process.env.AUDIENCE ?? ("https://dofavour.com" as const);
export const clientId = process.env.CLIENT_ID ?? ("dofavourMobileApp" as const);

export enum ExipirationTime {
    access = Math.floor(new Date().getTime() / 1000 + 1 * 60 * 60),
    refresh = Math.floor(new Date().getTime() / 1000 + 1 * 24 * 60 * 60),
}

export enum TokenTypeEnum {
    access = "access",
    refresh = "refresh",
}

export enum TokenAlgorithm {
    RS256 = "RS256",
    ES256 = "ES256",
}

export enum CertAlgorithm {
    RSA = "RSA",
    EC = "ECSDA",
}

export enum TokenSID {
    active = "active",
    inactive = "inactive",
}
