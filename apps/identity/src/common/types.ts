/*
 * @Author: Daffa R
 * @Purpose: Typescript types
 *
 */

import Account from "@/domain/entity/account";
import Role from "@/domain/entity/role";

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
   roles?: Role[];
   profile?: UserProfile;
   tokens?: string[];
   include?: {
      roles?: boolean;
      profile?: boolean;
      tokens?: boolean;
   };
}

export interface Entity extends Serializable {}

export interface UseCase<T> {
   execute(
      props?: T
   ): Promise<Entity | Entity[] | string | number | boolean | T>;
}

export interface UserAccount extends Entity {
   roles?: UserRole[];
   providerId?: number;
   profile: Partial<UserProfile>;
   tokens?: string[];
}

export interface Tokens {
   accessToken: string;
   refreshToken: string;
}

export interface UserProfile extends Entity {
   name: string;
   username: string;
   email: string;
   emailVerified: Date;
   password: string;
   salt?: string;
   phone: string;
   avatar: string;
}

export interface DataSourceSQL<T> {
   name: string;
   create(data: T): Promise<T | null>;
   read(id: string): Promise<T | null>;
   update(data: T): Promise<T | null>;
   delete(id: string): Promise<boolean>;
}

export interface UserRole extends Entity {
   type: RoleType;
   permissions: AccessInfo[];
}

export interface AccessInfo extends Entity {
   action: string;
   scope: string;
   resource: string;
   possession?: string;
   attributes?: { [key: string]: string };
}

export interface AccessControl {
   canAccess(roles: Role[]): Promise<boolean>;
   extendRole(role: Role, extendRole: Role): Promise<void>;
   extendPermission(): Promise<void>;
   grant(role: Role, access: AccessInfo): Promise<void>;
}

export interface RoleAccessor {
   createRole(role: UserRole): Promise<void>;
   updateRole(role: UserRole, data: UserRole): Promise<void>;
   upsertRole(role: UserRole, data: UserRole): Promise<void>;
   deleteRole(role: UserRole): Promise<void>;
   getRole(roles: UserRole): Promise<UserRole>;
   getRoles(): Promise<UserRole[]>;
}

export interface RoleDataSource {
   create(roleType: UserRole): Promise<void>;
   findById(accessId: ID): Promise<AccessInfo>;
   find(query: UserRole): Promise<UserRole>;
   findAll(): Promise<UserRole[]>;
   update(role: UserRole, data: UserRole): Promise<void>;
   upsert(role: UserRole, data: UserRole): Promise<void>;
   deleteById(accessId: ID): Promise<void>;
   delete(role: UserRole): Promise<void>;
}

export interface AccessControlAccessor {
   createAccess(role: UserRole, access: AccessInfo): Promise<void>;
   updateAccess(accessId: ID, access: AccessInfo): Promise<void>;
   getAccess(access: AccessInfo): Promise<UserRole>;
   getAllAccess(): Promise<UserRole[]>;
   deleteAccess(accessId: ID): Promise<void>;
}

export interface AccessControlDataSource {
   create(role: UserRole, access: AccessInfo): Promise<void>;
   findById(roleId: ID): Promise<UserRole>;
   find(query: Partial<UserRole>): Promise<UserRole>;
   findAll(): Promise<UserRole[]>;
   updateById(roleId: ID, data: AccessInfo): Promise<void>;
   update(query: UserRole, data: UserRole): Promise<void>;
   deleteById(roleId: ID): Promise<void>;
   delete(query: Partial<UserRole>): Promise<void>;
}

export interface AccountAccessor {
   getAllAccount(): Promise<UserAccount[]>;
   getAccountById(id: ID): Promise<UserAccount>;
   createAccount(user: CreateAccountInput): Promise<UserAccount>;
   updateAccount(user: UserAccount): Promise<UserAccount>;
   deleteAccount(id: ID): Promise<boolean>;
}

export type CreateAccountInput = {
   profile: Pick<UserProfile, "email" | "name" | "password">;
};

export interface AccountDataSource {
   insert(user: CreateAccountInput): Promise<UserAccount>;
   update(user: UserAccount): Promise<UserAccount>;
   delete(id: ID): Promise<boolean>;
   findById(id: ID): Promise<UserAccount>;
   find(user: UserAccount): Promise<UserAccount>;
   findByEmail(email: string): Promise<UserAccount>;
   query<Q>(query?: Q): Promise<UserAccount[]>;
   updateById(id: ID, data: UserAccount): Promise<void>;
}

/*
 * @Enum Role
 * @Purpose: for roles of an account (ADMIN, VOLUNTEER, ORGANIZATION)
 * @Usage: Role.VOLUNTEER
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
