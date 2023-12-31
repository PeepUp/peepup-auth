import { join } from "path";

const localAuthPath = "/local";
const identityPath = "/identities";
const tokenPath = "/tokens";
const remoteJWKSUrl = "oauth2/v1/jwks/keys";

export const clientURL = process.env.CLIENT_URL || "http://127.0.0.1:3000";
export const serverURL = process.env.SERVER_URL || "http://127.0.0.1:4334";
export const cwd = process.cwd();

export const issuer: string = `urn:server-identity:${serverURL}` || `urn:server-1:${serverURL}`;

export const keysPath = join(cwd, "keys");
export const publicDirPath = join(cwd, "public");
export const rsaKeysDirPath = join(keysPath, "RSA");
export const ecsdaKeysDirPath = join(keysPath, "ECSDA");
export const jwksPath = join(publicDirPath, ".well-known");
export const jwksURL = new URL(join(serverURL, remoteJWKSUrl));
export const protectedResource = [
    identityPath,
    join(localAuthPath, "logout", "api"),
    join(identityPath, "me"),
    join(identityPath, ":id"),
    join(identityPath, ":id", "deactivate"),
    join(tokenPath, "verify"),
    join(tokenPath, "rotate"),
    join(tokenPath, "sessions"),
    join(tokenPath, "sessions", "active"),
    join(tokenPath, "sessions", ":id"),
    join(tokenPath, "sessions", "histories"),
    join(tokenPath, "sessions", "whoami"),
];

export const requiredClaims = ["jti", "email", "id", "resource", "sub", "aud", "iss", "iat", "exp"];

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
    manager = "manager",
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

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" | "HEAD";
export enum Method {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE",
    PATCH = "PATCH",
    OPTIONS = "OPTIONS",
    HEAD = "HEAD",
}

export enum HttpStatusCode {
    OK = 200,
    Created = 201,
    Accepted = 202,
    NoContent = 204,
    MovedPermanently = 301,
    Found = 302,
    NotModified = 304,
    BadRequest = 400,
    Unauthorized = 401,
    Forbidden = 403,
    NotFound = 404,
    MethodNotAllowed = 405,
    NotAcceptable = 406,
    Conflict = 409,
    Gone = 410,
    PreconditionFailed = 412,
    UnsupportedMediaType = 415,
    UnprocessableEntity = 422,
    TooManyRequests = 429,
    InternalServerError = 500,
    NotImplemented = 501,
    BadGateway = 502,
    ServiceUnavailable = 503,
}

export enum Resource {
    identity = "Identity",
    token = "Token",
}
