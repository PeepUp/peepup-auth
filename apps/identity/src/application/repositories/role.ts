import { RoleAccessor, RoleDataSource, UserRole } from "@/common/types";
import Role from "@/domain/entities/role";

class RoleRepository implements RoleAccessor {
   constructor(private readonly dataSource: RoleDataSource) {}

   async createRole(role: Role): Promise<void> {
      return await this.dataSource.create(role);
   }

   async updateRole(role: Role, data: Role): Promise<void> {
      return await this.dataSource.update(role, data);
   }

   async upsertRole(role: Role, data: Role): Promise<void> {
      return await this.dataSource.upsert(role, data);
   }

   async deleteRole(role: Role): Promise<void> {
      return await this.dataSource.delete(role);
   }

   async getRole(role: Role): Promise<Role> {
      return await this.dataSource.find(role);
   }

   async getRoles(): Promise<Role[]> {
      return await this.dataSource.findAll();
   }
}
