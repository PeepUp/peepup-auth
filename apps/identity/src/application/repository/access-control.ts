import {
   AccessControlAccessor,
   AccessControlDataSource,
   AccessInfo,
   ID,
   RoleContract,
} from "@/types/types";

class AccessControlRepository implements AccessControlAccessor {
   constructor(
      private readonly accessControlDataSource: AccessControlDataSource
   ) {}

   async updateAccess(accessId: ID, data: AccessInfo): Promise<void> {
      return await this.accessControlDataSource.updateById(accessId, data);
   }

   async getAccess(access: AccessInfo): Promise<RoleContract> {
      return await this.accessControlDataSource.find({ permissions: [access] });
   }

   async getAllAccess(): Promise<RoleContract[]> {
      return await this.accessControlDataSource.findAll();
   }

   async deleteAccess(accessId: ID): Promise<void> {
      return await this.accessControlDataSource.deleteById(accessId);
   }

   async createAccess(role: RoleContract, access: AccessInfo): Promise<void> {
      return await this.accessControlDataSource.create(role, access);
   }
}
