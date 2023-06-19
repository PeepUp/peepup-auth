/*
 * @Author: Daffa R
 * @Purpose: Typescript types
 *
 */

import Role from "@/domain/entities/role";

export type ID = number | string;

export interface Serializable {
   id?: ID;
}

export interface Entity extends Serializable {}

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

export interface UseCase {
   execute(): Promise<Entity | Entity[] | string | number | boolean>;
}

export interface AccountProps {
   roles: UserRole[];
   providerId: number;
   profile: UserProps;
   tokens: string[];
}

export interface Tokens {
   accessToken: string;
   refreshToken: string;
}

export interface UserProps {
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
   createRole(): Promise<void>;
   updateRole(role: Role, data: Role): Promise<void>;
   upsertRole(role: Role, data: Role): Promise<void>;
   deleteRole(roleId: number): Promise<void>;
   getRole(roleId: number): Promise<UserRole>;
   getRole(roles: Role): Promise<UserRole>;
   getRoles(): Promise<UserRole[]>;
}

export interface RoleDataSource {
   create(roleType: Role, access: AccessInfo): Promise<void>;
   findById(accessId: number): Promise<AccessInfo>;
   find(query: AccessInfo): Promise<AccessInfo>;
   findAll(): Promise<AccessInfo[]>;
   updateById(accessId: number, data: AccessInfo): Promise<void>;
   update(query: AccessInfo, data: AccessInfo): Promise<void>;
   deleteById(accessId: number): Promise<void>;
   delete(query: AccessInfo): Promise<void>;
}

export interface AccessControlAccessor {
   createAccess(role: Role, access: AccessInfo): Promise<void>;
   getAccessById(accessId: number): Promise<AccessInfo>;
   getAccess(access: AccessInfo): Promise<AccessInfo>;
   getAllAccess(): Promise<AccessInfo[]>;
   updateAccess(accessId: number, data: AccessInfo): Promise<void>;
   deleteAccess(accessId: number): Promise<void>;
}

export interface AccessControlDataSource {
   create(role: Role): Promise<void>;
   findById(roleId: number): Promise<Role>;
   find(query: Partial<Role>): Promise<Role>;
   findAll(): Promise<Role[]>;
   updateById(roleId: number, data: Role): Promise<void>;
   update(query: Role, data: Role): Promise<void>;
   deleteById(roleId: number): Promise<void>;
   delete(query: Partial<Role>): Promise<void>;
}

export enum Action {
   Creat = "create",
   Read = "read",
   Update = "update",
   Delete = "delete",
}

export enum Possession {
   Any = "any",
   Own = "own",
}

export enum Scope {
   Any = "any",
   Own = "own",
   OwnOrAny = "ownOrAny",
}
