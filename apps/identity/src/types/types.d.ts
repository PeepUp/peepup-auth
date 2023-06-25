export type ID = number | string;

export interface Serializable {
   _id?: ID;
}

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

export interface EntityContract extends Serializable {}

export interface UseCase<T> {
   execute(
      props?: T
   ): Promise<
      EntityContract | EntityContract[] | string | number | boolean | T
   >;
}

export interface AccountContract extends EntityContract {
   roles?: RoleContract[];
   providerId?: ID;
   user: UserContract;
   tokens?: string[];
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

export interface DataSourceSQL<T> {
   name: string;
   create(data: T): Promise<T | null>;
   read(id: string): Promise<T | null>;
   update(data: T): Promise<T | null>;
   delete(id: string): Promise<boolean>;
}

export interface RoleContract extends EntityContract {
   type: RoleType;
   permissions: AccessInfo[];
}

export interface AccessInfo extends EntityContract {
   action: string;
   scope: string;
   resource: string;
   possession?: string;
   attributes?: { [key: string]: string };
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
   getAllAccount(): Promise<AccountContract[]>;
   getAccountById(id: ID): Promise<AccountContract>;
   createAccount(user: CreateAccountInput): Promise<AccountContract>;
   updateAccount(user: AccountContract): Promise<AccountContract>;
   deleteAccount(id: ID): Promise<boolean>;
}

export type CreateAccountInput = {
   profile: Pick<
      UserContract,
      "email" | "firstName" | "lastName" | "username" | "password"
   >;
};

export interface AccountDataSource {
   insert(user: CreateAccountInput): Promise<AccountContract>;
   update(user: AccountContract): Promise<AccountContract>;
   delete(id: ID): Promise<boolean>;
   findById(id: ID): Promise<AccountContract>;
   find(user: AccountContract): Promise<AccountContract>;
   findByEmail(email: string): Promise<AccountContract>;
   query<Q>(query?: Q): Promise<AccountContract[]>;
   updateById(id: ID, data: AccountContract): Promise<void>;
}

/*
 * @Enum RoleContract
 * @Purpose: for roles of an account (ADMIN, VOLUNTEER, ORGANIZATION)
 * @Usage: RoleContract.VOLUNTEER
 *
 * */
export enum RoleType {
   ADMIN = "admin",
   VOLUNTEER = "volunteer",
   ORGANIZATION = "Organization",
}

export enum Action {
   CREATE = "create",
   READ = "read",
   UPDATE = "update",
   DELETE = "delete",
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
