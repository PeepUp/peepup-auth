/*
 * @Author: Daffa R
 * @Purpose: Typescript types
 *
 */

export type ID = number | string;

export interface Serializable {
   id?: ID;
}

export interface Entity extends Serializable {}

/*
 * @Enum Role
 * @Purpose: for roles of an account (ADMIN, VOLUNTEER, ORGANIZATION)
 * @Usage: Role.VOLUNTEER
 * @Default: MUST BE Role.VOLUNTEER
 *
 * */
export enum Role {
   ADMIN = "ADMIN",
   VOLUNTEER = "VOLUNTEER",
   ORGANIZATION = "ORGANIZATION",
}

export enum Resource {
   ACCOUNT,
   POST,
   EVENT,
   ORGANIZATION,
   CAMPAIGN,
}

export interface UseCase {
   execute(): Promise<Entity | Entity[] | string | number | boolean>;
}

export enum VolunteerResource {
   ACCOUNT = "ACCOUNT",
   POST = "POST",
   EVENT = "EVENT",
   ORGANIZATION = "ORGANIZATION",
   CAMPAIGN = "CAMPAIGN",
}

export interface IVolunteerPolicy {
   getVolunteerPolicy<T>(role: Role): T;
   getPermission(role: Role): boolean;
}

export type AccountProps = {
   roles: Role[];
   providerId: number;
   permissions: Permission[];
   profile: UserProps;
   tokens: string[];
};

export type Tokens = {
   accessToken: string;
   refreshToken: string;
};

export type UserProps = {
   name: string;
   username: string;
   email: string;
   emailVerified: Date;
   password: string;
   phone: string;
   image: string;
};

export interface UserRole extends Permission {
   type: Role;
   roleId: number;
}

// export interface Permission extends BaseEntity {
//    readonly attributes: string[];
// }

export enum PERMISSIONS {
   // ALL_PERMISSION
   CREATE_ACCOUNT = "ALL_PERMISSION",
   READ_ACCOUNT = "ALL_PERMISSION",
   UPDATE_ACCOUNT = "ALL_PERMISSION",
   DELETE_ACCOUNT = "ALL_PERMISSION",
   CREATE_POST = "ALL_PERMISSION",
   READ_POST = "ALL_PERMISSION",
   UPDATE_POST = "ALL_PERMISSION",
   DELETE_POST = "ALL_PERMISSION",
   READ_EVENT = "ALL_PERMISSION",
   READ_ORGANIZATION = "ALL_PERMISSION",
   JOIN_ORGANIZATION = "ALL_PERMISSION",
   LEAVE_ORGANIZATION = "ALL_PERMISSION",
   JOIN_CAMPIGN = "ALL_PERMISSION",
   LEAVE_CAMPIGN = "ALL_PERMISSION",
   JOIN_EVENT = "ALL_PERMISSION",
   LEAVE_EVENT = "ALL_PERMISSION",

   // ONLY ORGANIZATION
   CREATE_ORGANIZATION = "ORGANIZATION_PERMISSION",
   UPDATE_ORGANIZATION = "ORGANIZATION_PERMISSION",
   DELETE_ORGANIZATION = "ORGANIZATION_PERMISSION",
   CREATE_EVENT = "ORGANIZATION_PERMISSION",
   UPDATE_EVENT = "ORGANIZATION_PERMISSION",
   DELETE_EVENT = "ORGANIZATION_PERMISSION",
}

export interface Permission {
   readonly attributes: string[];

   setAdminPermission(): string;
   setVolunteerPermission(): string;
   setOrganizationPermission(): string;

   hasPermissionByAction(permission: PERMISSIONS): boolean;
   getPermission(): boolean;
   setPermission(permission: PERMISSIONS): void;
   deletePermission(permission: PERMISSIONS): void;
   updatedPermission(permission: PERMISSIONS): void;
}
