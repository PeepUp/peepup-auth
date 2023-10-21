/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
import type { Identity } from "@domain/entity/identity";
import type { Prisma } from "@prisma/client";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import type { FastifyBaseLogger } from "fastify/types/logger";
import type { FastifyReply, FastifyRequest } from "fastify/types/request";
import type { RouteOptions } from "fastify/types/route";
import type {
    QueryTokenArgs,
    QueryWhitelistedTokenArgs,
} from "@/infrastructure/data-source/token.data-source";
import { TokenRelatedArgs } from "@/application/repository/token";

type IdentityId = string;
export type unknown = unknown;
export type ID = number | IdentityId;
export type Serializable = {
    readonly id?: ID | null;
};
export type WildcardParams = {
    "*": string;
};
export type IdentityAbilityArgs = {
    id: string;
    role: string;
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

export type AuthorizationHeaderOptions = {
    authorizationHeader: boolean;
    authorizationHeaderPrefix: string;
};
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
        never,
        unknown,
        never,
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

export type RegisterIdentityBody = Readonly<
    Partial<Pick<Identity, "email" | "password" | "username">>
>;
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

export type ParsedToken = {
    value: string;
    type: TokenTypes;
    header: TokenPayloadIdentity;
    payload: JWTHeader;
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
    findRelatedTokens(args: TokenRelatedArgs): Promise<Readonly<Token> | null>;
}

export interface WhiteListedTokenDataSourceAdapter {
    findMany(): Promise<Readonly<Token[]> | null>;
    findManyByIdentityId(identityId: ID): Promise<Readonly<Token[]> | null>;
    delete(query: QueryWhitelistedTokenArgs): Promise<void>;
    deleteMany(identityId: ID): Promise<void>;
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
    validateTokenScope(token: Token, scope: string): Promise<boolean>;
    deleteWhitelistedToken(query: QueryWhitelistedTokenArgs): Promise<void>;
    getWhitelistedTokens(identityId: ID): Promise<Readonly<Token>[] | null>;
    getTokens(identityId: ID, value?: string): Promise<Readonly<Token>[] | null>;
    getToken(query: QueryTokenArgs): Promise<Readonly<Token> | null>;
    saveTokens(token: Token[], identityId: ID): Promise<Readonly<Token[]> | null>;
    WhitelistedToken(token: QueryWhitelistedTokenArgs): Promise<Readonly<Token> | null>;
    updateWhiteListedToken(data: Token, newData: Token): Promise<Readonly<Token> | null>;
    findRelatedTokens(args: TokenRelatedArgs): Promise<Readonly<Token> | null>;
}

export interface WhiteListedTokenAccessor {
    findMany(): Promise<Readonly<Token[]> | null>;
    findManyByIdentityId(identityId: ID): Promise<Readonly<Token[]> | null>;
    delete(query: QueryWhitelistedTokenArgs): Promise<void>;
    deleteMany(identityId: ID): Promise<void>;
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

export type HashPasswordUtils = Readonly<
    HashPasswordArgs & {
        salt: string;
    }
>;
export type VerifyHashPasswordUtils = Readonly<
    HashPasswordArgs & {
        __: ReadonlyPassword;
    }
>;

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
