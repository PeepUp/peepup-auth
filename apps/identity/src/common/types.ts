/*
 * @Author: Daffa R
 * @Purpose: Typescript types
 *
 */

export interface BaseEntity {
   readonly id: number;
}

export interface CompactEntity extends BaseEntity {
   readonly createdAt: Date;
   readonly updatedAt: Date;
}

/*
 * @Enum Role
 * @Purpose: for roles of an account (ADMIN, VOLUNTEER, ORGANIZATION)
 * @Usage: Role.VOLUNTEER
 * @Default: MUST BE Role.VOLUNTEER
 *
 * */
export enum Role {
   ADMIN,
   VOLUNTEER,
   ORGANIZATION,
}

export interface Account extends BaseEntity {
   readonly roles: Role;
   providerId: Date;
   readonly permissions: Permission[];
}

export interface UserRole extends Permission {
   type: Role;
   roleId: number;
}

export interface Permission extends BaseEntity {
   readonly attributes: string[];
}

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
