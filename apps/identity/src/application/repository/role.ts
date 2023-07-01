import type { RoleAccessor, RoleContract, RoleDataSource } from "@/types/types";

class RoleRepository implements RoleAccessor {
    constructor(private readonly roleDataSource: RoleDataSource) {}

    async createRole(role: RoleContract): Promise<void> {
        return this.roleDataSource.create(role);
    }

    async updateRole(role: RoleContract, data: RoleContract): Promise<void> {
        return this.roleDataSource.update(role, data);
    }

    async upsertRole(role: RoleContract, data: RoleContract): Promise<void> {
        return this.roleDataSource.upsert(role, data);
    }

    async deleteRole(role: RoleContract): Promise<void> {
        return this.roleDataSource.delete(role);
    }

    async getRole(role: RoleContract): Promise<RoleContract> {
        return this.roleDataSource.find(role);
    }

    async getRoles(): Promise<RoleContract[]> {
        return this.roleDataSource.findAll();
    }
}

export default RoleRepository;
