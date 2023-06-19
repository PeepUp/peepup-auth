import {
   AccessControlAccessor,
   AccessControlDataSource,
   AccessInfo,
   UserRole,
} from "@/common";

class AccessControlRepository implements AccessControlAccessor {
   constructor(
      private readonly accessControlDataSource: AccessControlDataSource
   ) {}

   async updateAccess(accessId: number, data: AccessInfo): Promise<void> {
      return await this.accessControlDataSource.updateById(accessId, data);
   }

   async getAccess(access: AccessInfo): Promise<UserRole> {
      return await this.accessControlDataSource.find({ permissions: [access] });
   }

   async getAllAccess(): Promise<UserRole[]> {
      return await this.accessControlDataSource.findAll();
   }

   async deleteAccess(accessId: number): Promise<void> {
      return await this.accessControlDataSource.deleteById(accessId);
   }

   async createAccess(role: UserRole, access: AccessInfo): Promise<void> {
      return await this.accessControlDataSource.create(role, access);
   }
}
