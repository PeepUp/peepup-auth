import {
   AccessControlAccessor,
   AccessControlDataSource,
   AccessInfo,
} from "@/common";
import Role from "@/domain/entities/role";

class AccessControlRepository implements AccessControlAccessor {
   constructor(
      private readonly accessControlDataSource: AccessControlDataSource
   ) {}

   async getAccessById(accessId: number): Promise<AccessInfo> {
      return await this.accessControlDataSource.findById(accessId);
   }

   async getAccess(access: AccessInfo): Promise<AccessInfo> {
      return await this.accessControlDataSource.find(access);
   }

   async getAllAccess(): Promise<AccessInfo[]> {
      return await this.accessControlDataSource.findAll();
   }

   async updateAccess(accessId: number, data: AccessInfo): Promise<void> {
      return await this.accessControlDataSource.updateById(accessId, data);
   }

   async deleteAccess(accessId: number): Promise<void> {
      return await this.accessControlDataSource.deleteById(accessId);
   }

   async createAccess(role: Role, access: AccessInfo): Promise<void> {
      return await this.accessControlDataSource.create(role, access);
   }
}
