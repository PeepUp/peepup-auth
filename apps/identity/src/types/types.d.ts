import type { Identity } from "@domain/entity/identity";
import type { Prisma } from "@prisma/client";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import type { FastifyBaseLogger } from "fastify/types/logger";
import type { FastifyReply, FastifyRequest } from "fastify/types/request";
import type { RouteOptions } from "fastify/types/route";
import type { QueryTokenArgs } from "../infrastructure/data-source/token.data-source";

type IdentityId = string;

export type ID = number | IdentityId;

export type Serializable = {
    readonly id?: ID;
};

export type WildcardParams = {
    "*": string;
};

export type RequestHandler<
    Headers = unknown,
    RawQuery = unknown,
    Body = unknown,
    Params = unknown,
    Querystring = unknown,
    Url = unknown,
> = (
    request: FastifyRequest<{
        Headers: Headers;
        Body: Body;
        Params: Params;
        Querystring: Querystring;
        RawQuery: RawQuery;
        Url: Url;
    }>,
    reply: FastifyReply
) => Promise<unknown>;

type Request = http.IncomingMessage;
type Reply = http.ServerResponse;

export type TokenContract = {
    access_token: string;
    refresh_token: string;
};

export type Routes<T> = {
    routes: T;
};

export type IdentityRoutes = Array<
    RouteOptions<
        http.Server,
        Request,
        Reply,
        any,
        unknown,
        any,
        ZodTypeProvider,
        FastifyBaseLogger
    >
>;

export type UserQuery = {
    id?: ID;
    email?: string;
    username?: string;
    name?: string;
    phone?: string;
    providerId?: number;
    roles?: RoleContract[];
    profile?: UserContract;
    tokens?: string[];
    include?: {
        roles?: boolean;
        profile?: boolean;
        tokens?: boolean;
    };
};

export type RegisterIdentityBody = Pick<Identity, "email" | "password" | "username">;
export type Entity = Serializable;

export interface UseCase<T> {
    execute(props?: T): Promise<Entity | Entity[] | string | number | boolean | T>;
}

export type AccountContract = {
    roles?: RoleContract[];
    providerId?: ID;
    user: UserContract;
    tokens?: string[];
} & Entity;

export type Token = {
    value: string;
    type: TokenTypes;
    header: Prisma.JsonValue;
    payload: Prisma.JsonValue;
    kid: string;
    jti: string;
    nbf: number;
    expires_at: number;
    tokenStatus: TokenStatus;
    expirationTime: Date;
    createdAt: Date;
    identityId: string | null;
    device_id: string | null;
    ip_address: string | null;
} & Entity;

type TokenTypes = "access" | "refresh";

type TokenStatus =
    | "revoked"
    | "signed"
    | "expired"
    | "revokedAndExpired"
    | "error"
    | "active"
    | "queued"
    | "rotated"
    | "unknown";

export type WhiteListedToken = {
    id: number;
    token: Token;
    identity: IdentityContract;
    createdAt: Date;
} & Entity;

export type Tokens = {
    accessToken: string;
    refreshToken: string;
};

export type UserContract = {
    avatar?: string;
    email: string;
    emailVerified?: Date;
    firstName?: string;
    lastName?: string;
    phone?: string;
    password: Password;
    salt?: string;
    username?: string;
} & Entity;

export type EmailUserName = Pick<Identity, "email" | "username">;
export type Password = string;
export type ReadonlyPassword = Readonly<Password>;

export type FindUniqeIdentityQuery = Partial<EmailUserName>;

export type FindLoginIdentityQuery = {
    where: FindUniqeIdentityQuery;
    data: {
        password: Password;
    };
};

export interface DataSourceSQL<T> {
    create(data: T): Promise<Readonly<T>>;
    find(id: ID): Promise<Readonly<T> | null>;
    findMany(): Promise<Readonly<T>[] | null>;
    update(id: ID, data: T): Promise<Readonly<T>>;
    delete(id: ID): Promise<void>;
    query(query: Partial<T>): Promise<Readonly<T> | Readonly<T>[] | null>;
}

export interface DataSourceSQLGeneric<T> {
    create<R>(data: T, addsOn: R): Promise<Readonly<T>>;
    find(id: ID): Promise<Readonly<T> | null>;
    findMany(): Promise<Readonly<T>[] | null>;
    findUnique(query: QueryTokenArgs): Promise<Readonly<Token> | null>;
    update(id: ID, data: T): Promise<Readonly<T> | null>;
    delete(id: ID): Promise<void>;
    query(query: Partial<T>): Promise<Readonly<T> | Readonly<T>[] | null>;
}

export interface TokenDataSourceAdapter extends DataSourceSQLGeneric<Token | Token[]> {
    findUnique(query: QueryTokenArgs): Promise<Readonly<Token> | null>;
    findUniqueInWhiteListed(
        query: QueryWhitelistedTokenArgs
    ): Promise<Readonly<Token> | null>;
    createMany<R = unknown>(data: T[], _: R): Promise<void>;
    revoke(jti: ID): Promise<Readonly<T> | null>;
    find(identityId: ID): Promise<Readonly<Token> | null>;
    findMany(identityId: ID, tokenValue?: string): Promise<Readonly<T>[] | null>;
    getWhitelistedTokens(identityId): Promise<Readonly<Token>[] | null>;
}

export type RoleContract = {
    type: RoleType;
    identityId?: ID;
    permissions?: AccessInfo[];
} & Entity;

export type AccessInfo = {
    resource: string;
    action: Action;
    subject: string;
    fields: string[];
    conditions?: { [key: string]: string };
    inverted?: boolean;
    reason?: string;
    roleId?: ID;
} & Entity;

export interface AccessControl {
    extendPermission(): Promise<void>;
    canAccess(roles: RoleContract[]): Promise<boolean>;
    grant(role: RoleContract, access: AccessInfo): Promise<void>;
    extendRole(role: RoleContract, extendRole: RoleContract): Promise<void>;
}

export interface RoleAccessor {
    createRole(role: RoleContract): Promise<void>;
    updateRole(role: RoleContract, data: RoleContract): Promise<void>;
    upsertRole(role: RoleContract, data: RoleContract): Promise<void>;
    deleteRole(role: RoleContract): Promise<void>;
    getRole(roles: RoleContract): Promise<RoleContract>;
    getRoles(): Promise<RoleContract[]>;
}

export interface RoleDataSource {
    findAll(): Promise<RoleContract[]>;
    deleteById(accessId: ID): Promise<void>;
    delete(role: RoleContract): Promise<void>;
    findById(accessId: ID): Promise<AccessInfo>;
    create(roleType: RoleContract): Promise<void>;
    find(query: RoleContract): Promise<RoleContract>;
    update(role: RoleContract, data: RoleContract): Promise<void>;
    upsert(role: RoleContract, data: RoleContract): Promise<void>;
}

export interface AccessControlAccessor {
    getAllAccess(): Promise<RoleContract[]>;
    deleteAccess(accessId: ID): Promise<void>;
    getAccess(access: AccessInfo): Promise<RoleContract>;
    updateAccess(accessId: ID, access: AccessInfo): Promise<void>;
    createAccess(role: RoleContract, access: AccessInfo): Promise<void>;
}

export interface AccessControlDataSource {
    findAll(): Promise<RoleContract[]>;
    deleteById(roleId: ID): Promise<void>;
    findById(roleId: ID): Promise<RoleContract>;
    delete(query: Partial<RoleContract>): Promise<void>;
    updateById(roleId: ID, data: AccessInfo): Promise<void>;
    find(query: Partial<RoleContract>): Promise<RoleContract>;
    create(role: RoleContract, access: AccessInfo): Promise<void>;
    update(query: RoleContract, data: RoleContract): Promise<void>;
}

export interface AccountAccessor {
    deleteAccount(id: ID): Promise<void>;
    createToken(token: Token): Promise<Token>;
    getAllAccount(): Promise<AccountContract[] | null>;
    getAccountById(id: ID): Promise<AccountContract | null>;
    getTokenByValue(tokenValue: string): Promise<Token | null>;
    updateAccount(user: AccountContract): Promise<AccountContract>;
    createAccount(user: CreateAccountInput): Promise<AccountContract>;
}

export interface TokenAccessor {
    cleanUpExpiredToken(): Promise<void>;
    cleanupRevokedTokens(): Promise<void>;
    cleanUpExpiredAndRevokedTokens(): Promise<void>;
    revokeAllToken(identityId: ID): Promise<Token[]>;
    revokeToken(jti: ID): Promise<Readonly<Token> | null>;
    generateToken(token: Token, identityId: ID): Promise<Token>;
    rotateToken(token: Token, identityId: ID): Promise<Token>;
    verifyToken(token: Token, identityId: ID): Promise<Token>;
    saveToken(token: Token, identityId: ID): Promise<Readonly<Token>>;
    findToken(query: QueryTokenArgs): Promise<Readonly<Token> | null>;
    validateTokenScope(token: Token, scope: string): Promise<boolean>;
    deleteWhitelistedToken(query: QueryWhitelistedTokenArgs): Promise<void>;
    getWhitelistedTokens(identityId: ID): Promise<Readonly<Token>[] | null>;
    getTokens(identityId: ID, value?: string): Promise<Readonly<Token>[] | null>;
    saveTokens(token: Token[], identityId: ID): Promise<Readonly<Token[]> | null>;
    WhitelistedToken(token: QueryWhitelistedTokenArgs): Promise<Readonly<Token> | null>;
    updateWhiteListedToken(data: Token, newData: Token): Promise<Readonly<Token> | null>;
}

export interface WhiteListedTokenAccessor {
    addToWhiteListedToken(
        token: Token,
        identityId: ID
    ): Promise<Readonly<WhiteListedToken>>;
    removeFromWhiteList(token: Token): Promise<void>;
    getWhiteListedTokens(identityId: ID): Promise<Readonly<WhiteListedToken>[]>;
    whitelistToken(token: Token, identityId: ID): Promise<Readonly<WhiteListedToken>>;
}

export type TokenAndWhiteListed = TokenAccessor & WhiteListedTokenAccessor;
export type CreateAccountInput = {
    profile: Pick<
        UserContract,
        "email" | "firstName" | "lastName" | "username" | "password"
    >;
};

export interface AccountDataSource {
    delete(id: ID): Promise<void>;
    find(id: ID): Promise<AccountContract | null>;
    query<Q>(query?: Q): Promise<AccountContract[]>;
    findByEmail(email: string): Promise<AccountContract>;
    update(user: AccountContract): Promise<AccountContract>;
    updateById(id: ID, data: AccountContract): Promise<void>;
    insert(user: CreateAccountInput): Promise<AccountContract>;
}

export type EmailAndIdentityId = Pick<Identity, "email" | "id">;

export type IdentityQueryOption = {
    id?: ID;
    email?: string;
    username?: string;
    phoneNumber?: string;
};

export type HashPasswordArgs = {
    _: ReadonlyPassword;
};

export type HashPasswordUtils = HashPasswordArgs & {
    salt: string;
};
export type VerifyHashPasswordUtils = HashPasswordArgs & {
    __: ReadonlyPassword;
};

export interface IdentityAccessor {
    create<T>(identity: Identity): Promise<T | void>;
    update<T>(id: ID, identity: Identity): Promise<Readonly<T> | void>;
    deleteById(id: ID): Promise<void>;
    getIdentityById<T>(id: ID): Promise<Readonly<T> | null>;
    getIdentity<T>(query: FindUniqeIdentityQuery): Promise<Readonly<T> | null>;
    getLoginIdentity<T>(query: FindLoginIdentityQuery): Promise<Readonly<T> | null>;
    getIdentities(query?: FindUniqeIdentityQuery): Promise<Readonly<Identity>[] | null>;
}

export interface IdentityDataSource {
    create<T>(identity: Identity): Promise<T | void>;
    update<T>(id: ID, identity: Identity): Promise<T | void>;
    deleteById(id: ID): Promise<void>;
    delete(identity: Identity): Promise<void>;
    getIdentityById(id: ID): Promise<Identity>;
    getIdentities(): Promise<Identity[]>;
}

export type IdentityCreateFirst = {
    email: string;
    password: Password;
};

export type FastifyGracefulExitOptions = {
    logBindings?: Record<string, unknown>;
    timeout?: number;
    message?: string;
};

export enum RoleType {
    admin = "admin",
    volunteer = "volunteer",
    organization = "organization",
}

export enum Action {
    create = "create",
    read = "read",
    update = "update",
    delete = "delete",
    manage = "manage",
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
