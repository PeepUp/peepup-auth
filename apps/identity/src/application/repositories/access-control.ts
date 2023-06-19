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

   updateAccess(accessId: number, data: Role): Promise<void> {
      return this.accessControlDataSource.updateById(accessId, data);
   }

   async getAccess(access: AccessInfo): Promise<Role> {
      return await this.accessControlDataSource.find({ permissions: [access] });
   }

   async getAllAccess(): Promise<Role[]> {
      return await this.accessControlDataSource.findAll();
   }

   async deleteAccess(accessId: number): Promise<void> {
      return await this.accessControlDataSource.deleteById(accessId);
   }

   async createAccess(role: Role, access: AccessInfo): Promise<void> {
      return await this.accessControlDataSource.create(role, access);
   }
}
