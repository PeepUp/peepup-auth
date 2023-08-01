import type { Identity } from "@domain/entity/identity";
import type { Prisma } from "@prisma/client";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import type { FastifyBaseLogger } from "fastify/types/logger";
import type { FastifyReply, FastifyRequest } from "fastify/types/request";
import type { RouteOptions } from "fastify/types/route";
import type { QueryTokenArgs } from "../infrastructure/data-source/token.data-source";

export type ID = number | string;
export interface Serializable {
    readonly id?: ID;
}

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

export interface TokenContract {
    access_token: string;
    refresh_token: string;
}

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

export interface UserQuery {
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
}

export type RegisterIdentityBody = Pick<Identity, "email" | "password" | "username">;
export type EntityContract = Serializable;
export type Entity = Serializable;

export interface UseCase<T> {
    execute(
        props?: T
    ): Promise<EntityContract | EntityContract[] | string | number | boolean | T>;
}

export interface AccountContract extends EntityContract {
    roles?: RoleContract[];
    providerId?: ID;
    user: UserContract;
    tokens?: string[];
}

export interface Token extends EntityContract {
    value: string;
    tokenTypes: TokenTypes;
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
}

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

export interface WhiteListedToken extends EntityContract {
    id: number;
    token: Token;
    identity: IdentityContract;
    createdAt: Date;
}

export interface Tokens {
    accessToken: string;
    refreshToken: string;
}

export interface UserContract extends EntityContract {
    avatar?: string;
    email: string;
    emailVerified?: Date;
    firstName?: string;
    lastName?: string;
    phone?: string;
    password: string;
    salt?: string;
    username?: string;
}

export type FindUniqeIdentityQuery = Partial<
    Omit<Prisma.IdentityEmailUsernamePhoneNumberCompoundUniqueInput, "phoneNumber">
>;

export interface FindLoginIdentityQuery {
    where: FindUniqeIdentityQuery;
    data: { readonly password: string };
}

export interface DataSourceSQL<T> {
    create(data: T): Promise<T>;
    find(id: ID): Promise<Readonly<T> | null>;
    findMany(): Promise<Readonly<T>[] | null>;
    update(id: ID, data: T): Promise<T>;
    delete(id: ID): Promise<void>;
    query(query: Partial<T>): Promise<T | T[] | null>;
}

export interface DataSourceSQLGeneric<T> {
    create<R = unknown>(data: T, _: R): Promise<Readonly<T>>;
    find(id: ID): Promise<Readonly<T> | null>;
    findMany(): Promise<Readonly<T>[] | null>;
    findUnique(query: QueryTokenArgs): Promise<Readonly<Token> | null>;
    update(id: ID, data: T): Promise<Readonly<T> | null>;
    delete(id: ID): Promise<void>;
    query(query: Partial<T>): Promise<T | T[] | null>;
}

export interface TokenDataSourceAdapter extends DataSourceSQLGeneric<Token | Token[]> {
    findUnique(query: QueryTokenArgs): Promise<Readonly<Token> | null>;
    findUniqueInWhiteListed(
        query: QueryWhitelistedTokenArgs
    ): Promise<Readonly<Token> | null>;
    revoke(jti: ID): Promise<Readonly<T> | null>;
    find(identityId: ID): Promise<Readonly<Token> | null>;
    findMany(identityId: ID, tokenValue?: string): Promise<Readonly<T>[] | null>;
    getAllWhiteListedToken(identityId): Promise<Readonly<Token>[] | null>;
}

export interface RoleContract extends EntityContract {
    type: RoleType;
    identityId?: ID;
    permissions?: AccessInfo[];
}

export interface AccessInfo extends EntityContract {
    resource: string;
    action: Action;
    subject: string;
    fields: string[];
    conditions?: { [key: string]: string };
    inverted?: boolean;
    reason?: string;
    roleId?: ID;
}

export interface AccessControl {
    canAccess(roles: RoleContract[]): Promise<boolean>;
    extendRole(role: RoleContract, extendRole: RoleContract): Promise<void>;
    extendPermission(): Promise<void>;
    grant(role: RoleContract, access: AccessInfo): Promise<void>;
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
    create(roleType: RoleContract): Promise<void>;
    findById(accessId: ID): Promise<AccessInfo>;
    find(query: RoleContract): Promise<RoleContract>;
    findAll(): Promise<RoleContract[]>;
    update(role: RoleContract, data: RoleContract): Promise<void>;
    upsert(role: RoleContract, data: RoleContract): Promise<void>;
    deleteById(accessId: ID): Promise<void>;
    delete(role: RoleContract): Promise<void>;
}

export interface AccessControlAccessor {
    createAccess(role: RoleContract, access: AccessInfo): Promise<void>;
    updateAccess(accessId: ID, access: AccessInfo): Promise<void>;
    getAccess(access: AccessInfo): Promise<RoleContract>;
    getAllAccess(): Promise<RoleContract[]>;
    deleteAccess(accessId: ID): Promise<void>;
}

export interface AccessControlDataSource {
    create(role: RoleContract, access: AccessInfo): Promise<void>;
    findById(roleId: ID): Promise<RoleContract>;
    find(query: Partial<RoleContract>): Promise<RoleContract>;
    findAll(): Promise<RoleContract[]>;
    updateById(roleId: ID, data: AccessInfo): Promise<void>;
    update(query: RoleContract, data: RoleContract): Promise<void>;
    deleteById(roleId: ID): Promise<void>;
    delete(query: Partial<RoleContract>): Promise<void>;
}

export interface AccountAccessor {
    createToken(token: Token): Promise<Token>;
    getTokenByValue(tokenValue: string): Promise<Token | null>;
    getAllAccount(): Promise<AccountContract[] | null>;
    getAccountById(id: ID): Promise<AccountContract | null>;
    createAccount(user: CreateAccountInput): Promise<AccountContract>;
    updateAccount(user: AccountContract): Promise<AccountContract>;
    deleteAccount(id: ID): Promise<void>;
}

export interface TokenAccessor {
    updateWhiteListedToken(
        token: Token,
        newToken: Token
    ): Promise<Readonly<Token> | null>;

    revokeToken(jti: ID): Promise<Readonly<Token> | null>;
    deleteTokenInWhiteListed(query: QueryWhitelistedTokenArgs): Promise<void>;
    getAllWhiteListedToken(identityId: ID): Promise<Readonly<Token>[] | null>;
    saveToken(token: Token, identityId: ID): Promise<Readonly<Token>>;
    WhitelistedToken(token: QueryWhitelistedTokenArgs): Promise<Readonly<Token> | null>;
    generateToken(token: Token, identityId: ID): Promise<Token>;
    rotateToken(token: Token, identityId: ID): Promise<Token>;
    verifyToken(token: Token, identityId: ID): Promise<Token>;

    revokeAllToken(identityId: ID): Promise<Token[]>;
    getTokens(identityId: ID): Promise<Token[]>;
    findToken(query: QueryTokenArgs): Promise<Readonly<Token> | null>;
    cleanUpExpiredToken(): Promise<void>;
    cleanupRevokedTokens(): Promise<void>;
    cleanUpExpiredAndRevokedTokens(): Promise<void>;
    validateTokenScope(token: Token, scope: string): Promise<boolean>;
}

export interface WhiteListedTokenAccessor {
    whitelistToken(token: Token, identityId: ID): Promise<WhiteListedToken>;
    removeFromWhiteList(token: Token): Promise<void>;
    addToWhiteListedToken(token: Token, identityId: ID): Promise<WhiteListedToken>;
    getWhiteListedTokens(identityId: ID): Promise<WhiteListedToken[]>;
}

export type TokenAndWhiteListed = TokenAccessor & WhiteListedTokenAccessor;

export type CreateAccountInput = {
    profile: Pick<
        UserContract,
        "email" | "firstName" | "lastName" | "username" | "password"
    >;
};

export interface AccountDataSource {
    insert(user: CreateAccountInput): Promise<AccountContract>;
    update(user: AccountContract): Promise<AccountContract>;
    delete(id: ID): Promise<void>;
    find(id: ID): Promise<AccountContract | null>;
    findByEmail(email: string): Promise<AccountContract>;
    query<Q>(query?: Q): Promise<AccountContract[]>;
    updateById(id: ID, data: AccountContract): Promise<void>;
}

export interface IdentityQueryOption {
    id?: ID;
    email?: string;
    username?: string;
    phoneNumber?: string;
}

export interface HashPasswordArgs {
    readonly _: string;
}

export interface HashPasswordUtils extends HashPasswordArgs {
    salt: string;
}
export interface VerifyHashPasswordUtils extends HashPasswordArgs {
    readonly __: string;
}

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
    password: string;
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

export enum Scope {
    ANY = "any",
    OWN = "own",
    OWN_OR_ANY = "ownOrAny",
}

export type FastifyGracefulExitOptions = {
    logBindings?: Record<string, unknown>;
    timeout?: number;
    message?: string;
};
