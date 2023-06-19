import { AccessInfo, ID, RoleType, UserRole } from "@/common";

class Role implements UserRole {
   _id?: ID;
   constructor(public type: RoleType, public permissions: AccessInfo[]) {}

   set id(id: ID) {
      this.id = id;
   }

   get id(): ID | undefined {
      return this._id ? <ID>this._id : undefined;
   }
}
export default Role;
