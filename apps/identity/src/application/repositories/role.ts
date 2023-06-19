import {
   RoleAccessor,
   RoleDataSource,
   RoleType,
   UserRole,
} from "@/common/types";

class RoleRepository implements RoleAccessor {
   constructor(private readonly dataSource: RoleDataSource) {}

   async getRole(id: number): Promise<UserRole> {}
}
