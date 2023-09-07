import { join } from "path";
import config from "../application/config/api.config";

export const jwksPath = "/.well-known/jwks.json";
export const clientUrl = process.env.CLIENT_URL || "http://127.0.0.1:3000";
export const issuer: string =
    (`urn:server-identity:${config.environment.host}:${config.environment.port}` as const) ??
    ("urn:server-1:http://127.0.0.1:4334" as const);

const localAuthPath = "/local";
const identityPath = "/identities";
const tokenPath = "/token";

export const protectedResource = [
    identityPath,
    tokenPath,
    localAuthPath,
    join(identityPath, "/:id"),
    join(identityPath, "/:id", "/inactivate"),
    join(tokenPath, "/sessions"),
    join(tokenPath, "/sessions", "/active"),
    join(tokenPath, "/sessions", "/:id"),
    join(tokenPath, "/sessions", "/histories"),
    join(tokenPath, "/sessions", "/whoami"),
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

export enum TokenStatusType {
    active = "active",
    inactive = "inactive",
    expired = "expired",
    revoked = "revoked",
    signed = "signed",
    revokedAndExpired = "revokedAndExpired",
    error = "error",
    queued = "queued",
    rotated = "rotated",
}

export enum TokenType {
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

export enum RoleType {
    admin = "admin",
    member = "member",
    volunteer = "volunteer",
    organization = "organization",
}

export enum Action {
    create = "create",
    read = "read",
    update = "update",
    delete = "delete",
    manage = "manage",
    readAll = "read-all",
}

export enum Possession {
    ANY = "any",
    OWN = "own",
}

export enum TokenStatusTypes {
    revoked = "revoked",
    signed = "signed",
    expired = "expired",
    revokedAndExpired = "revokedAndExpired",
    error = "error",
    active = "active",
    queued = "queued",
    unknown = "unknown",
    rotated = "rotated",
}

export enum Scope {
    ANY = "any",
    OWN = "own",
    OWN_OR_ANY = "ownOrAny",
}

export enum IdentityStateTypes {
    active = "active",
    deactive = "deactive",
    pending = "pending",
    blocked = "blocked",
    deleted = "deleted",
    archived = "archived",
    unknown = "unknown",
    unverified = "unverified",
}
