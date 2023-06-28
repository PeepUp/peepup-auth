import { RoleAccessor, RoleContract, RoleDataSource } from "@/types/types";

class RoleRepository implements RoleAccessor {
    constructor(private readonly roleDataSource: RoleDataSource) {}

    async createRole(role: RoleContract): Promise<void> {
        return await this.roleDataSource.create(role);
    }

    async updateRole(role: RoleContract, data: RoleContract): Promise<void> {
        return await this.roleDataSource.update(role, data);
    }

    async upsertRole(role: RoleContract, data: RoleContract): Promise<void> {
        return await this.roleDataSource.upsert(role, data);
    }

    async deleteRole(role: RoleContract): Promise<void> {
        return await this.roleDataSource.delete(role);
    }

    async getRole(role: RoleContract): Promise<RoleContract> {
        return await this.roleDataSource.find(role);
    }

    async getRoles(): Promise<RoleContract[]> {
        return await this.roleDataSource.findAll();
    }
}
