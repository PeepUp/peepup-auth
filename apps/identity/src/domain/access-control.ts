import type {
   AccessControl,
   AccessControlAccessor,
   AccessInfo,
   RoleAccessor,
   UserRole,
} from "common/types";

class RBAC implements AccessControl {
   constructor(
      private readonly roleRepository: RoleAccessor,
      private readonly accessControlRepository: AccessControlAccessor
   ) {}

   async grant(role: UserRole, access: AccessInfo): Promise<void> {
      try {
         const existRole = await this.roleRepository.getRole(role);

         if (!existRole) {
            throw new Error(`Role: {Role} not found`);
         }

         const existPermission = existRole.permissions.find(
            (p) => p.action === access.action && p.scope === access.scope
         );

         if (existPermission) {
            if (access.attributes) {
               const updatedAttributes: { [key: string]: string } = {
                  ...existPermission.attributes,
                  ...access.attributes,
               };

               const updatedPermission: AccessInfo = {
                  ...existPermission,
                  attributes: updatedAttributes,
               };

               await this.accessControlRepository.updateAccess(
                  <number>existPermission._id,
                  updatedPermission
               );
            }
         } else {
            role.permissions.push(access);
            await this.accessControlRepository.createAccess(role, access);
         }
      } catch (e) {
         if (e instanceof Error) {
            throw new Error(e.message);
         }
      }
   }

   async canAccess(roles: UserRole[]): Promise<boolean> {
      if (Array.isArray(roles) && roles.length === 0) {
         return false;
      }

      for (const role of roles) {
         const rolePermissions = await this.getRolePermissions(role);
         if (await this.hasPermission(rolePermissions)) {
            return true;
         }
      }

      return false;
   }

   private async hasPermission(permissions: AccessInfo[]): Promise<boolean> {
      if (Array.isArray(permissions) && permissions.length === 0) {
         return false;
      }

      for (const permission of permissions) {
         const existPermission = await this.accessControlRepository.getAccess(
            permission
         );

         if (existPermission) {
            return true;
         }
      }

      return false;
   }

   private async getRolePermissions(role: UserRole): Promise<AccessInfo[]> {
      if (Array.isArray(role) && role.length === 0) {
         return [];
      }

      const dbRole = await this.roleRepository.getRole(role);

      if (!dbRole) {
         return [];
      }

      return dbRole.permissions.map((permission: AccessInfo) => ({
         action: permission.action,
         resource: permission.resource,
         scope: permission.scope,
         attributes: Array.isArray(permission.attributes)
            ? permission.attributes.reduce(
                 (acc: { [key: string]: string }, attr: any) => {
                    acc[attr.name] = attr.value;
                    return acc;
                 },
                 {}
              )
            : undefined,
      }));
   }

   extendPermission(): Promise<void> {
      throw new Error("Method not implemented.");
   }

   private matchAttributes(
      requiredAttributes: Pick<AccessInfo, "attributes"> | undefined,
      providedAttributes: Pick<AccessInfo, "attributes">
   ): boolean {
      if (!requiredAttributes || providedAttributes) {
         return true;
      }

      for (const [key, value] of Object.entries(requiredAttributes)) {
         if (providedAttributes[key] !== value) {
            return false;
         }
      }
      return true;
   }

   async extendRole(role: UserRole, extendRole: UserRole): Promise<void> {
      const roleData = await this.getRolePermissions(extendRole);
      const extendedRolePermissions = roleData.map((permission) => ({
         action: permission.action,
         resource: permission.resource,
         scope: permission.scope,
         attributes: Array.isArray(permission.attributes)
            ? permission.attributes.reduce(
                 (acc: { [key: string]: string }, attr: any) => {
                    acc[attr.name] = attr.value;
                    return acc;
                 },
                 {}
              )
            : undefined,
      }));

      const updatedRole: UserRole = {
         _id: role._id,
         type: role.type,
         permissions: [...role.permissions, ...extendedRolePermissions],
      };

      await this.roleRepository.upsertRole(role, updatedRole);
   }
}

export default RBAC;