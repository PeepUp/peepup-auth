import type {
    AccessControlAccessor,
    AccessControlDataSource,
    AccessInfo,
    ID,
    RoleContract,
} from "@/types/types";

class AccessControlRepository implements AccessControlAccessor {
    constructor(private readonly accessControlDataSource: AccessControlDataSource) {}

    async updateAccess(accessId: ID, data: AccessInfo): Promise<void> {
        return this.accessControlDataSource.updateById(accessId, data);
    }

    async getAccess(access: AccessInfo): Promise<RoleContract> {
        return this.accessControlDataSource.find({ permissions: [access] });
    }

    async getAllAccess(): Promise<RoleContract[]> {
        return this.accessControlDataSource.findAll();
    }

    async deleteAccess(accessId: ID): Promise<void> {
        return this.accessControlDataSource.deleteById(accessId);
    }

    async createAccess(role: RoleContract, access: AccessInfo): Promise<void> {
        return this.accessControlDataSource.create(role, access);
    }
}

export default AccessControlRepository;
