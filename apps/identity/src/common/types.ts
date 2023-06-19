/*
 * @Author: Daffa R
 * @Purpose: Typescript types
 *
 */

import { Account } from "@/domain/entities/account";
import Role from "@/domain/entities/role";

export type ID = number | string;

export interface Serializable {
   _id?: ID;
}

export interface Entity extends Serializable {}

export interface UseCase {
   execute(): Promise<Entity | Entity[] | string | number | boolean>;
}

export interface UserAccount extends Entity {
   roles: UserRole[];
   providerId: number;
   profile: UserProfile;
   tokens: string[];
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
   phone: string;
   avatar: string;
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
   createRole(role: Role): Promise<void>;
   updateRole(role: Role, data: Role): Promise<void>;
   upsertRole(role: Role, data: Role): Promise<void>;
   deleteRole(role: Role): Promise<void>;
   getRole(roles: Role): Promise<UserRole>;
   getRoles(): Promise<UserRole[]>;
}

export interface RoleDataSource {
   create(roleType: Role): Promise<void>;
   findById(accessId: number): Promise<AccessInfo>;
   find(query: Role): Promise<Role>;
   findAll(): Promise<Role[]>;
   update(role: Role, data: Role): Promise<void>;
   upsert(role: Role, data: Role): Promise<void>;
   deleteById(accessId: number): Promise<void>;
   delete(role: Role): Promise<void>;
}

export interface AccessControlAccessor {
   createAccess(role: Role, access: AccessInfo): Promise<void>;
   getAccess(access: AccessInfo): Promise<Role>;
   getAllAccess(): Promise<Role[]>;
   deleteAccess(accessId: number): Promise<void>;
}

export interface AccessControlDataSource {
   create(role: Role, access: AccessInfo): Promise<void>;
   findById(roleId: number): Promise<Role>;
   find(query: Partial<Role>): Promise<Role>;
   findAll(): Promise<Role[]>;
   updateById(roleId: number, data: Role): Promise<void>;
   update(query: Role, data: Role): Promise<void>;
   deleteById(roleId: number): Promise<void>;
   delete(query: Partial<Role>): Promise<void>;
}

export interface AccountAccessor {
   getUsers(): Promise<Account[]>;
   getUserById(id: number): Promise<Account>;
   createUser(user: Account): Promise<Account>;
   updateUser(user: Account): Promise<Account>;
   deleteUser(id: number): Promise<boolean>;
}

export interface AccountDataSource {
   insert(user: Account): Promise<Account>;
   update(user: Account): Promise<Account>;
   delete(id: number): Promise<boolean>;
   find(id: number): Promise<Account>;
   findAll(): Promise<Account[]>;
   updateById(id: number, data: Account): Promise<void>;
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
