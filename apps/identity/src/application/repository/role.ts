import { RoleAccessor, RoleDataSource, UserRole } from "@/common/types";

class RoleRepository implements RoleAccessor {
   constructor(private readonly roleDataSource: RoleDataSource) {}

   async createRole(role: UserRole): Promise<void> {
      return await this.roleDataSource.create(role);
   }

   async updateRole(role: UserRole, data: UserRole): Promise<void> {
      return await this.roleDataSource.update(role, data);
   }

   async upsertRole(role: UserRole, data: UserRole): Promise<void> {
      return await this.roleDataSource.upsert(role, data);
   }

   async deleteRole(role: UserRole): Promise<void> {
      return await this.roleDataSource.delete(role);
   }

   async getRole(role: UserRole): Promise<UserRole> {
      return await this.roleDataSource.find(role);
   }

   async getRoles(): Promise<UserRole[]> {
      return await this.roleDataSource.findAll();
   }
}
