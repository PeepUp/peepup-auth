import { join } from "path";
import config from "../application/config/api.config";

export const jwksPath = "/.well-known/jwks.json";
export const clientUrl = process.env.CLIENT_URL || "http://127.0.0.1:3000";
export const issuer =
    (`urn:server-identity:${config.environment.host}:${config.environment.port}` as const) ??
    ("urn:server-1:http://127.0.0.1:4334" as const);

export const protectedResource = ["/identities", "/identities/:id"];
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
export const privateKeyFile = "private.pem.key";
export const publicKeyFile = "public.pem.key";
export const jwtType = "JWT" as const;
export const jwtAlgorithms = ["RS256", "ES256"];
export const maxTokenAge = "30 seconds" as const;
export const audience = process.env.AUDIENCE ?? "https://dofavour.com";
export const clientId = process.env.CLIENT_ID ?? "dofavourMobileApp";
